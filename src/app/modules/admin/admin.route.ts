import express from 'express';
import AdminController from './admin.controller';
import ValidateRequest from '../../middlewares/ValidateRequest';
import AdminValidation from './admin.validation';

const router = express.Router();

router.post('/create-admin',ValidateRequest(AdminValidation.createAdminZodSchema) ,AdminController.createAdmin);

router.post(
  '/login',
  ValidateRequest(AdminValidation.loginZodSchema),
  AdminController.adminLogin,
);

const AdminRoutes = router;
export default AdminRoutes;
