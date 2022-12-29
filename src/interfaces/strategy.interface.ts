import passport from 'passport';
import { StrategyOption } from 'passport-facebook';

export interface StrategiesOptions {
  readonly strategies: any[];
  readonly env: NodeJS.Process['env'];
  readonly tokenCookieName: string;
  readonly tokenSecret: string;
  readonly profileCookieName: string;
  readonly cookieDomain: string;
  readonly maxAge?: number;
}

export abstract class Strategy {
  abstract Ctor: {
    new (config: StrategyOption & { scope?: string[] }, toUser: (...args: any[]) => any): passport.Strategy;
  };
  abstract getConfig: (
    env: NodeJS.Process['env'],
    callbackURL: string,
  ) => (StrategyOption & { scope?: string[] }) | undefined;
  abstract toUser: (...args: any[]) => any;
  abstract config?: StrategyOption & { scope?: string[] };
  abstract type?: string;
}
