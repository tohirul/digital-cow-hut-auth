"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_helper_1 = __importDefault(require("../../helpers/jwt.helper"));
const config_1 = __importDefault(require("../../config"));
const AuthorizedOrdersAccess = () => (req, res, next) => {
    const token = req.headers.authorization;
    try {
        const verifiedData = jwt_helper_1.default.verifyToken(token, config_1.default.jwt.jwt_access_token_key);
        const { id: userId, role: userRole } = verifiedData;
        let filterOrders;
        if (userRole === 'buyer')
            filterOrders = { role: 'buyer', buyer: userId };
        else if (userRole === 'seller')
            filterOrders = { role: 'seller', seller: userId };
        else
            filterOrders = { role: 'admin' };
        req.filterOrders = filterOrders;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.default = AuthorizedOrdersAccess;
