import React from "react";

// generic card with consistent padding/rounded corners and optional hover
export default function Card({ children, className = "", style = {} }) {
  return (
    <div
      className={`bg-white/5 backdrop-blur-lg rounded-lg shadow-lg p-5 transition-transform hover:scale-[1.01] ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
