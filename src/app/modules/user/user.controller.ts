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

/**
 * Retrieves the user's profile based on the provided authorization token.
 * @function
 * @param {Request} req - Express Request object containing user's authorization token in the headers.
 * @param {Response} res - Express Response object for sending the user's profile data in the response.
 * @returns {Promise<void>} - A Promise that resolves when the user's profile is successfully retrieved and sent in the response.
 */
const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  // Extract the authorization token from the request headers
  const token = req.headers.authorization;

  // Call the UserService method to retrieve user's profile based on the provided token
  const result = await UserService.getMyProfile(token as string);

  // Send the user's profile data in the response
  sendResponse<Partial<IUser>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});

/**
 * Updates the user's profile based on the provided authorization token and updated data.
 * @function
 * @param {Request} req - Express Request object containing user's authorization token in the headers and updated data in the body.
 * @param {Response} res - Express Response object for sending the updated user's profile data in the response.
 * @returns {Promise<void>} - A Promise that resolves when the user's profile is successfully updated and sent in the response.
 */
const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  // Extract the authorization token from the request headers
  const token = req.headers.authorization;

  // Extract updated data from the request body
  const updatedData = req.body;

  // Call the UserService method to update user's profile based on the provided token and updated data
  const result = await UserService.updateMyProfile(
    token as string,
    updatedData,
  );

  // Send the updated user's profile data in the response
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
