import jwt from 'jsonwebtoken';
import passport from 'passport';
import scopeDecoder from '@/helpers/scopeDecoder';
import { CookieOptions, NextFunction, Request, Response } from 'express';
import { StrategiesOptions } from '@interfaces/strategy.interface';

export default class StrategiesController {
  constructor(readonly options: StrategiesOptions) {
    // do nothing
  }

  private readonly cookieOpts = ({
    httpOnly,
    reset = false,
    domain,
    maxAge = undefined,
  }: {
    httpOnly: boolean;
    reset?: boolean;
    domain: string;
    maxAge?: number;
  }): CookieOptions => {
    return {
      secure: true,
      httpOnly,
      domain,
      expires: reset ? new Date() : undefined,
      maxAge: !reset ? maxAge : maxAge,
    };
  };

  readonly onAuthenticationRequest = (req: Request, res: Response, next: NextFunction) => {
    const { strategies, env } = this.options;
    const type = req.path.split('/')[1];
    const strategy = strategies.find((strategy) => strategy.type === type);
    const opts: Record<string, any> = {};
    if (env && env.LW_DYNAMIC_SCOPE && req.query && req.query.scope) {
      opts.scope = scopeDecoder(req.query.scope as string);
    }
    req.session = {
      ...req.session,
      success: req.query.success,
      failure: req.query.failure,
    };
    if (strategy.preHook) {
      strategy.preHook(req, opts);
    }
    passport.authenticate(type, opts)(req, res, next);
  };

  readonly onAuthenticationCallback = (req: Request, res: Response, next: NextFunction) => {
    const { tokenCookieName, cookieDomain, profileCookieName, maxAge, tokenSecret } = this.options;
    const type = req.path.split('/')[1];
    passport.authenticate(type, (error, user) => {
      if (error || !user) {
        res.cookie(
          tokenCookieName || 'token-cookie',
          '',
          this.cookieOpts({
            reset: true,
            httpOnly: true,
            domain: cookieDomain || 'localhost:5000',
          }),
        );
        res.cookie(
          profileCookieName || 'profile-cookie',
          JSON.stringify({ error: error || 'No user was returned' }),
          this.cookieOpts({
            httpOnly: false,
            domain: cookieDomain || 'localhost:5000',
            maxAge: maxAge || 1000 * 60 * 60 * 24 * 10,
          }),
        );
        if (req.session!.failure) {
          return res.redirect(decodeURIComponent(req.session!.failure));
        }
      } else if (user) {
        res.cookie(
          tokenCookieName || 'token-cookie',
          jwt.sign(user, tokenSecret || 'my-top'),
          this.cookieOpts({
            httpOnly: true,
            domain: cookieDomain || 'localhost:5000',
            maxAge,
          }),
        );
        res.cookie(
          profileCookieName || 'profile-cookie',
          JSON.stringify(user.profile),
          this.cookieOpts({
            httpOnly: false,
            domain: cookieDomain || 'localhost:5000',
            maxAge,
          }),
        );
        if (req.session!.success) {
          return res.redirect(decodeURIComponent(req.session!.success));
        }
      }
      return res.json({ error, user });
    })(req, res);
  };
}
