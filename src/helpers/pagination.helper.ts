import { SortOrder } from 'mongoose';

type IOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  maxPrice?: number;
  minPrice?: number;
};

type IPaginateOptions = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: SortOrder;
  maxPrice: number;
  minPrice: number;
};

const calculatePagination = (options: IOptions): IPaginateOptions => {
  const page = Number(options.page || 1);
  const limit = Number(options.limit || 10);
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy || 'price';
  const sortOrder = options.sortOrder || 'desc';
  const maxPrice = options.maxPrice || 10000000;
  const minPrice = options.minPrice || 1;
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
    maxPrice,
    minPrice,
  };
};

export default calculatePagination;
