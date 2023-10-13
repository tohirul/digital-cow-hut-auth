import { ObjectId } from 'mongoose';
import { IGenericErrorMessage } from './error.type';
import { IUser } from '../app/modules/user/user.interface';

export interface IGenericErrorResponse {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
}

export interface IGenericResponse<T> {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: T;
}

export interface ILoginData {
  phoneNumber: string;
  password: string;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface IRefreshTokenResponse {
  accessToken: string;
}

export type IAuthFilter = {
  role: string;
  buyer?: ObjectId | IUser;
  seller?: ObjectId | IUser;
};
