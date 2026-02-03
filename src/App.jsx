import { useState, useCallback } from 'react';
import { BankProvider } from './context/BankContext';
import CreateAccount from './components/CreateAccount';
import AccountList from './components/AccountList';
import Deposit from './components/Deposit';
import Withdraw from './components/Withdraw';
import Transfer from './components/Transfer';
import OutputPanel from './components/OutputPanel';
import './App.css';

const PAGES = {
  create: { label: 'Create Account', Component: CreateAccount },
  list: { label: 'Account List', Component: AccountList },
  deposit: { label: 'Deposit', Component: Deposit },
  withdraw: { label: 'Withdraw', Component: Withdraw },
  transfer: { label: 'Transfer', Component: Transfer },
};

function AppContent() {
  const [page, setPage] = useState('create');
  const [outputMessages, setOutputMessages] = useState([]);

  const pushOutput = useCallback((type, text) => {
    setOutputMessages((prev) => [...prev.slice(-49), { type, text }]);
  }, []);

  const clearOutput = useCallback(() => {
    setOutputMessages([]);
  }, []);

  const CurrentComponent = PAGES[page]?.Component ?? CreateAccount;

  return (
    <div className="app">
      <header className="app-header">
        <h1>Online Bank Mini System</h1>
        <nav className="nav-tabs">
          {Object.entries(PAGES).map(([key, { label }]) => (
            <button
              key={key}
              type="button"
              className={`nav-tab ${page === key ? 'active' : ''}`}
              onClick={() => setPage(key)}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main className="app-main">
        <div className="content-area">
          <CurrentComponent onOutput={pushOutput} />
        </div>
        <OutputPanel messages={outputMessages} onClear={clearOutput} />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BankProvider>
      <AppContent />
    </BankProvider>
  );
}
