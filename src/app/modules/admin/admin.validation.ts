import { z } from 'zod';

const createAdminZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string({ required_error: 'Phone Number is required' }),
    role: z.enum(["admin"] as [string, ...string[]], {
      required_error: 'role is required',
    }),
    password: z.string({
      required_error: 'Password is required to sign up',
    }),
    name: z.object({
      firstName: z.string({ required_error: 'First Name is required' }),
      lastName: z.string({ required_error: 'Last Name is required' }),
    }),
    address: z.string({ required_error: 'Address is required' }),
  })
});

const loginZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string({
      required_error: 'PhoneNumber is required to login',
    }),
    password: z.string({
      required_error: 'Password is required to login',
    }),
  }),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token not found',
    }),
  }),
});

const AdminValidation = {
  createAdminZodSchema,
  loginZodSchema,
  refreshTokenZodSchema,
};

export default AdminValidation;
