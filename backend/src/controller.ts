import { eachDayOfInterval, parse, format } from 'date-fns';
import { dbRates } from './rates';
import { Rates } from './types';
import { Request, Response } from 'express';

const parseDate = (date: string) => parse(date, 'yyyy/MM/dd', new Date());

const getDaysArray = (start: string, end: string) =>
  eachDayOfInterval({
    start: parseDate(start),
    end: parseDate(end),
  });

export const getRates = async (range: { start: string; end: string }) => {
  const list = getDaysArray(range.start, range.end);
  const promises = await Promise.all(
    list.map(async (date) => {
      const convertedDate = format(date, 'dd/MM/yyyy');
      return { date: convertedDate, rates: await dbRates.getRates(convertedDate) };
    })
  );

  const currencies = promises.reduce((acc, { date, rates }) => {
    return { ...acc, [date]: rates };
  }, {} as Rates);

  return currencies;
};


export const onRequestHanlder = async (req: Request, res: Response) => {
  const body = req.body as { start: string; end: string };
  console.log('body: ', body);
  if (!body.end || !body.start) {
    res.status(400).send('NO!!!!');
    return;
  }
  const result = await getRates(body);
  res.status(200).send(result);
};
