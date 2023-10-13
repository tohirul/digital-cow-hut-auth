import express from 'express';
import CowController from './cow.controller';
import ValidateRequest from '../../middlewares/ValidateRequest';
import CowZodValidation from './cow.validation';
import Authorization from '../../middlewares/Authorization';
import { USER_ROLE } from '../../../enums/enums';
import AuthorizedSeller from '../../middlewares/AuthorizedSeller';

const router = express.Router();

router.post(
  '/',
  ValidateRequest(CowZodValidation.cowProfileZodSchema),
  Authorization(USER_ROLE.SELLER),
  CowController.createCowProfile,
);
router.get(
  '/',
  Authorization(USER_ROLE.ADMIN, USER_ROLE.BUYER, USER_ROLE.SELLER),
  CowController.getAllCowProfile,
);

router.get(
  '/:id',
  Authorization(USER_ROLE.SELLER, USER_ROLE.ADMIN, USER_ROLE.BUYER),
  AuthorizedSeller(),
  CowController.getCowProfile,
);

router.patch(
  '/:id',
  ValidateRequest(CowZodValidation.cowProfileUpdateZodSchema),
  Authorization(USER_ROLE.SELLER),
  AuthorizedSeller(),
  CowController.updateCowProfile,
);
router.delete(
  '/:id',
  Authorization(USER_ROLE.SELLER),
  CowController.deleteCowProfile,
);

const CowRoutes = router;
export default CowRoutes;

/* 
    ? Cows
    api/v1/cows (POST)
    api/v1/cows (GET)
    api/v1/cows/6177a5b87d32123f08d2f5d4 (Single GET) Include an id that is saved in your database
    api/v1/cows/6177a5b87d32123f08d2f5d4 (PATCH)
    api/v1/cows/6177a5b87d32123f08d2f5d4 (DELETE) Include an id that is saved in your database
    ? Pagination and Filtering routes of Cows
    api/v1/cows?pag=1&limit=10
    api/v1/cows?sortBy=price&sortOrder=asc
    api/v1/cows?minPrice=20000&maxPrice=70000
    api/v1/cows?location=Chattogram
    api/v1/cows?searchTerm=Cha
*/
