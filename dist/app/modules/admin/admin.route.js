"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = __importDefault(require("./admin.controller"));
const ValidateRequest_1 = __importDefault(require("../../middlewares/ValidateRequest"));
const admin_validation_1 = __importDefault(require("./admin.validation"));
const router = express_1.default.Router();
router.post('/create-admin', (0, ValidateRequest_1.default)(admin_validation_1.default.createAdminZodSchema), admin_controller_1.default.createAdmin);
router.post('/login', (0, ValidateRequest_1.default)(admin_validation_1.default.loginZodSchema), admin_controller_1.default.adminLogin);
const AdminRoutes = router;
exports.default = AdminRoutes;
