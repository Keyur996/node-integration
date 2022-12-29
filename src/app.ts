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
import cookieSession from 'cookie-session';
import Strategies from './routes/strategy/strategies';
import passport from 'passport';
import StrategiesController from './routes/strategy/strategies.controller';

const test = require('passport-facebook').Strategy;
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
    this.setPassportStrategies();
    this.initializeRoutes(routes);
    this.setPassportRoutes();
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
    this.app.use(
      cookieSession({
        name: 'session',
        keys: ['test01', 'test03'],
        maxAge: 24 * 60 * 60 * 1000,
      }),
    );
    this.app.use(passport.initialize());
  };

  private readonly setPassportStrategies = () => {
    const strategies = Strategies.getStrategies(process.env, 'http://localhost:5000/');
    strategies.forEach((strategy) => {
      passport.use(new strategy.Ctor(strategy.config!, strategy.toUser));
    });

    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user as Express.User));
  };

  private readonly setPassportRoutes = () => {
    const strategies = Strategies.getStrategies(process.env, 'http://localhost:5000');
    // console.log('Started', strategies);
    const opts: Record<string, any> = {};
    if (strategies.length > 0) {
      opts.strategies = strategies;
      opts.env = process.env;
      const controller = new StrategiesController(opts as any);
      this.app.get(
        strategies.map((strategy) => `/${strategy.type}`),
        controller.onAuthenticationRequest,
      );
      this.app.get(
        strategies.map((strategy) => `/${strategy.type}/callback`),
        controller.onAuthenticationCallback,
      );
    }
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
