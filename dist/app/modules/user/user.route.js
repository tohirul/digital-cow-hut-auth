"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("./user.controller"));
const Authorization_1 = __importDefault(require("../../middlewares/Authorization"));
const enums_1 = require("../../../enums/enums");
const router = express_1.default.Router();
router.get('/my-profile', (0, Authorization_1.default)(enums_1.USER_ROLE.SELLER, enums_1.USER_ROLE.BUYER), user_controller_1.default.getMyProfile);
router.get('/', (0, Authorization_1.default)(enums_1.USER_ROLE.ADMIN), user_controller_1.default.getAllUsers);
router.get('/:id', (0, Authorization_1.default)(enums_1.USER_ROLE.ADMIN), user_controller_1.default.getUserById);
router.patch('/my-profile', (0, Authorization_1.default)(enums_1.USER_ROLE.SELLER, enums_1.USER_ROLE.BUYER), user_controller_1.default.updateMyProfile);
router.patch('/:id', (0, Authorization_1.default)(enums_1.USER_ROLE.ADMIN), user_controller_1.default.updateUser);
router.delete('/:id', (0, Authorization_1.default)(enums_1.USER_ROLE.ADMIN), user_controller_1.default.deleteUser);
const UserRoutes = router;
exports.default = UserRoutes;
