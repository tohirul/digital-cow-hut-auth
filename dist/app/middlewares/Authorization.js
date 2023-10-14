"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const jwt_helper_1 = __importDefault(require("../../helpers/jwt.helper"));
const config_1 = __importDefault(require("../../config"));
const admin_model_1 = __importDefault(require("../modules/admin/admin.model"));
const user_model_1 = __importDefault(require("../modules/user/user.model"));
/**
 * Custom middleware to handle user authorization and access control based on user roles.
 * @function
 * @param {...string} requiredRoles - Array of role names required to access the route.
 * @returns {Function} - Express middleware function handling the authorization logic.
 */
const Authorization = (...requiredRoles) => async (req, res, next) => {
    try {
        // Extract the authorization token from the request headers
        const token = req.headers.authorization;
        // Throw an error if authorization token is missing
        if (!token)
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Credentials Missing!');
        // Verify the access token and check for expiration
        const verifiedData = jwt_helper_1.default.verifyToken(token, config_1.default.jwt.jwt_access_token_key);
        // Throw an error if the token has expired
        if (!verifiedData)
            throw new ApiError_1.default(http_status_1.default.NON_AUTHORITATIVE_INFORMATION, 'Invalid Credentials! Token has expired');
        // Extract user ID and role from the verified access token data
        const { id, role } = verifiedData;
        // Verify the refresh token and check if it corresponds to the same user ID
        if (jwt_helper_1.default.verifyToken(req.cookies.refreshToken, config_1.default.jwt.jwt_refresh_token_key).id.toString() !== id.toString())
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid Credentials! Credentials do not match');
        // Create an instance of Admin or User model based on the user's role
        let user = null;
        if (role === 'admin')
            user = new admin_model_1.default();
        else
            user = new user_model_1.default();
        // Check if the user exists in the database
        const isExisting = await user.findExistingById(id);
        // Throw an error if the user is not found
        if (!isExisting)
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Invalid Credentials! User not found');
        // Extend verified data to Express request object for further usage
        req.user = verifiedData;
        // Check if the user has the required roles to access the route
        if (requiredRoles.length > 0 &&
            !requiredRoles.includes(verifiedData.role))
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'You do not have the required permission to access this resource');
        // Proceed to the next middleware or route handler if all checks pass
        next();
    }
    catch (error) {
        // Pass the error to the global error handling middleware
        next(error);
    }
};
exports.default = Authorization;
