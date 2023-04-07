import { Request, Response } from 'express';
import { getRate, getRates } from './services';

export const onRatesHandler = async (req: Request, res: Response) => {
  const body = req.body as { start: string; end: string };
  if (!body.end || !body.start) {
    res.status(400).send('NO!!!!');
    return;
  }
  const result = await getRates(body);
  res.status(200).send(result);
};

export const onRateHandler = async (req: Request, res: Response) => {
  const body = req.body as { date: string };
  if (!body.date) {
    res.status(400).send('NO!!!!');
    return;
  }
  const result = await getRate(body.date);

  res.status(200).send(result);
};
