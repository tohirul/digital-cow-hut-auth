import { Response } from 'express';

type IAPIResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  data?: T | null;
};

/**
 * Send a standardized API response to the client.
 *
 * @param res - The Express.js response object.
 * @param data - An object representing the API response data, including status code, success flag, message, and optional data and metadata.
 */
const sendResponse = <T>(res: Response, data: IAPIResponse<T>): void => {
  // Create a standardized response object with defaults for missing properties
  const responseData: IAPIResponse<T> = {
    statusCode: data.statusCode,
    success: data.success,
    message: data.message,
    meta: data.meta || null || undefined,
    data: data.data || null,
  };

  // Set the HTTP status code and send the response as JSON
  res.status(data.statusCode).json(responseData);
};

export default sendResponse;
