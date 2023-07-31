import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { connect } from "mongoose";
import dotenv from "dotenv";
import { error } from "console";
import { Request, Response, NextFunction } from "express";

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ credentials: true, origin: "*" }));

// error middleware for handling error
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const { message, statusCode } = error;

  res.status(statusCode).json({ error: message });
});
async function mongooseConnect() {
  await connect(
    `mongodb+srv://recommender-system:recommender12345@cluster0.jv9eo4u.mongodb.net/HospiatlRecommenderSystem?retryWrites=true&w=majority`
  );
}

app.listen(process.env.PORT, () => {
  mongooseConnect().then(() => {
    console.log("mongodb connected successfully");
  });
});
