# Online Bank Mini System

A working banking web app with account creation, deposit, withdraw, transfer (with KYC and balance validation), and a full UI. Built with **React + Vite** and deployable to Vercel, Netlify, or GitHub Pages.

## Live Deployment

- **Deployment URL**: [https://mini-banking-system-tau.vercel.app]
- **GitHub Repository**: [https://github.com/agarwaldhruv710/Mini-Banking-System]

## Features

### Functional Requirements

1. **Create Account** — Create a new bank account with holder name, optional initial balance, and KYC status.
2. **Deposit Money** — Deposit a positive amount into any account.
3. **Withdraw Money** — Withdraw from an account (validates sufficient balance).
4. **Transfer Money** — `TransferMoney(senderAccount, receiverAccount, amount)`:
   - Sender must be **KYC verified** (validation enforced).
   - Sender must have **sufficient balance** (validation enforced).
   - On validation failure, an **error message** is shown in the Output panel.

### Data Model

| Field         | Description        |
|---------------|--------------------|
| `accountNo`   | Unique ID          |
| `holderName`  | Account holder     |
| `balance`     | Current balance    |
| `isKYCVerified` | true/false       |

### UI

- **Account creation screen** — Form for new accounts (name, initial balance, KYC checkbox).
- **Transaction screens** — Deposit, Withdraw, and Transfer forms with account selectors and amount input.
- **Account listing screen** — Table of all accounts with balance, KYC status, and toggle KYC.
- **Output display panel** — Success/error/info messages for all actions (with Clear).

Data is persisted in **localStorage** so it survives refresh (per browser).

## Tech Stack

- **React 19** + **Vite 7**
- No backend; state and persistence via React Context + `localStorage`
- Plain CSS with CSS variables (light/dark via `prefers-color-scheme`)

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build & Deploy

```bash
npm run build
```

Static output is in `dist/`. Deploy `dist/` to:

- **Vercel**: Connect repo or `vercel` CLI; build command `npm run build`, output `dist`.
- **Netlify**: Build command `npm run build`, publish directory `dist`.
- **GitHub Pages**: Build and push `dist` to `gh-pages` or use GitHub Actions.

## Project Structure

```
src/
  context/BankContext.jsx   # Accounts state, create/deposit/withdraw/transfer + validation
  components/
    CreateAccount.jsx        # Account creation screen
    AccountList.jsx          # Account listing + KYC toggle
    Deposit.jsx              # Deposit form
    Withdraw.jsx             # Withdraw form
    Transfer.jsx             # Transfer form (KYC + balance validated)
    OutputPanel.jsx          # Output display panel
  App.jsx, App.css
  main.jsx, index.css
```


