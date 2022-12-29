import ms from 'ms';
import { User as IUser } from '@prisma/client';
import asyncHandler from 'express-async-handler';
import { NextFunction, Request, Response } from 'express';
import AuthService from './auth.service';
import { User } from '../user/user.model';
import { AuthData } from './types/auth.type';
import UserService from '../user/user.service';
import { HttpException } from '@exceptions/HttpException';
import { COOKIE_EXPIRES_IN, JWT_EXPIRES_IN } from '@/config';
import { generalResponse } from '@/helpers/common.helpers';

export default class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {
    // do nothing
  }

  private readonly createSendToken = (user: IUser, statusCode: number, req: Request, res: Response) => {
    const accessToken = this.authService.signToken(user);

    res.cookie('jwt', accessToken, {
      expires: new Date(Date.now() + +COOKIE_EXPIRES_IN! * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    });

    return generalResponse(
      res,
      {
        access_token: accessToken,
        user,
        expiresIn: ms(JWT_EXPIRES_IN!),
      },
      'Log in Successful',
      'success',
      false,
      statusCode,
    );
  };

  readonly login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userData = new User(req.body).toJSON() as AuthData;

    const user = await this.userService.getUser({
      findArgs: {
        where: { email: userData.email },
      },
    });

    if (!user) {
      throw new HttpException(404, 'User does not Exist');
    }

    const correctPassword = await this.authService.comparePassword(userData.password, user.password);

    if (!correctPassword) {
      throw new HttpException(400, 'Invalid Password');
    }

    this.createSendToken(user, 200, req, res);
  });

  readonly register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userData = new User(req.body).toJSON() as IUser;

    const isEmailExist = await this.userService.getUser({ findArgs: { where: { email: userData.email } } });

    if (isEmailExist) {
      throw new HttpException(400, 'Email Already Exist');
    }

    userData.password = await this.authService.createPasswordHash(userData.password);

    const user = await this.userService.createUser({ createArgs: { data: userData } });

    this.createSendToken(user, 201, req, res);
  });
}
