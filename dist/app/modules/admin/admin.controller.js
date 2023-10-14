"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const admin_service_1 = __importDefault(require("./admin.service"));
const config_1 = __importDefault(require("../../../config"));
/**
 * Creates a new admin profile.
 * @param {Request} req - Express Request object containing the admin profile data in the request body.
 * @param {Response} res - Express Response object for sending the response back to the client.
 */
const createAdmin = (0, catchAsync_1.default)(async (req, res) => {
    const { ...payload } = req.body;
    const result = await admin_service_1.default.createAdmin(payload);
    // Sending success response with the created admin profile data
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Admin profile created successfully',
        data: result,
    });
});
/**
 * Handles the admin login functionality.
 * @param {Request} req - Express Request object containing the admin login credentials in the request body.
 * @param {Response} res - Express Response object for sending the response back to the client.
 */
const adminLogin = (0, catchAsync_1.default)(async (req, res) => {
    const payload = req.body;
    // Authenticating admin login credentials using AdminService
    const { accessToken, refreshToken } = await admin_service_1.default.adminLogin(payload);
    // Configuring secure HTTP-only cookie for storing refreshToken
    const cookieOptions = {
        secure: config_1.default.env === 'production',
        httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    // Sending success response with access token for admin login
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Admin logged in successfully',
        data: { accessToken },
    });
});
// Exporting the methods as part of the AdminController object
const AdminController = {
    createAdmin,
    adminLogin,
};
exports.default = AdminController;
