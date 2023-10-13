import express from 'express';
import UserController from './user.controller';
import Authorization from '../../middlewares/Authorization';
import { USER_ROLE } from '../../../enums/enums';

const router = express.Router();
router.get(
  '/my-profile',
  Authorization(USER_ROLE.SELLER, USER_ROLE.BUYER),
  UserController.getMyProfile,
);
router.get('/', Authorization(USER_ROLE.ADMIN), UserController.getAllUsers);
router.get('/:id', Authorization(USER_ROLE.ADMIN), UserController.getUserById);

router.patch(
  '/my-profile',
  Authorization(USER_ROLE.SELLER, USER_ROLE.BUYER),
  UserController.updateMyProfile,
);
router.patch('/:id', Authorization(USER_ROLE.ADMIN), UserController.updateUser);
router.delete(
  '/:id',
  Authorization(USER_ROLE.ADMIN),
  UserController.deleteUser,
);

const UserRoutes = router;
export default UserRoutes;
