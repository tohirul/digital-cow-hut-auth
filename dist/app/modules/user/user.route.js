'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const user_controller_1 = __importDefault(require('./user.controller'));
const router = express_1.default.Router();
router.get('/', user_controller_1.default.getAllUsers);
router.get('/:id', user_controller_1.default.getUserById);
router.patch('/:id', user_controller_1.default.updateUser);
router.delete('/:id', user_controller_1.default.deleteUser);
const UserRoutes = router;
exports.default = UserRoutes;
