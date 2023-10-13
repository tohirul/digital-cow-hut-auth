"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
const config_1 = __importDefault(require("../../config"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const decodeCastError_1 = __importDefault(require("../../errors/decodeCastError"));
const decodeValidationError_1 = __importDefault(require("../../errors/decodeValidationError"));
const decodeZodError_1 = __importDefault(require("../../errors/decodeZodError"));
const decodeDuplicateError_1 = __importDefault(require("../../errors/decodeDuplicateError"));
const http_status_1 = __importDefault(require("http-status"));
/**
 * Global error handler middleware for handling and formatting errors.
 * This middleware centralizes error handling and sends standardized error responses.
 *
 * @param error - The error object to be handled.
 * @param req - The Express Request object.
 * @param res - The Express Response object.
 * @param next - The Express NextFunction to pass control to the next middleware.
 */
const GlobalErrorHandler = (error, req, res, next) => {
    let statusCode = http_status_1.default.NOT_FOUND;
    let message = 'Something went wrong!';
    let errorMessages = [];
    if (error instanceof ApiError_1.default) {
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
    }
    else if (error.name === 'ValidationError') {
        const decoded_error = (0, decodeValidationError_1.default)(error);
        statusCode = decoded_error.statusCode;
        message = decoded_error.message;
        errorMessages = decoded_error.errorMessages;
    }
    else if (error instanceof zod_1.ZodError) {
        const decoded_error = (0, decodeZodError_1.default)(error);
        statusCode = decoded_error.statusCode;
        message = decoded_error.message;
        errorMessages = decoded_error.errorMessages;
    }
    else if (error instanceof mongoose_1.Error.CastError) {
        const decoded_error = (0, decodeCastError_1.default)(error);
        statusCode = decoded_error.statusCode;
        message = decoded_error.message;
        errorMessages = decoded_error.errorMessages;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    else if ('code' in error && error.code === 11000) {
        const decoded_error = (0, decodeDuplicateError_1.default)(error);
        statusCode = decoded_error.statusCode;
        message = decoded_error.message;
        errorMessages = decoded_error.errorMessages;
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorMessages,
        stack: config_1.default.env !== 'production' ? error?.stack : undefined,
    });
};
exports.default = GlobalErrorHandler;
