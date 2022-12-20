import { BaseModel } from '@/lib/base/base.model';
import { User as IUser } from '@prisma/client';

export class User extends BaseModel implements Partial<IUser> {
  id?: number = undefined;
  email?: string = undefined;
  name?: string | null = undefined;

  constructor(data?: { [key: string]: any }) {
    super();
    this.setInstance(data);
  }
}
