import { Schema, model } from "mongoose";

interface Hmodel {
  name: string;
  address: string;
  specialists: string[];
  services: string[];
  rating: {};
  avatar: string;
  location: { type: string; coordinate: number[] };
  phone: string;
}

const hospitalSchema = new Schema<Hmodel>({
  name: { type: String, required: true },
  address: { type: String, required: true },
  specialists: [],
  services: [],
  avatar: String,
  location: { type: { type: String, coordinate: [Number] } },
  phone: String,
  rating: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Hospital = model<Hmodel>("Hospital", hospitalSchema)