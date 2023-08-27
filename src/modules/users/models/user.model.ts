import { Schema, model } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
interface IUser {
  displayName: string;
  email: string;
  password: string;
  phone: string;
  firstName: string;
  lastName: string;
  avatar: string;
  location: { type: string; coordinate: number[] };
  recommendation: string[];
}

// user schema
const userSchema = new Schema<IUser>({
  displayName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: String,
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  avatar: String,
  location: { type: { type: String, coordinate: [Number] } },
  recommendation: [{ type: String }],
});

// 3. Create a Model.
export const User = model<IUser>("User", userSchema);
