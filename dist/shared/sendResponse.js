"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Send a standardized API response to the client.
 *
 * @param res - The Express.js response object.
 * @param data - An object representing the API response data, including status code, success flag, message, and optional data and metadata.
 */
const sendResponse = (res, data) => {
    // Create a standardized response object with defaults for missing properties
    const responseData = {
        statusCode: data.statusCode,
        success: data.success,
        message: data.message,
        meta: data.meta || null || undefined,
        data: data.data || null,
    };
    // Set the HTTP status code and send the response as JSON
    res.status(data.statusCode).json(responseData);
};
exports.default = sendResponse;
