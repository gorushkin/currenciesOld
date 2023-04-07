import { join } from 'path';
import fs from 'fs/promises';
import { Currencies, Rates } from './types';
import { getRate } from './util';

class DBRates {

  path: string;
  rates: Rates = {} as Rates;

  async init() {
    this.path = join('rates.json');
    const isPathExist = await this.#checkPath(this.path);
    if (!isPathExist) {
      await fs.writeFile(this.path, JSON.stringify({}), 'utf-8');
    }
    this.#readData();
  }

  async #checkPath(path: string) {
    try {
      await fs.access(path);
      return true;
    } catch (error) {
      return false;
    }
  }

  async #writeData(): Promise<any | void> {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.rates, null, 2));
    } catch (error) {
      throw new Error('There is an error with adding currencies');
    }
  }

  async #readData(): Promise<any | void> {
    try {
      const data: Rates = JSON.parse(await fs.readFile(this.path, 'utf-8'));
      this.rates = data;
    } catch (error) {
      console.log('error: ', error);
      throw new Error('There is an error with reading currencies');
    }
  }

  async getRate(date: string): Promise<Currencies> {
    if (!this.rates[date]) {
      const rates = await getRate(date);
      this.rates = { ...this.rates, [date]: rates };
      await this.#writeData();
    }
    return this.rates[date];
  }
}

export const dbRates = new DBRates();
