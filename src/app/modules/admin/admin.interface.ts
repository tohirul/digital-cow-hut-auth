import { Model, ObjectId } from 'mongoose';

export interface IAdmin {
  _id?: ObjectId;
  password: string;
  role: string;
  name: {
    firstName: string;
    lastName: string;
  };
  phoneNumber: string;
  address: string;
}

export interface IAdminMethods {
  findExistingByPhone(id: string): Promise<IAdmin | null>;
  findExistingById(id: string): Promise<IAdmin | null>;
  passwordMatch(givenPassword: string, savedPassword: string): Promise<boolean>;
}

export type AdminModel = Model<IAdmin, Record<string, unknown>, IAdminMethods>;
