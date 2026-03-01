import { motion } from "framer-motion";
import {
  BrainCircuit,
  AlertTriangle,
  TrendingUp,
  Zap,
  Info,
  ShieldAlert,
} from "lucide-react";

const severityConfig = {
  critical: {
    icon: AlertTriangle,
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    text: "text-red-400",
    dot: "bg-red-500",
  },
  warning: {
    icon: ShieldAlert,
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    dot: "bg-amber-500",
  },
  info: {
    icon: Info,
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    text: "text-cyan-400",
    dot: "bg-cyan-500",
  },
};

export default function InsightsPanel({ alerts, prediction, staff }) {
  const riskColors = {
    Low: "text-emerald-400",
    Medium: "text-amber-400",
    High: "text-red-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="glass-card p-5 relative overflow-hidden"
    >
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-5">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
            <BrainCircuit className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">AI Insights</h3>
            <p className="text-[10px] text-gray-500">Intelligent alerts</p>
          </div>
        </div>

        {/* Alerts */}
        <div className="space-y-3 mb-5">
          {alerts.map((alert, i) => {
            const config = severityConfig[alert.severity] || severityConfig.info;
            const Icon = config.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className={`flex items-start gap-3 p-3 rounded-xl ${config.bg} border ${config.border}`}
              >
                <Icon className={`h-4 w-4 mt-0.5 ${config.text} flex-shrink-0`} />
                <p className="text-xs text-gray-300 leading-relaxed">
                  {alert.message}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Prediction */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-white/10 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-violet-400" />
            <span className="text-xs font-semibold text-gray-300">
              Tomorrow's Forecast
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">
              {prediction.predicted_issue_count}
            </span>
            <span className="text-xs text-gray-500">predicted tickets</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-500">Risk Level:</span>
            <span
              className={`text-xs font-bold ${riskColors[prediction.risk_level]}`}
            >
              {prediction.risk_level}
            </span>
          </div>
          <div className="flex gap-1 mt-3">
            {prediction.last_3_days.map((v, i) => (
              <div key={i} className="flex-1 text-center">
                <div
                  className="mx-auto rounded bg-violet-500/30 mb-1"
                  style={{
                    height: `${Math.max((v / 50) * 40, 4)}px`,
                    width: "100%",
                  }}
                />
                <span className="text-[10px] text-gray-500">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Staff Highlight */}
        {staff && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-semibold text-gray-300">
                Staff Highlights
              </span>
            </div>
            <div className="text-xs text-gray-400 space-y-1.5">
              <p>
                Top Performer:{" "}
                <span className="text-emerald-400 font-semibold">
                  {staff.top_performer}
                </span>
              </p>
              <p>
                Most Loaded:{" "}
                <span className="text-amber-400 font-semibold">
                  {staff.overloaded_staff}
                </span>
              </p>
              <p>
                Underutilized:{" "}
                <span className="text-cyan-400 font-semibold">
                  {staff.underutilized_staff}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
