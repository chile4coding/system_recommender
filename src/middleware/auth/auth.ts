import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Utils } from "../../helpers/utils";
import Jwt from "jsonwebtoken";


// interface AuthProps {
//   utils: Utils;

// }

// export class Auth implements AuthProps {
//   public userAuthId: string = "";
// let utils = new Utils();
// auth = (req: Request | any, res: Response, next: NextFunction) => {
//   try {
//     const authHeader = req.get("Authorization");
//     if (!authHeader) {
//       this.utils.handleError("No token provided", StatusCodes.UNAUTHORIZED);
//     }
//     let decode: any;
//     const token = authHeader?.split(" ")[1];
//     decode = Jwt.verify(token as string, `${process.env.JWT_SECRET_KEY}`);

//     if (!token || !decode) {
//       this.utils.handleError("Invalid token", StatusCodes.UNAUTHORIZED);
//     }
//     req.authId = decode.authId;
//     this.userAuthId = decode.authId;

//     console.log(this.userAuthId);
//     next();
//   } catch (error) {
//     next(error);
//   }
// };
// // }

const utils = new Utils();

export default (req: Request | any, res: Response| any, next: NextFunction) => {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      utils.handleError("No token provided", StatusCodes.UNAUTHORIZED);
    }
    let decode: any;
    const token = authHeader?.split(" ")[1];
    decode = Jwt.verify(token as string, `${process.env.JWT_SECRET_KEY}`);
    if (!token || !decode) {
      utils.handleError("Invalid token", StatusCodes.UNAUTHORIZED);
    }
    req.authId = decode.authId;
    // req.role = utils.capitalizeFirstLetter(decode.role);
    next();
  } catch (error) {
    // const errorResponse: Error = new Error("Not authorized");
    // errorResponse.statusCode = StatusCodes.UNAUTHORIZED;
    next(error);
  }
};
