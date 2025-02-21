"use client";

import { useState, useEffect } from "react";
import SideMenu from "../components/side-menu";
import DarkModeSwitch from "../components/DarkModeSwitch";

interface Item {
  id: number;
  text: string;
  checked: boolean;
}

export default function Home() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [items, setItems] = useState<Item[]>([
    { id: 1, text: "Item 1", checked: false },
    { id: 2, text: "Item 2", checked: false },
    { id: 3, text: "Item 3", checked: false },
  ]);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Evita erro de hidratação

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const toggleCheckbox = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  return (
    <div style={{ 
      display: "flex", // Adiciona layout em colunas
      backgroundColor: darkMode ? "#222" : "#f9f9f9", 
      color: darkMode ? "#fff" : "#000", 
      minHeight: "100vh",
      transition: "0.3s"
    }}>
      
      {/* Menu lateral */}
      <SideMenu />

      {/* Conteúdo principal */}
      <div style={{ flex: 1, padding: "20px" }}>
        {/* Cabeçalho */}
        <header style={{ display: "flex", justifyContent: "space-between", padding: "10px 20px", borderBottom: "2px solid #ccc" }}>
          <h1>Horizon Bank</h1>
          <DarkModeSwitch darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </header>

        {/* Corpo */}
        <main style={{ padding: "20px" }}>
          <h2>Lista de Itens</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {items.map(item => (
              <li key={item.id} style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
                <input 
                  type="checkbox" 
                  checked={item.checked} 
                  onChange={() => toggleCheckbox(item.id)} 
                  style={{ marginRight: "10px" }}
                />
                {item.text}
              </li>
            ))}
          </ul>
        </main>

        {/* Rodapé */}
        <footer style={{ padding: "10px 20px", borderTop: "2px solid #ccc", textAlign: "center", marginTop: "20px" }}>
          <p>&copy; 2025 Horizon Bank - Todos os direitos reservados</p>
        </footer>
      </div>
    </div>
  );
}
