import _ from 'lodash';

export abstract class BaseModel<M extends object> {
  constructor() {
    // do nothing
  }

  private readonly ucFirst = (str: string) => `${str[0].toUpperCase()}${str.slice(1)}`;

  protected readonly setInstance = (data?: { [key: string]: any }) => {
    Object.keys(data || {}).forEach((key) => {
      if (typeof this[`set${this.ucFirst(key)}`] === 'function') {
        this[`set${this.ucFirst(key)}`](data?.[key]);
      } else if (data?.[key] && key in this) {
        this[key] = data?.[key];
      }
    });
  };

  public readonly toJSON = (): Partial<M> => {
    return Object.keys(this).reduce((obj: object, key) => {
      if (typeof (this as any)[key] !== 'function') {
        obj[key] = _.cloneDeep(this[key]);
      }
      return obj;
    }, {});
  };
}
