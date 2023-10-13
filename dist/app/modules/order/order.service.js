'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const http_status_1 = __importDefault(require('http-status'));
const ApiError_1 = __importDefault(require('../../../errors/ApiError'));
const cow_model_1 = __importDefault(require('../cow/cow.model'));
const user_model_1 = __importDefault(require('../user/user.model'));
const order_model_1 = __importDefault(require('./order.model'));
const mongoose_1 = __importDefault(require('mongoose'));
/**
 * Create a new order.
 *
 * @param payload - An object containing order details, including cow ID and buyer ID.
 * @returns A Promise that resolves to the created IOrder object or null.
 * @throws ApiError with a BAD_REQUEST status code if the buyer or cow is not found,
 * or if the creation process fails.
 */
const createOrder = async payload => {
  const { cow, buyer } = payload;
  const buyerProfile = await user_model_1.default.findById({ _id: buyer });
  const cowProfile = await cow_model_1.default.findById({ _id: cow });
  if (buyerProfile === null)
    throw new ApiError_1.default(
      http_status_1.default.BAD_REQUEST,
      'Buyer not found',
    );
  if (cowProfile === null)
    throw new ApiError_1.default(
      http_status_1.default.BAD_REQUEST,
      'Cow not found',
    );
  if (cowProfile.label === 'sold out')
    throw new ApiError_1.default(
      http_status_1.default.BAD_REQUEST,
      'Cow not available, already sold out',
    );
  if (cowProfile.price > buyerProfile.budget)
    throw new ApiError_1.default(
      http_status_1.default.BAD_REQUEST,
      'Insufficient amount to purchase',
    );
  const session = await mongoose_1.default.startSession();
  session.startTransaction();
  try {
    // Deduct Money from Buyer Account;
    await user_model_1.default.findByIdAndUpdate(
      { _id: buyer },
      { $inc: { budget: -cowProfile.price } },
      { session },
    );
    // Send Money to Buyer Account;
    await user_model_1.default.findByIdAndUpdate(
      { _id: cowProfile.seller },
      { $inc: { income: cowProfile.price } },
      { session },
    );
    // Update the Cow label to Sold;
    await cow_model_1.default.findByIdAndUpdate(
      { _id: cow },
      { label: 'sold out' },
      { session },
    );
    // Create a new Order;
    const order = new order_model_1.default({ cow, buyer });
    await order.save({ session });
    await session.commitTransaction();
    return await order_model_1.default
      .findById({ _id: order._id })
      .populate('buyer')
      .populate('cow');
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};
/**
 * Get all orders.
 *
 * @returns A Promise that resolves to an array of IOrder objects.
 */
const getAllOrder = async () => {
  return order_model_1.default.find().populate('cow').populate('buyer');
};
const OrderService = {
  createOrder,
  getAllOrder,
};
exports.default = OrderService;
