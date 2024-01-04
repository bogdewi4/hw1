import { Router } from 'express';

import { authMiddleware } from '../middlewares/auth';
import { userValidation } from '../validators/user';
import { UsersController } from '../features/users';

export const userRoute = Router();

userRoute.get('/', authMiddleware, UsersController.getUsers);

userRoute.post(
  '/',
  authMiddleware,
  userValidation(),
  UsersController.createUser
);

userRoute.delete('/:id', authMiddleware, UsersController.deleteUser);
