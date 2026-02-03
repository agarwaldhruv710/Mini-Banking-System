import { useState } from 'react';
import { useBank } from '../context/BankContext';
import './Transaction.css';

export default function Transfer({ onOutput }) {
  const { accounts, transferMoney } = useBank();
  const [senderAccountNo, setSenderAccountNo] = useState('');
  const [receiverAccountNo, setReceiverAccountNo] = useState('');
  const [amount, setAmount] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const result = transferMoney(senderAccountNo, receiverAccountNo, amount);
    if (result.success) {
      onOutput?.('success', `Transferred ₹${Number(amount).toFixed(2)} from ${senderAccountNo} to ${receiverAccountNo}. Sender new balance: ₹${result.senderNewBalance.toFixed(2)}`);
      setAmount('');
    } else {
      onOutput?.('error', result.error);
    }
  }

  return (
    <section className="transaction card-panel">
      <h2>Transfer Money</h2>
      <p className="hint">Sender must be KYC verified and have sufficient balance.</p>
      <form onSubmit={handleSubmit}>
        <label>Sender account <span className="required">*</span></label>
        <select
          value={senderAccountNo}
          onChange={(e) => setSenderAccountNo(e.target.value)}
          required
        >
          <option value="">Choose sender</option>
          {accounts.map((a) => (
            <option key={a.accountNo} value={a.accountNo}>
              {a.accountNo} — {a.holderName} (₹{a.balance.toFixed(2)}) {a.isKYCVerified ? '✓ KYC' : '— No KYC'}
            </option>
          ))}
        </select>
        <label>Receiver account <span className="required">*</span></label>
        <select
          value={receiverAccountNo}
          onChange={(e) => setReceiverAccountNo(e.target.value)}
          required
        >
          <option value="">Choose receiver</option>
          {accounts
            .filter((a) => a.accountNo !== senderAccountNo)
            .map((a) => (
              <option key={a.accountNo} value={a.accountNo}>
                {a.accountNo} — {a.holderName}
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
        <button type="submit">Transfer</button>
      </form>
    </section>
  );
}
