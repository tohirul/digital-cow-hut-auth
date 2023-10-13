'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const catchAsync_1 = __importDefault(require('../../../shared/catchAsync'));
const order_service_1 = __importDefault(require('./order.service'));
const sendResponse_1 = __importDefault(require('../../../shared/sendResponse'));
const http_status_1 = __importDefault(require('http-status'));
/**
 * Create a new order.
 *
 * @param req - The Express.js request object with order details in the request body.
 * @param res - The Express.js response object.
 * @returns A response indicating the success of the order creation.
 */
const createOrder = (0, catchAsync_1.default)(async (req, res) => {
  const result = await order_service_1.default.createOrder(req.body);
  (0, sendResponse_1.default)(res, {
    statusCode: http_status_1.default.OK,
    success: true,
    message: 'Order has been created successfully',
    data: result,
  });
});
/**
 * Get all orders.
 *
 * @param req - The Express.js request object.
 * @param res - The Express.js response object.
 * @returns A response with a list of all orders.
 */
const getAllOrders = (0, catchAsync_1.default)(async (req, res) => {
  const result = await order_service_1.default.getAllOrder();
  (0, sendResponse_1.default)(res, {
    statusCode: http_status_1.default.OK,
    success: true,
    message: 'All orders successfully retrieved',
    data: result,
  });
});
const OrderController = {
  createOrder,
  getAllOrders,
};
exports.default = OrderController;
