'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const catchAsync_1 = __importDefault(require('../../../shared/catchAsync'));
const sendResponse_1 = __importDefault(require('../../../shared/sendResponse'));
const http_status_1 = __importDefault(require('http-status'));
const auth_service_1 = __importDefault(require('./auth.service'));
/**
 * Register a new user.
 *
 * @param req - The Express Request object.
 * @param res - The Express Response object.
 * @returns A Promise<void>.
 * @throws Any unhandled exceptions are passed to the Express error handling middleware.
 */
const createUser = (0, catchAsync_1.default)(async (req, res) => {
  const { ...payload } = req.body;
  const result = await auth_service_1.default.SignUp(payload);
  (0, sendResponse_1.default)(res, {
    statusCode: http_status_1.default.OK,
    success: true,
    message: 'User successfully signed up',
    data: result,
  });
});
/**
 * Export the AuthController with its functions.
 */
const AuthController = {
  createUser,
};
exports.default = AuthController;
