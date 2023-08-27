import expressAsyncHandler from "express-async-handler";
import { Utils } from "../../../helpers/utils";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import dotenv from "dotenv";
dotenv.config();
import { User } from "../models/user.model";
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from "cloudinary";
import { Request, Response, NextFunction } from "express";

interface UserServiceProps {
  utils: Utils;
}

export class UserServices implements UserServiceProps {
  utils = new Utils();

  public createuser = expressAsyncHandler(async (req, res, next) => {
    const error = validationResult(req.body);
    if (!error.isEmpty()) {
      this.utils.handleError("Invalide request", StatusCodes.BAD_REQUEST);
    }
    try {
      const { email, password, phone, firstname, lastname } = req.body;
      const findEmail = await User.findOne({ email });
      if (findEmail) {
        this.utils.handleError(
          "User has been registered",
          StatusCodes.BAD_REQUEST
        );
      }
      const hashPassword = await this.utils.hashPassword(password);
      const user = await User.create({
        firstName: firstname,
        phone: phone,
        password: hashPassword,
        lastName: lastname,
        email: email,
        displayName: firstname.charAt(0) + " " + lastname.charAt(0),
      });
      const saveUser = await user.save();

      res.status(StatusCodes.OK).json({
        message: "user created successfully",
        firstname: saveUser.firstName,
        phone: saveUser.phone,
        email: saveUser.email,
        id: saveUser._id,
      });
    } catch (error) {
      next(error);
    }
  });

  public loginUser = expressAsyncHandler(async (req: any, res: any, next) => {
    const error = validationResult(req.body);
    if (!error.isEmpty()) {
      this.utils.handleError("Invalide request", StatusCodes.BAD_REQUEST);
    }
    try {
      const { email, password } = req.body;
      const findEmail = await User.findOne({ email });
      if (!findEmail) {
        this.utils.handleError("User not found!", StatusCodes.BAD_REQUEST);
      }
      await this.utils.comparePassword(password, findEmail?.password as string);

      const id = findEmail?.id;

      console.log(id);
      const token = this.utils.JWTToken(findEmail?.email as string, id);

      res.status(StatusCodes.OK).json({
        mesage: "Login SUccessful",
        token: token,
        userId: id,
        firstname: findEmail?.firstName,
        lastname: findEmail?.lastName,
        email: findEmail?.email,
        dpName: findEmail?.displayName,
      });
    } catch (error) {
      next(error);
    }
  });

  public uploadProfilePicture = expressAsyncHandler(
    async (req: any, res: any, next) => {
      try {
        const imagePath = req.file?.path.replace("\\", "/");
        const { authId } = req;
        const findUser = await User.findById(authId);

       


        if (!findUser) {
          this.utils.handleError("Inval request", StatusCodes.BAD_REQUEST);
        }

        if ("file" in req) {
          if (!req.path) {
            this.utils.handleError("file is required", StatusCodes.BAD_REQUEST);
          }
          const cloudImageUpload = await this.utils.uploaduserpicture(
            req.file?.path as string
          );


          const update = { avatar: cloudImageUpload.url };
          const uploadUserPics = await User.findByIdAndUpdate(authId, update);

          res.status(StatusCodes.OK).json({
            message: "upload successful",
            firstname: uploadUserPics?.firstName,
            phone: uploadUserPics?.phone,
            email: uploadUserPics?.email,
            avatar: uploadUserPics?.avatar,
            id: uploadUserPics?._id,
          });
        }
      } catch (error) {
        next(error);
      }
    }
  );
}
