import { Request, Response } from "express";
import MeetingService from "./service";
import { AuthRequest } from "../auth/controller/authController";

export const requestMeeting = async (req: AuthRequest, res: Response) => {
  try {
    const body = {
      ...req.body,
      userId: req.userId,
    };

    const data = await MeetingService.requestMeeting(body);
    if (data.success) {
      res.status(201).json({
        ...data,
        code: 201,
      });
    } else {
      res.status(409).json({
        ...data,
        code: 409,
      });
    }
  } catch (error: any) {
    const statusCode = error.output?.statusCode ?? 500;
    const errorMessage = error.message ?? "Internal Server Error";
    res.status(statusCode).json({ error: errorMessage });
  }
};

export const getMeetings = async (req: AuthRequest, res: Response) => {
  try {
    const data = await MeetingService.getMeetings();
    if (data.success) {
      res.status(201).json({
        ...data,
        code: 201,
      });
    } else {
      res.status(409).json({
        ...data,
        code: 409,
      });
    }
  } catch (error: any) {
    const statusCode = error.output?.statusCode ?? 500;
    const errorMessage = error.message ?? "Internal Server Error";
    res.status(statusCode).json({ error: errorMessage });
  }
};

export const approveMeetings = async (req: AuthRequest, res: Response) => {
  try {
    const meetingId = req.params.id;

    const data = await MeetingService.approveMeetings(meetingId as string);
    if (data.success) {
      res.status(201).json({
        ...data,
        code: 201,
      });
    } else {
      res.status(409).json({
        ...data,
        code: 409,
      });
    }
  } catch (error: any) {
    const statusCode = error.output?.statusCode ?? 500;
    const errorMessage = error.message ?? "Internal Server Error";
    res.status(statusCode).json({ error: errorMessage });
  }
};

// export const zoomOauth = async (req: AuthRequest, res: Response) => {
//   try {
//       const { code } = req.query;

//     const data = await MeetingService.zoomOauth(code as string);
//     if (data.success) {
//       res.status(201).json({
//         ...data,
//         code: 201,
//       });
//     } else {
//       res.status(409).json({
//         ...data,
//         code: 409,
//       });
//     }
//   } catch (error: any) {
//     const statusCode = error.output?.statusCode ?? 500;
//     const errorMessage = error.message ?? "Internal Server Error";
//     res.status(statusCode).json({ error: errorMessage });
//   }
// };
