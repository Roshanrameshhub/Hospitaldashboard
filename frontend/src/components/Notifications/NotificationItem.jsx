import React from "react";
import { motion } from "framer-motion";

export default function NotificationItem({ notification, onClick }) {
  const { icon: Icon, title, time, severity, read } = notification;
  const colors = {
    info: "text-blue-400",
    warning: "text-yellow-400",
    critical: "text-red-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer hover:bg-white/10 transition-colors ${read ? "bg-white/5" : "bg-white/10"}`}
      onClick={onClick}
    >
      {Icon && <Icon className={`h-5 w-5 ${colors[severity] || "text-gray-400"}`} />}
      <div className="flex-1">
        <p className="text-sm text-white font-medium">{title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{time}</p>
      </div>
    </motion.div>
  );
}
