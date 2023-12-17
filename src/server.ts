import express, { json } from 'express';

import { blogRoute, testingRoute } from './routes';

export const app = express();

app.use(json());
app.use('/blogs', blogRoute);
app.use('/testing', testingRoute);
