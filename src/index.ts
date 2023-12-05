import express, { json } from 'express';

import { videoRouter } from './routers';

const PORT = 5000;

export const app = express();

app.use(json());
app.use('/videos', videoRouter);

app.listen(PORT, () => {
  console.log(`App start on port: ${PORT}`);
});
