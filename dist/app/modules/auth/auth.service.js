"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Service module for user authentication-related operations.
 * This module provides functions for user registration.
 */
const mongoose_1 = require("mongoose");
const user_model_1 = __importDefault(require("../user/user.model"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const jwt_helper_1 = __importDefault(require("../../../helpers/jwt.helper"));
const admin_model_1 = __importDefault(require("../admin/admin.model"));
/**
 * Register a new user.
 *
 * @param payload - An object containing user registration details.
 * @returns A Promise that resolves to the registered IUser object.
 * @throws ApiError with a BAD_REQUEST status code if the registration process fails.
 */
const SignUp = async (payload) => {
    let user = null;
    const session = await (0, mongoose_1.startSession)();
    session.startTransaction();
    try {
        const result = await user_model_1.default.create([payload], { session });
        if (!result.length)
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create User');
        user = result[0];
        await session.commitTransaction();
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        await session.endSession();
    }
    return user;
};
/**
 * Authenticates user credentials and generates access and refresh tokens upon successful login.
 * @function
 * @param {ILoginData} payload - User login credentials (phoneNumber, password).
 * @returns {Promise<ILoginResponse>} - A Promise that resolves to an object containing access and refresh tokens.
 * @throws {ApiError} - If user profile is not found or if provided password does not match the stored password,
 * an ApiError with appropriate status and message is thrown.
 */
const loginUser = async (payload) => {
    // Extract phoneNumber and password from the login payload
    const { phoneNumber, password } = payload;
    // Create a new User instance and check if the user profile exists
    const user = new user_model_1.default();
    const isExisting = await user.findExistingByPhone(phoneNumber);
    // If user profile is not found, throw an error
    if (!isExisting)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User profile not found, please try again!');
    // If provided password does not match the stored password, throw an error
    if (isExisting.password && !user.passwordMatch(password, isExisting.password))
        throw new ApiError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'Phone Number and Password do not match');
    // Extract user ID and role from the existing user profile
    const { _id: userID, role: userRole } = isExisting;
    // Generate access token and refresh token using JWTHelper methods
    const accessToken = jwt_helper_1.default.createToken({
        id: userID,
        role: userRole,
    }, config_1.default.jwt.jwt_access_token_key, config_1.default.jwt.jwt_access_token_expires_in);
    const refreshToken = jwt_helper_1.default.createToken({
        id: userID,
        role: userRole,
    }, config_1.default.jwt.jwt_refresh_token_key, config_1.default.jwt.jwt_refresh_token_expires_in);
    // Return an object containing access and refresh tokens
    return {
        accessToken,
        refreshToken,
    };
};
const verifyRefreshToken = async (payload) => {
    // * verify token
    let verifiedData = null;
    try {
        verifiedData = jwt_helper_1.default.verifyToken(payload, config_1.default.jwt.jwt_refresh_token_key);
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid Credentials');
    }
    console.log(verifiedData);
    const { id, role } = verifiedData;
    let isExisting;
    const user = new user_model_1.default();
    const admin = new admin_model_1.default();
    if (role === 'admin')
        isExisting = await admin.findExistingById(id);
    else
        isExisting = await user.findExistingById(id);
    if (!isExisting)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User profile not found, User does not exist!');
    // ? Generate new Token
    const newAccessToken = jwt_helper_1.default.createToken({
        id: isExisting?._id,
        role: isExisting?.role,
    }, config_1.default.jwt.jwt_access_token_key, config_1.default.jwt.jwt_access_token_expires_in);
    return {
        accessToken: newAccessToken,
    };
};
/**
 * Export the AuthService with its functions.
 */
const AuthService = {
    SignUp,
    loginUser,
    verifyRefreshToken,
};
exports.default = AuthService;
