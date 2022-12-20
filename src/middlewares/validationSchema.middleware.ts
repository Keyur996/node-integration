import { generalResponse } from '@/helpers/common.helpers';
import { NextFunction, Request, Response } from 'express';
import { NumberSchema, ObjectSchema, StringSchema } from 'joi';

export const validationMiddleware = (
  type: ObjectSchema | StringSchema | NumberSchema,
  value: string | 'body' | 'query' | 'params' = 'body',
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req[value] = await type.validateAsync(req[value]);
      next();
    } catch (e) {
      const error: any = e;
      if (error.details) {
        const errorResponse = (error?.details || []).map((err: Error) => err.message).toString();
        return generalResponse(res, null, errorResponse, 'error', true, 400);
      }
      return generalResponse(res, null, 'Something went wrong!', 'success', true, 400);
    }
  };
};
