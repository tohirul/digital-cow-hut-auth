"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const auth_service_1 = __importDefault(require("./auth.service"));
const config_1 = __importDefault(require("../../../config"));
/**
 * Register a new user.
 *
 * @param req - The Express Request object.
 * @param res - The Express Response object.
 * @returns A Promise<void>.
 * @throws Any unhandled exceptions are passed to the Express error handling middleware.
 */
const createUser = (0, catchAsync_1.default)(async (req, res) => {
    // console.log(req.cookies, 'refresh token');
    const { ...payload } = req.body;
    const result = await auth_service_1.default.SignUp(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User successfully signed up',
        data: result,
    });
});
/**
 * Handles the user login functionality. Authenticates user credentials and generates access and refresh tokens.
 * @function
 * @param {Request} req - Express Request object containing user login data in the request body.
 * @param {Response} res - Express Response object for sending the response back to the client.
 * @returns {Promise<void>} - A Promise that resolves when the user is successfully logged in and tokens are sent in the response.
 */
const loginUser = (0, catchAsync_1.default)(async (req, res) => {
    // Extract user login data from the request body
    const loginData = req.body;
    // Call the AuthService method to authenticate user, generate access and refresh tokens
    const { accessToken, refreshToken } = await auth_service_1.default.loginUser(loginData);
    // Set the refresh token into a secure HTTP-only cookie
    const cookieOptions = {
        secure: config_1.default.env === 'production',
        httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    // Prepare response data with access token and send it in the response
    const responseData = {
        accessToken: accessToken,
    };
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User successfully logged in',
        data: responseData,
    });
});
/**
 * Verifies the provided refresh token and generates a new access token. Updates the refresh token in the cookie.
 * @function
 * @param {Request} req - Express Request object containing the refresh token in the cookie.
 * @param {Response} res - Express Response object for sending the new access token in the response.
 * @returns {Promise<void>} - A Promise that resolves when the new access token is generated and sent in the response.
 */
const verifyRefreshToken = (0, catchAsync_1.default)(async (req, res) => {
    // Extract refresh token from the cookie
    const refreshToken = req.cookies.refreshToken;
    // Call the AuthService method to verify the refresh token and generate a new access token
    const result = await auth_service_1.default.verifyRefreshToken(refreshToken);
    // Update the refresh token in the cookie
    const cookieOptions = {
        secure: config_1.default.env === 'production',
        httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    // Prepare response data with the new access token and send it in the response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'New access token generated successfully!',
        data: result,
    });
});
/**
 * Export the AuthController with its functions.
 */
const AuthController = {
    createUser,
    loginUser,
    verifyRefreshToken,
};
exports.default = AuthController;
