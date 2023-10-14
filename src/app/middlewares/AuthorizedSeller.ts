import { NextFunction, Request, Response } from 'express';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import JWTHelpers from '../../helpers/jwt.helper';
import config from '../../config';
import { Secret } from 'jsonwebtoken';
import User from '../modules/user/user.model';
import Cow from '../modules/cow/cow.model';
/**
 * Custom middleware to authorize seller-specific actions on a specific cow based on user credentials.
 * @function
 * @returns {Function} - Express middleware function handling the authorization logic for seller actions.
 */
const AuthorizedSeller =
  () => async (req: Request, res: Response, next: NextFunction) => {
    // Extract cow ID from the request parameters and authorization token from headers
    const cowId = req.params.id;
    const token = req.headers.authorization;

    // Throw an error if authorization token is missing
    if (!token)
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Credentials Missing!');

    try {
      // Find the cow by ID and check if it exists
      const cow = await Cow.findById({ _id: cowId });
      if (!cow) throw new ApiError(httpStatus.NOT_FOUND, 'Cow not found!');

      // Verify the authorization token and extract seller ID from the verified data
      const verifiedData = JWTHelpers.verifyToken(
        token as string,
        config.jwt.jwt_access_token_key as Secret,
      );
      const user = new User();
      const { id: sellerId } = verifiedData;

      // Check if the seller associated with the cow matches the verified seller ID
      const seller = await user.findExistingById(sellerId);
      if (!seller)
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Credentials!');

      if (cow.seller.toString() !== sellerId.toString())
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          'You are not authorized to perform this action!',
        );

      // Check if the cow ID and seller ID match in the database
      const matching = await Cow.findOne({
        _id: cowId,
        seller: sellerId,
      });
      if (!matching)
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          'You are not authorized to perform this operation',
        );
      else next(); // Proceed to the next middleware or route handler if authorized
    } catch (error) {
      // Pass any errors to the global error handling middleware
      next(error);
    }
  };

export default AuthorizedSeller;
