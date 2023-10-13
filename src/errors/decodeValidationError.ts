import mongoose from 'mongoose';
import { IGenericErrorResponse } from '../types/common.type';
import { IGenericErrorMessage } from '../types/error.type';
import httpStatus from 'http-status';

/**
 * Decode a Mongoose validation error into a standard error response format.
 *
 * @param err - The Mongoose validation error.
 * @returns An object containing error details in a standard format.
 */
const decodeValidationError = (
  err: mongoose.Error.ValidationError,
): IGenericErrorResponse => {
  // Map Mongoose validation errors into a standard error format
  const errors: IGenericErrorMessage[] = Object.values(err.errors).map(
    (
      el: mongoose.Error.CastError | mongoose.Error.ValidatorError,
    ): IGenericErrorMessage => {
      return {
        path: el?.path,
        message: el?.message,
      };
    },
  );

  // HTTP status code for a validation error (usually 400 Bad Request)
  const statusCode = httpStatus.BAD_REQUEST;

  // Create an error response object with the standardized format
  return {
    statusCode,
    message:
      'Validation Error: The provided data did not pass Mongoose validation checks',
    errorMessages: errors,
  };
};

export default decodeValidationError;
