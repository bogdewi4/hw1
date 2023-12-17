import { NextFunction, Request, Response } from 'express';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.headers?.['authorization'] !== 'Basic YWRtaW46cXdlcnR5') {
    res.sendStatus(401);
    return;
  }

  next();

  const auth = req.headers?.['authorization'];

  if (!auth) {
    res.sendStatus(401);
    return;
  }

  const [basic, token] = auth.split(' ');

  if (basic !== 'Basic') {
    res.sendStatus(401);
    return;
  }

  const decodedData = Buffer.from(token, 'base64').toString();

  const [login, password] = decodedData.split(':');

  if (login !== process.env.AUTH_LOGIN || password !== process.env.AUTH_PASS) {
    res.sendStatus(401);
    return;
  }
};
