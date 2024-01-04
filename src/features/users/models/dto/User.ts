import { BaseDateEntity } from '../../../../types';

type UserBaseDTO = {
  id: string;
  login: string;
  email: string;
};

export type UserDTO = UserBaseDTO & BaseDateEntity;
