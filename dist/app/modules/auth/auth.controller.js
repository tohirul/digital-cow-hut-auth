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
const loginUser = (0, catchAsync_1.default)(async (req, res) => {
    const loginData = req.body;
    const { accessToken, refreshToken } = await auth_service_1.default.loginUser(loginData);
    // * Set refresh Token into Cookie
    const cookieOptions = {
        secure: config_1.default.env === 'production',
        httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
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
const verifyRefreshToken = (0, catchAsync_1.default)(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    const result = await auth_service_1.default.verifyRefreshToken(refreshToken);
    const cookieOptions = {
        secure: config_1.default.env === 'production',
        httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'New access token generated successfully !',
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
