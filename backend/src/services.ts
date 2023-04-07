import { eachDayOfInterval, parse, format } from 'date-fns';
import { dbRates } from './rates';
import { Rates } from './types';

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
      return { date: convertedDate, rates: await dbRates.getRate(convertedDate) };
    })
  );

  const currencies = promises.reduce((acc, { date, rates }) => {
    return { ...acc, [date]: rates };
  }, {} as Rates);

  return currencies;
};

export const getRate = async (date: string) => {

  const convertedDate = format(parseDate(date), 'dd/MM/yyyy');

  return await dbRates.getRate(convertedDate);
};
