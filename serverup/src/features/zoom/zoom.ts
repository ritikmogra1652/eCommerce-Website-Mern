import mongoose, { Document, Schema } from "mongoose";

// Define an interface for the Meeting document
export interface IMeeting extends Document {
  userId: string;
  topic: string;
  start_time: Date;
  duration: number;
  approved: boolean;
  join_url?: string;
  meeting_id?: string;
}

const MeetingSchema: Schema<IMeeting> = new Schema(
  {
    userId: { type: String, required: true },
    topic: { type: String, required: true },
    start_time: { type: Date, required: true },
    duration: { type: Number, required: true },
    approved: { type: Boolean, default: false },
    join_url: { type: String },
    meeting_id: { type: String },
  },
  { timestamps: true } // Optional: add timestamps for createdAt and updatedAt fields
);

// Export the model
const Meeting = mongoose.model<IMeeting>("Meeting", MeetingSchema);

export default Meeting;
