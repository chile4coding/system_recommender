import expressAsyncHandler from "express-async-handler";
import { Utils } from "../../../helpers/utils";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/user.model";

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
    const { firstname, lastname, email, password, phone } = req.body
    
    
    try {
      
      const findEmail = await User.findOne({ email });
      if (findEmail) {
        this.utils.handleError(
          "User has been registered",
          StatusCodes.BAD_REQUEST
        );
      }
      const hashPassword = await this.utils.hashPassword(password);
      const user = await User.create({
        userName: firstname.charAt(0) + " " + lastname.charAt(0),
        firstName: firstname,
        lastName: lastname,
        phone: phone,
        password: hashPassword,
        email: email,
      });
      const saveUser = await user.save();

      res.status(StatusCodes.OK).json({
        message: "user created successfully",
        firstName: saveUser.firstName,
        lastName: saveUser.lastName,
        username: saveUser.userName,
        email: saveUser.email,

        id: saveUser._id,
      });
    } catch (error) {
      next(error);
    }
  });

  public loginUser = expressAsyncHandler(async (req, res, next) => {
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
      await this.utils.comparePassword(password, findEmail?.password as string);

      const id = findEmail?.id as string;
      const token = this.utils.JWTToken(findEmail?.email as string, id);

      res.status(StatusCodes.OK).json({
        mesage: "Login SUccessful",
        token: token,
        userId: id,
        username: findEmail?.userName,
        firstName: findEmail?.firstName,
        lastName: findEmail?.lastName,
        email: findEmail?.email,
      });
    } catch (error) {
      next(error);
    }
  });
}
