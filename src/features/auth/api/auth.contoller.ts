import { Response } from 'express';
import { HttpStatusCode } from 'axios';

import { RequestWithBody } from '../../../types';
import { userService } from '../../users/services';
import { Credential } from '../models';

export const AuthController = {
  loginUser: async (req: RequestWithBody<Credential>, res: Response) => {
    const { loginOrEmail, password } = req.body;

    const hasCredential = await userService.checkCredential(
      loginOrEmail,
      password
    );

    hasCredential
      ? res.sendStatus(HttpStatusCode.NoContent)
      : res.sendStatus(HttpStatusCode.Unauthorized);
  },
};
