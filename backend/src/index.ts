import express from 'express';
import cors from 'cors';
import { onRatesHandler,  onRateHandler} from './controller';
import { dbRates } from './rates';

const app = express();

const PORT = 3050;

const init = async (port: number) => {
  dbRates.init();
  app.use(cors());

  app.use(express.json());

  app.post('/rates', onRatesHandler);
  app.post('/rate', onRateHandler);
  app.use('/', (req, res) => res.send('There is no anything!!!'))

  app.listen(port, () => {
    console.log(`app started on port ${port}`);
  });
};

init(PORT);
