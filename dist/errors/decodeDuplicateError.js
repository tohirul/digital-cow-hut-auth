"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
/**
 * Decode a Mongoose duplicate key error into a standard error response format.
 *
 * @param err - The Mongoose error, typically a duplicate key error.
 * @returns An object containing error details in a standard format.
 */
const decodeDuplicateError = (err) => {
    // Create an error message array with a single message using the error message from Mongoose
    const errors = [
        {
            path: '',
            message: err.message,
        },
    ];
    // HTTP status code for a conflict (usually 409 Conflict)
    const statusCode = http_status_1.default.CONFLICT;
    // Create an error response object with the standardized format
    return {
        statusCode,
        message: `Duplicate Entry: ${err.message || 'Duplicate entry error'}`,
        errorMessages: errors,
    };
};
exports.default = decodeDuplicateError;
