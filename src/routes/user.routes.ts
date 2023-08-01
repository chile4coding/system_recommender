import { Router } from "express";
import { check } from "express-validator";
import { UserServices } from "../modules/users/service/user.service.controller";
interface UserRouteProps{
userService: UserServices
}
export class UserRoutes implements UserRouteProps{
    private route:Router
    userService = new UserServices();

    constructor(){
        this.route = Router()
        this.initRoute()
    }

    private initRoute(){

this.route.post('/register',check('email').isEmail().isEmpty(), check("password").isEmpty(), check("username").isEmpty(), check("fullName").isEmpty(), this.userService.createuser)
this.route.post('/login',check('email').isEmail().isEmpty(), check("password").isEmpty(),this.userService.loginUser)
    }
    public getRoute(){
        return this.route
    }
    
}