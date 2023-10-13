import { ICow } from './../cow/cow.interface';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import Cow from '../cow/cow.model';
import User from '../user/user.model';
import { IOrder } from './order.interface';
import Order from './order.model';
import mongoose, { ObjectId } from 'mongoose';
import { IUser } from '../user/user.interface';
import { IAuthFilter } from '../../../types/common.type';

/**
 * Create a new order.
 *
 * @param payload - An object containing order details, including cow ID and buyer ID.
 * @returns A Promise that resolves to the created IOrder object or null.
 * @throws ApiError with a BAD_REQUEST status code if the buyer or cow is not found,
 * or if the creation process fails.
 */
const createOrder = async (payload: IOrder): Promise<IOrder | null> => {
  const { cow, buyer } = payload;

  const buyerProfile: IUser | null = await User.findById({ _id: buyer });
  const cowProfile: ICow | null = await Cow.findById({ _id: cow });

  if (buyerProfile === null)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Buyer not found');
  if (cowProfile === null)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cow not found');

  if (cowProfile.label === 'sold out')
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Cow not available, already sold out',
    );
  if (cowProfile.price > buyerProfile.budget)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Insufficient amount to purchase',
    );

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Deduct Money from Buyer Account;
    await User.findByIdAndUpdate(
      { _id: buyer },
      { $inc: { budget: -cowProfile.price } },
      { session },
    );
    // Send Money to Buyer Account;
    await User.findByIdAndUpdate(
      { _id: cowProfile.seller },
      { $inc: { income: cowProfile.price } },
      { session },
    );
    // Update the Cow label to Sold;
    await Cow.findByIdAndUpdate(
      { _id: cow },
      { label: 'sold out' },
      { session },
    );

    // Create a new Order;
    const order = new Order({ cow, buyer });
    await order.save({ session });

    await session.commitTransaction();
    return await Order.findById({ _id: order._id })
      .populate('buyer')
      .populate({
        path: 'cow',
        populate: {
          path: 'seller',
        },
      });
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
const getAllOrder = async (filter: IAuthFilter): Promise<IOrder[]> => {
  let orders: IOrder[];
  // console.log(filter, 'filter');
  if (filter?.role === 'buyer') {
    const condition = { buyer: filter.buyer };
    orders = await Order.find(condition)
      .populate({
        path: 'cow',
        populate: {
          path: 'seller',
        },
      })
      .populate('buyer');
  } else if (filter.role === 'seller') {
    const condition = {};
    const allOrders = await Order.find(condition)
      .populate({
        path: 'cow',
        populate: {
          path: 'seller',
        },
      })
      .populate('buyer');
    // console.log('All Orders: ', allOrders);
    orders = allOrders.filter(order => {
      const cow = order.cow as ICow;
      const seller = cow.seller;
      console.log(`COW: ${cow} SELLER: ${seller}`);
      return (
        seller._id &&
        seller._id.toString() === (filter.seller as ObjectId).toString()
      );
    });
    console.log('orders: ', orders);
  } else {
    const condition = {};
    orders = await Order.find(condition)
      .populate({
        path: 'cow',
        populate: {
          path: 'seller',
        },
      })
      .populate('buyer');
  }

  return orders;
};

const getOrderById = async (
  id: string,
  filter: IAuthFilter,
): Promise<IOrder | null> => {
  // const {role} = filter;
  const order = await Order.findById(id)
    .populate({
      path: 'cow',
      populate: {
        path: 'seller',
      },
    })
    .populate('buyer');

  if (filter.role === 'buyer') {
    const buyer = order?.buyer;
    if (filter.buyer && buyer?._id?.toString() !== filter.buyer.toString())
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'You are not allowed to access this order',
      );
  }
  if (filter.role === 'seller') {
    const cow = order?.cow as ICow;
    const seller = cow.seller as IUser;
    if (filter.seller && seller?._id?.toString() !== filter?.seller.toString())
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'You are not allowed to access this order',
      );
  }

  return order;
};

const OrderService = {
  createOrder,
  getAllOrder,
  getOrderById,
};
export default OrderService;
