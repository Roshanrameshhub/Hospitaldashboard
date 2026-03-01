import React from "react";

export default function RiskMeter({ level }) {
  // level: "Low" | "Medium" | "High"
  const colors = { Low: "#10b981", Medium: "#f59e0b", High: "#ef4444" };
  const percent = level === "Low" ? 33 : level === "Medium" ? 66 : 100;
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <path
            className="text-gray-600"
            strokeWidth="3"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="text-white"
            strokeWidth="3"
            stroke={colors[level]}
            strokeDasharray={`${percent}, 100`}
            strokeLinecap="round"
            fill="none"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold text-white">{level}</span>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2">Risk Level</p>
    </div>
  );
}
