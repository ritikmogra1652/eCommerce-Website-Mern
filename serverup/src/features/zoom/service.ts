import mongoose from "mongoose";
import { requestMeeting, approveMeetings, zoomOauth } from "./controller";
import { IMeeting } from "./zoom";
import Meeting from "./zoom";
import axios from "axios";
import qs from "qs";
interface IResponse {
  message: string;
  data?: unknown;
  success: boolean;
}
const response: IResponse = { message: "", success: false };
const getZoomAccessToken = async (authCode?: string): Promise<string> => {
  try {
    const response = await axios.post(
      "https://zoom.us/oauth/token",
      qs.stringify({
        grant_type: "authorization_code",
        code: authCode,
        redirect_uri: process.env.REDIRECT_URI, // Your redirect URI (e.g., http://localhost:5000/oauth/callback)
      }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching Zoom access token:", error);
    throw new Error("Failed to fetch access token");
  }
};
class MeetingService {
  static async requestMeeting(data: Partial<IMeeting>): Promise<IResponse> {
    const { userId, topic, start_time, duration } = data;

    const meeting = new Meeting({
      userId,
      topic,
      start_time,
      duration,
    });

    await meeting.save();

    response.message = "Meeting requested successfully";
    response.success = true;
    response.data = meeting;
    return response;
  }

  static async getMeetings(): Promise<IResponse> {
    const meetings = await Meeting.find().sort({ createdAt: -1 });
    response.message = "Meeting display successfully";
    response.success = true;
    response.data = meetings;
    return response;
  }

  static async approveMeetings(meetingId: string): Promise<IResponse> {
      const meeting = await Meeting.findById(meetingId);
      const zoomAccessToken = await getZoomAccessToken();

    if (meeting) {
      const res = await axios.post(
        "https://api.zoom.us/v2/users/me/meetings",
        {
          topic: meeting?.topic,
          type: 2,
          start_time: meeting?.start_time,
          duration: meeting?.duration,
          settings: {
            join_before_host: true,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${zoomAccessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      meeting.approved = true;
      meeting.join_url = res.data.join_url;
      meeting.meeting_id = res.data.id;
      await meeting.save();

      response.message = "Meeting approved successfully";
      response.success = true;
      response.data = meeting;
    }
    return response;
  }

  static async zoomOauth(code: string): Promise<IResponse> {
    const accessToken = await getZoomAccessToken(code as string);
      response.data = { accessToken };
      return response;
  }
}

export default MeetingService;
