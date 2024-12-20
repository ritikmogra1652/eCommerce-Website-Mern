import mongoose from "mongoose";
import { requestMeeting, approveMeetings } from "./controller";
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
// export async function getZoomAccessToken() {
//   console.log("ajshdahsjdhas");

//   const response = await axios.post(
//     `https://zoom.us/oauth/token?grant_type=ritikmogra321@gmail.com&account_id=${process.env.ACCOUNT_ID}`,
//     {},
//     {
//       auth: {
//         username: process.env.CLIENT_ID!,
//         password: process.env.CLIENT_SECRET!,
//       },
//     }
//   );
//   console.log(response, "acess response");

//   return response.data.access_token;
// }

export async function getZoomAccessToken() {
  try {
    const token = Buffer.from(
      `N6HC1LcTMiOIY86HttOIQ:CXFduXpsQHIN7k7hg7HGUkahNArhUgqG`
    ).toString("base64");
    const query = "https://zoom.us/oauth/token";
    const body = new URLSearchParams({
      grant_type: "account_credentials",
      account_id: "88cX00I3R76r1QofWptxLg",
    }).toString();
    const response = await axios.post(query, body, {
      headers: {
        Authorization: `Basic ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data.access_token; // The access token is returned here
  } catch (error) {
    console.error("Error getting Zoom access token:", error);
    throw new Error("Error fetching access token");
  }
}
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

    if (!meeting || meeting.approved) {
      response.message = "Invalid Meeting Id or Meeting is already approved";
      response.success = false;
      return response;
    }
    const accessToken = await getZoomAccessToken();
    console.log(accessToken, "yha tak sab mast bc");
    let data = JSON.stringify({
      topic: meeting?.topic,
      type: 2,
      start_time: meeting?.start_time,
      duration: meeting?.duration,
      settings: {
        join_before_host: true,
        waiting_room: true,
      },
    });
    let res;
    try {
      res = await axios.post(
        `https://api.zoom.us/v2/users/me/meetings`, // Correct endpoint for creating a meeting
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Authorization header with Bearer token
            "Content-Type": "application/json", // Correct content type for POST request
          },
        }
      );
    } catch (e) {
      console.log(e);
    }

    meeting.approved = true;
    meeting.join_url = res!.data.join_url;
    meeting.meeting_id = res!.data.id;
    await meeting.save();

    response.message = "Meeting approved successfully";
    response.success = true;
    response.data = meeting;
    return response;

    // const res = await axios.post(
    //   `https://api.zoom.us/v2/users/${process.env.Admin_email}/meetings`,
    //   {
    //     topic: meeting?.topic,
    //     type: 2,
    //     start_time: meeting?.start_time,
    //     duration: meeting?.duration,
    //     settings: {
    //       join_before_host: true,
    //       waiting_room: true,
    //     },
    //   },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${accessToken}`,
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );
    // console.log(res, "ressssssssss");
  }
}

export default MeetingService;
