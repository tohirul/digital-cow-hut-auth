'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const mongoose_1 = __importDefault(require('mongoose'));
const ApiError_1 = __importDefault(require('../../../errors/ApiError'));
const user_embed_1 = __importDefault(require('./user.embed'));
const user_model_1 = __importDefault(require('./user.model'));
const http_status_1 = __importDefault(require('http-status'));
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
const getUserById = async userId => {
  const exists = await user_model_1.default.exists({ _id: userId });
  if (exists === null)
    throw new ApiError_1.default(
      http_status_1.default.NOT_FOUND,
      'User not found, please try again with valid input',
    );
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
    throw new ApiError_1.default(
      http_status_1.default.NOT_FOUND,
      'User not found',
    );
  const { name, ...userData } = payload;
  let updatedData = { ...userData };
  if (name && Object.keys(name).length) {
    updatedData = (0, user_embed_1.default)(name, updatedData, 'name');
  }
  return await user_model_1.default.findOneAndUpdate(
    { _id: userId },
    updatedData,
    {
      new: true,
    },
  );
};
/**
 * Delete a user by ID.
 *
 * @param userId - The ID of the user to delete.
 * @returns A Promise that resolves to the deleted IUser object or null if not found.
 * @throws ApiError with a NOT_FOUND status code if the user is not found,
 * or a BAD_REQUEST status code if the deletion fails.
 */
const deleteUser = async userId => {
  let deletedUser;
  const exists = await user_model_1.default.exists({ _id: userId });
  if (exists === null) {
    throw new ApiError_1.default(
      http_status_1.default.NOT_FOUND,
      'User not found',
    );
  }
  const session = await mongoose_1.default.startSession();
  session.startTransaction();
  try {
    const userDoc = await user_model_1.default
      .findOneAndDelete({ _id: userId })
      .session(session);
    if (userDoc) {
      deletedUser = userDoc.toObject();
    } else {
      throw new ApiError_1.default(
        http_status_1.default.BAD_REQUEST,
        'Failed to delete user',
      );
    }
    await session.commitTransaction();
    return deletedUser;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};
const UserService = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
exports.default = UserService;
