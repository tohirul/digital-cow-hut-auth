/**
 * Custom Error class for handling API-specific errors.
 */
class ApiError extends Error {
  /**
   * HTTP status code associated with the error.
   */
  statusCode: number;

  /**
   * Create a new instance of the ApiError class.
   *
   * @param code - The HTTP status code associated with the error.
   * @param message - A human-readable error message.
   * @param stack - Optional. The call stack associated with the error.
   */
  constructor(code: number, message: string | undefined, stack = '') {
    super(message);

    // Set the HTTP status code for the error
    this.statusCode = code;

    // Set the call stack for the error, if provided; otherwise, capture the stack trace
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
