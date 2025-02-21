"use client";

import { useState, useEffect } from "react";
import SideMenu from "../../components/side-menu";
import DarkModeSwitch from "../../components/DarkModeSwitch";
import { ArrowUp, ArrowDown } from "lucide-react";

const API_BASE_URL = "http://localhost:3001/accounts/1/transactions";

export default function Transactions() {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const [amount, setAmount] = useState("");

  interface Transaction {
    transaction_type: string;
    amount: number;
    balance_before: number;
    balance_after: number;
    created_at: string;
  }

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error("Erro ao buscar transações");
      const data = await response.json();

      setTransactions(
        data.transactions.data.map((t: any) => ({
          transaction_type: t.attributes.transaction_type,
          amount: parseFloat(t.attributes.amount),
          balance_before: parseFloat(t.attributes.balance_before),
          balance_after: parseFloat(t.attributes.balance_after),
          created_at: new Date(t.attributes.created_at).toLocaleString(),
        }))
      );
    } catch (err) {
      setError("Erro ao buscar transações");
    } finally {
      setLoading(false);
    }
  };

  const handleTransaction = async (type: string) => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction: { transaction_type: type, amount: parseFloat(amount) },
        }),
      });
      if (!response.ok) throw new Error("Erro ao processar transação");
      setAmount("");
      fetchTransactions();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: darkMode ? "#1a1a1a" : "#f9f9f9",
        color: darkMode ? "#fff" : "#000",
        transition: "0.3s",
        overflow: "hidden",
      }}
    >
      <SideMenu />
      <div style={{ flex: 1, padding: "20px", display: "flex", justifyContent: "center" }}>
        <div style={{ maxWidth: "400px", textAlign: "center" }}>
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1>Transações</h1>
            <DarkModeSwitch darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          </header>

          <div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Valor"
              style={{ padding: "10px", marginRight: "10px", width: "100%" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
              <button
                onClick={() => handleTransaction("credit")}
                disabled={loading}
                style={{ flex: 1, padding: "10px 20px", margin: "5px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px" }}
              >
                Depositar
              </button>
              <button
                onClick={() => handleTransaction("debit")}
                disabled={loading}
                style={{ flex: 1, padding: "10px 20px", margin: "5px", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "5px" }}
              >
                Sacar
              </button>
            </div>
          </div>

          {loading && <p>Carregando...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>
      <div style={{ width: "300px", padding: "20px", borderLeft: "1px solid #ccc", display: "flex", flexDirection: "column", overflowY: "auto", maxHeight: "100vh" }}>
        <h2>Histórico</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {transactions.length > 0 ? (
            transactions.map((t, index) => (
              <li
                key={index}
                style={{
                  backgroundColor: darkMode ? "#333" : "#fff",
                  padding: "10px",
                  borderRadius: "5px",
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                {t.transaction_type === "credit" ? <ArrowUp color="green" /> : <ArrowDown color="red" />}
                <div>
                  <strong>{t.transaction_type.toUpperCase()}</strong> - R$ {t.amount.toFixed(2)}
                  <br />
                  Saldo antes: R$ {t.balance_before.toFixed(2)} | Saldo depois: R$ {t.balance_after.toFixed(2)}
                  <br />
                  <small>{t.created_at}</small>
                </div>
              </li>
            ))
          ) : (
            <p>Nenhuma transação encontrada</p>
          )}
        </ul>
      </div>
    </div>
  );
}