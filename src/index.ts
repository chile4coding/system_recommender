import express from "express";
import cors from "cors"
import bodyParser from "body-parser"
import { connect } from "mongoose";
 import dotenv from 'dotenv'

dotenv.config()
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ credentials: true, origin: "*" }));
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
