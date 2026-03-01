import { motion } from "framer-motion";

export default function ChartCard({ title, children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`glass-card p-4 sm:p-5 ${className}`}
    >
      <h3 className="text-xs sm:text-sm font-semibold text-gray-300 mb-3 sm:mb-4">
        {title}
      </h3>
      <div className="h-56 sm:h-64">{children}</div>
    </motion.div>
  );
}
