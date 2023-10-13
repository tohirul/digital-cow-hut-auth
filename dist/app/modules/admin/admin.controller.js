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
const createAdmin = (0, catchAsync_1.default)(async (req, res) => {
    const { ...payload } = req.body;
    const result = await admin_service_1.default.createAdmin(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Admin profile created successfully',
        data: result,
    });
});
const adminLogin = (0, catchAsync_1.default)(async (req, res) => {
    const payload = req.body;
    const { accessToken, refreshToken } = await admin_service_1.default.adminLogin(payload);
    const cookieOptions = {
        secure: config_1.default.env === 'production',
        httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Admin logged in successfully',
        data: { accessToken },
    });
});
const AdminController = {
    createAdmin,
    adminLogin,
};
exports.default = AdminController;
