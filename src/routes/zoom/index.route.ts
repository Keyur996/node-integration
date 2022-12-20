import { Router } from 'express';
import { Route } from '@/interfaces/route.interface';
import { validationMiddleware } from '@/middlewares/validationSchema.middleware';
import { zoomAccessTokenSchema } from './validationSchema/zoom.validation.schema';
import ZoomController from './zoom.controller';

export default class ZoomRoute implements Route {
  readonly path = '/zoom';
  readonly router = Router();

  private readonly zoomController = new ZoomController();

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private readonly initializeRoutes = () => {
    this.router
      .route(`${this.path}/access-token`)
      .get(validationMiddleware(zoomAccessTokenSchema, 'body'), this.zoomController.getAccessToken);
  };
}
