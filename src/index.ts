import express, { json } from 'express';

import { testingRouter, videoRouter } from './routers';

const PORT = 5001;

export const app = express();

app.use(json());
app.use('/videos', videoRouter);
app.use('/testing', testingRouter);

app.listen(PORT, () => {
  console.log(`App start on port: ${PORT}`);
});
