"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_helper_1 = __importDefault(require("../../helpers/jwt.helper"));
const config_1 = __importDefault(require("../../config"));
/**
 * Custom middleware to filter orders based on user roles (buyer, seller, or admin).
 * @function
 * @returns {Function} - Express middleware function handling the order filtering logic.
 */
const AuthorizedOrdersAccess = () => (req, res, next) => {
    try {
        // Extract the authorization token from the request headers
        const token = req.headers.authorization;
        // Verify the access token and extract user ID and role from the verified data
        const verifiedData = jwt_helper_1.default.verifyToken(token, config_1.default.jwt.jwt_access_token_key);
        const { id: userId, role: userRole } = verifiedData;
        let filterOrders;
        // Determine the filter criteria based on user roles
        if (userRole === 'buyer')
            filterOrders = { role: 'buyer', buyer: userId };
        else if (userRole === 'seller')
            filterOrders = { role: 'seller', seller: userId };
        else
            filterOrders = { role: 'admin' };
        // Attach the filter criteria to the Express request object for further usage
        req.filterOrders = filterOrders;
        // Proceed to the next middleware or route handler
        next();
    }
    catch (error) {
        // Pass any errors to the global error handling middleware
        next(error);
    }
};
exports.default = AuthorizedOrdersAccess;
