import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import OrderService from './order.service';
import sendResponse from '../../../shared/sendResponse';
import { IOrder } from './order.interface';
import httpStatus from 'http-status';
// import { IAuthFilter } from '../../../types/common.type';

/**
 * Create a new order.
 *
 * @param req - The Express.js request object with order details in the request body.
 * @param res - The Express.js response object.
 * @returns A response indicating the success of the order creation.
 */
const createOrder = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const result = await OrderService.createOrder(req.body);

    sendResponse<IOrder>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Order has been created successfully',
      data: result,
    });
  },
);

/**
 * Get all orders.
 *
 * @param req - The Express.js request object.
 * @param res - The Express.js response object.
 * @returns A response with a list of all orders.
 */
const getAllOrders = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    // console.log(req);
    const result = await OrderService.getAllOrder(req.filterOrders);

    sendResponse<IOrder[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All orders successfully retrieved',
      data: result,
    });
  },
);

const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const filter = req.filterOrders;
  const result = await OrderService.getOrderById(id, filter);
  sendResponse<IOrder>(res, {
    statusCode: httpStatus.OK,
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

export default OrderController;
