import { useState } from 'react';
import { useBank } from '../context/BankContext';
import './CreateAccount.css';

export default function CreateAccount({ onOutput }) {
  const { createAccount } = useBank();
  const [holderName, setHolderName] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [isKYCVerified, setIsKYCVerified] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const result = createAccount(holderName, initialBalance, isKYCVerified);
    if (result.success) {
      onOutput?.('success', `Account created: ${result.account.accountNo} — ${result.account.holderName}, Balance: ₹${result.account.balance.toFixed(2)}, KYC: ${result.account.isKYCVerified ? 'Yes' : 'No'}`);
      setHolderName('');
      setInitialBalance('');
      setIsKYCVerified(false);
    } else {
      onOutput?.('error', result.error);
    }
  }

  return (
    <section className="create-account card-panel">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Account holder name <span className="required">*</span>
        </label>
        <input
          type="text"
          value={holderName}
          onChange={(e) => setHolderName(e.target.value)}
          placeholder="Full name"
          required
        />
        <label>Initial balance (₹)</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={initialBalance}
          onChange={(e) => setInitialBalance(e.target.value)}
          placeholder="0"
        />
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={isKYCVerified}
            onChange={(e) => setIsKYCVerified(e.target.checked)}
          />
          KYC verified (required for transfers)
        </label>
        <button type="submit">Create Account</button>
      </form>
    </section>
  );
}
