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

/**
 * Handles the user login functionality. Authenticates user credentials and generates access and refresh tokens.
 * @function
 * @param {Request} req - Express Request object containing user login data in the request body.
 * @param {Response} res - Express Response object for sending the response back to the client.
 * @returns {Promise<void>} - A Promise that resolves when the user is successfully logged in and tokens are sent in the response.
 */
const loginUser = catchAsync(async (req: Request, res: Response) => {
  // Extract user login data from the request body
  const loginData = req.body;

  // Call the AuthService method to authenticate user, generate access and refresh tokens
  const { accessToken, refreshToken } = await AuthService.loginUser(loginData);

  // Set the refresh token into a secure HTTP-only cookie
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };
  res.cookie('refreshToken', refreshToken, cookieOptions);

  // Prepare response data with access token and send it in the response
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

/**
 * Verifies the provided refresh token and generates a new access token. Updates the refresh token in the cookie.
 * @function
 * @param {Request} req - Express Request object containing the refresh token in the cookie.
 * @param {Response} res - Express Response object for sending the new access token in the response.
 * @returns {Promise<void>} - A Promise that resolves when the new access token is generated and sent in the response.
 */
const verifyRefreshToken = catchAsync(async (req: Request, res: Response) => {
  // Extract refresh token from the cookie
  const refreshToken = req.cookies.refreshToken;

  // Call the AuthService method to verify the refresh token and generate a new access token
  const result = await AuthService.verifyRefreshToken(refreshToken);

  // Update the refresh token in the cookie
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };
  res.cookie('refreshToken', refreshToken, cookieOptions);

  // Prepare response data with the new access token and send it in the response
  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'New access token generated successfully!',
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
