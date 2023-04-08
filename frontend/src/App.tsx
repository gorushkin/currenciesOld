import { useState } from 'react';
import './App.css';
import { One } from './One/One';
import { Two } from './Two/Two';
export type Range = { start: string; end: string };


type Tab = 'one' | 'two';

const tabMapping: Record<Tab, () => JSX.Element> = {
  one: One,
  two: Two,
};

const App = () => {
  const [tab, setTab] = useState<Tab>('two');

  const tabClickHandler = (tab: Tab) => setTab(tab);

  const Component = tabMapping[tab];

  return (
    <div className='App'>
      {/* <ul>
        <li>
          <button onClick={() => tabClickHandler('one')}>One</button>
        </li>
        <li>
          <button onClick={() => tabClickHandler('two')}>Two</button>
        </li>
      </ul> */}
      <Component />
    </div>
  );
};

export default App;
