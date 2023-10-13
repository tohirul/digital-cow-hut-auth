import { Router } from 'express';
import OrderController from './order.controller';
import Authorization from '../../middlewares/Authorization';
import { USER_ROLE } from '../../../enums/enums';
import AuthorizedOrdersAccess from '../../middlewares/AuthorizedOrdersAccess';

const router = Router();

router.post('/', Authorization(USER_ROLE.BUYER), OrderController.createOrder);
router.get(
  '/',
  Authorization(USER_ROLE.SELLER, USER_ROLE.BUYER, USER_ROLE.ADMIN),
  AuthorizedOrdersAccess(),
  OrderController.getAllOrders,
);
router.get(
  '/:id',
  Authorization(USER_ROLE.ADMIN, USER_ROLE.BUYER, USER_ROLE.SELLER),
  AuthorizedOrdersAccess(),
  OrderController.getOrderById,
);

const OrderRoutes = router;
export default OrderRoutes;
