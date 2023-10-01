import { Router } from "express";
import { check } from "express-validator";
import { HospitalServices } from "../modules/users/service/hospial.service";
import { Auth } from "../middleware/auth/auth";

import multer from "multer";
const upload = multer({ dest: "hospitals/" });

interface HospitalRouteProps {
  hospitalService: HospitalServices;
  authService: Auth;
}

export class HospitalRoutes implements HospitalRouteProps {
  private route: Router;
  hospitalService = new HospitalServices();
  authService = new Auth();
  constructor() {
    this.route = Router();
    this.initRoute();
  }

  private initRoute() {
    this.route.post(
      "/create_hospital",
      check("name").isEmpty(),
      check("address").isEmpty(),
      check("phone").isEmpty(),
      check("lat").isEmpty(),
      check("long").isEmpty(),
      check("city").isEmpty(),
      check("desc").isEmpty(),
      check("website").isEmpty(),
      this.hospitalService.createHospital
    ),
      this.route.post(
        "/create_specialist/:hospitalId/:specialist/:position",
           upload.single("image"),
        this.hospitalService.createSpecialist
      );
      this.route.post(
        "/create_facility/:hospitalId/:name/:hospitalName",
           upload.single("image"),
        this.hospitalService.createFacility
      );
    this.route.post(
      "/create_service/:hospitalId",
      check("service").isEmpty(),
      this.hospitalService.createService
    );
    this.route.post(
      "/rate_hospital",
      check("hospitalId").isEmpty(),
      check("rate").isEmpty(),
      this.authService.auth,
      this.hospitalService.rateHospital
    );
  
    this.route.post(
      "/upload_hospital_image/:hospitalId/",
      upload.single("image"),
      this.hospitalService.uplaodHospitalImage
    );
    this.route.get(
      "/get_hospitals",
      this.authService.auth,
      this.hospitalService.getHospitals
    );
 
  }

  public getRoute() {
    return this.route;
  }
}
