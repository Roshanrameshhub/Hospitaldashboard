import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BrainCircuit, TrendingUp, AlertTriangle, Zap, BarChart3 } from "lucide-react";
import { KPICard } from "../components/KPICards";
import { ShiftChart, ResolutionTrendChart } from "../components/DashboardCharts";
import InsightsPanel from "../components/InsightsPanel";
import * as api from "../api";

export default function Predictions() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [prediction, alerts, shift, trend, staff, kpis] = await Promise.all([
          api.getPrediction(),
          api.getAlerts(),
          api.getShiftAnalysis(),
          api.getResolutionTrend(),
          api.getStaffPerformance(),
          api.getKPIs(),
        ]);
        setData({ prediction, alerts, shift, trend, staff, kpis });
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>Loading dashboard data...</p>;
  if (error) return <p>Failed to load data</p>;
  if (!data) return null;

  const riskColor = { Low: "from-emerald-500 to-green-600", Medium: "from-amber-500 to-orange-600", High: "from-red-500 to-rose-600" };
  const riskSparkColor = { Low: "#10b981", Medium: "#f59e0b", High: "#ef4444" };

  const cards = [
    { icon: BrainCircuit, label: "Predicted Issues", value: data.prediction.predicted_issue_count, color: "from-violet-500 to-purple-600", sparkColor: "#8b5cf6", trend: "Tomorrow", trendUp: true },
    { icon: AlertTriangle, label: "Risk Level", value: data.prediction.risk_level, color: riskColor[data.prediction.risk_level], sparkColor: riskSparkColor[data.prediction.risk_level] },
    { icon: BarChart3, label: "3-Day Average", value: Math.round(data.prediction.last_3_days.reduce((a, b) => a + b, 0) / 3), color: "from-cyan-500 to-blue-600", sparkColor: "#06b6d4" },
    { icon: Zap, label: "Alerts Active", value: data.alerts.filter((a) => a.severity === "critical").length, color: "from-red-500 to-rose-600", sparkColor: "#ef4444", trend: "Critical", trendUp: true, trendBad: true },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5 sm:space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Predictions & Insights</h2>
        <p className="text-xs text-gray-500">AI-powered forecasting, shift patterns, and alert monitoring</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((c, i) => (
          <KPICard
            key={i}
            icon={c.icon}
            label={c.label}
            value={c.value}
            color={c.color}
            sparkColor={c.sparkColor}
            trend={c.trend}
            trendUp={c.trendUp}
            trendBad={c.trendBad}
            sparkIndex={i + 2}
            delay={i * 0.06}
          />
        ))}
      </div>

      {/* Detailed forecast panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card p-5 sm:p-6 relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <BrainCircuit className="h-5 w-5 text-violet-400" />
            <h3 className="text-sm font-semibold text-white">Volume Forecast</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {data.prediction.last_3_days.map((count, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5">
                <p className="text-[10px] text-gray-500 mb-1">Day -{3 - i}</p>
                <p className="text-2xl font-bold text-white">{count}</p>
                <p className="text-[10px] text-gray-500">tickets created</p>
                <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500"
                    style={{ width: `${Math.min((count / 50) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Tomorrow's Prediction</p>
                <p className="text-3xl font-bold text-white mt-1">{data.prediction.predicted_issue_count} <span className="text-sm text-gray-500 font-normal">tickets</span></p>
              </div>
              <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                data.prediction.risk_level === "High" ? "bg-red-500/20 text-red-400" :
                data.prediction.risk_level === "Medium" ? "bg-amber-500/20 text-amber-400" :
                "bg-emerald-500/20 text-emerald-400"
              }`}>
                {data.prediction.risk_level} Risk
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <ShiftChart data={data.shift} delay={0.2} />
        <ResolutionTrendChart data={data.trend} delay={0.25} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="xl:col-span-3">
          <InsightsPanel alerts={data.alerts} prediction={data.prediction} staff={data.staff} />
        </div>
      </div>
    </motion.div>
  );
}
