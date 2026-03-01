import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import KPICards from "../components/KPICards";
import { ResolutionTrendChart, OpenClosedDonut } from "../components/DashboardCharts";
import InsightsPanel from "../components/InsightsPanel";
import RecentActivity from "../components/RecentActivity";
import LoadingSkeleton from "../components/LoadingSkeleton";
import * as api from "../api";

const extraCards = [
  { key: "total_patients", label: "Total Patients", icon: "HeartPulse", color: "from-pink-500 to-rose-600", sparkColor: "#ec4899", trend: "+6%", trendUp: true },
  { key: "active_staff", label: "Active Staff", icon: "Users", color: "from-teal-500 to-emerald-600", sparkColor: "#14b8a6", trend: "+2", trendUp: true },
  { key: "avg_resolution_time_minutes", label: "Avg Resolution", icon: "Timer", color: "from-sky-500 to-blue-600", sparkColor: "#0ea5e9", trend: "-12m", trendUp: false, suffix: "m" },
];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getKPIs(),
      api.getResolutionTrend(),
      api.getAlerts(),
      api.getPrediction(),
      api.getStaffPerformance(),
      api.getRecentActivity(),
      api.getPatients(),
      api.getStaffDetails(),
    ])
      .then(([kpis, trend, alerts, prediction, staff, activity, patients, staffDetails]) => {
        const merged = {
          ...kpis,
          total_patients: patients.total_patients,
          active_staff: staffDetails.active_staff,
        };
        setData({ kpis: merged, trend, alerts, prediction, staff, activity, patients, staffDetails });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) return <LoadingSkeleton />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5 sm:space-y-6">
      <KPICards kpis={data.kpis} extraCards={extraCards} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <ResolutionTrendChart data={data.trend} delay={0.15} />
        <OpenClosedDonut kpis={data.kpis} delay={0.2} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="xl:col-span-2">
          <RecentActivity data={data.activity} />
        </div>
        <InsightsPanel alerts={data.alerts} prediction={data.prediction} staff={data.staff} />
      </div>
    </motion.div>
  );
}
