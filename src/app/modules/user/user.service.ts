import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
import embed from './user.embed';
import { IUser } from './user.interface';
import User from './user.model';
import httpStatus from 'http-status';
import JWTHelpers from '../../../helpers/jwt.helper';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

/**
 * Get all users.
 *
 * @returns A Promise that resolves to an array of IUser objects.
 * @throws ApiError with a NOT_FOUND status code if no users are found.
 */
const getAllUsers = async (): Promise<IUser[]> => {
  return await User.find();
};

/**
 * Get a user by ID.
 *
 * @param userId - The ID of the user to retrieve.
 * @returns A Promise that resolves to an IUser object or null if not found.
 * @throws ApiError with a NOT_FOUND status code if the user is not found.
 */
const getUserById = async (userId: string): Promise<IUser | null> => {
  const exists = await User.exists({ _id: userId });
  if (exists === null)
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'User not found, please try again with valid input',
    );
  return await User.findById(userId);
};

/**
 * Update a user's information.
 *
 * @param userId - The ID of the user to update.
 * @param payload - A partial IUser object with the data to update.
 * @returns A Promise that resolves to the updated IUser object or null if not found.
 * @throws ApiError with a NOT_FOUND status code if the user is not found.
 */
const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
): Promise<IUser | null> => {
  const exists = await User.exists({ _id: userId });
  if (exists === null)
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  const { name, ...userData } = payload;
  let updatedData: Partial<IUser> = { ...userData };

  if (name && Object.keys(name).length) {
    updatedData = embed(name, updatedData, 'name');
  }
  return await User.findOneAndUpdate({ _id: userId }, updatedData, {
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
const deleteUser = async (userId: string): Promise<IUser | null> => {
  let deletedUser: IUser;
  const exists = await User.exists({ _id: userId });
  if (exists === null) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userDoc = await User.findOneAndDelete({ _id: userId }).session(
      session,
    );
    if (userDoc) {
      deletedUser = userDoc.toObject();
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to delete user');
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

const getMyProfile = (token: string): Promise<Partial<IUser> | null> => {
  const verifiedData = JWTHelpers.verifyToken(
    token,
    config.jwt.jwt_access_token_key as Secret,
  );
  const { id } = verifiedData;

  return User.findById({ _id: id }, { name: 1, phoneNumber: 1, address: 1 });
};

const updateMyProfile = async (
  token: string,
  payload: IUser,
): Promise<Partial<IUser> | null> => {
  const verifiedData = JWTHelpers.verifyToken(
    token,
    config.jwt.jwt_access_token_key as Secret,
  );
  const { id } = verifiedData;
  const { name, ...userData } = payload;
  let updatedData: Partial<IUser> = { ...userData };

  if (name && Object.keys(name).length) {
    updatedData = embed(name, updatedData, 'name');
  }

  if (payload?.password) {
    console.log(payload.password);
    updatedData.password = await bcrypt.hash(
      payload.password,
      Number(config.bcrypt_salt_rounds),
    );
  }

  return await User.findOneAndUpdate({ _id: id }, updatedData, {
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
export default UserService;
