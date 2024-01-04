import { Router } from 'express';

import { UsersController } from '../features/users';
import { authMiddleware } from '../middlewares/auth';
import { userValidation } from '../validators/user';

export const userRoute = Router();

userRoute.get('/', authMiddleware, UsersController.getUsers);

userRoute.post(
  '/',
  authMiddleware,
  userValidation(),
  UsersController.createUser
);

userRoute.delete('/:id', authMiddleware, UsersController.deleteUser);
