import _ from 'lodash';
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import UserService from '@routes/user/user.service';
import { HttpException } from '@exceptions/HttpException';
import { JWT_SECRET } from '@/config';
import { User } from '@prisma/client';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userService = new UserService();
    const token = req?.headers?.authorization?.split(' ')[1];

    if (!token) {
      throw new HttpException(401, 'Please login');
    }

    const decodedToken = jwt.verify(token, JWT_SECRET!) as User;
    const user = await userService.getUser({ findArgs: { where: { id: decodedToken.id } } });
    (req as any).user = _.cloneDeep(user);
    next();
  } catch (err) {
    next(err);
  }
};
