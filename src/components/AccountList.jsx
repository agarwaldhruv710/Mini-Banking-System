import { useBank } from '../context/BankContext';
import './AccountList.css';

export default function AccountList({ onOutput }) {
  const { accounts, toggleKYC } = useBank();

  function handleToggleKYC(accountNo, current) {
    toggleKYC(accountNo);
    onOutput?.('info', `KYC for ${accountNo} set to ${!current ? 'verified' : 'unverified'}.`);
  }

  if (accounts.length === 0) {
    return (
      <section className="account-list card-panel">
        <h2>Account Listing</h2>
        <p className="empty-state">No accounts yet. Create an account first.</p>
      </section>
    );
  }

  return (
    <section className="account-list card-panel">
      <h2>Account Listing</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Account No</th>
              <th>Holder Name</th>
              <th>Balance (₹)</th>
              <th>KYC</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc) => (
              <tr key={acc.accountNo}>
                <td><code>{acc.accountNo}</code></td>
                <td>{acc.holderName}</td>
                <td>{acc.balance.toFixed(2)}</td>
                <td>
                  <span className={`badge ${acc.isKYCVerified ? 'badge-success' : 'badge-warning'}`}>
                    {acc.isKYCVerified ? 'Verified' : 'Not verified'}
                  </span>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn-sm"
                    onClick={() => handleToggleKYC(acc.accountNo, acc.isKYCVerified)}
                  >
                    {acc.isKYCVerified ? 'Unverify KYC' : 'Verify KYC'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
