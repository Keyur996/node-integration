import { AxiosError } from 'axios';
import { Request, Response, NextFunction } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { generalResponse } from '@/helpers/common.helpers';

export const errorHandlerMIddleWare = (
  err: Error | AxiosError | HttpException,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AxiosError) {
    return generalResponse(
      res,
      {
        code: err.code,
        detailError: err.response?.data,
      },
      err.message,
      'error',
      false,
      err.response?.status || 500,
    );
  }

  if (err instanceof HttpException) {
    return generalResponse(res, err, err.message, 'error', false, err.statusCode);
  }
  console.log('Error', err);
  return generalResponse(res, err, 'Something Went Wrong !!', 'error', false, 500);
};
