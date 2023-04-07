import axios from 'axios';
import convert from 'xml-js';
import { CurResponse, Currencies, Currency } from './types';

const convertStringToNumber = (str: string) => parseFloat(str.replace(',', '.'));

const getValue = (value: string, nominal: string) => {
  return Number((convertStringToNumber(value) / convertStringToNumber(nominal)).toFixed(4));
};

const currenciesList: Currency[] = ['TRY', 'USD'];

export const getRate = async (date: string) => {
  const URL = `https://www.cbr.ru/scripts/XML_daily_eng.asp?date_req=${date}`;
  const { data } = await axios(URL);
  const convertedData = convert.xml2js(data, { compact: true });
  const parsedData = convertedData as CurResponse;
  const valutes = parsedData.ValCurs.Valute;
  const currencies = valutes.reduce<Currencies>((acc, item) => {
    if (!currenciesList.includes(item.CharCode._text)) return acc;

    return {
      ...acc,
      [item.CharCode._text]: {
        name: item.Name._text,
        value: getValue(item.Value._text, item.Nominal._text),
        code: item.CharCode._text,
      },
    };
  }, {} as Currencies);
  return currencies;
};
