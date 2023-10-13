"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = __importDefault(require("./order.controller"));
const Authorization_1 = __importDefault(require("../../middlewares/Authorization"));
const enums_1 = require("../../../enums/enums");
const AuthorizedOrdersAccess_1 = __importDefault(require("../../middlewares/AuthorizedOrdersAccess"));
const router = (0, express_1.Router)();
router.post('/', (0, Authorization_1.default)(enums_1.USER_ROLE.BUYER), order_controller_1.default.createOrder);
router.get('/', (0, Authorization_1.default)(enums_1.USER_ROLE.SELLER, enums_1.USER_ROLE.BUYER, enums_1.USER_ROLE.ADMIN), (0, AuthorizedOrdersAccess_1.default)(), order_controller_1.default.getAllOrders);
router.get('/:id', (0, Authorization_1.default)(enums_1.USER_ROLE.ADMIN, enums_1.USER_ROLE.BUYER, enums_1.USER_ROLE.SELLER), (0, AuthorizedOrdersAccess_1.default)(), order_controller_1.default.getOrderById);
const OrderRoutes = router;
exports.default = OrderRoutes;
