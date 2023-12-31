"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const user_constant_1 = require("../user/user.constant");
const signupZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string({
            required_error: 'Password is required to sign up',
        }),
        role: zod_1.z.enum([...user_constant_1.UserRoles], {
            required_error: 'role is required',
        }),
        name: zod_1.z.object({
            firstName: zod_1.z.string({ required_error: 'First Name is required' }),
            lastName: zod_1.z.string({ required_error: 'Last Name is required' }),
        }),
        phoneNumber: zod_1.z.string({ required_error: 'Phone Number is required' }),
        address: zod_1.z.string({ required_error: 'Address is required' }),
        budget: zod_1.z.number().optional(),
        income: zod_1.z.number().optional(),
    }),
});
const loginZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        phoneNumber: zod_1.z.string({
            required_error: 'PhoneNumber is required to login',
        }),
        password: zod_1.z.string({
            required_error: 'Password is required to login',
        }),
    }),
});
const refreshTokenZodSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({
            required_error: 'Refresh Token is required',
        }),
    }),
});
const AuthZodValidation = {
    signupZodSchema,
    loginZodSchema,
    refreshTokenZodSchema,
};
exports.default = AuthZodValidation;
