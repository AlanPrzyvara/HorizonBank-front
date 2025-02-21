"use client";

import { useState, useEffect } from "react";

interface DarkModeSwitchProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function DarkModeSwitch({ darkMode, toggleDarkMode }: DarkModeSwitchProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <span>Dark Mode</span>
      <div 
        style={{
          width: "50px",
          height: "25px",
          background: darkMode ? "#666" : "#ddd",
          borderRadius: "25px",
          position: "relative",
          cursor: "pointer",
          transition: "0.3s"
        }}
        onClick={toggleDarkMode}
      >
        <div 
          style={{
            width: "20px",
            height: "20px",
            background: "#fff",
            borderRadius: "50%",
            position: "absolute",
            top: "50%",
            left: darkMode ? "27px" : "3px",
            transform: "translateY(-50%)",
            transition: "0.3s",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
          }}
        ></div>
      </div>
    </label>
  );
}
