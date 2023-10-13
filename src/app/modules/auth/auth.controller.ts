/**
 * Controller module for user authentication-related operations.
 * This module provides functions for user registration.
 */
import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import AuthService from './auth.service';
import { IUser } from '../user/user.interface';
import {
  ILoginResponse,
  IRefreshTokenResponse,
} from '../../../types/common.type';
import config from '../../../config';

/**
 * Register a new user.
 *
 * @param req - The Express Request object.
 * @param res - The Express Response object.
 * @returns A Promise<void>.
 * @throws Any unhandled exceptions are passed to the Express error handling middleware.
 */
const createUser = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    // console.log(req.cookies, 'refresh token');
    const { ...payload } = req.body;
    const result = await AuthService.SignUp(payload);
    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User successfully signed up',
      data: result,
    });
  },
);

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const loginData = req.body;
  const { accessToken, refreshToken } = await AuthService.loginUser(loginData);

  // * Set refresh Token into Cookie

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };
  res.cookie('refreshToken', refreshToken, cookieOptions);

  const responseData = {
    accessToken: accessToken,
  };

  sendResponse<Partial<ILoginResponse>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User successfully logged in',
    data: responseData,
  });
});

const verifyRefreshToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  const result = await AuthService.verifyRefreshToken(refreshToken);

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };
  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'New access token generated successfully !',
    data: result,
  });
});

/**
 * Export the AuthController with its functions.
 */
const AuthController = {
  createUser,
  loginUser,
  verifyRefreshToken,
};
export default AuthController;
