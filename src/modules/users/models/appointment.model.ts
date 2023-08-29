import { time } from "console";
import { ObjectId, Schema, model, mongo } from "mongoose";

enum Status {
  upcoming = "upcoming",
  concluded = "concluded",
  today = "today",
  missed = "missed",
}

interface Amodel extends mongo.Document {
  hospital: string;
  specialist: string;
  purpose: string;
  date: string;
  time: string;
  status: Status;
  user: ObjectId;
}

const appointmentSchema = new Schema<Amodel>(
  {
    hospital: String,
    specialist: String,
    purpose: String,
    date: String,
    time: String,
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.upcoming,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

export const Appointment = model<Amodel>("Appointment", appointmentSchema);
