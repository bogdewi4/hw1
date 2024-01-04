import { BaseDateEntity } from '../../../types';

type BaseUserModel = {
  login: string;
  email: string;
  password: string;
};

export type CreateUserModel = BaseUserModel;
export type UserModel = BaseUserModel & BaseDateEntity & { id: string };
