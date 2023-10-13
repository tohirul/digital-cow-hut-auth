'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const auth_controller_1 = __importDefault(require('./auth.controller'));
const ValidateRequest_1 = __importDefault(
  require('../../middlewares/ValidateRequest'),
);
const auth_validation_1 = __importDefault(require('./auth.validation'));
const router = express_1.default.Router();
router.post(
  '/signup',
  (0, ValidateRequest_1.default)(auth_validation_1.default.signupZodSchema),
  auth_controller_1.default.createUser,
);
const AuthRoutes = router;
exports.default = AuthRoutes;
