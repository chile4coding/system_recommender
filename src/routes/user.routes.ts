import { Router } from "express";
import { check } from "express-validator";
import { UserServices } from "../modules/users/service/user.service.controller";
// import auth from "../middleware/auth/auth";
import { Auth } from "../middleware/auth/auth";
import multer from "multer";
const upload = multer({ dest: "uploads/" });

interface UserRouteProps {
  userService: UserServices;
  authService: Auth
}
export class UserRoutes implements UserRouteProps {
  private route: Router;
  userService = new UserServices();
  authService = new Auth();

  constructor() {
    this.route = Router();
    this.initRoute();
  }

  private initRoute() {
    this.route.post(
      "/register",
      check("email").isEmpty(),
      check("password").isEmpty(),
      check("username").isEmpty(),
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
    this.route.get(
      "/recommendation",
      this.authService.auth,
      this.userService.recommendation
    );
  }
  public getRoute() {
    return this.route;
  }
}
