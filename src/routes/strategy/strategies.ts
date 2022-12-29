import scopeDecoder from '@/helpers/scopeDecoder';
import { Strategy } from '@/interfaces/strategy.interface';
import { join } from 'path';

export default class Strategies {
  private static readonly strategies: Record<string, Strategy> = {
    facebook: require(join(process.cwd(), './strategy/facebook')),
    google: require(join(process.cwd(), './strategy/google')),
    linkedin: require(join(process.cwd(), './strategy/linkedin')),
    twitter: require(join(process.cwd(), './strategy/twitter')),
  };

  static readonly isConfigured = (strategy: any) => strategy?.config;

  static readonly getStrategies = (env: NodeJS.Process['env'], rootUrl: string) => {
    return Object.keys(this.strategies)
      .map((type) => {
        const strategy = this.strategies[type];
        const callbackURL = `${rootUrl}/${type}/callback`;
        strategy.config = strategy.getConfig(env, callbackURL);
        if (strategy.config && strategy.config.scope) {
          strategy.config.scope = scopeDecoder(strategy.config.scope);
        }
        strategy.type = type;
        return strategy;
      })
      .filter((strategy) => this.isConfigured(strategy));
  };
}
