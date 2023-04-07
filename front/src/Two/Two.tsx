import { useEffect, useRef, useState } from 'react';
import { parse, isValid } from 'date-fns';
import { getRate } from '../api';
import { Currencies, Currency, Rates } from '../types';

const validateDate = (date: string) => {
  // const rgexp = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
  // const isFormatOk = rgexp.test(date);
  // if (!isFormatOk) return false;
  const parsedDate = parse(date, 'dd/MM/yyyy', new Date());
  const isValidDate = isValid(parsedDate);
  return isValidDate;
};

const FilledRow = ({ data }: { data: Row }) => {
  const onClickHandler = (e: number) => {
    navigator.clipboard.writeText(e.toString());
  };

  return (
    <tr>
      <td>{data.date}</td>
      <td onClick={(e) => onClickHandler(data.amount)}>{data.amount}</td>
      <td onClick={(e) => onClickHandler(data.rate.USD.value * data.amount)}>
        {data.rate.USD.value * data.amount}
      </td>
      <td onClick={(e) => onClickHandler(data.rate.TRY.value * data.amount)}>
        {data.rate.TRY.value * data.amount}
      </td>
    </tr>
  );
};

const CurrentRow = ({ onSuccess }: { onSuccess: (data: Row) => void }) => {
  const dateInput = useRef<HTMLInputElement>(null);
  const amountInput = useRef<HTMLInputElement>(null);

  const [activeInput, setActiveInput] = useState<React.RefObject<HTMLInputElement>>(dateInput);

  const [date, setDate] = useState('');
  const [isDateValid, setIsDateValid] = useState(false);
  const [amount, setAmount] = useState(0);
  const [isAmountValid, setIsAmountValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsDateValid(validateDate(date));
  }, []);

  useEffect(() => {
    if (!activeInput.current) return;
    activeInput.current.focus();
    setIsDateValid(validateDate(date));
    setIsAmountValid(!!amount);
  }, [activeInput]);

  const onDateChangeHanlder = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIsDateValid(validateDate(date));
    setDate(value);
  };

  const onAmountChangeHanlder = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (isNaN(value)) return;
    setAmount(value);
    setIsAmountValid(!!value);
  };

  const isFormValid = isDateValid && isAmountValid;

  useEffect(() => {
    const onKeyPresHanlder = (e: KeyboardEvent) => {
      if (e.code !== 'Enter' && e.code !== 'NumpadEnter') return;
      if (activeInput === dateInput && isDateValid) {
        setActiveInput(amountInput);
      }
    };

    document.addEventListener('keypress', onKeyPresHanlder);
    return () => document.removeEventListener('keypress', onKeyPresHanlder);
  }, [isDateValid]);

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const rate = await getRate(date);
      setDate('');
      setAmount(0);
      onSuccess({ amount, date, rate });
      setActiveInput(dateInput);
    } catch (error) {
      console.log('error: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form className='form' onSubmit={onSubmitHandler}>
        <div className='inputWrapper'>
          <input
            className={isDateValid ? 'input' : 'input input_invalid'}
            onChange={onDateChangeHanlder}
            value={date}
            ref={dateInput}
            type='text'
            name='date'
          />
          <input
            className={isAmountValid ? 'input' : 'input input_invalid'}
            value={amount}
            onChange={onAmountChangeHanlder}
            type='text'
            name='amount'
            ref={amountInput}
          />
        </div>
        <button disabled={!isFormValid || isLoading} type='submit'>
          Submit
        </button>
      </form>
    </>
  );
};

type Row = { date: string; amount: number; rate: Currencies };

const TableHeader = () => {
  return (
    <tr>
      <th>Data</th>
      <th>Amount</th>
      <th>USD</th>
      <th>TRY</th>
    </tr>
  );
};

export const Two = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [activeCurrency, setActiveCurrency] = useState<Currency>('USD');

  const updateRows = (data: Row) => {
    navigator.clipboard.writeText((data.rate[activeCurrency].value * data.amount).toString());
    setRows((state) => [...state, data]);
  };

  const getClassName = (button: Currency) => {
    return activeCurrency === button ? 'currencyButton_active currencyButton' : 'currencyButton';
  };

  return (
    <>
      <ul className='currencies'>
        <li className='currency'>
          <button className={getClassName('USD')} onClick={() => setActiveCurrency('USD')}>
            USD
          </button>
        </li>
        <li className='currency'>
          <button className={getClassName('TRY')} onClick={() => setActiveCurrency('TRY')}>
            TRY
          </button>
        </li>
      </ul>
      <table className='table'>
        <TableHeader />
        {rows.map((row) => (
          <FilledRow key={row.date} data={row} />
        ))}
      </table>
      <CurrentRow onSuccess={updateRows} />
    </>
  );
};
