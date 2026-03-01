import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, UserCheck, UserX, Award } from "lucide-react";
import { KPICard } from "../components/KPICards";
import { StaffDistributionPie, StaffWorkloadChart } from "../components/DashboardCharts";
import StaffLeaderboard from "../components/StaffLeaderboard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import * as api from "../api";

export default function StaffAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getStaffPerformance(),
      api.getStaffDetails(),
    ])
      .then(([performance, details]) => setData({ performance, details }))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) return <LoadingSkeleton />;

  const cards = [
    { icon: Users, label: "Total Staff", value: data.details.total_staff, color: "from-cyan-500 to-blue-600", sparkColor: "#06b6d4" },
    { icon: UserCheck, label: "Active", value: data.details.active_staff, color: "from-emerald-500 to-green-600", sparkColor: "#10b981", trend: "+3", trendUp: true },
    { icon: UserX, label: "On Leave", value: data.details.on_leave, color: "from-amber-500 to-orange-600", sparkColor: "#f59e0b" },
    { icon: Award, label: "Top Performer", value: data.performance.top_performer, color: "from-violet-500 to-purple-600", sparkColor: "#8b5cf6" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5 sm:space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Staff Analytics</h2>
        <p className="text-xs text-gray-500">Staff distribution, performance scores, and workload analysis</p>
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
            sparkIndex={i + 5}
            delay={i * 0.06}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <StaffDistributionPie data={data.details} delay={0.1} />
        <StaffWorkloadChart data={data.performance.staff} delay={0.15} />
      </div>

      <StaffLeaderboard staff={data.performance} />
    </motion.div>
  );
}
