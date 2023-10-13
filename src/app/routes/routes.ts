import express from 'express';
import UserRoutes from '../modules/user/user.route';
import AuthRoutes from '../modules/auth/auth.route';
import CowRoutes from '../modules/cow/cow.route';
import OrderRoutes from '../modules/order/order.route';
import AdminRoutes from '../modules/admin/admin.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/cows',
    route: CowRoutes,
  },
  {
    path: '/orders',
    route: OrderRoutes,
  },
  {
    path: '/admins',
    route: AdminRoutes,
  },
];

for (const { path, route } of moduleRoutes) {
  router.use(path, route);
}

const Routes = router;
export default Routes;
