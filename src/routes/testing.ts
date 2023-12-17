import { Response, Request, Router } from 'express';
import { db } from '../db';

export const testingRoute = Router();

testingRoute.delete('/', (req: Request, res: Response) => {
  db.blogs = [];
  db.posts = [];
  res.sendStatus(204);
});
