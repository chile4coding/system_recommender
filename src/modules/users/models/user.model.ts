import { Schema, model } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
interface IUser {
  displayName: string;
  email: string;
  password: string;
  phone: string;
  fullName: string;
  avatar: string;
  location: { type:{}, coordinates:Number[] };
  recommendation: string[];
}

// user schema
const userSchema = new Schema<IUser>({
  displayName: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: String,
  fullName: { type: String, required: true },
  avatar: String,
  location: { type:{type:String, },coordinates:[Number]},
  recommendation: [{ type: String }],
});



// 3. Create a Model.
export const User = model<IUser>("User", userSchema);
