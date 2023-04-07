import { Range } from '../App';
import { eachDayOfInterval, format } from 'date-fns';
import { Rates } from '../types';

const getDaysArray = (start: string, end: string) =>
  eachDayOfInterval({
    start: new Date(start),
    end: new Date(end),
  });

const Header = () => (
  <tr>
    <th>Date</th>
    <th>TRY</th>
    <th>USD</th>
    <th></th>
  </tr>
);

const Row = ({ date, rates }: { date: string; rates: Rates }) => {
  return (
    <tr>
      <th>{date}</th>
      <th>{rates[date].TRY.value}</th>
      <th>{rates[date].USD.value}</th>
    </tr>
  );
};

const Body = ({ range, rates }: { range: Range; rates: Rates }) => {
  const list = getDaysArray(range.start, range.end);

  return (
    <>
      {list.map((date) => {
        const convertedDate = format(date, 'dd/MM/yyyy');
        return <Row key={date.toISOString()} rates={rates} date={convertedDate} />;
      })}
    </>
  );
};

const Table = ({ range, rates }: { range: Range; rates: Rates }) => {
  if (!range.start || !range.end) return null;

  return (
    <table>
      <Header />
      <Body range={range} rates={rates} />
    </table>
  );
};

export { Table };
