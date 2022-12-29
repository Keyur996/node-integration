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

export interface Strategy {
  Ctor: { new (config: StrategyOption & { scope?: string[] }, toUser: (...args: any[]) => any): passport.Strategy };
  getConfig: (env: NodeJS.Process['env'], callbackURL: string) => StrategyOption & { scope?: string[] };
  toUser: (...args: any[]) => any;
  config?: StrategyOption & { scope?: string[] };
  type: string;
}
