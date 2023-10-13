"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const order_service_1 = __importDefault(require("./order.service"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
// import { IAuthFilter } from '../../../types/common.type';
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
    // console.log(req);
    const result = await order_service_1.default.getAllOrder(req.filterOrders);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All orders successfully retrieved',
        data: result,
    });
});
const getOrderById = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const filter = req.filterOrders;
    const result = await order_service_1.default.getOrderById(id, filter);
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
    getOrderById,
};
exports.default = OrderController;
