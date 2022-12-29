import { Strategy } from '@interfaces/strategy.interface';
import { Strategy as FaceBookStrategy, StrategyOption } from 'passport-facebook';

export class FBStrategy extends Strategy {
  config?: (StrategyOption & { scope?: string[] | undefined }) | undefined;
  readonly Ctor = FaceBookStrategy;
  readonly type = 'facebook';
  constructor() {
    super();
  }

  readonly getConfig = (
    env: NodeJS.ProcessEnv,
    callbackURL: string,
  ): (StrategyOption & { scope?: string[] }) | undefined => {
    const clientID = env.LW_FACEBOOK_APPID;
    const clientSecret = env.LW_FACEBOOK_APPSECRET;
    if (clientID && clientSecret) {
      return {
        clientID,
        clientSecret,
        callbackURL,
        profileFields: ['displayName', 'name', 'photos'],
      };
    }
  };

  readonly toUser = (
    accessToken: string,
    refreshToken: string,
    profile: Record<string, any>,
    done: (error: any, user?: any, info?: any) => void,
  ) => {
    let name: string = '';
    if (profile.name) {
      if (profile.name.givenName && profile.name.familyName) {
        name = `${profile.name.givenName} ${profile.name.familyName}`;
      } else if (profile.name.givenName) {
        name = profile.name.givenName;
      } else if (profile.name.familyName) {
        name = profile.name.familyName;
      }
    }
    done(null, {
      accessToken,
      refreshToken,
      profile: {
        username: profile.displayName,
        provider: 'facebook',
        name,
        photo: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
      },
    });
  };
}
