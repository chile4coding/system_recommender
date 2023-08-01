import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Utils } from "../../helpers/utils";
import Jwt from "jsonwebtoken";

interface AuthProps {
  utils: Utils;
}

export class Auth implements AuthProps {
  utils = new Utils();
  public auth = (req: Request | any, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.get("Authorization");
      if (!authHeader) {
        this.utils.handleError("No token provided", StatusCodes.UNAUTHORIZED);
      }
      let decode: any;
      const token = authHeader?.split(" ")[1];
      decode = Jwt.verify(
        token as string,
        `${process.env.JWT_SECRET_KEY!.toString()}`
      );
      if (!token || !decode) {
        this.utils.handleError("Invalid token", StatusCodes.UNAUTHORIZED);
      }
      req.authId = decode.authId;
      next();
    } catch (error) {
      next(error);
    }
  };
}
