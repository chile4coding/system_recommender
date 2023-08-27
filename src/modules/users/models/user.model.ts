import { Schema, model } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
interface IUser {
  name: string;
  email: string;
  password: string;
  phone: string;
  fullName: string;
}

// user schema
const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: String,
  fullName: { type: String, required: true },
});

// 3. Create a Model.
export const User = model<IUser>("User", userSchema);
