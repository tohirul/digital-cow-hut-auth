import {
  Label,
  breedEnumValues,
  categoryEnumValues,
  labelEnumValues,
  landmarkEnumValues,
} from './cow.constant';
import mongoose, { Schema } from 'mongoose';
import { CowModel, ICow } from './cow.interface';

const cowSchema = new Schema<ICow, CowModel>({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    enum: landmarkEnumValues,
    required: true,
  },
  breed: {
    type: String,
    enum: breedEnumValues,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  label: {
    type: String,
    default: Label.ForSale,
    enum: labelEnumValues,
  },
  category: {
    type: String,
    enum: categoryEnumValues,
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Cow = mongoose.model<ICow, CowModel>('Cow', cowSchema);

export default Cow;
