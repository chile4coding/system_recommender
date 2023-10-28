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
import { Hospital } from "../models/hospital.model";

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
      await Hospital.collection.createIndex({ location: "2dsphere" });
      const { email, password, fullname } = req.body;
      const findEmail = await User.findOne({ email });
      if (findEmail) {
        this.utils.handleError(
          "User has been registered",
          StatusCodes.BAD_REQUEST
        );
      }
      const username = fullname.split(" ");
      const hashPassword = await this.utils.hashPassword(password);
      const user = await User.create({
        fullName: fullname,
        password: hashPassword,
        email: email,
        displayName: username[0].charAt(0) + "" + username[1].charAt(0),
      });
      const saveUser = await user.save();

      res.status(StatusCodes.OK).json({
        message: "Signup successfully",
        fullname: saveUser.fullName,
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
      const isMatch = await this.utils.comparePassword(
        password,
        findEmail?.password as string
      );
      if (!isMatch) {
        this.utils.handleError("Wrong password", StatusCodes.BAD_REQUEST);
      }
      const id = findEmail?.id;

      const token = this.utils.JWTToken(findEmail?.email as string, id);

      res.status(StatusCodes.OK).json({
        mesage: "Login successful",
        token: token,
        userId: id,
        fullname: findEmail?.fullName,
        email: findEmail?.email,
        username: findEmail?.displayName,
      });
    } catch (error) {
      next(error);
    }
  });

  public uploadProfilePicture = expressAsyncHandler(
    async (req: any, res: any, next) => {
      try {
        // const imagePath = req.file?.path.replace("\\", "/");

        const update  =  req.body.image
        const { authId } = req;
        const findUser = await User.findById(authId);

        if (!findUser) {
          this.utils.handleError("Inval request", StatusCodes.BAD_REQUEST);
        }
          const uploadUserPics = await User.findByIdAndUpdate({_id: authId}, {
            avatar: update
          });

          res.status(StatusCodes.OK).json({
            message: "upload successful",
            phone: uploadUserPics?.phone,
            email: uploadUserPics?.email,
            avatar: uploadUserPics?.avatar,
            id: uploadUserPics?._id,
          });
        
      } catch (error) {
        next(error);
      }
    }
  );
  public addUserLocation = expressAsyncHandler(
    async (req: any, res: any, next) => {
      const error = validationResult(req.body);
      if (!error.isEmpty()) {
        this.utils.handleError("Invalide request", StatusCodes.BAD_REQUEST);
      }

      try {
        const { longitude, latitude } = req.body;

        const updateuserLocale = await User.findByIdAndUpdate(req.authId, {
          location: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
        });
        const user = await updateuserLocale?.save();
        if (!user) {
          this.utils.handleError("Error occurred", StatusCodes.BAD_REQUEST);
        }

        res.status(StatusCodes.OK).json({
          message: "location set successfully",
          location: user?.location,
        });
      } catch (error) {
        next(error);
      }
    }
  );
  public updateUserProfile = expressAsyncHandler(
    async (req: any, res, next) => {
      try {
        const { firstname, lastname, phone, gender, status, displayName } =
          req.body;

        const updateUser = await User.findByIdAndUpdate(req.authId, {
          fullName: `${firstname} ${lastname}`,
          phone: phone,
          gender: gender,
          status: status,
          displayName: displayName,
        });
        const updated = await updateUser?.save();

        if (!updated) {
          this.utils.handleError("Server Error", StatusCodes.BAD_REQUEST);
        }
        res.status(StatusCodes.OK).json({
          message: "profile updated successfully",
          phone: updated?.phone,
          fullname: updated?.fullName,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  public getUser = expressAsyncHandler(async (req: any, res, next) => {
    try {
      const user = await User.findById(req.authId);

      if (user) {
        res.status(StatusCodes.OK).json({
          user,
        });
      }
    } catch (error) {
      next(error);
    }
  });

  public recommendation = expressAsyncHandler(async (req: any, res, next) => {
    const user = await User.findById(req.authId);

    const locale = user?.location?.coordinates;

    let long: number | any;
    let lat: number | any;
    if (locale) {
      [long, lat] = locale;
    }
    //  await Hospital.collection.createIndex({ location: "2dsphere" });
    const locationRecommendation = await Hospital.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(long), parseFloat(lat)],
          },
          $maxDistance: 10000, // Maximum distance in meters
        },
      },
    });

    if (locationRecommendation.length < 3) {
      const ratingRecommendation = await Hospital.find({})
        .sort({ avgRate: -1 })
        .limit(3)
        .exec();

      res.status(StatusCodes.OK).json({
        message: "Recommended hospoitals",
        ratingRecommendation,
      });
    } else {
      res.status(StatusCodes.OK).json({
        message: "Recommended hospoitals",
        locationRecommendation,
      });
    }
  });

  public recommendationByRating = expressAsyncHandler(async (req, res) => {
    const ratingRecommendation = await Hospital.find({})
      .sort({ avgRate: -1 })
      .exec();
    if (!ratingRecommendation) {
    }
    res.status(StatusCodes.OK).json({
      message: "Recommended hospoitals",
      ratingRecommendation,
    });
  });
  public recommendationByLocation = expressAsyncHandler(
    async (req: any, res) => {
      const user = await User.findById(req.authId);

      const locale = user?.location?.coordinates;

      let long: number | any;
      let lat: number | any;
      if (locale) {
        [long, lat] = locale;
      }
      const locationRecommendation = await Hospital.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [parseFloat(long), parseFloat(lat)],
            },
            $maxDistance: 10000, // Maximum distance in meters
          },
        },
      });
      res.status(StatusCodes.OK).json({
        message: "Recommended hospoitals",
        locationRecommendation,
      });
    }
  );
}
