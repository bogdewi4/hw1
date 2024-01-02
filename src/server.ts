import express, { json } from 'express';

import { blogRoute, postRoute, testingRoute } from '@/routes';

export const app = express();

app.use(json());
app.use('/blogs', blogRoute);
app.use('/posts', postRoute);
app.use('/testing', testingRoute);
