import express from 'express';
import cors from 'cors';
import { onRequestHanlder } from './controller';
import { dbRates } from './rates';

const app = express();

const PORT = 3050;

const init = async (port: number) => {
  dbRates.init();
  app.use(cors());

  app.use(express.json());

  app.post('/', onRequestHanlder);

  app.listen(port, () => {
    console.log(`app started on port ${port}`);
  });
};

init(PORT);
