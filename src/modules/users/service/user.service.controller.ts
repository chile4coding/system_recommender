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

    try {
      const { username, email, password, phone } = req.body;
      const findEmail = await User.findOne({ email });
      if (findEmail) {
        this.utils.handleError(
          "User has been registered",
          StatusCodes.BAD_REQUEST
        );
      }
      const hashPassword = await this.utils.hashPassword(password);
      const user = await User.create({
        name: username,
        phone: phone,
        password: hashPassword,
      });
      const saveUser = await user.save();

      res.status(StatusCodes.OK).json({
        message: "user created successfully",
        name: saveUser.name,
        phone: saveUser.phone,
        email: saveUser.email,
        id: saveUser._id,
      });
    } catch (error) {
      next(error);
    }
  });
}
