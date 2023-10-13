/**
 * Service module for cow profile-related operations.
 */
import mongoose from 'mongoose';
import { ICow } from './cow.interface';
import Cow from './cow.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import {
  DataFilters,
  IPaginationOptions,
} from '../../../types/pagination.types';
import { IGenericResponse } from '../../../types/common.type';
import calculatePagination from '../../../helpers/pagination.helper';
import { SortOrder } from 'mongoose';

/**
 * Create a new cow profile.
 *
 * @param payload - An object containing cow profile details.
 * @returns A Promise that resolves to the created ICow object or null.
 * @throws ApiError with a BAD_REQUEST status code if the creation process fails.
 */
const createCowProfile = async (payload: ICow): Promise<ICow | null> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  let cowProfile;

  try {
    const newProfile = await Cow.create([payload], { session });

    if (!newProfile.length)
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Failed to create the profile',
      );
    cowProfile = newProfile[0];
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
  return await Cow.findById({ _id: cowProfile._id }).populate('seller');
};

/**
 * Get cow profiles based on filters and pagination options.
 *
 * @param filters - An object containing filters for searching cow profiles.
 * @param paginationOptions - An object containing pagination-related options.
 * @returns A Promise that resolves to an IGenericResponse containing cow profiles and pagination metadata.
 */
const getAllCowProfile = async (
  filters: DataFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<ICow[]>> => {
  // Extract pagination options
  const { page, limit, skip, sortBy, sortOrder, maxPrice, minPrice } =
    calculatePagination(paginationOptions);

  // Extract search term and filters
  const { searchTerm, ...filtersData } = filters;
  const searchFields = ['location', 'breed', 'category'];

  // Define sort conditions
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) sortConditions[sortBy] = sortOrder;

  // Define search conditions
  const conditions = [];

  // Add search term conditions
  if (searchTerm) {
    conditions.push({
      $or: searchFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  // Add filter conditions
  if (Object.keys(filtersData).length > 0) {
    conditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  // Add price range conditions
  if (maxPrice !== undefined) conditions.push({ price: { $lte: maxPrice } });
  if (minPrice !== undefined) conditions.push({ price: { $gte: minPrice } });

  // Construct the final search conditions
  const searchConditions = conditions.length > 0 ? { $and: conditions } : {};

  // Perform the query
  const result = await Cow.find(searchConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
    .populate('seller');
  const total = await Cow.countDocuments(searchConditions);

  // Return the result with pagination metadata
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

/**
 * Get a cow profile by its ID.
 *
 * @param id - The ID of the cow profile to retrieve.
 * @returns A Promise that resolves to the ICow object or null if not found.
 * @throws ApiError with a NOT_FOUND status code if the cow profile is not found.
 */
const getCowProfile = async (id: string): Promise<ICow | null> => {
  const exists = await Cow.exists({ _id: id });
  if (exists === null)
    throw new ApiError(httpStatus.NOT_FOUND, 'Cow profile not found');

  return await Cow.findById(id).populate('seller');
};

/**
 * Update a cow profile by its ID.
 *
 * @param id - The ID of the cow profile to update.
 * @param payload - An object containing the fields to update.
 * @returns A Promise that resolves to the updated ICow object or null.
 * @throws ApiError with a NOT_FOUND status code if the cow profile is not found.
 */
const updateCowProfile = async (
  id: string,
  payload: Partial<ICow>,
): Promise<ICow | null> => {
  const exists = await Cow.exists({ _id: id });
  if (exists === null)
    throw new ApiError(httpStatus.NOT_FOUND, 'Cow profile not found');

  return await Cow.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  }).populate('seller');
};

/**
 * Delete a cow profile by its ID.
 *
 * @param id - The ID of the cow profile to delete.
 * @returns A Promise that resolves to the deleted ICow object or null.
 * @throws ApiError with a NOT_FOUND status code if the cow profile is not found,
 *         or a BAD_REQUEST status code if the deletion process fails.
 */
const deleteCowProfile = async (id: string): Promise<ICow | null> => {
  const exists = await Cow.exists({ _id: id });
  if (exists === null)
    throw new ApiError(httpStatus.NOT_FOUND, 'Cow profile not found');

  let profile: ICow;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const deletedProfile = await Cow.findOneAndDelete(
      { _id: id },
      { session },
    ).populate('seller');

    if (!deletedProfile)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to delete profile');
    profile = deletedProfile;
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
  return profile;
};

/**
 * Export the CowService with its functions.
 */
const CowService = {
  createCowProfile,
  getAllCowProfile,
  getCowProfile,
  updateCowProfile,
  deleteCowProfile,
};
export default CowService;
