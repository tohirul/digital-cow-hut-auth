import express from 'express';
import AuthController from './auth.controller';
import ValidateRequest from '../../middlewares/ValidateRequest';
import AuthZodValidation from './auth.validation';

const router = express.Router();

router.post(
  '/signup',
  ValidateRequest(AuthZodValidation.signupZodSchema),
  AuthController.createUser,
);

router.post(
  '/login',
  ValidateRequest(AuthZodValidation.loginZodSchema),
  AuthController.loginUser,
);

router.post(
  '/refresh-token',
  ValidateRequest(AuthZodValidation.refreshTokenZodSchema),
  AuthController.verifyRefreshToken,
);

const AuthRoutes = router;
export default AuthRoutes;
