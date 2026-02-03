import { useState } from 'react';
import { useBank } from '../context/BankContext';
import './Transaction.css';

export default function Deposit({ onOutput }) {
  const { accounts, deposit } = useBank();
  const [accountNo, setAccountNo] = useState('');
  const [amount, setAmount] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const result = deposit(accountNo, amount);
    if (result.success) {
      onOutput?.('success', `Deposited ₹${Number(amount).toFixed(2)} to ${accountNo}. New balance: ₹${result.newBalance.toFixed(2)}`);
      setAmount('');
    } else {
      onOutput?.('error', result.error);
    }
  }

  return (
    <section className="transaction card-panel">
      <h2>Deposit Money</h2>
      <form onSubmit={handleSubmit}>
        <label>Select account <span className="required">*</span></label>
        <select
          value={accountNo}
          onChange={(e) => setAccountNo(e.target.value)}
          required
        >
          <option value="">Choose account</option>
          {accounts.map((a) => (
            <option key={a.accountNo} value={a.accountNo}>
              {a.accountNo} — {a.holderName} (₹{a.balance.toFixed(2)})
            </option>
          ))}
        </select>
        <label>Amount (₹) <span className="required">*</span></label>
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          required
        />
        <button type="submit">Deposit</button>
      </form>
    </section>
  );
}
