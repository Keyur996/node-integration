import { generalResponse } from '@/helpers/common.helper';
import { NextFunction, Request, Response } from 'express';
import { NumberSchema, ObjectSchema, StringSchema } from 'joi';

const errorFilterValidator = (error: Array<Error>) => {
  const extractedErrors: Array<string> = [];
  error.map((err: Error) => extractedErrors.push(err.message));
  const errorResponse = extractedErrors.join(', ');
  return errorResponse;
};

export const validationMiddleware = (
  type: ObjectSchema | StringSchema | NumberSchema,
  value: string | 'body' | 'query' | 'params' = 'body',
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      (req as any)[value] = await type.validateAsync((req as any)[value]);
      next();
    } catch (e) {
      const error: any = e;
      if (error.details) {
        const errorResponse = errorFilterValidator(error.details);
        return generalResponse(res, null, errorResponse, 'error', true, 400);
      }
      return generalResponse(res, null, 'Something went wrong!', 'success', true, 400);
    }
  };
};
