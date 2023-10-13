import { Model, ObjectId } from 'mongoose';

export interface IUser {
  _id?: ObjectId;
  password: string;
  role: string;
  name: {
    firstName: string;
    lastName: string;
  };
  phoneNumber: string;
  address: string;
  budget: number;
  income: number;
}

export interface IUserMethods {
  findExistingByPhone(id: string): Promise<IUser | null>;
  findExistingById(id: string): Promise<IUser | null>;
  passwordMatch(givenPassword: string, savedPassword: string): Promise<boolean>;
}

export type UserModel = Model<IUser, Record<string, unknown>, IUserMethods>;
