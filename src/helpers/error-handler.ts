import { Error } from "./intefaces/error-inteface";

export const errorHandler = (errorMessage: string, statusCode: number) => {
  const error: Error = new Error(errorMessage);
  error.statusCode = statusCode;
   throw error;
};
