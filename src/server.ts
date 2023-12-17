import express, { json } from 'express';

import { blogRoute } from './routes';

export const app = express();

app.use(json());
app.use('/blogs', blogRoute);
