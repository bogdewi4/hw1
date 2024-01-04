import { Router } from 'express';

import { authMiddleware } from '../middlewares/auth';
import { AuthController } from '../features/auth';

export const authRoute = Router();

authRoute.post('/login', authMiddleware, AuthController.loginUser);
