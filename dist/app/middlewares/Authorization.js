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
const Authorization = (...requiredRoles) => async (req, res, next) => {
    console.log('Required Roles: ', requiredRoles);
    try {
        // console.log(requiredRoles);
        const token = req.headers.authorization;
        // console.log(token);
        if (!token)
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Credentials Missing !');
        const verifiedData = jwt_helper_1.default.verifyToken(token, config_1.default.jwt.jwt_access_token_key);
        if (!verifiedData)
            throw new ApiError_1.default(http_status_1.default.NON_AUTHORITATIVE_INFORMATION, 'Invalid Creadentials! Token is has expired');
        // console.log(verifiedData);
        const { id, role } = verifiedData;
        console.log(verifiedData, 'requiredRoles', requiredRoles);
        if (jwt_helper_1.default.verifyToken(req.cookies.refreshToken, config_1.default.jwt.jwt_refresh_token_key).id.toString() !== id.toString())
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid Creadentials! Outdated credentials in use');
        let user = null;
        if (role === 'admin')
            user = new admin_model_1.default();
        else
            user = new user_model_1.default();
        const isExisting = await user.findExistingById(id);
        if (!isExisting)
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Invalid Credentials! User not found');
        // ? Extending verified data to Express;
        req.user = verifiedData;
        // ? Checking if User has access
        if (requiredRoles.length > 0 &&
            !requiredRoles.includes(verifiedData.role))
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'You do not have required permission to access this!');
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.default = Authorization;
