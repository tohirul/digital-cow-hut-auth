/**
 * Service module for user authentication-related operations.
 * This module provides functions for user registration.
 */
import { startSession } from 'mongoose';
import { IUser } from '../user/user.interface';
import User from '../user/user.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import {
  ILoginData,
  ILoginResponse,
  IRefreshTokenResponse,
} from '../../../types/common.type';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import JWTHelpers from '../../../helpers/jwt.helper';
import Admin from '../admin/admin.model';

/**
 * Register a new user.
 *
 * @param payload - An object containing user registration details.
 * @returns A Promise that resolves to the registered IUser object.
 * @throws ApiError with a BAD_REQUEST status code if the registration process fails.
 */
const SignUp = async (payload: IUser): Promise<IUser> => {
  let user: IUser | null = null;
  const session = await startSession();
  session.startTransaction();

  try {
    const result = await User.create([payload], { session });
    if (!result.length)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create User');
    user = result[0] as IUser;
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }

  return user;
};

const loginUser = async (payload: ILoginData): Promise<ILoginResponse> => {
  const { phoneNumber, password } = payload;

  const user = new User();
  const isExisting = await user.findExistingByPhone(phoneNumber);

  if (!isExisting)
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'User profile not found, please try again!',
    );

  if (isExisting.password && !user.passwordMatch(password, isExisting.password))
    throw new ApiError(
      httpStatus.NOT_ACCEPTABLE,
      'Phone Number and Password do not match',
    );

  const { _id: userID, role: userRole } = isExisting;

  // * Access Token and Refresh Token
  const accessToken: string = JWTHelpers.createToken(
    {
      id: userID,
      role: userRole,
    },
    config.jwt.jwt_access_token_key as Secret,
    config.jwt.jwt_access_token_expires_in as string,
  );
  const refreshToken: string = JWTHelpers.createToken(
    {
      id: userID,
      role: userRole,
    },
    config.jwt.jwt_refresh_token_key as Secret,
    config.jwt.jwt_refresh_token_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const verifyRefreshToken = async (
  payload: string,
): Promise<IRefreshTokenResponse> => {
  // * verify token
  let verifiedData = null;
  try {
    verifiedData = JWTHelpers.verifyToken(
      payload,
      config.jwt.jwt_refresh_token_key as Secret,
    );
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Credentials');
  }
  console.log(verifiedData);
  const { id, role } = verifiedData;

  let isExisting;
  const user = new User();
  const admin = new Admin();
  if (role === 'admin') isExisting = await admin.findExistingById(id);
  else isExisting = await user.findExistingById(id);

  if (!isExisting)
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'User profile not found, User does not exist!',
    );

  // ? Generate new Token
  const newAccessToken = JWTHelpers.createToken(
    {
      id: isExisting?._id,
      role: isExisting?.role,
    },
    config.jwt.jwt_access_token_key as Secret,
    config.jwt.jwt_access_token_expires_in as string,
  );

  return {
    accessToken: newAccessToken,
  };
};

/**
 * Export the AuthService with its functions.
 */
const AuthService = {
  SignUp,
  loginUser,
  verifyRefreshToken,
};
export default AuthService;
