import mongoose from 'mongoose';
import { IOrder, OrderModel } from './order.interface';

const orderSchema = new mongoose.Schema<IOrder, OrderModel>({
  cow: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cow', // Reference to the Cow model
    required: true,
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
});

const Order = mongoose.model<IOrder, OrderModel>('Order', orderSchema);

export default Order;
