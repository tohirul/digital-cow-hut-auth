"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Service module for cow profile-related operations.
 */
const mongoose_1 = __importDefault(require("mongoose"));
const cow_model_1 = __importDefault(require("./cow.model"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const pagination_helper_1 = __importDefault(require("../../../helpers/pagination.helper"));
/**
 * Create a new cow profile.
 *
 * @param payload - An object containing cow profile details.
 * @returns A Promise that resolves to the created ICow object or null.
 * @throws ApiError with a BAD_REQUEST status code if the creation process fails.
 */
const createCowProfile = async (payload) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    let cowProfile;
    try {
        const newProfile = await cow_model_1.default.create([payload], { session });
        if (!newProfile.length)
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create the profile');
        cowProfile = newProfile[0];
        await session.commitTransaction();
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        await session.endSession();
    }
    return await cow_model_1.default.findById({ _id: cowProfile._id }).populate('seller');
};
/**
 * Get cow profiles based on filters and pagination options.
 *
 * @param filters - An object containing filters for searching cow profiles.
 * @param paginationOptions - An object containing pagination-related options.
 * @returns A Promise that resolves to an IGenericResponse containing cow profiles and pagination metadata.
 */
const getAllCowProfile = async (filters, paginationOptions) => {
    // Extract pagination options
    const { page, limit, skip, sortBy, sortOrder, maxPrice, minPrice } = (0, pagination_helper_1.default)(paginationOptions);
    // Extract search term and filters
    const { searchTerm, ...filtersData } = filters;
    const searchFields = ['location', 'breed', 'category'];
    // Define sort conditions
    const sortConditions = {};
    if (sortBy && sortOrder)
        sortConditions[sortBy] = sortOrder;
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
    if (maxPrice !== undefined)
        conditions.push({ price: { $lte: maxPrice } });
    if (minPrice !== undefined)
        conditions.push({ price: { $gte: minPrice } });
    // Construct the final search conditions
    const searchConditions = conditions.length > 0 ? { $and: conditions } : {};
    // Perform the query
    const result = await cow_model_1.default.find(searchConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit)
        .populate('seller');
    const total = await cow_model_1.default.countDocuments(searchConditions);
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
const getCowProfile = async (id) => {
    const exists = await cow_model_1.default.exists({ _id: id });
    if (exists === null)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Cow profile not found');
    return await cow_model_1.default.findById(id).populate('seller');
};
/**
 * Update a cow profile by its ID.
 *
 * @param id - The ID of the cow profile to update.
 * @param payload - An object containing the fields to update.
 * @returns A Promise that resolves to the updated ICow object or null.
 * @throws ApiError with a NOT_FOUND status code if the cow profile is not found.
 */
const updateCowProfile = async (id, payload) => {
    const exists = await cow_model_1.default.exists({ _id: id });
    if (exists === null)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Cow profile not found');
    return await cow_model_1.default.findOneAndUpdate({ _id: id }, payload, {
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
const deleteCowProfile = async (id) => {
    const exists = await cow_model_1.default.exists({ _id: id });
    if (exists === null)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Cow profile not found');
    let profile;
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const deletedProfile = await cow_model_1.default.findOneAndDelete({ _id: id }, { session }).populate('seller');
        if (!deletedProfile)
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to delete profile');
        profile = deletedProfile;
        await session.commitTransaction();
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
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
exports.default = CowService;
