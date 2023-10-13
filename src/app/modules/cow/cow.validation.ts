import { z } from 'zod';
import {
  breedEnumValues,
  categoryEnumValues,
  labelEnumValues,
  landmarkEnumValues,
} from './cow.constant';

const cowProfileZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name not provided' }),
    age: z.number({ required_error: 'Age not provided' }),
    price: z.number({ required_error: 'Price not provided' }),
    location: z.enum([...landmarkEnumValues] as [string, ...string[]], {
      required_error: 'Location not provided',
    }),
    breed: z.enum([...breedEnumValues] as [string, ...string[]], {
      required_error: 'breed not provided',
    }),
    weight: z.number({ required_error: 'weight not provided' }),
    label: z.enum([...labelEnumValues] as [string, ...string[]]),
    category: z.enum([...categoryEnumValues] as [string, ...string[]]),
    seller: z.string({
      required_error: 'Seller id not provided',
    }),
  }),
});

const cowProfileUpdateZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    age: z.number().optional(),
    price: z.number().optional(),
    location: z
      .enum([...landmarkEnumValues] as [string, ...string[]])
      .optional(),
    breed: z.enum([...breedEnumValues] as [string, ...string[]]).optional(),
    weight: z.number().optional(),
    label: z.enum([...labelEnumValues] as [string, ...string[]]).optional(),
    category: z
      .enum([...categoryEnumValues] as [string, ...string[]])
      .optional(),
    seller: z.string().optional(),
  }),
});

const CowZodValidation = {
  cowProfileZodSchema,
  cowProfileUpdateZodSchema,
};

export default CowZodValidation;
