'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
/**
 * Decode a Mongoose CastError into a standard error response format.
 *
 * @param err - The Mongoose CastError.
 * @returns An object containing error details in a standard format.
 */
const decodeCastError = err => {
  // Create an error message array with a single message using the error details from Mongoose CastError
  const errors = [
    {
      path: err.path,
      message: err.message || 'Failed to complete request',
    },
  ];
  // HTTP status code for a bad request (usually 400 Bad Request)
  const statusCode = 400;
  // Create an error response object with the standardized format
  return {
    statusCode,
    message: `Cast Error: ${err?.kind} failed for value '${err?.value}' at path '${err?.path}'`,
    errorMessages: errors,
  };
};
exports.default = decodeCastError;
