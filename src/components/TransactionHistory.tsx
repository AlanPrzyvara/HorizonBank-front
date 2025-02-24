import { ArrowUp, ArrowDown } from "lucide-react";
import styles from "../app/pay/Transactions.module.css";

interface Transaction {
  id: string;
  transaction_type: "credit" | "debit";
  amount: number;
  balance_before: number;
  balance_after: number;
  created_at: string;
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
        {transactions.map((transaction, index) => (
          <TransactionItem 
            key={transaction.id || `transaction-${index}`} 
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

export default TransactionHistory;
