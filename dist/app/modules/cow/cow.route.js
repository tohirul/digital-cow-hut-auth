'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const cow_controller_1 = __importDefault(require('./cow.controller'));
const ValidateRequest_1 = __importDefault(
  require('../../middlewares/ValidateRequest'),
);
const cow_validation_1 = __importDefault(require('./cow.validation'));
const router = express_1.default.Router();
router.post(
  '/',
  (0, ValidateRequest_1.default)(cow_validation_1.default.cowProfileZodSchema),
  cow_controller_1.default.createCowProfile,
);
router.get('/', cow_controller_1.default.getAllCowProfile);
router.get('/:id', cow_controller_1.default.getCowProfile);
router.patch(
  '/:id',
  (0, ValidateRequest_1.default)(
    cow_validation_1.default.cowProfileUpdateZodSchema,
  ),
  cow_controller_1.default.updateCowProfile,
);
router.delete('/:id', cow_controller_1.default.deleteCowProfile);
const CowRoutes = router;
exports.default = CowRoutes;
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
