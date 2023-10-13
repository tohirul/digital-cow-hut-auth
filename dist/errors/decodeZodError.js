'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
/**
 * Decode a Zod validation error into a standard error response format.
 *
 * @param err - The ZodError instance representing a validation error.
 * @returns An object containing error details in a standard format.
 */
const decodeZodError = err => {
  // Map Zod issues into a standard error format
  const errors = err.issues.map(issue => {
    return {
      // Extract the field path from the issue and get the last element as the path
      path: issue?.path[issue?.path.length - 1],
      message: issue?.message,
    };
  });
  // HTTP status code for a validation error (usually 400 Bad Request)
  const statusCode = 400;
  // Create an error response object with the standardized format
  return {
    statusCode,
    message:
      'Zod Validation Error: The provided data did not pass Zod Validation checks.',
    errorMessages: errors,
  };
};
exports.default = decodeZodError;
