import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'bank_mini_accounts';

const BankContext = createContext(null);

function generateAccountNo() {
  return 'ACC' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
}

export function BankProvider({ children }) {
  const [accounts, setAccounts] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  }, [accounts]);

  const createAccount = useCallback((holderName, initialBalance = 0, isKYCVerified = false) => {
    if (!holderName?.trim()) {
      return { success: false, error: 'Holder name is required.' };
    }
    const balance = Math.max(0, Number(initialBalance) || 0);
    const accountNo = generateAccountNo();
    const account = {
      accountNo,
      holderName: holderName.trim(),
      balance,
      isKYCVerified: Boolean(isKYCVerified),
    };
    setAccounts((prev) => [...prev, account]);
    return { success: true, account };
  }, []);

  const deposit = useCallback((accountNo, amount) => {
    const amt = Number(amount);
    if (isNaN(amt) || amt <= 0) {
      return { success: false, error: 'Please enter a valid positive amount.' };
    }
    const idx = accounts.findIndex((a) => a.accountNo === accountNo);
    if (idx === -1) {
      return { success: false, error: 'Account not found.' };
    }
    setAccounts((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], balance: next[idx].balance + amt };
      return next;
    });
    return { success: true, newBalance: accounts[idx].balance + amt };
  }, [accounts]);

  const withdraw = useCallback((accountNo, amount) => {
    const amt = Number(amount);
    if (isNaN(amt) || amt <= 0) {
      return { success: false, error: 'Please enter a valid positive amount.' };
    }
    const idx = accounts.findIndex((a) => a.accountNo === accountNo);
    if (idx === -1) {
      return { success: false, error: 'Account not found.' };
    }
    if (accounts[idx].balance < amt) {
      return { success: false, error: 'Insufficient balance.' };
    }
    setAccounts((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], balance: next[idx].balance - amt };
      return next;
    });
    return { success: true, newBalance: accounts[idx].balance - amt };
  }, [accounts]);

  /**
   * TransferMoney(senderAccount, receiverAccount, amount)
   * - Sender must be KYC verified
   * - Sender must have sufficient balance
   * - Returns error message if validation fails
   */
  const transferMoney = useCallback((senderAccountNo, receiverAccountNo, amount) => {
    const amt = Number(amount);
    if (isNaN(amt) || amt <= 0) {
      return { success: false, error: 'Please enter a valid positive amount.' };
    }
    if (senderAccountNo === receiverAccountNo) {
      return { success: false, error: 'Sender and receiver cannot be the same account.' };
    }
    const senderIdx = accounts.findIndex((a) => a.accountNo === senderAccountNo);
    const receiverIdx = accounts.findIndex((a) => a.accountNo === receiverAccountNo);
    if (senderIdx === -1) {
      return { success: false, error: 'Sender account not found.' };
    }
    if (receiverIdx === -1) {
      return { success: false, error: 'Receiver account not found.' };
    }
    const sender = accounts[senderIdx];
    if (!sender.isKYCVerified) {
      return { success: false, error: 'Sender must be KYC verified to transfer money.' };
    }
    if (sender.balance < amt) {
      return { success: false, error: 'Insufficient balance. Sender does not have enough funds.' };
    }
    setAccounts((prev) => {
      const next = [...prev];
      next[senderIdx] = { ...next[senderIdx], balance: next[senderIdx].balance - amt };
      next[receiverIdx] = { ...next[receiverIdx], balance: next[receiverIdx].balance + amt };
      return next;
    });
    return {
      success: true,
      senderNewBalance: sender.balance - amt,
      receiverNewBalance: accounts[receiverIdx].balance + amt,
    };
  }, [accounts]);

  const getAccount = useCallback((accountNo) => {
    return accounts.find((a) => a.accountNo === accountNo) ?? null;
  }, [accounts]);

  const toggleKYC = useCallback((accountNo) => {
    const idx = accounts.findIndex((a) => a.accountNo === accountNo);
    if (idx === -1) return;
    setAccounts((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], isKYCVerified: !next[idx].isKYCVerified };
      return next;
    });
  }, [accounts]);

  const value = {
    accounts,
    createAccount,
    deposit,
    withdraw,
    transferMoney,
    getAccount,
    toggleKYC,
  };

  return <BankContext.Provider value={value}>{children}</BankContext.Provider>;
}

export function useBank() {
  const ctx = useContext(BankContext);
  if (!ctx) throw new Error('useBank must be used within BankProvider');
  return ctx;
}
