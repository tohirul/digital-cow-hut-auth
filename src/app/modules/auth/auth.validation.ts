import { z } from 'zod';
import { UserRoles } from '../user/user.constant';

const signupZodSchema = z.object({
  body: z.object({
    password: z.string({
      required_error: 'Password is required to sign up',
    }),
    role: z.enum([...UserRoles] as [string, ...string[]], {
      required_error: 'role is required',
    }),
    name: z.object({
      firstName: z.string({ required_error: 'First Name is required' }),
      lastName: z.string({ required_error: 'Last Name is required' }),
    }),
    phoneNumber: z.string({ required_error: 'Phone Number is required' }),
    address: z.string({ required_error: 'Address is required' }),
    budget: z.number().optional(),
    income: z.number().optional(),
  }),
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
      required_error: 'Refresh Token is required',
    }),
  }),
});

const AuthZodValidation = {
  signupZodSchema,
  loginZodSchema,
  refreshTokenZodSchema,
};
export default AuthZodValidation;
