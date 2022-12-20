import { Response } from 'express';

export const generalResponse = (
  response: Response,
  data: any = null,
  message = '',
  responseType = 'success',
  toast = false,
  statusCode = 200,
) => {
  response.status(statusCode).send({
    data,
    message,
    toast,
    responseType,
  });
};
