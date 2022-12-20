import { Router } from 'express';
import { Route } from '@interfaces/route.interface';
import { validationMiddleware } from '@middlewares/validationSchema.middleware';
import { loginSchema, registerUserSchema } from './validationSchema/auth.validation.schema';
import AuthController from './auth.controller';
import AuthService from './auth.service';
import UserService from '../user/user.service';

export default class AuthRoute implements Route {
  readonly path = '/auth';
  readonly router = Router();

  private readonly authController = new AuthController(new AuthService(), new UserService());

  constructor() {
    this.initializeRoute();
  }

  private readonly initializeRoute = () => {
    this.router.route(`${this.path}/login`).post(validationMiddleware(loginSchema, 'body'), this.authController.login);

    this.router
      .route(`${this.path}/register`)
      .post(validationMiddleware(registerUserSchema, 'body'), this.authController.register);
  };
}
