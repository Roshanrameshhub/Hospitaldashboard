import React from "react";
import { motion } from "framer-motion";

export default function AiInsightCard({ icon: Icon, title, description, confidence, horizon, severity="info" }) {
  const colors = {
    info: "border-cyan-400/40",
    warning: "border-yellow-400/40",
    alert: "border-red-400/40",
  };
  const gradient = severity === "alert" ? "from-red-500 to-rose-600" : severity === "warning" ? "from-amber-500 to-orange-600" : "from-cyan-500 to-blue-600";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative p-4 rounded-lg bg-white/5 border ${colors[severity]} shadow-md hover:shadow-lg transition-shadow`}
    >
      <div className="absolute inset-0 rounded-lg pointer-events-none" style={{ boxShadow: `0 0 16px 2px rgba(0,0,0,0.4)` }} />
      <div className="flex items-center gap-3 mb-2">
        {Icon && <Icon className="h-6 w-6 text-white" />}
        <h4 className="text-sm font-semibold text-white">{title}</h4>
      </div>
      <p className="text-xs text-gray-300 mb-3">{description}</p>
      <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-1">
        <div className="h-full" style={{ width: `${confidence}%`, background: `linear-gradient(to right, ${gradient})` }} />
      </div>
      <p className="text-[10px] text-gray-400">Confidence: {confidence}% &middot; {horizon}</p>
    </motion.div>
  );
}
