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
            } else if (new Date(appoint.date) === new Date()) {
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

  public userAppointmentDashboard = expressAsyncHandler(
    async (req: any, res, next) => {
      try {
        const id = req.authId;
        const appointments = await Appointment.find({
          user: id,
        });

        const Jan = appointments.filter(
          (a) =>
            new Date(a.date).getMonth() === 0 &&
            new Date(a.date).getFullYear() === new Date().getFullYear()
        );
        const Feb = appointments.filter(
          (a) =>
            new Date(a.date).getMonth() === 1 &&
            new Date(a.date).getFullYear() === new Date().getFullYear()
        );
        const march = appointments.filter(
          (a) =>
            new Date(a.date).getMonth() === 2 &&
            new Date(a.date).getFullYear() === new Date().getFullYear()
        );
        const appril = appointments.filter(
          (a) =>
            new Date(a.date).getMonth() === 3 &&
            new Date(a.date).getFullYear() === new Date().getFullYear()
        );
        const may = appointments.filter(
          (a) =>
            new Date(a.date).getMonth() === 4 &&
            new Date(a.date).getFullYear() === new Date().getFullYear()
        );
        const jun = appointments.filter(
          (a) =>
            new Date(a.date).getMonth() === 5 &&
            new Date(a.date).getFullYear() === new Date().getFullYear()
        );
        const jul = appointments.filter(
          (a) =>
            new Date(a.date).getMonth() === 6 &&
            new Date(a.date).getFullYear() === new Date().getFullYear()
        );
        const aug = appointments.filter(
          (a) =>
            new Date(a.date).getMonth() === 7 &&
            new Date(a.date).getFullYear() === new Date().getFullYear()
        );
        const sep = appointments.filter(
          (a) =>
            new Date(a.date).getMonth() === 8 &&
            new Date(a.date).getFullYear() === new Date().getFullYear()
        );
        const oct = appointments.filter(
          (a) =>
            new Date(a.date).getMonth() === 9 &&
            new Date(a.date).getFullYear() === new Date().getFullYear()
        );
        const nov = appointments.filter(
          (a) =>
            new Date(a.date).getMonth() === 10 &&
            new Date(a.date).getFullYear() === new Date().getFullYear()
        );
        const dec = appointments.filter(
          (a) =>
            new Date(a.date).getMonth() === 11 &&
            new Date(a.date).getFullYear() === new Date().getFullYear()
        );

        const userData1 = [
          {
            id: 1,
            month: "Jan",
            appointment: Jan.length,
          },
          {
            id: 2,
            month: "Feb",
            appointment: Feb.length,
          },
          {
            id: 3,
            month: "Mar",

            appointment: march.length,
          },
          {
            id: 4,
            month: "Apr",

            appointment: appril.length,
          },
          {
            id: 5,
            month: "May",

            appointment: may.length,
          },
          {
            id: 6,
            month: "Jun",

            appointment: jun.length,
          },
          {
            id: 7,
            month: "Jul",
            appointment: jul.length,
          },
          {
            id: 8,
            month: "Aug",
            appointment: aug.length,
          },
          {
            id: 9,
            month: "Sep",
            appointment: sep.length,
          },
          {
            id: 10,
            month: "Oct",
            appointment: oct.length,
          },
          {
            id: 6,
            month: "Nov",
            appointment: nov.length,
          },
          {
            id: 6,
            month: "Dec",
            appointment: dec.length,
          },
        ];

        res.status(StatusCodes.OK).json(userData1);
      } catch (error) {
        next(error);
      }
    }
  );
}
