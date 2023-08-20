import { Schema, model } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
interface IUser {
  userName: string;
  firstName:string,
  lastName:string,
  email: string;
  password: string;
  phone: string;

}

// user schema
const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userName:{type:String, required:true},
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: String,
});

// 3. Create a Model.
export const User = model<IUser>("User", userSchema);
