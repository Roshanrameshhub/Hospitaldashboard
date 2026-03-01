import React from "react";

export default function SectionHeader({ title, subtitle, className = "" }) {
  return (
    <div className={`mb-4 ${className}`}> 
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
}
