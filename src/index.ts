import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { connect } from "mongoose";
import dotenv from "dotenv";
import v1Api from "./routes/route";
// import cloudinary from "cloudinary"
import { v2 as cloudinary } from "cloudinary";

import { error } from "console";
import { Request, Response, NextFunction } from "express";

dotenv.config();
const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ credentials: true, 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  origin: "*" }));

app.use(v1Api);

// error middleware for handling error
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "INVALID REQUEST";

  res.status(statusCode).json({ error: message });
});
async function mongooseConnect() {
  await connect(process.env.URL || "");
}

app.listen(process.env.PORT, () => {
  mongooseConnect().then(() => {
    console.log("mongodb connected successfully");
  });
});
