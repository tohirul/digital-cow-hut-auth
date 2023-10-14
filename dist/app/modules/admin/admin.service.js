"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const admin_model_1 = __importDefault(require("./admin.model"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const jwt_helper_1 = __importDefault(require("../../../helpers/jwt.helper"));
const config_1 = __importDefault(require("../../../config"));
/**
 * Creates a new admin profile in the database.
 *
 * @param {IAdmin} payload - Admin data to be stored in the database.
 * @returns {Promise<Partial<IAdmin> | null>} - Promise resolving to the created admin profile or null if creation fails.
 * @throws {ApiError} - If admin creation fails, an ApiError with appropriate status and message is thrown.
 */
const createAdmin = async (payload) => {
    let createdAdmin;
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const result = await admin_model_1.default.create([payload], { session });
        if (!result.length)
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Admin creation failed');
        createdAdmin = result[0];
        await session.commitTransaction();
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        await session.endSession();
    }
    return await admin_model_1.default.findById({ _id: createdAdmin._id });
};
/**
 * Handles the admin login functionality.
 *
 * @param {ILoginData} payload - Admin login credentials (phoneNumber, password).
 * @returns {Promise<ILoginResponse>} - Promise resolving to an object containing access and refresh tokens.
 * @throws {ApiError} - If admin profile is not found or if provided password does not match the stored password,
 * an ApiError with appropriate status and message is thrown.
 */
const adminLogin = async (payload) => {
    const { phoneNumber, password } = payload;
    const admin = new admin_model_1.default();
    const isExisting = await admin.findExistingByPhone(phoneNumber);
    if (!isExisting)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Admin profile not found, please try again!');
    if (isExisting.password &&
        !admin.passwordMatch(password, isExisting.password))
        throw new ApiError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'Phone Number and Password do not match');
    const { _id, role } = isExisting;
    // Create JWT tokens for authentication
    const accessToken = jwt_helper_1.default.createToken({
        id: _id,
        role: role,
    }, config_1.default.jwt.jwt_access_token_key, config_1.default.jwt.jwt_access_token_expires_in);
    const refreshToken = jwt_helper_1.default.createToken({
        id: _id,
        role: role,
    }, config_1.default.jwt.jwt_refresh_token_key, config_1.default.jwt.jwt_refresh_token_expires_in);
    return { accessToken, refreshToken };
};
/**
 * AdminService object containing methods for admin profile creation and login.
 */
const AdminService = {
    createAdmin,
    adminLogin,
};
exports.default = AdminService;
