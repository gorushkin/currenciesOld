export type Currency = 'TRY' | 'USD';

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
    code: Currency;
  }
>;

export type Rates = Record<string, Currencies>;
