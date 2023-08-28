import { Router } from "express";
import { UserRoutes } from "./user.routes";
import { HospitalRoutes } from "./hospital.route";
const v1Api = Router();

const user = new UserRoutes();
const hospital = new HospitalRoutes();

v1Api.use("/v1", user.getRoute());
v1Api.use("/v1", hospital.getRoute());

export default v1Api;
