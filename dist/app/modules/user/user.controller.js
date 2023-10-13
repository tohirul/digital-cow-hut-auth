'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const catchAsync_1 = __importDefault(require('../../../shared/catchAsync'));
const user_service_1 = __importDefault(require('./user.service'));
const sendResponse_1 = __importDefault(require('../../../shared/sendResponse'));
const http_status_1 = __importDefault(require('http-status'));
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
  else message = 'All users successfully retrieved';
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
const UserController = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
exports.default = UserController;
