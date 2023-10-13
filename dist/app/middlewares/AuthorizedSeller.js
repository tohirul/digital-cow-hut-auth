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
const AuthorizedSeller = () => async (req, res, next) => {
    const cowId = req.params.id;
    const token = req.headers.authorization;
    if (!token)
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Credentials Missing !');
    try {
        const cow = await cow_model_1.default.findById({ _id: cowId }); /* .populate('seller') */
        if (!cow)
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Cow not found!');
        // console.log('COW: ', cow);
        const verifiedData = jwt_helper_1.default.verifyToken(token, config_1.default.jwt.jwt_access_token_key);
        const user = new user_model_1.default();
        const { id: sellerId } = verifiedData;
        const seller = await user.findExistingById(sellerId);
        if (!seller)
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid Credentials!');
        // console.log('SELLER', seller);
        if (cow.seller.toString() !== sellerId.toString())
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized to perform this action!');
        const matching = await cow_model_1.default.findOne({
            _id: cowId,
            seller: sellerId,
        });
        // console.log('Matching: ', matching);
        if (!matching)
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized to perform this operation');
        else
            next();
    }
    catch (error) {
        next(error);
    }
};
exports.default = AuthorizedSeller;
