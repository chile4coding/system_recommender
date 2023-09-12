import { errorHandler } from "./error-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import StatusCodes from "http-status-codes";
import {v2 as cloudinary} from "cloudinary"


export class Utils {
  handleError(message: string, statusCode: number) {
    return errorHandler(message, statusCode);
  }
  salt = async () => <string>await bcrypt.genSalt(10);
  hashPassword = async (password: string): Promise<string> => {
    const hashPassword = await bcrypt.hash(password, await this.salt());
    return hashPassword;
  };
  JWTToken = (email: string, userId: string) => {
    const token = jwt.sign(
      {
        email: email,
        authId: userId,
      },
      `${process.env.JWT_SECRET_KEY}`,
      { expiresIn: "5d" }
    );
    return token;
  };
 async comparePassword  (password: string, hashedPassword: string) {
    
    
      const isMatch = await bcrypt.compare(password, hashedPassword);
      
   
      return isMatch
  };

  uploaduserpicture = async function name(file: string) {

    const result = await cloudinary.uploader.upload(file , {
      folder: process.env.CLOUDINARY_UPLOAD_PATH,
    });
  
    return result;




















  }

}
