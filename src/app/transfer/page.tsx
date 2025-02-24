// page.tsx
"use client";

import { useState, useEffect } from "react";
import SideMenu from "../../components/side-menu";
import DarkModeSwitch from "../../components/DarkModeSwitch";
import TransactionHistory from "../../components/TransactionHistory";
import styles from "./Transfer.module.css";

interface Account {
  id: string;
  name: string;
  balance: number;
  document: string;
}

interface Transaction {
  id: string;
  transaction_type: "credit" | "debit" | "transfer";
  amount: number;
  balance_before: number;
  balance_after: number;
  created_at: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function Transfer() {
  const [darkMode, setDarkMode] = useState(false);
  const [amount, setAmount] = useState("");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState({ main: false, action: false });
  const [error, setError] = useState<string | null>(null);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  useEffect(() => {
    fetchAccounts();
    fetchTransactions();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading((prev) => ({ ...prev, main: true }));
      const response = await fetch(`${API_BASE_URL}/accounts`);
      if (!response.ok) throw new Error("Falha ao buscar contas");

      const result = await response.json();
      const fetchedAccounts = result.accounts.data.map((account: any) => ({
        id: account.id,
        name: account.attributes.name,
        document: account.attributes.document,
      }));
      setAccounts(fetchedAccounts);
    } catch (err) {
      setError("Erro ao buscar contas");
    } finally {
      setLoading((prev) => ({ ...prev, main: false }));
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading((prev) => ({ ...prev, main: true }));
      const response = await fetch(`${API_BASE_URL}/accounts/1/transactions`);
      if (!response.ok) throw new Error("Falha ao buscar transações");

      const result = await response.json();
      const fetchedTransactions = result.transactions.data.map(
        (transaction: any) => ({
          id: transaction.id,
          transaction_type: transaction.attributes.transaction_type,
          amount: parseFloat(transaction.attributes.amount),
          balance_before: parseFloat(transaction.attributes.balance_before),
          balance_after: parseFloat(transaction.attributes.balance_after),
          created_at: transaction.attributes.created_at,
        })
      );
      setTransactions(fetchedTransactions);
    } catch (err) {
      setError("Erro ao buscar transações");
    } finally {
      setLoading((prev) => ({ ...prev, main: false }));
    }
  };

  const handleTransfer = async () => {
    if (!validateAmount() || !selectedAccount) return;

    try {
      setLoading((prev) => ({ ...prev, action: true }));
      const response = await fetch(
        `${API_BASE_URL}/accounts/1/transfers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transfer: {
              receiver_account_id: selectedAccount,
              amount: parseFloat(amount),
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao processar transferência");
      }

      setAmount("");
      setSelectedAccount("");
      await fetchTransactions();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  const validateAmount = () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      setError("Valor inválido. Insira um número positivo.");
      return false;
    }
    setError(null);
    return true;
  };

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}>
      <SideMenu />

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1 className={styles.title}>Transferência</h1>
          <DarkModeSwitch darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </header>

        <section className={styles.transferSection}>
          <div className={styles.inputGroup}>
            <label htmlFor="account" className={styles.inputLabel}>
              Conta Destino
            </label>
            <select
              id="account"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className={styles.selectInput}
              disabled={loading.action}
            >
              <option value="">Selecione uma conta</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name} - Documento : {account.document}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="amount" className={styles.inputLabel}>
              Valor (R$)
            </label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value.replace(/[^0-9.,]/g, ""))
              }
              placeholder="0,00"
              min="0"
              step="0.01"
              className={styles.amountInput}
              disabled={loading.action}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              onClick={handleTransfer}
              disabled={loading.action || !amount || !selectedAccount}
              className={`${styles.button} ${styles.transferButton}`}
              aria-label="Transferir valor"
            >
              {loading.action ? "Processando..." : "Transferir"}
            </button>
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}
        </section>

        <TransactionHistory
          transactions={transactions}
          darkMode={darkMode}
          loading={loading.main}
        />
      </main>
    </div>
  );
}
