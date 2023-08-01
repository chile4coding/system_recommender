import { errorHandler } from "./error-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import StatusCodes from "http-status-codes";

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
  comparePassword = async (password: string, hashedPassword: string) => {
    try {
      const isMatch = await bcrypt.compare(password, hashedPassword);
      if (!isMatch) {
        this.handleError("Invalid password", StatusCodes.BAD_REQUEST);
      }
    } catch (error) {
      console.error(error);
    }
  };
}
