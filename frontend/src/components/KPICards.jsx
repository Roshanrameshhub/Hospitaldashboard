import { motion } from "framer-motion";
import {
  Ticket, AlertCircle, CheckCircle2, ShieldCheck, ShieldAlert,
  TrendingUp, TrendingDown, Users, HeartPulse, Timer, Bell,
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const sparkSets = [
  [4, 7, 5, 9, 6, 8, 11, 9, 13, 10],
  [3, 5, 4, 6, 5, 8, 6, 7, 5, 4],
  [8, 6, 9, 7, 11, 10, 13, 12, 14, 16],
  [70, 72, 68, 75, 73, 78, 80, 77, 82, 79],
  [2, 3, 1, 4, 2, 5, 3, 4, 6, 5],
  [30, 35, 32, 40, 38, 42, 45, 43, 48, 46],
  [18, 20, 19, 22, 21, 24, 23, 25, 24, 26],
  [50, 48, 55, 52, 58, 56, 60, 57, 62, 59],
];

const iconMap = {
  Ticket, AlertCircle, CheckCircle2, ShieldCheck, ShieldAlert,
  Users, HeartPulse, Timer, Bell, TrendingUp,
};

const defaultCards = [
  { key: "total_issues", label: "Total Issues", icon: "Ticket", color: "from-cyan-500 to-blue-600", sparkColor: "#06b6d4", trend: "+12%", trendUp: true },
  { key: "open_issues", label: "Open Issues", icon: "AlertCircle", color: "from-amber-500 to-orange-600", sparkColor: "#f59e0b", trend: "-5%", trendUp: false },
  { key: "resolved_issues", label: "Resolved", icon: "CheckCircle2", color: "from-emerald-500 to-green-600", sparkColor: "#10b981", trend: "+8%", trendUp: true },
  { key: "sla_compliance_percent", label: "SLA Compliance", icon: "ShieldCheck", color: "from-violet-500 to-purple-600", sparkColor: "#8b5cf6", trend: "+2%", trendUp: true, suffix: "%" },
  { key: "total_sla_breaches", label: "SLA Breaches", icon: "ShieldAlert", color: "from-red-500 to-rose-600", sparkColor: "#ef4444", trend: "+3", trendUp: true, trendBad: true },
];

export function KPICard({ icon, label, value, color, sparkColor, trend, trendUp, trendBad, suffix, sparkIndex = 0, delay = 0 }) {
  const Icon = typeof icon === "string" ? iconMap[icon] || Ticket : icon;
  const data = (sparkSets[sparkIndex % sparkSets.length] || sparkSets[0]).map((v) => ({ v }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      whileHover={{ y: -3, scale: 1.015 }}
      className="glass-card-hover gradient-border p-4 sm:p-5 cursor-default"
    >
      <div className="flex items-start justify-between mb-2.5">
        <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
            trendBad ? "text-red-400 bg-red-500/10" : trendUp ? "text-emerald-400 bg-emerald-500/10" : "text-amber-400 bg-amber-500/10"
          }`}>
            {trendUp ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
            {trend}
          </div>
        )}
      </div>
      <p className="text-xl sm:text-2xl font-bold text-white mb-0.5">
        {typeof value === "number" ? value.toLocaleString() : value}{suffix || ""}
      </p>
      <p className="text-[10px] sm:text-xs text-gray-500 mb-2.5">{label}</p>
      <div className="h-7">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line type="monotone" dataKey="v" stroke={sparkColor} strokeWidth={1.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export default function KPICards({ kpis, extraCards = [] }) {
  const allCards = [...defaultCards, ...extraCards];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
      {allCards.map((card, idx) => (
        <KPICard
          key={card.key}
          icon={card.icon}
          label={card.label}
          value={kpis[card.key] ?? card.value ?? 0}
          color={card.color}
          sparkColor={card.sparkColor}
          trend={card.trend}
          trendUp={card.trendUp}
          trendBad={card.trendBad}
          suffix={card.suffix}
          sparkIndex={idx}
          delay={idx * 0.06}
        />
      ))}
    </div>
  );
}
