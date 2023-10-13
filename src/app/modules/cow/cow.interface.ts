import { Model, Types } from 'mongoose';
import { Breed, Category, Label, Landmark } from './cow.constant';
import { IUser } from '../user/user.interface';

export interface ICow {
  name: string;
  age: number;
  price: number;
  location: Landmark;
  breed: Breed;
  weight: number;
  label: Label;
  category: Category;
  seller: Types.ObjectId | IUser;
}

export type CowModel = Model<ICow, Record<string, unknown>>;
