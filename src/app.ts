import morgan from 'morgan';
import hpp from 'hpp';
import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import path from 'path';
import compression from 'compression';
import { Route } from '@interfaces/route.interface';
import { NODE_ENV, PORT } from '@/config';
import { IncomingMessage, ServerResponse, Server } from 'http';
import { errorHandlerMIddleWare } from '@middlewares/errorHandler.middleware';

export default class App {
  private readonly port: number;
  private readonly env: string;
  public server: Server<typeof IncomingMessage, typeof ServerResponse> | undefined;
  public readonly app: express.Application;

  constructor(routes: Route[]) {
    this.app = express();
    this.port = (PORT && +PORT) || 7000;
    this.env = NODE_ENV || 'development';
    this.setMiddleWares();
    this.initializeRoutes(routes);
    this.setErrorHandlerMiddleWare();
  }

  public readonly listen = () => {
    this.server = this.app.listen(this.port, () => {
      process.stdout.write('================================== \n');
      process.stdout.write(`======= ENV: ${this.env} ========= \n`);
      process.stdout.write(`🚀 App listening on the port ${this.port} \n`);
      process.stdout.write('================================== \n');
    });
  };

  private readonly setMiddleWares = () => {
    this.app.set('views', path.resolve(process.cwd(), '/src/templates'));
    this.app.set('view engine', 'ejs');
    this.app.use('api/v1/images', express.static(path.resolve(process.cwd(), '/public')));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(morgan('dev'));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(cookieParser());
  };

  private readonly initializeRoutes = (routes: Route[]) => {
    routes.map((route) => {
      this.app.use('/api/v1/', route.router);
    });
  };

  private readonly setErrorHandlerMiddleWare = () => {
    this.app.use(errorHandlerMIddleWare);
  };
}
