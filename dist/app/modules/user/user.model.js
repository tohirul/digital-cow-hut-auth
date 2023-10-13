"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const user_constant_1 = require("./user.constant");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const UserSchema = new mongoose_1.Schema({
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: user_constant_1.UserRoles,
        required: true,
    },
    name: {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type: String,
        required: true,
    },
    budget: {
        type: Number,
        required: false,
        default: 0,
    },
    income: {
        type: Number,
        required: false,
        default: 0,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
UserSchema.methods.passwordMatch = async function (givenPassword, savedPassword) {
    return await bcrypt_1.default.compare(givenPassword, savedPassword);
};
UserSchema.methods.findExistingById = async function (property) {
    const result = await User.findById({ _id: property });
    return result;
};
UserSchema.methods.findExistingByPhone = async function (property) {
    const result = await User.findOne({ phoneNumber: property });
    return result;
};
UserSchema.pre('save', async function (next) {
    this.password = await bcrypt_1.default.hash(this.password, Number(config_1.default.bcrypt_salt_rounds));
    next();
});
const User = (0, mongoose_1.model)('User', UserSchema);
exports.default = User;
