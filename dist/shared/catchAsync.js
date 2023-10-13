'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
/**
 * A middleware function for handling asynchronous request handlers and catching errors.
 *
 * @param fn - The asynchronous request handler function to be wrapped.
 * @returns A new request handler function that handles errors and passes them to the next middleware.
 */
const catchAsync = fn => {
  return async (req, res, next) => {
    try {
      // Execute the asynchronous request handler function
      await fn(req, res, next);
    } catch (error) {
      // Pass any caught error to the next middleware for error handling
      next(error);
    }
  };
};
exports.default = catchAsync;
