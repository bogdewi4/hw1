import { Router } from 'express';

import { dropVideoTable } from '../db';

export const testingRouter = Router({});

testingRouter.delete('/', (_req, res) => {
  dropVideoTable();
  res.sendStatus(204);
});
