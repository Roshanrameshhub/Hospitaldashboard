import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, Bed, Clock } from "lucide-react";

export default function OperationalImpactCard({ data }) {
  if (!data) return null;

  const metrics = [
    {
      icon: Bed,
      label: "Expected ICU Occupancy",
      value: `${data.icu_occupancy || 75}%`,
      subtitle: "Next 24 hours",
      color: "text-cyan-400",
    },
    {
      icon: TrendingUp,
      label: "Expected ER Load",
      value: `${data.er_load || 82}%`,
      subtitle: "Next 24 hours",
      color: "text-amber-400",
    },
    {
      icon: Users,
      label: "Staff Utilization",
      value: `${data.staff_util || 68}%`,
      subtitle: "Predicted capacity",
      color: "text-green-400",
    },
    {
      icon: Clock,
      label: "Peak Hours",
      value: "14:00 - 18:00",
      subtitle: "Busiest periods",
      color: "text-rose-400",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-5 sm:p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp className="h-5 w-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">Operational Impact</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div
              key={idx}
              className="relative p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/8"
            >
              <div className="flex items-start justify-between mb-3">
                <Icon className={`h-5 w-5 ${metric.color}`} />
              </div>
              <p className="text-xs text-gray-400 mb-1">{metric.label}</p>
              <p className={`text-2xl font-bold ${metric.color} mb-1`}>{metric.value}</p>
              <p className="text-[10px] text-gray-500">{metric.subtitle}</p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
