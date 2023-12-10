import { app } from './server';
import 'dotenv/config';

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`App start on port: ${PORT}`);
});
