import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, Timer, TrendingDown } from "lucide-react";
import { KPICard } from "../components/KPICards";
import { SLATrendChart, PriorityChart, SLAByDepartmentChart } from "../components/DashboardCharts";
import SLATable from "../components/SLATable";
import * as api from "../api";

export default function SLAMonitor() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [kpis, breaches, slaTrend, priority, workload] = await Promise.all([
          api.getKPIs(),
          api.getSLABreaches(),
          api.getSLATrend(),
          api.getPriorityDistribution(),
          api.getWorkload(),
        ]);
        setData({ kpis, breaches, slaTrend, priority, workload });
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

  const cards = [
    { icon: ShieldCheck, label: "SLA Compliance", value: data.kpis.sla_compliance_percent, suffix: "%", color: "from-emerald-500 to-green-600", sparkColor: "#10b981", trend: "+2%", trendUp: true },
    { icon: ShieldAlert, label: "Total Breaches", value: data.kpis.total_sla_breaches, color: "from-red-500 to-rose-600", sparkColor: "#ef4444", trend: "+3", trendUp: true, trendBad: true },
    { icon: Timer, label: "Avg Resolution", value: `${Math.round(data.kpis.avg_resolution_time_minutes)}m`, color: "from-cyan-500 to-blue-600", sparkColor: "#06b6d4", trend: "-12m", trendUp: false },
    { icon: TrendingDown, label: "Open Issues", value: data.kpis.open_issues, color: "from-amber-500 to-orange-600", sparkColor: "#f59e0b" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5 sm:space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-white mb-1">SLA Monitor</h2>
        <p className="text-xs text-gray-500">Service level agreement compliance, breaches, and department analysis</p>
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
            suffix={c.suffix}
            sparkIndex={i + 3}
            delay={i * 0.06}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <SLATrendChart data={data.slaTrend} delay={0.1} />
        <SLAByDepartmentChart workload={data.workload} breaches={data.breaches} delay={0.15} />
      </div>

      <SLATable breaches={data.breaches} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <PriorityChart data={data.priority} delay={0.25} />
      </div>
    </motion.div>
  );
}
