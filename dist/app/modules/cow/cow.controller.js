'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const catchAsync_1 = __importDefault(require('../../../shared/catchAsync'));
const cow_service_1 = __importDefault(require('./cow.service'));
const sendResponse_1 = __importDefault(require('../../../shared/sendResponse'));
const http_status_1 = __importDefault(require('http-status'));
const pick_1 = __importDefault(require('../../../shared/pick'));
/**
 * Create a new cow profile.
 *
 * @param req - Express Request object containing the cow profile data in the request body.
 * @param res - Express Response object for sending the response.
 * @returns A Promise that resolves to void.
 */
const createCowProfile = (0, catchAsync_1.default)(async (req, res) => {
  const data = req.body;
  const result = await cow_service_1.default.createCowProfile(data);
  (0, sendResponse_1.default)(res, {
    statusCode: http_status_1.default.OK,
    success: true,
    message: 'Cow profile created successfully',
    data: result,
  });
});
/**
 * Get a list of cow profiles based on filters and pagination options.
 *
 * @param req - Express Request object containing query parameters for filtering and pagination.
 * @param res - Express Response object for sending the response.
 * @returns A Promise that resolves to void.
 */
const getAllCowProfile = (0, catchAsync_1.default)(async (req, res) => {
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
  const paginationOptions = (0, pick_1.default)(req.query, paginationFields);
  const filters = (0, pick_1.default)(req.query, filterableFields);
  const result = await cow_service_1.default.getAllCowProfile(
    filters,
    paginationOptions,
  );
  (0, sendResponse_1.default)(res, {
    statusCode: http_status_1.default.OK,
    success: true,
    message: 'Cow profiles were successfully retrieved',
    data: result.data,
    meta: result.meta,
  });
});
/**
 * Get a cow profile by its ID.
 *
 * @param req - Express Request object containing the cow profile ID as a URL parameter.
 * @param res - Express Response object for sending the response.
 * @returns A Promise that resolves to void.
 */
const getCowProfile = (0, catchAsync_1.default)(async (req, res) => {
  const id = req.params.id;
  const result = await cow_service_1.default.getCowProfile(id);
  (0, sendResponse_1.default)(res, {
    statusCode: http_status_1.default.OK,
    success: true,
    message: 'Cow profile was successfully retrieved',
    data: result,
  });
});
/**
 * Update a cow profile by its ID.
 *
 * @param req - Express Request object containing the cow profile ID as a URL parameter
 *               and updated cow profile data in the request body.
 * @param res - Express Response object for sending the response.
 * @returns A Promise that resolves to void.
 */
const updateCowProfile = (0, catchAsync_1.default)(async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  const result = await cow_service_1.default.updateCowProfile(id, updatedData);
  (0, sendResponse_1.default)(res, {
    statusCode: http_status_1.default.OK,
    success: true,
    message: 'Cow profile was successfully updated',
    data: result,
  });
});
/**
 * Delete a cow profile by its ID.
 *
 * @param req - Express Request object containing the cow profile ID as a URL parameter.
 * @param res - Express Response object for sending the response.
 * @returns A Promise that resolves to void.
 */
const deleteCowProfile = (0, catchAsync_1.default)(async (req, res) => {
  const result = await cow_service_1.default.deleteCowProfile(req.params.id);
  (0, sendResponse_1.default)(res, {
    statusCode: http_status_1.default.OK,
    success: true,
    message: 'Cow profile deleted successfully',
    data: result,
  });
});
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
exports.default = CowController;
