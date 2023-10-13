import mongoose from 'mongoose';
import { IGenericErrorResponse } from '../types/common.type';
import { IGenericErrorMessage } from '../types/error.type';
import httpStatus from 'http-status';

/**
 * Decode a Mongoose duplicate key error into a standard error response format.
 *
 * @param err - The Mongoose error, typically a duplicate key error.
 * @returns An object containing error details in a standard format.
 */
const decodeDuplicateError = (err: mongoose.Error): IGenericErrorResponse => {
  // Create an error message array with a single message using the error message from Mongoose
  const errors: IGenericErrorMessage[] = [
    {
      path: '',
      message: err.message,
    },
  ];

  // HTTP status code for a conflict (usually 409 Conflict)
  const statusCode = httpStatus.CONFLICT;

  // Create an error response object with the standardized format
  return {
    statusCode,
    message: `Duplicate Entry: ${err.message || 'Duplicate entry error'}`,
    errorMessages: errors,
  };
};

export default decodeDuplicateError;
