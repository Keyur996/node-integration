import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { JWT_EXPIRES_IN, JWT_SECRET, PASSWORD_SALT } from '@/config';

export default class AuthService {
  constructor() {
    // do nothing
  }

  readonly comparePassword = async (password: string, hash: string) => {
    return bcrypt.compare(password, hash);
  };

  readonly createPasswordHash = async (password: string) => {
    return bcrypt.hash(password, 5);
  };

  readonly signToken = (user: User) => {
    return jwt.sign(user, JWT_SECRET!, { expiresIn: JWT_EXPIRES_IN! });
  };
}
