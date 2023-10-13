"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const createAdminZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        phoneNumber: zod_1.z.string({ required_error: 'Phone Number is required' }),
        role: zod_1.z.enum(["admin"], {
            required_error: 'role is required',
        }),
        password: zod_1.z.string({
            required_error: 'Password is required to sign up',
        }),
        name: zod_1.z.object({
            firstName: zod_1.z.string({ required_error: 'First Name is required' }),
            lastName: zod_1.z.string({ required_error: 'Last Name is required' }),
        }),
        address: zod_1.z.string({ required_error: 'Address is required' }),
    })
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
            required_error: 'Refresh token not found',
        }),
    }),
});
const AdminValidation = {
    createAdminZodSchema,
    loginZodSchema,
    refreshTokenZodSchema,
};
exports.default = AdminValidation;
