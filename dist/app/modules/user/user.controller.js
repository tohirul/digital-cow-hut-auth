"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const user_service_1 = __importDefault(require("./user.service"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
/**
 * Get all users.
 *
 * @param req - The Express.js request object.
 * @param res - The Express.js response object.
 * @returns A response with a list of users.
 */
const getAllUsers = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.default.getAllUsers();
    let message;
    if (!result.length)
        message =
            'Request was successfull but, there are no user profile registered';
    else
        message = 'All users successfully retrieved';
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message,
        data: result,
    });
});
/**
 * Get a user by ID.
 *
 * @param req - The Express.js request object with a user ID parameter.
 * @param res - The Express.js response object.
 * @returns A response with the user's details.
 */
const getUserById = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await user_service_1.default.getUserById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User retrieved successfully',
        data: result,
    });
});
/**
 * Update a user's information.
 *
 * @param req - The Express.js request object with a user ID parameter and updated data in the request body.
 * @param res - The Express.js response object.
 * @returns A response with the updated user's details.
 */
const updateUser = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const payload = req.body;
    const result = await user_service_1.default.updateUser(id, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User updated successfully',
        data: result,
    });
});
/**
 * Delete a user by ID.
 *
 * @param req - The Express.js request object with a user ID parameter.
 * @param res - The Express.js response object.
 * @returns A response with the deleted user's details.
 */
const deleteUser = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await user_service_1.default.deleteUser(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User deleted successfully',
        data: result,
    });
});
/**
 * Retrieves the user's profile based on the provided authorization token.
 * @function
 * @param {Request} req - Express Request object containing user's authorization token in the headers.
 * @param {Response} res - Express Response object for sending the user's profile data in the response.
 * @returns {Promise<void>} - A Promise that resolves when the user's profile is successfully retrieved and sent in the response.
 */
const getMyProfile = (0, catchAsync_1.default)(async (req, res) => {
    // Extract the authorization token from the request headers
    const token = req.headers.authorization;
    // Call the UserService method to retrieve user's profile based on the provided token
    const result = await user_service_1.default.getMyProfile(token);
    // Send the user's profile data in the response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User retrieved successfully',
        data: result,
    });
});
/**
 * Updates the user's profile based on the provided authorization token and updated data.
 * @function
 * @param {Request} req - Express Request object containing user's authorization token in the headers and updated data in the body.
 * @param {Response} res - Express Response object for sending the updated user's profile data in the response.
 * @returns {Promise<void>} - A Promise that resolves when the user's profile is successfully updated and sent in the response.
 */
const updateMyProfile = (0, catchAsync_1.default)(async (req, res) => {
    // Extract the authorization token from the request headers
    const token = req.headers.authorization;
    // Extract updated data from the request body
    const updatedData = req.body;
    // Call the UserService method to update user's profile based on the provided token and updated data
    const result = await user_service_1.default.updateMyProfile(token, updatedData);
    // Send the updated user's profile data in the response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User updated successfully',
        data: result,
    });
});
const UserController = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getMyProfile,
    updateMyProfile,
};
exports.default = UserController;
