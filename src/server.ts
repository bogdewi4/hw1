import express, { json } from 'express';

import { testingRouter, videoRouter } from './routers';

export const app = express();

app.use(json());
app.use('/videos', videoRouter);
app.use('/testing', testingRouter);
