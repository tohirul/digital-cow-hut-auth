import mongoose from 'mongoose';
import { IAdmin } from './admin.interface';
import Admin from './admin.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { ILoginData, ILoginResponse } from '../../../types/common.type';
import JWTHelpers from '../../../helpers/jwt.helper';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';
const createAdmin = async (
  payload: IAdmin,
): Promise<Partial<IAdmin> | null> => {
  // // * Encrypting Password using bcrypt
  // const encryptedPassword = await bcrypt.hash(payload.password,
  //   Number(config.bcrypt_salt_rounds));
  // payload.password = encryptedPassword;

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

const AdminService = {
  createAdmin,
  adminLogin,
};
export default AdminService;
