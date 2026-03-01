import React from "react";
import { motion } from "framer-motion";

export default function LoginCard({ children, title, subtitle, maxWidth = 420 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full relative"
      style={{ maxWidth }}
    >
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl" style={{ boxShadow: "0 24px 48px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.04) inset" }}>
        <div className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
            {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
          </div>
          {children}
        </div>
        <div className="border-t border-white/5 px-8 sm:px-10 py-4">
          <p className="text-center text-[11px] text-gray-600">
            © 2026 MedAdmin Analytics
          </p>
        </div>
      </div>
    </motion.div>
  );
}
