import { JwtPayload } from 'jsonwebtoken';
import { IAuthFilter } from './common.type';

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
      filterOrders: IAuthFilter;
    }
  }
}
