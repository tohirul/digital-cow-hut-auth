import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import UserService from './user.service';
import sendResponse from '../../../shared/sendResponse';
import { IUser } from './user.interface';
import httpStatus from 'http-status';

/**
 * Get all users.
 *
 * @param req - The Express.js request object.
 * @param res - The Express.js response object.
 * @returns A response with a list of users.
 */
const getAllUsers = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const result = await UserService.getAllUsers();

    let message: string;
    if (!result.length)
      message =
        'Request was successfull but, there are no user profile registered';
    else message = 'All users successfully retrieved';

    sendResponse<IUser[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message,
      data: result,
    });
  },
);

/**
 * Get a user by ID.
 *
 * @param req - The Express.js request object with a user ID parameter.
 * @param res - The Express.js response object.
 * @returns A response with the user's details.
 */
const getUserById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await UserService.getUserById(id);
  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});

/**
 * Update a user's information.
 *
 * @param req - The Express.js request object with a user ID parameter and updated data in the request body.
 * @param res - The Express.js response object.
 * @returns A response with the updated user's details.
 */
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;

  const result = await UserService.updateUser(id, payload);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

/**
 * Delete a user by ID.
 *
 * @param req - The Express.js request object with a user ID parameter.
 * @param res - The Express.js response object.
 * @returns A response with the deleted user's details.
 */
const deleteUser = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const result = await UserService.deleteUser(id);

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User deleted successfully',
      data: result,
    });
  },
);

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  const result = await UserService.getMyProfile(token as string);

  sendResponse<Partial<IUser>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  const updatedData = req.body;
  const result = await UserService.updateMyProfile(
    token as string,
    updatedData,
  );

  sendResponse<Partial<IUser>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

const UserController = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getMyProfile,
  updateMyProfile,
};
export default UserController;
