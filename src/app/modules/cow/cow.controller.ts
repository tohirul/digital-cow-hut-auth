/**
 * Controller module for cow profile-related HTTP endpoints.
 * This module handles request and response handling for cow profile operations.
 */
import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import CowService from './cow.service';
import sendResponse from '../../../shared/sendResponse';
import { ICow } from './cow.interface';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';

/**
 * Create a new cow profile.
 *
 * @param req - Express Request object containing the cow profile data in the request body.
 * @param res - Express Response object for sending the response.
 * @returns A Promise that resolves to void.
 */
const createCowProfile = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const data = req.body;
    const result = await CowService.createCowProfile(data);

    sendResponse<ICow>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Cow profile created successfully',
      data: result,
    });
  },
);

/**
 * Get a list of cow profiles based on filters and pagination options.
 *
 * @param req - Express Request object containing query parameters for filtering and pagination.
 * @param res - Express Response object for sending the response.
 * @returns A Promise that resolves to void.
 */
const getAllCowProfile = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    // console.log(req.user, 'controller');
    const paginationFields = [
      'page',
      'limit',
      'sortBy',
      'sortOrder',
      'minPrice',
      'maxPrice',
      'location',
    ];
    const filterableFields = ['searchTerm', 'location', 'breed', 'category'];

    const paginationOptions = pick(req.query, paginationFields);
    const filters = pick(req.query, filterableFields);

    const result = await CowService.getAllCowProfile(
      filters,
      paginationOptions,
    );

    sendResponse<ICow[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Cow profiles were successfully retrieved',
      data: result.data,
      meta: result.meta,
    });
  },
);

/**
 * Get a cow profile by its ID.
 *
 * @param req - Express Request object containing the cow profile ID as a URL parameter.
 * @param res - Express Response object for sending the response.
 * @returns A Promise that resolves to void.
 */
const getCowProfile = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const result = await CowService.getCowProfile(id);

    sendResponse<ICow>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Cow profile was successfully retrieved',
      data: result,
    });
  },
);

/**
 * Update a cow profile by its ID.
 *
 * @param req - Express Request object containing the cow profile ID as a URL parameter
 *               and updated cow profile data in the request body.
 * @param res - Express Response object for sending the response.
 * @returns A Promise that resolves to void.
 */
const updateCowProfile = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const updatedData = req.body;

    const result = await CowService.updateCowProfile(id, updatedData);

    sendResponse<ICow>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Cow profile was successfully updated',
      data: result,
    });
  },
);

/**
 * Delete a cow profile by its ID.
 *
 * @param req - Express Request object containing the cow profile ID as a URL parameter.
 * @param res - Express Response object for sending the response.
 * @returns A Promise that resolves to void.
 */
const deleteCowProfile = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const result = await CowService.deleteCowProfile(req.params.id);

    sendResponse<ICow>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Cow profile deleted successfully',
      data: result,
    });
  },
);

/**
 * Export the CowController with its functions.
 */
const CowController = {
  createCowProfile,
  getAllCowProfile,
  getCowProfile,
  updateCowProfile,
  deleteCowProfile,
};

export default CowController;
