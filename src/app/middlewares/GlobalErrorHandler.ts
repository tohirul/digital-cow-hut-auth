/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';
import { ZodError } from 'zod';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import decodeCastError from '../../errors/decodeCastError';
import decodeValidationError from '../../errors/decodeValidationError';
import decodeZodError from '../../errors/decodeZodError';
import { IGenericErrorMessage } from '../../types/error.type';
import decodeDuplicateError from '../../errors/decodeDuplicateError';
import httpStatus from 'http-status';

/**
 * Global error handler middleware for handling and formatting errors.
 * This middleware centralizes error handling and sends standardized error responses.
 *
 * @param error - The error object to be handled.
 * @param req - The Express Request object.
 * @param res - The Express Response object.
 * @param next - The Express NextFunction to pass control to the next middleware.
 */
const GlobalErrorHandler: ErrorRequestHandler = (
  error: Error.ValidationError | Error.CastError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode: number = httpStatus.NOT_FOUND;
  let message: string = 'Something went wrong!';
  let errorMessages: Array<IGenericErrorMessage> = [];

  if (error instanceof ApiError) {
    statusCode = error?.statusCode;
    message = error?.message ? error.message : 'An error occurred';
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : [];
  } else if (error.name === 'ValidationError') {
    const decoded_error = decodeValidationError(error);
    statusCode = decoded_error.statusCode;
    message = decoded_error.message;
    errorMessages = decoded_error.errorMessages;
  } else if (error instanceof ZodError) {
    const decoded_error = decodeZodError(error);
    statusCode = decoded_error.statusCode;
    message = decoded_error.message;
    errorMessages = decoded_error.errorMessages;
  } else if (error instanceof Error.CastError) {
    const decoded_error = decodeCastError(error);
    statusCode = decoded_error.statusCode;
    message = decoded_error.message;
    errorMessages = decoded_error.errorMessages;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  else if ('code' in error && (error as any).code === 11000) {
    const decoded_error = decodeDuplicateError(error);
    statusCode = decoded_error.statusCode;
    message = decoded_error.message;
    errorMessages = decoded_error.errorMessages;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.env !== 'production' ? error?.stack : undefined,
  });
};

export default GlobalErrorHandler;
