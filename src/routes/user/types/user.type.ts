import { Prisma } from '@prisma/client';

export type UserCreateArgs = {
  createArgs: Prisma.UserCreateArgs;
  tx?: Prisma.TransactionClient;
};

export type UserUpdateArgs = {
  updateArgs: Prisma.UserUpdateArgs;
  tx?: Prisma.TransactionClient;
};

export type UserFindFirstArgs = {
  findArgs: Prisma.UserFindFirstArgs;
  tx?: Prisma.TransactionClient;
};

export type UserFindFirstManyArgs = {
  findManyArgs: Prisma.UserFindManyArgs;
  tx?: Prisma.TransactionClient;
};

export type UserDeleteArgs = {
  deleteArgs: Prisma.UserDeleteArgs;
  tx?: Prisma.TransactionClient;
};
