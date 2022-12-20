import prismaObj from '@lib/prisma';
import {
  UserCreateArgs,
  UserDeleteArgs,
  UserFindFirstArgs,
  UserFindFirstManyArgs,
  UserUpdateArgs,
} from './types/user.type';

export default class UserService {
  constructor() {
    // do nothing
  }

  readonly createUser = (data: UserCreateArgs) => {
    const { createArgs, tx } = data;
    return (tx || prismaObj).user.create(createArgs);
  };

  readonly updateUser = (data: UserUpdateArgs) => {
    const { updateArgs, tx } = data;
    return (tx || prismaObj).user.update(updateArgs);
  };

  readonly getUser = (data: UserFindFirstArgs) => {
    const { findArgs, tx } = data;
    return (tx || prismaObj).user.findFirst(findArgs);
  };

  readonly getUsers = (data: UserFindFirstManyArgs) => {
    const { findManyArgs, tx } = data;
    return (tx || prismaObj).user.findMany(findManyArgs);
  };

  readonly deleteUser = (data: UserDeleteArgs) => {
    const { deleteArgs, tx } = data;
    return (tx || prismaObj).user.delete(deleteArgs);
  };
}
