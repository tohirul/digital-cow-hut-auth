"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const cow_constant_1 = require("./cow.constant");
const cowProfileZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Name not provided' }),
        age: zod_1.z.number({ required_error: 'Age not provided' }),
        price: zod_1.z.number({ required_error: 'Price not provided' }),
        location: zod_1.z.enum([...cow_constant_1.landmarkEnumValues], {
            required_error: 'Location not provided',
        }),
        breed: zod_1.z.enum([...cow_constant_1.breedEnumValues], {
            required_error: 'breed not provided',
        }),
        weight: zod_1.z.number({ required_error: 'weight not provided' }),
        label: zod_1.z.enum([...cow_constant_1.labelEnumValues]),
        category: zod_1.z.enum([...cow_constant_1.categoryEnumValues]),
        seller: zod_1.z.string({
            required_error: 'Seller id not provided',
        }),
    }),
});
const cowProfileUpdateZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        age: zod_1.z.number().optional(),
        price: zod_1.z.number().optional(),
        location: zod_1.z
            .enum([...cow_constant_1.landmarkEnumValues])
            .optional(),
        breed: zod_1.z.enum([...cow_constant_1.breedEnumValues]).optional(),
        weight: zod_1.z.number().optional(),
        label: zod_1.z.enum([...cow_constant_1.labelEnumValues]).optional(),
        category: zod_1.z
            .enum([...cow_constant_1.categoryEnumValues])
            .optional(),
        seller: zod_1.z.string().optional(),
    }),
});
const CowZodValidation = {
    cowProfileZodSchema,
    cowProfileUpdateZodSchema,
};
exports.default = CowZodValidation;
