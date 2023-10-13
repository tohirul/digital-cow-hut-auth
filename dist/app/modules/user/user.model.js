'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const mongoose_1 = require('mongoose');
const user_constant_1 = require('./user.constant');
const userSchema = new mongoose_1.Schema(
  {
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
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
