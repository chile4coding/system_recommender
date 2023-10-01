import { Schema, model } from "mongoose";
import { ObjectId } from "mongoose";

interface Hmodel {
  name: string;
  userEmail: string;
  isFavourite: boolean;
  hospitalId: Object;
  description: string;
  hospitalFavouriteId: {}[];
  city: string;
  address: string;
  specialists: string[];
  facilities: string[];
  services: string[];
  rating: [{ rate: number }];
  position: string;
  avgRate: number;
  avatar: string;
  website: string;
  location: { type: { type: string }; coordinate: number[] };
  phone: string;
  hospital: {};
  user: {};
}

const hospitalSchema = new Schema<Hmodel>({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: String,

  services: [],
  avatar: String,
  description: String,
  website: String,
  avgRate: { type: Number },
  specialists: [
    {
      specialist: String,
      position: String,
      avatar: String,
      officeTime: String,
    },
  ],
  facilities: [
    {
      name: String,
      hospitalName: String,
      avatar: String,
    
    },
  ],
  rating: [],
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
  hospitalFavouriteId: [
    {
      type: Schema.Types.ObjectId,
      ref: "Hospitalfavourite",
    },
  ],
});

hospitalSchema.index({ location: "2dsphere" });

export const Hospital = model<Hmodel>("Hospital", hospitalSchema);
