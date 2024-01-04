import type { WithId } from 'mongodb';

import type { UserDTO } from '../dto';
import { UserDB } from '../../../../models/db';

export const userMapper = ({ _id, ...userDb }: WithId<UserDB>): UserDTO => {
  return {
    id: _id.toString(),
    email: userDb.email,
    login: userDb.login,
    createdAt: userDb.createdAt,
  };
};
