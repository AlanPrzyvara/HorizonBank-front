"use client";

import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import SideMenu from "../../components/side-menu";
import DarkModeSwitch from "../../components/DarkModeSwitch";
import styles from "./Transactions.module.css";

interface Transaction {
  id: string;
  transaction_type: "credit" | "debit";
  amount: number;
  balance_before: number;
  balance_after: number;
  created_at: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function Transactions() {
  const [darkMode, setDarkMode] = useState(false);
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState({ main: false, action: false });
  const [error, setError] = useState<string | null>(null);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Definição correta da função fetchTransactions
  const fetchTransactions = async () => {
    try {
      setLoading(prev => ({ ...prev, main: true }));
      const response = await fetch(`${API_BASE_URL}/accounts/1/transactions`);
  
      if (!response.ok) throw new Error("Failed to fetch transactions");
  
      const result = await response.json();
      const transactions = result.transactions?.data || []; // Acessa corretamente a estrutura da API
  
      const formattedTransactions = transactions.map(({ attributes }: any) => ({
        id: attributes.id,
        transaction_type: attributes.transaction_type,
        amount: Number(attributes.amount),
        balance_before: Number(attributes.balance_before),
        balance_after: Number(attributes.balance_after),
        created_at: new Date(attributes.created_at).toISOString(),
      }));
  
      setTransactions(formattedTransactions);
    } catch (err) {
      setError("Erro ao buscar transações");
    } finally {
      setLoading(prev => ({ ...prev, main: false }));
    }
  };

  // Chama fetchTransactions ao montar o componente
  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleTransaction = async (type: Transaction["transaction_type"]) => {
    if (!validateAmount()) return;

    try {
      setLoading(prev => ({ ...prev, action: true }));
      
      const response = await fetch(`${API_BASE_URL}/accounts/1/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction: { 
            transaction_type: type, 
            amount: Number(amount) 
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao processar transação");
      }

      setAmount("");
      await fetchTransactions(); // Agora fetchTransactions está acessível corretamente
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
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
          <h1 className={styles.title}>Transações</h1>
          <DarkModeSwitch
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
          />
        </header>

        <section className={styles.transactionSection}>
          <div className={styles.inputGroup}>
            <label htmlFor="amount" className={styles.inputLabel}>
              Valor (R$)
            </label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.,]/g, ""))}
              placeholder="0,00"
              min="0"
              step="0.01"
              className={styles.amountInput}
              disabled={loading.action}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              onClick={() => handleTransaction("credit")}
              disabled={loading.action || !amount}
              className={`${styles.button} ${styles.creditButton}`}
              aria-label="Depositar valor"
            >
              {loading.action ? "Processando..." : "Depositar"}
            </button>
            <button
              onClick={() => handleTransaction("debit")}
              disabled={loading.action || !amount}
              className={`${styles.button} ${styles.debitButton}`}
              aria-label="Sacar valor"
            >
              {loading.action ? "Processando..." : "Sacar"}
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

interface TransactionHistoryProps {
  transactions: Transaction[];
  darkMode: boolean;
  loading: boolean;
}

const TransactionHistory = ({ transactions, darkMode, loading }: TransactionHistoryProps) => (
  <aside className={`${styles.historyPanel} ${darkMode ? styles.dark : ""}`}>
    <h2 className={styles.historyTitle}>Histórico</h2>
    
    {loading ? (
      <div className={styles.loadingState}>
        <div className={styles.loadingSpinner} />
      </div>
    ) : transactions.length === 0 ? (
      <p className={styles.emptyState}>Nenhuma transação encontrada</p>
    ) : (
      <ul className={styles.transactionList}>
        {transactions.map((transaction) => (
          <TransactionItem 
            key={transaction.id} 
            transaction={transaction} 
            darkMode={darkMode}
          />
        ))}
      </ul>
    )}
  </aside>
);

const TransactionItem = ({ transaction, darkMode }: { transaction: Transaction; darkMode: boolean }) => {
  const isCredit = transaction.transaction_type === "credit";
  const date = new Date(transaction.created_at);
  
  return (
    <li className={`${styles.transactionItem} ${darkMode ? styles.dark : ""}`}>
      <div className={styles.transactionIcon}>
        {isCredit ? (
          <ArrowUp className={styles.creditIcon} />
        ) : (
          <ArrowDown className={styles.debitIcon} />
        )}
      </div>
      
      <div className={styles.transactionDetails}>
        <div className={styles.transactionHeader}>
          <span className={`${styles.transactionType} ${isCredit ? styles.credit : styles.debit}`}>
            {isCredit ? "CRÉDITO" : "DÉBITO"}
          </span>
          <span className={styles.transactionAmount}>
            R$ {transaction.amount.toFixed(2)}
          </span>
        </div>
        
        <div className={styles.balanceInfo}>
          <span>Saldo anterior: R$ {transaction.balance_before.toFixed(2)}</span>
          <span>Novo saldo: R$ {transaction.balance_after.toFixed(2)}</span>
        </div>
        
        <time className={styles.transactionDate}>
          {date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })} às {date.toLocaleTimeString("pt-BR")}
        </time>
      </div>
    </li>
  );
};
