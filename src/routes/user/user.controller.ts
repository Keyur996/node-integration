import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { User } from './user.model';

export default class UserController {
  constructor() {
    // do nothing
  }

  readonly createUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userData = new User(req.body);
  });
}
