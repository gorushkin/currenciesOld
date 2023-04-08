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

export const getRate = async (date: string) => {
  const { data } = await axios.post(`http://127.0.0.1:3050/rate/`, { date });
  return data;
};
