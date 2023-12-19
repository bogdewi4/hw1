const path = require('path');

import dotenv from 'dotenv';
import { runDb } from './db';
import { app } from './server';

dotenv.config({
  path: path.join(__dirname, `../.env.${process.env.NODE_ENV}`),
});

const PORT = process.env.PORT || 5002;

const bootstrap = async () => {
  await runDb();
  app.listen(PORT, () => {
    console.log(`App start on port: ${PORT}`);
  });
};

bootstrap();
