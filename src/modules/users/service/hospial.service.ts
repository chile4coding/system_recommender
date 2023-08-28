import expressAsyncHandler from "express-async-handler";
import { Utils } from "../../../helpers/utils";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import {
  Hospital,


} from "../models/hospital.model";
import { User } from "../models/user.model";

interface HospiterServiceProps {
  utils: Utils;
}

export class HospitalServices implements HospiterServiceProps {
  utils = new Utils();
  public createHospital = expressAsyncHandler(async (req, res, next) => {
    const error = validationResult(req.body);
    if (!error.isEmpty()) {
      this.utils.handleError("Invalide request", StatusCodes.BAD_REQUEST);
    }
    try {
      const { name, address, phone, long, lat } = req.body;

      const hospital = await Hospital.create({
        name,
        phone,
        address,
        location: {
          type: "Point",
          coordinates: [long, lat],
        },
      });
      const save = await hospital.save();
      res.status(StatusCodes.OK).json({
        message: "hospital created successfully",
        save,
      });
    } catch (error) {
      next(error);
    }
  });

  public createSpecialist = expressAsyncHandler(async (req, res, next) => {
    const error = validationResult(req.params);
    if (!error.isEmpty()) {
      this.utils.handleError("Invalide request", StatusCodes.BAD_REQUEST);
    }

    try {
      const { specialist, position, hospitalId } = req.params;

      if ("file" in req) {
        if (!req.path) {
          this.utils.handleError("file is required", StatusCodes.BAD_REQUEST);
        }
        const cloudImageUpload = await this.utils.uploaduserpicture(
          req.file?.path as string
        );
        const hospitalUser = await Hospital.findByIdAndUpdate(
          { _id: hospitalId },
          {
            $push: {
              specialists: {
                specialist,
                position,
                avatar: cloudImageUpload.url,
              },
            },
          }
        );

        res.status(StatusCodes.OK).json({
          message: "specialist created",
          specialist: hospitalUser,
        });
      }
    } catch (error) {}
  });
  public createService = expressAsyncHandler(async (req, res, next) => {
    const error = validationResult(req.body);
    if (!error.isEmpty()) {
      this.utils.handleError("Invalide request", StatusCodes.BAD_REQUEST);
    }
    try {
      const id = req.params.hospitalId;
      const { service } = req.body;
      const user = await Hospital.findByIdAndUpdate(
        { _id: id },
        {
          $push: {
            services: {
              service,
            },
          },
        }
      );
      //   const serveService = await user.save();
      res.status(StatusCodes.OK).json({
        message: "service created",
        specialist: user,
      });
    } catch (error) {
      next(error);
    }
  });

  public rateHospital = expressAsyncHandler(async (req: any, res, next) => {
    const error = validationResult(req.body);
    if (!error.isEmpty()) {
      this.utils.handleError("Invalide request", StatusCodes.BAD_REQUEST);
    }
    try {
      const { rate, hospitalId } = req.body;
      const authId = req.authId;
      const hospital = await Hospital.findByIdAndUpdate(hospitalId, {
        $push: {
          rating: {
            rate,
            userId: authId,
          },
        },
      });
      const hospitalRating = hospital?.rating;
      const rateArr = hospitalRating
        ?.map((rate) => rate.rate)
        .reduce((acc, curr) => acc + curr, 0);
      if (hospitalRating && rateArr) {
        const rateAvg = Math.round(rateArr / hospitalRating.length);
       
        const finalRate = await Hospital.findByIdAndUpdate({_id: hospitalId}, {
          avgRate: rateAvg,
        });
        const saveRate  = await finalRate?.save()

     

        res.status(StatusCodes.OK).json({
          message: "rating successfully ",
          saveRate,
        });
      }
    } catch (error) {}
  });

  public uplaodHospitalImage = expressAsyncHandler(async (req, res, next) => {
    try {
      if ("file" in req) {
        if (!req.path) {
          this.utils.handleError("file is required", StatusCodes.BAD_REQUEST);
        }
        const cloudImageUpload = await this.utils.uploaduserpicture(
          req.file?.path as string
        );

        const update = { avatar: cloudImageUpload.url };
        const uploadHospitalPics = await Hospital.findByIdAndUpdate(
          req.params.hospitalId,
          update
        );

        res.status(StatusCodes.OK).json({
          message: "upload successful",
          uploadHospitalPics,
        });
      }
    } catch (error) {}
  });

  public getHospitals = expressAsyncHandler(async (req, res, next) => {
    try {
      const hospitals = await Hospital.find();

      res.status(StatusCodes.OK).json({
        message: "hospitals  successfully fetched",
        hospitals,
      });
    } catch (error) {
      next(error);
    }
  });
}
