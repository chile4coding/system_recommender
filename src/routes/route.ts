import { Router } from "express";
import { UserRoutes } from "./user.routes";
const v1Api = Router()

const user = new UserRoutes();

v1Api.use('/v1', user.getRoute())

export default v1Api
