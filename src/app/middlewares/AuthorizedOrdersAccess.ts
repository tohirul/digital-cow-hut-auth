import { NextFunction, Request, Response } from 'express';
import JWTHelpers from '../../helpers/jwt.helper';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import { IAuthFilter } from '../../types/common.type';

const AuthorizedOrdersAccess =
  () => (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    try {
      const verifiedData = JWTHelpers.verifyToken(
        token as string,
        config.jwt.jwt_access_token_key as Secret,
      );
      const { id: userId, role: userRole } = verifiedData;

      let filterOrders: IAuthFilter;

      if (userRole === 'buyer') filterOrders = { role: 'buyer', buyer: userId };
      else if (userRole === 'seller')
        filterOrders = { role: 'seller', seller: userId };
      else filterOrders = { role: 'admin' };

      req.filterOrders = filterOrders;
      next();
    } catch (error) {
      next(error);
    }
  };

export default AuthorizedOrdersAccess;
