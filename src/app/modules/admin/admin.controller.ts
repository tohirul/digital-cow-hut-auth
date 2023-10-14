import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import AdminService from './admin.service';
import { IAdmin } from './admin.interface';
import { ILoginResponse } from '../../../types/common.type';
import config from '../../../config';

/**
 * Creates a new admin profile.
 * @param {Request} req - Express Request object containing the admin profile data in the request body.
 * @param {Response} res - Express Response object for sending the response back to the client.
 */
const createAdmin = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { ...payload } = req.body;
    const result = await AdminService.createAdmin(payload);

    // Sending success response with the created admin profile data
    sendResponse<Partial<IAdmin>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin profile created successfully',
      data: result,
    });
  },
);

/**
 * Handles the admin login functionality.
 * @param {Request} req - Express Request object containing the admin login credentials in the request body.
 * @param {Response} res - Express Response object for sending the response back to the client.
 */
const adminLogin = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const payload = req.body;

    // Authenticating admin login credentials using AdminService
    const { accessToken, refreshToken } =
      await AdminService.adminLogin(payload);

    // Configuring secure HTTP-only cookie for storing refreshToken
    const cookieOptions = {
      secure: config.env === 'production',
      httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);

    // Sending success response with access token for admin login
    sendResponse<Partial<ILoginResponse>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin logged in successfully',
      data: { accessToken },
    });
  },
);

// Exporting the methods as part of the AdminController object
const AdminController = {
  createAdmin,
  adminLogin,
};

export default AdminController;
