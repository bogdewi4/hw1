import { Router } from 'express';
import type { Request, Response } from 'express';

import { client } from '@/db';

export const testingRoute = Router();

testingRoute.delete('/all-data', (req: Request, res: Response) => {
  client.db().collection('post').deleteMany({});
  client.db().collection('blog').deleteMany({});
  res.sendStatus(204);
});
