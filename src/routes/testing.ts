import { Response, Request, Router } from 'express';
import { client } from '../db';

export const testingRoute = Router();

testingRoute.delete('/all-data', (req: Request, res: Response) => {
  client.db().dropDatabase();
  res.sendStatus(204);
});
