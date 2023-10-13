"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
/**
 * Decode a Mongoose validation error into a standard error response format.
 *
 * @param err - The Mongoose validation error.
 * @returns An object containing error details in a standard format.
 */
const decodeValidationError = (err) => {
    // Map Mongoose validation errors into a standard error format
    const errors = Object.values(err.errors).map((el) => {
        return {
            path: el?.path,
            message: el?.message,
        };
    });
    // HTTP status code for a validation error (usually 400 Bad Request)
    const statusCode = http_status_1.default.BAD_REQUEST;
    // Create an error response object with the standardized format
    return {
        statusCode,
        message: 'Validation Error: The provided data did not pass Mongoose validation checks',
        errorMessages: errors,
    };
};
exports.default = decodeValidationError;
