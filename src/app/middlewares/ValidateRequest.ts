import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodEffects } from 'zod';

/**
 * Middleware for request validation using Zod schemas.
 *
 * @param schema - The Zod schema or Zod effects to validate the request against.
 * @returns Express middleware function to validate incoming requests.
 */
const ValidateRequest =
  (schema: AnyZodObject | ZodEffects<AnyZodObject>) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate the request against the provided schema.
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });

      // If validation is successful, continue to the next middleware.
      return next();
    } catch (error) {
      // If validation fails, pass the error to the error handling middleware.
      next(error);
    }
  };

/**
 * Export the ValidateRequest middleware function.
 */
export default ValidateRequest;
