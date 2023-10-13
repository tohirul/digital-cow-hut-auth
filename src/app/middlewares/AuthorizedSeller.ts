import { NextFunction, Request, Response } from 'express';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import JWTHelpers from '../../helpers/jwt.helper';
import config from '../../config';
import { Secret } from 'jsonwebtoken';
import User from '../modules/user/user.model';
import Cow from '../modules/cow/cow.model';

const AuthorizedSeller =
  () => async (req: Request, res: Response, next: NextFunction) => {
    const cowId = req.params.id;
    const token = req.headers.authorization;
    if (!token)
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Credentials Missing !');
    try {
      const cow = await Cow.findById({ _id: cowId }); /* .populate('seller') */
      if (!cow) throw new ApiError(httpStatus.NOT_FOUND, 'Cow not found!');
      // console.log('COW: ', cow);

      const verifiedData = JWTHelpers.verifyToken(
        token as string,
        config.jwt.jwt_access_token_key as Secret,
      );
      const user = new User();
      const { id: sellerId } = verifiedData;
      const seller = await user.findExistingById(sellerId);
      if (!seller)
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Credentials!');
      // console.log('SELLER', seller);
      if (cow.seller.toString() !== sellerId.toString())
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          'You are not authorized to perform this action!',
        );

      const matching = await Cow.findOne({
        _id: cowId,
        seller: sellerId,
      });
      // console.log('Matching: ', matching);
      if (!matching)
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          'You are not authorized to perform this operation',
        );
      else next();
    } catch (error) {
      next(error);
    }
  };
export default AuthorizedSeller;
