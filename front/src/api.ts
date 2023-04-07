import axios from 'axios';
import { Range } from './App';
const url = 'http://127.0.0.1:3050';
import { format } from 'date-fns';
import { Currencies } from './types';

const getDate = (date: string) => format(new Date(date), 'yyyy/MM/dd');

export const getRates = async (range: Range) => {
  const convertedRange = { start: getDate(range.start), end: getDate(range.end) };
  const { data } = await axios.post(`${url}/rates`, convertedRange);
  return data;
};

const mockRate: Currencies = {
  USD: {
    name: 'US Dollar',
    value: 83.4097,
    code: 'USD',
  },
  TRY: {
    name: 'Turkish Lira',
    value: 5.6816,
    code: 'TRY',
  },
};

export const getRate = async (date: string) => {
  console.log('date: ', date);
  const { data } = await axios.post(`http://127.0.0.1:3050/rate/`, { date });
  // console.log('data: ', data);

  return mockRate;
};
