import { app } from '../src/setting';

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`App start on port: ${PORT}`);
});

module.exports = app;
