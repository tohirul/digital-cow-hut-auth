import mongoose from 'mongoose';
import { IAdmin } from './admin.interface';
import Admin from './admin.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { ILoginData, ILoginResponse } from '../../../types/common.type';
import JWTHelpers from '../../../helpers/jwt.helper';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';

/**
 * Creates a new admin profile in the database.
 *
 * @param {IAdmin} payload - Admin data to be stored in the database.
 * @returns {Promise<Partial<IAdmin> | null>} - Promise resolving to the created admin profile or null if creation fails.
 * @throws {ApiError} - If admin creation fails, an ApiError with appropriate status and message is thrown.
 */
const createAdmin = async (
  payload: IAdmin,
): Promise<Partial<IAdmin> | null> => {
  let createdAdmin;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const result = await Admin.create([payload], { session });
    if (!result.length)
      throw new ApiError(httpStatus.NOT_FOUND, 'Admin creation failed');

    createdAdmin = result[0];
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }

  return await Admin.findById({ _id: createdAdmin._id });
};

/**
 * Handles the admin login functionality.
 *
 * @param {ILoginData} payload - Admin login credentials (phoneNumber, password).
 * @returns {Promise<ILoginResponse>} - Promise resolving to an object containing access and refresh tokens.
 * @throws {ApiError} - If admin profile is not found or if provided password does not match the stored password,
 * an ApiError with appropriate status and message is thrown.
 */
const adminLogin = async (payload: ILoginData): Promise<ILoginResponse> => {
  const { phoneNumber, password } = payload;

  const admin = new Admin();
  const isExisting = await admin.findExistingByPhone(phoneNumber);

  if (!isExisting)
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Admin profile not found, please try again!',
    );

  if (
    isExisting.password &&
    !admin.passwordMatch(password, isExisting.password)
  )
    throw new ApiError(
      httpStatus.NOT_ACCEPTABLE,
      'Phone Number and Password do not match',
    );

  const { _id, role } = isExisting;

  // Create JWT tokens for authentication
  const accessToken = JWTHelpers.createToken(
    {
      id: _id,
      role: role,
    },
    config.jwt.jwt_access_token_key as Secret,
    config.jwt.jwt_access_token_expires_in as string,
  );

  const refreshToken = JWTHelpers.createToken(
    {
      id: _id,
      role: role,
    },
    config.jwt.jwt_refresh_token_key as Secret,
    config.jwt.jwt_refresh_token_expires_in as string,
  );

  return { accessToken, refreshToken };
};

/**
 * AdminService object containing methods for admin profile creation and login.
 */
const AdminService = {
  createAdmin,
  adminLogin,
};

export default AdminService;
