import { Router } from "express";
import { check } from "express-validator";
import { UserServices } from "../modules/users/service/user.service.controller";
import { AppointmentServices } from "../modules/users/service/appointment.service.controller";
// import auth from "../middleware/auth/auth";
import { Auth } from "../middleware/auth/auth";
import multer from "multer";
const upload = multer({ dest: "uploads/" });

interface UserRouteProps {
  userService: UserServices;
  authService: Auth
  appointmentServices: AppointmentServices
}
export class UserRoutes implements UserRouteProps {
  private route: Router;
  userService = new UserServices();
  authService = new Auth();
  appointmentServices = new AppointmentServices()

  constructor() {
    this.route = Router();
    this.initRoute();
  }

  private initRoute() {
    this.route.post(
      "/register",
      check("email").isEmpty(),
      check("password").isEmpty(),
      check("fullName").isEmpty(),
      this.userService.createuser
    );
    this.route.post(
      "/login",
      check("email").isEmail().isEmpty(),
      check("password").isEmpty(),
      this.userService.loginUser
    );

    this.route.post(
      "/upload",
      this.authService.auth,
      upload.single("image"),
      this.userService.uploadProfilePicture
    );
    this.route.post(
      "/add_location",
      check("longitude").isEmpty(),
      check("latitude").isEmpty(),
      this.authService.auth,
      this.userService.addUserLocation
    );
    this.route.post(
      "/book_appointment",
      check("hospital").isEmpty(),
      check("specialist").isEmpty(),
      check("purpose").isEmpty(),
      check("time").isEmpty(),
      check("date").isEmpty(),
      this.authService.auth,
      this.appointmentServices.createAppointment
    );
    this.route.get(
      "/get_appointments",
      this.authService.auth,
      this.appointmentServices.getAppointments
    );
    this.route.patch(
      "/update_appointment_status",
      check("satus").isEmpty(),
      check("appointmentId").isEmpty(),
      this.authService.auth,
      this.appointmentServices.updateAppointmentStatus
    );
    this.route.get(
      "/recommendation",
      this.authService.auth,
      this.userService.recommendation
    );
    this.route.get(
      "/get_user",
      this.authService.auth,
      this.userService.getUser
    );
  }
  public getRoute() {
    return this.route;
  }
}
