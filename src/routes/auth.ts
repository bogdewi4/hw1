import { Router } from 'express';

import { AuthController } from '../features/auth';

export const authRoute = Router();

authRoute.post('/login', AuthController.loginUser);
