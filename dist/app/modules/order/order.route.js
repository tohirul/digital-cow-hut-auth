'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = require('express');
const order_controller_1 = __importDefault(require('./order.controller'));
const router = (0, express_1.Router)();
router.post('/', order_controller_1.default.createOrder);
router.get('/', order_controller_1.default.getAllOrders);
const OrderRoutes = router;
exports.default = OrderRoutes;
