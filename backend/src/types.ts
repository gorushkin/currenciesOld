export type Currency = 'TRY' | 'USD' | 'RUB';

export interface CurResponse {
  ValCurs: {
    Valute: {
      CharCode: {
        _text: Currency;
      };
      Name: {
        _text: string;
      };
      Value: {
        _text: string;
      };
      Nominal: {
        _text: string;
      };
    }[];
  };
}

export type Currencies = Record<
  Currency,
  {
    name: string;
    value: number;
    _nominal: number;
    code: Currency;
    _value: number;
    convertedValue: number;
  }
>;

export type Rates = Record<string, Currencies>;
