import { NextFunction, Request, Response } from 'express';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import JWTHelpers from '../../helpers/jwt.helper';
import config from '../../config';
import { Secret } from 'jsonwebtoken';
import Admin from '../modules/admin/admin.model';
import User from '../modules/user/user.model';

const Authorization =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    console.log('Required Roles: ', requiredRoles);
    try {
      // console.log(requiredRoles);
      const token = req.headers.authorization;
      // console.log(token);
      if (!token)
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Credentials Missing !');

      const verifiedData = JWTHelpers.verifyToken(
        token as string,
        config.jwt.jwt_access_token_key as Secret,
      );
      if (!verifiedData)
        throw new ApiError(
          httpStatus.NON_AUTHORITATIVE_INFORMATION,
          'Invalid Creadentials! Token is has expired',
        );
      // console.log(verifiedData);
      const { id, role } = verifiedData;
      console.log(verifiedData, 'requiredRoles', requiredRoles);
      if (
        JWTHelpers.verifyToken(
          req.cookies.refreshToken as string,
          config.jwt.jwt_refresh_token_key as Secret,
        ).id.toString() !== id.toString()
      )
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          'Invalid Creadentials! Outdated credentials in use',
        );

      let user = null;

      if (role === 'admin') user = new Admin();
      else user = new User();

      const isExisting = await user.findExistingById(id);

      if (!isExisting)
        throw new ApiError(
          httpStatus.NOT_FOUND,
          'Invalid Credentials! User not found',
        );

      // ? Extending verified data to Express;
      req.user = verifiedData;

      // ? Checking if User has access
      if (
        requiredRoles.length > 0 &&
        !requiredRoles.includes(verifiedData.role)
      )
        throw new ApiError(
          httpStatus.FORBIDDEN,
          'You do not have required permission to access this!',
        );

      next();
    } catch (error) {
      next(error);
    }
  };

export default Authorization;
