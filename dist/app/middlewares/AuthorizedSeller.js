"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const jwt_helper_1 = __importDefault(require("../../helpers/jwt.helper"));
const config_1 = __importDefault(require("../../config"));
const user_model_1 = __importDefault(require("../modules/user/user.model"));
const cow_model_1 = __importDefault(require("../modules/cow/cow.model"));
/**
 * Custom middleware to authorize seller-specific actions on a specific cow based on user credentials.
 * @function
 * @returns {Function} - Express middleware function handling the authorization logic for seller actions.
 */
const AuthorizedSeller = () => async (req, res, next) => {
    // Extract cow ID from the request parameters and authorization token from headers
    const cowId = req.params.id;
    const token = req.headers.authorization;
    // Throw an error if authorization token is missing
    if (!token)
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Credentials Missing!');
    try {
        // Find the cow by ID and check if it exists
        const cow = await cow_model_1.default.findById({ _id: cowId });
        if (!cow)
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Cow not found!');
        // Verify the authorization token and extract seller ID from the verified data
        const verifiedData = jwt_helper_1.default.verifyToken(token, config_1.default.jwt.jwt_access_token_key);
        const user = new user_model_1.default();
        const { id: sellerId } = verifiedData;
        // Check if the seller associated with the cow matches the verified seller ID
        const seller = await user.findExistingById(sellerId);
        if (!seller)
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid Credentials!');
        if (cow.seller.toString() !== sellerId.toString())
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized to perform this action!');
        // Check if the cow ID and seller ID match in the database
        const matching = await cow_model_1.default.findOne({
            _id: cowId,
            seller: sellerId,
        });
        if (!matching)
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized to perform this operation');
        else
            next(); // Proceed to the next middleware or route handler if authorized
    }
    catch (error) {
        // Pass any errors to the global error handling middleware
        next(error);
    }
};
exports.default = AuthorizedSeller;
