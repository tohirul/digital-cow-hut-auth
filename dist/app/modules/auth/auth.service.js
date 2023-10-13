'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
/**
 * Service module for user authentication-related operations.
 * This module provides functions for user registration.
 */
const mongoose_1 = require('mongoose');
const user_model_1 = __importDefault(require('../user/user.model'));
const ApiError_1 = __importDefault(require('../../../errors/ApiError'));
const http_status_1 = __importDefault(require('http-status'));
/**
 * Register a new user.
 *
 * @param payload - An object containing user registration details.
 * @returns A Promise that resolves to the registered IUser object.
 * @throws ApiError with a BAD_REQUEST status code if the registration process fails.
 */
const SignUp = async payload => {
  let user = null;
  const session = await (0, mongoose_1.startSession)();
  session.startTransaction();
  try {
    const result = await user_model_1.default.create([payload], { session });
    if (!result.length)
      throw new ApiError_1.default(
        http_status_1.default.BAD_REQUEST,
        'Failed to create User',
      );
    user = result[0];
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
  return user;
};
/**
 * Export the AuthService with its functions.
 */
const AuthService = {
  SignUp,
};
exports.default = AuthService;
