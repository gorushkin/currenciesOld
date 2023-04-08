import { useState } from 'react';
import '../App.css';
import { Table } from './table';
import { startOfMonth, endOfMonth, format, parse } from 'date-fns';
import { getRates } from '../api';
import { Rates } from '../types';
export type Range = { start: string; end: string };

const currentDate = new Date();

export const One = () => {
  const [range, setRange] = useState<Range>({
    start: format(startOfMonth(currentDate), 'yyyy-MM-dd'),
    end: format(endOfMonth(currentDate), 'yyyy-MM-dd'),
  });

  const hanldeChange = ({ target: { value, name } }: React.ChangeEvent<HTMLInputElement>) => {
    setisLocked(true);
    setRange((state) => ({ ...state, [name]: value }));
  };

  const [rates, setRates] = useState<Rates>({});
  const [loading, setIsLoading] = useState(false);
  const [isLocked, setisLocked] = useState(true);

  const onPrintClickHandle = async () => {
    setIsLoading(true);
    const res = await getRates(range);
    setIsLoading(false);
    setRates(res);
    if (res) setisLocked(false);
  };

  return (
    <div className='App'>
      <input value={range.start} onChange={hanldeChange} name='start' type='date' />
      <input value={range.end} onChange={hanldeChange} name='end' type='date' />
      <button onClick={onPrintClickHandle}>START!!!</button>
      {!isLocked && <Table range={range} rates={rates} />}
    </div>
  );
};
