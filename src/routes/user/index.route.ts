import { Router } from 'express';
import { Route } from '@interfaces/route.interface';

class UserRoute implements Route {
  readonly path = '/user';
  readonly router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private readonly initializeRoutes = () => {
    this.router.route(`${this.path}`);
  };
}
