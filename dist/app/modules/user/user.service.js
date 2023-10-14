"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const user_embed_1 = __importDefault(require("./user.embed"));
const user_model_1 = __importDefault(require("./user.model"));
const http_status_1 = __importDefault(require("http-status"));
const jwt_helper_1 = __importDefault(require("../../../helpers/jwt.helper"));
const config_1 = __importDefault(require("../../../config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
/**
 * Get all users.
 *
 * @returns A Promise that resolves to an array of IUser objects.
 * @throws ApiError with a NOT_FOUND status code if no users are found.
 */
const getAllUsers = async () => {
    return await user_model_1.default.find();
};
/**
 * Get a user by ID.
 *
 * @param userId - The ID of the user to retrieve.
 * @returns A Promise that resolves to an IUser object or null if not found.
 * @throws ApiError with a NOT_FOUND status code if the user is not found.
 */
const getUserById = async (userId) => {
    const exists = await user_model_1.default.exists({ _id: userId });
    if (exists === null)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found, please try again with valid input');
    return await user_model_1.default.findById(userId);
};
/**
 * Update a user's information.
 *
 * @param userId - The ID of the user to update.
 * @param payload - A partial IUser object with the data to update.
 * @returns A Promise that resolves to the updated IUser object or null if not found.
 * @throws ApiError with a NOT_FOUND status code if the user is not found.
 */
const updateUser = async (userId, payload) => {
    const exists = await user_model_1.default.exists({ _id: userId });
    if (exists === null)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    const { name, ...userData } = payload;
    let updatedData = { ...userData };
    if (name && Object.keys(name).length) {
        updatedData = (0, user_embed_1.default)(name, updatedData, 'name');
    }
    return await user_model_1.default.findOneAndUpdate({ _id: userId }, updatedData, {
        new: true,
    });
};
/**
 * Delete a user by ID.
 *
 * @param userId - The ID of the user to delete.
 * @returns A Promise that resolves to the deleted IUser object or null if not found.
 * @throws ApiError with a NOT_FOUND status code if the user is not found,
 * or a BAD_REQUEST status code if the deletion fails.
 */
const deleteUser = async (userId) => {
    let deletedUser;
    const exists = await user_model_1.default.exists({ _id: userId });
    if (exists === null) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const userDoc = await user_model_1.default.findOneAndDelete({ _id: userId }).session(session);
        if (userDoc) {
            deletedUser = userDoc.toObject();
        }
        else {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to delete user');
        }
        await session.commitTransaction();
        return deletedUser;
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        await session.endSession();
    }
};
/**
 * Retrieves the user's profile based on the provided authorization token.
 * @function
 * @param {string} token - User's authorization token for authentication and verification.
 * @returns {Promise<Partial<IUser> | null>} - A Promise that resolves to the user's profile data or null if the user is not found.
 */
const getMyProfile = (token) => {
    // Verify the provided token to obtain user's ID
    const verifiedData = jwt_helper_1.default.verifyToken(token, config_1.default.jwt.jwt_access_token_key);
    const { id } = verifiedData;
    // Retrieve user's profile data based on the verified user ID
    return user_model_1.default.findById({ _id: id }, { name: 1, phoneNumber: 1, address: 1 });
};
/**
 * Updates the user's profile based on the provided authorization token and payload data.
 * @function
 * @param {string} token - User's authorization token for authentication and verification.
 * @param {IUser} payload - Updated user profile data.
 * @returns {Promise<Partial<IUser> | null>} - A Promise that resolves to the updated user's profile data or null if the user is not found.
 */
const updateMyProfile = async (token, payload) => {
    // Verify the provided token to obtain user's ID
    const verifiedData = jwt_helper_1.default.verifyToken(token, config_1.default.jwt.jwt_access_token_key);
    const { id } = verifiedData;
    // Extract and process updated data from the payload
    const { name, ...userData } = payload;
    let updatedData = { ...userData };
    // Embed updated name data if available in the payload
    if (name && Object.keys(name).length) {
        updatedData = (0, user_embed_1.default)(name, updatedData, 'name');
    }
    // Hash and update password if provided in the payload
    if (payload?.password) {
        updatedData.password = await bcrypt_1.default.hash(payload.password, Number(config_1.default.bcrypt_salt_rounds));
    }
    // Update user's profile data based on the verified user ID and updated data
    return await user_model_1.default.findOneAndUpdate({ _id: id }, updatedData, {
        new: true,
    })
        .select('name')
        .select('phoneNumber')
        .select('address');
};
const UserService = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getMyProfile,
    updateMyProfile,
};
exports.default = UserService;
