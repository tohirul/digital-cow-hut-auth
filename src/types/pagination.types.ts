export type IPaginationOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  maxPrice?: number;
  minPrice?: number;
  location?: string;
};

export type DataFilters = {
  searchTerm?: string;
};
