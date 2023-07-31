import { errorHandler } from "./error-handler";

export class Utils {
  handleError(message: string, statusCode: number): void {
    return errorHandler(message, statusCode);
  }
}
