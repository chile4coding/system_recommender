import { errorHandler } from "./error-handler";

export class Utils {
  handleError(message: string, statusCode: number) {
    return errorHandler(message, statusCode);
  }
}
