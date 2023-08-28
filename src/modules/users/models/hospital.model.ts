import { Schema, model } from "mongoose";
import { ObjectId } from "mongoose";

interface Hmodel {
  name: string;
  address: string;
  specialists: string[];
  services: string[];
  rating: [{rate:number}];
  position: string;
  avgRate: number;
  avatar: string;
  location: { type: { type: string }; coordinate: number[] };
  phone: string;
  hospital: {};
  user: {};
}

const hospitalSchema = new Schema<Hmodel>({
  name: { type: String, required: true },
  address: { type: String, required: true },
  services: [],
  avatar: String,
  avgRate:{type:Number},
  specialists: [{ specialist: String, position: String, avatar: String }],
  rating: [],
  // specialists: { type: Schema.Types.ObjectId, ref: "Specialist" },

  // location: { type: { type: String }, coordinate: [Number] },
  location: {
    type: {
      type: String,
      enum: ["Point"], // Specify type as 'Point' for GeoJSON
      required: true,
    },
    coordinates: {
      type: [Number], // Array of coordinates [longitude, latitude]
      required: true,
    },
  },
  phone: String,
});



hospitalSchema.index({ location: "2dsphere" });
export const Hospital = model<Hmodel>("Hospital", hospitalSchema);


