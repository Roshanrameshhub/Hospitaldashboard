import React from "react";

export default function RecommendationPanel({ recommendations }) {
  return (
    <div className="bg-white/5 p-4 rounded-lg">
      <h4 className="text-sm font-semibold text-white mb-2">Recommendations</h4>
      <ul className="text-xs text-gray-300 list-disc list-inside space-y-1">
        {recommendations.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
    </div>
  );
}
