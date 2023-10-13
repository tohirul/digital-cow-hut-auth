"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const calculatePagination = (options) => {
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
exports.default = calculatePagination;
