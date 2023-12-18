import { runDb } from './db';
import { app } from './server';
import 'dotenv/config';

const PORT = process.env.PORT || 5002;

const bootstrap = async () => {
  await runDb();

  app.listen(PORT, async () => {
    console.log(`App start on port: ${PORT}`);
  });
};

bootstrap();
