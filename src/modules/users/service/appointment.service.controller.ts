import { Appointment } from "../models/appointment.model";
import { User } from "../models/user.model";
import { Utils } from "../../../helpers/utils";
import expressAsyncHandler = require("express-async-handler");
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";

interface AppointmentServiceProps {
  utils: Utils;
}

export class AppointmentServices implements AppointmentServiceProps {
  utils = new Utils();

  public createAppointment = expressAsyncHandler(
    async (req: any, res, next) => {
      const error = validationResult(req.body);
      if (!error.isEmpty()) {
        this.utils.handleError("Invalide request", StatusCodes.BAD_REQUEST);
      }

      try {
        const { hospital, specialist, purpose, time, date } = req.body;
        const addAppointment = await Appointment.create({
          hospital,
          specialist,
          purpose,
          user: req.authId,
          date,
          time,
        });
        if (!addAppointment) {
          this.utils.handleError("Invalide request", StatusCodes.BAD_REQUEST);
        }
        res.status(StatusCodes.OK).json({
          message: "appointment successfully booked",
          addAppointment,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  public getAppointments = expressAsyncHandler(async (req: any, res, next) => {
    try {
      const id = req.authId;
      console.log(id);
      const userAppointment = await Appointment.find({
        user: id,
      });
      if (!userAppointment) {
        this.utils.handleError("Invalide request", StatusCodes.BAD_REQUEST);
      }
      res.status(StatusCodes.OK).json({
        message: "appointment successfully booked",
        userAppointment,
      });
    } catch (error) {
      next(error);
    }
  });
  public updateAppointmentStatus = expressAsyncHandler(
    async (req: any, res, next) => {
      try {
        const id = req.authId;
        const { appointmentId, status } = req.body;
        const findAppointment = await Appointment.findById(appointmentId);
        if (findAppointment?.status === "concluded") {
          res.status(StatusCodes.OK).json({
            message: "appointment concluded",
            findAppointment,
          });
        } else {
          const userAppointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            {
              status,
              user: id,
            }
          );
          if (!userAppointment) {
            this.utils.handleError("Invalide request", StatusCodes.BAD_REQUEST);
          }
          res.status(StatusCodes.OK).json({
            message: "appointment successfully updated",
            userAppointment,
          });
        }
      } catch (error) {
        next(error);
      }
    }
  );
  public updateAppointment = expressAsyncHandler(
    async (req: any, res, next) => {
      enum Status {
        upcoming = "upcoming",
        concluded = "concluded",
        today = "today",
        missed = "missed",
      }

      try {
        const id = req.authId;
        const findAppointment = await Appointment.find({
          user: id,
        });

        if (findAppointment) {
          findAppointment.forEach((appoint: any) => {
            if (appoint.status === Status.concluded) {
              return appoint;
            } else if (
              
              new Date(appoint.date) === new Date()
            ) {
              appoint.status = Status.today;
            } else if (new Date(appoint.date) < new Date()) {
             
              appoint.status = Status.missed;
            } else if (new Date(appoint.date) > new Date()) {
              appoint.status = Status.upcoming;
            }

            return appoint;
          });

          findAppointment.forEach((appoint: any) => {
            appoint
              .save()
              .then((data: any) => console.log(data))
              .catch((error: any) => console.log(error));
          });
        }
        res.status(StatusCodes.OK).json(findAppointment);
      } catch (error) {
        next(error);
      }
    }
  );
}
