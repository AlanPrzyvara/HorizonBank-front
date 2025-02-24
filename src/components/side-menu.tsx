"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Home, Info,HandCoins ,Banknote, Mail } from "lucide-react";

const SideMenu: React.FC = () => {
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isCompact, setIsCompact] = useState<boolean>(false);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsCompact(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const menuItems = [
    { id: 1, label: "Início", icon: <Home />, path: "/" },
    { id: 2, label: "Sobre", icon: <Info />, path: "/about" },
    { id: 3, label: "Saque/Deposito", icon: <HandCoins />, path: "/pay" },
    { id: 4, label: "Transferencias", icon: <Banknote />, path: "/transfer" },
    { id: 6, label: "Contato", icon: <Mail />, path: "/contact" },
  ];

  return (
    <div
      style={{
        ...sideMenuStyle,
        width: isCompact ? "80px" : "250px",
        transition: "width 0.3s ease",
      }}
    >
      <ul style={menuListStyle}>
        {menuItems.map((item, index) => (
          <li
            key={item.id}
            onClick={() => handleNavigation(item.path)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              ...menuItemStyle,
              backgroundColor: hoveredIndex === index ? "#333" : "#222",
              transform: hoveredIndex === index ? "scale(1.05)" : "scale(1)",
            }}
          >
            <div style={menuContentStyle}>
              <span
                style={{
                  ...iconStyle,
                  transform: hoveredIndex === index ? "scale(1.1)" : "scale(1)",
                }}
              >
                {React.cloneElement(item.icon, { size: hoveredIndex === index ? 26 : 22 })}
              </span>
              {!isCompact && <span style={textStyle}>{item.label}</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Estilos do menu lateral
const sideMenuStyle: React.CSSProperties = {
  height: "100vh",
  backgroundColor: "#1a1a1a",
  color: "#fff",
  padding: "10px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  boxShadow: "2px 0 5px rgba(0,0,0,0.2)",
};

// Estilos da lista
const menuListStyle: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

// Estilos dos itens do menu
const menuItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  padding: "15px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: 500,
  borderRadius: "8px",
  fontFamily: "'Sora', sans-serif",
  transition: "background 0.3s, transform 0.3s ease",
};

// Estilos do conteúdo dentro de cada item do menu
const menuContentStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  width: "100%",
};

// Estilos do ícone
const iconStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "40px",
};

// Estilos do texto
const textStyle: React.CSSProperties = {
  flex: 1,
  textAlign: "left",
};

export default SideMenu;
