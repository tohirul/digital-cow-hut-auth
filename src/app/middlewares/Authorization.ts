import { NextFunction, Request, Response } from 'express';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import JWTHelpers from '../../helpers/jwt.helper';
import config from '../../config';
import { Secret } from 'jsonwebtoken';
import Admin from '../modules/admin/admin.model';
import User from '../modules/user/user.model';
/**
 * Custom middleware to handle user authorization and access control based on user roles.
 * @function
 * @param {...string} requiredRoles - Array of role names required to access the route.
 * @returns {Function} - Express middleware function handling the authorization logic.
 */
const Authorization =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the authorization token from the request headers
      const token = req.headers.authorization;

      // Throw an error if authorization token is missing
      if (!token)
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Credentials Missing!');

      // Verify the access token and check for expiration
      const verifiedData = JWTHelpers.verifyToken(
        token as string,
        config.jwt.jwt_access_token_key as Secret,
      );

      // Throw an error if the token has expired
      if (!verifiedData)
        throw new ApiError(
          httpStatus.NON_AUTHORITATIVE_INFORMATION,
          'Invalid Credentials! Token has expired',
        );

      // Extract user ID and role from the verified access token data
      const { id, role } = verifiedData;

      // Verify the refresh token and check if it corresponds to the same user ID
      if (
        JWTHelpers.verifyToken(
          req.cookies.refreshToken as string,
          config.jwt.jwt_refresh_token_key as Secret,
        ).id.toString() !== id.toString()
      )
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          'Invalid Credentials! Credentials do not match',
        );

      // Create an instance of Admin or User model based on the user's role
      let user = null;
      if (role === 'admin') user = new Admin();
      else user = new User();

      // Check if the user exists in the database
      const isExisting = await user.findExistingById(id);

      // Throw an error if the user is not found
      if (!isExisting)
        throw new ApiError(
          httpStatus.NOT_FOUND,
          'Invalid Credentials! User not found',
        );

      // Extend verified data to Express request object for further usage
      req.user = verifiedData;

      // Check if the user has the required roles to access the route
      if (
        requiredRoles.length > 0 &&
        !requiredRoles.includes(verifiedData.role)
      )
        throw new ApiError(
          httpStatus.FORBIDDEN,
          'You do not have the required permission to access this resource',
        );

      // Proceed to the next middleware or route handler if all checks pass
      next();
    } catch (error) {
      // Pass the error to the global error handling middleware
      next(error);
    }
  };

export default Authorization;
