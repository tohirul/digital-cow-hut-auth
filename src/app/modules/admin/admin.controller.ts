import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import AdminService from './admin.service';
import { IAdmin } from './admin.interface';
import { ILoginResponse } from '../../../types/common.type';
import config from '../../../config';

const createAdmin = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { ...payload } = req.body;
    const result = await AdminService.createAdmin(payload);

    sendResponse<Partial<IAdmin>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin profile created successfully',
      data: result,
    });
  },
);

const adminLogin = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const payload = req.body;

    const { accessToken, refreshToken } =
      await AdminService.adminLogin(payload);

    const cookieOptions = {
      secure: config.env === 'production',
      httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);

    sendResponse<Partial<ILoginResponse>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin logged in successfully',
      data: { accessToken },
    });
  },
);

const AdminController = {
  createAdmin,
  adminLogin,
};

export default AdminController;
