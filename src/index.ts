import { app } from './setting';

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`App start on port: ${PORT}`);
});

export default app;
