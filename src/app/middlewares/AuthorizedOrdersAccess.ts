import { NextFunction, Request, Response } from 'express';
import JWTHelpers from '../../helpers/jwt.helper';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import { IAuthFilter } from '../../types/common.type';
/**
 * Custom middleware to filter orders based on user roles (buyer, seller, or admin).
 * @function
 * @returns {Function} - Express middleware function handling the order filtering logic.
 */
const AuthorizedOrdersAccess =
  () => (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the authorization token from the request headers
      const token = req.headers.authorization;

      // Verify the access token and extract user ID and role from the verified data
      const verifiedData = JWTHelpers.verifyToken(
        token as string,
        config.jwt.jwt_access_token_key as Secret,
      );
      const { id: userId, role: userRole } = verifiedData;

      let filterOrders: IAuthFilter;

      // Determine the filter criteria based on user roles
      if (userRole === 'buyer') filterOrders = { role: 'buyer', buyer: userId };
      else if (userRole === 'seller')
        filterOrders = { role: 'seller', seller: userId };
      else filterOrders = { role: 'admin' };

      // Attach the filter criteria to the Express request object for further usage
      req.filterOrders = filterOrders;

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      // Pass any errors to the global error handling middleware
      next(error);
    }
  };

export default AuthorizedOrdersAccess;
