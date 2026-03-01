import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, Users, AlertTriangle, HeartPulse } from "lucide-react";
import { KPICard } from "../components/KPICards";
import {
  WorkloadChart,
  PatientLoadChart,
  IssueTypeChart,
  PriorityChart,
} from "../components/DashboardCharts";
import LoadingSkeleton from "../components/LoadingSkeleton";
import * as api from "../api";

export default function Departments() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getWorkload(),
      api.getPatients(),
      api.getIssueTypeAnalysis(),
      api.getPriorityDistribution(),
      api.getKPIs(),
    ])
      .then(([workload, patients, issueType, priority, kpis]) =>
        setData({ workload, patients, issueType, priority, kpis })
      )
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) return <LoadingSkeleton />;

  const deptCards = [
    { icon: Building2, label: "Departments", value: 5, color: "from-cyan-500 to-blue-600", sparkColor: "#06b6d4" },
    { icon: HeartPulse, label: "Total Patients", value: data.patients.total_patients, color: "from-pink-500 to-rose-600", sparkColor: "#ec4899", trend: "+6%", trendUp: true },
    { icon: AlertTriangle, label: "Critical Patients", value: data.patients.critical_patients, color: "from-red-500 to-rose-600", sparkColor: "#ef4444", trend: "+2", trendUp: true, trendBad: true },
    { icon: Users, label: "Admitted Today", value: data.patients.admitted_today, color: "from-emerald-500 to-green-600", sparkColor: "#10b981", trend: "+4", trendUp: true },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5 sm:space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Departments Overview</h2>
        <p className="text-xs text-gray-500">Department workload, patient load, and issue analytics</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {deptCards.map((c, i) => (
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
            sparkIndex={i}
            delay={i * 0.06}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <WorkloadChart data={data.workload} delay={0.1} />
        <PatientLoadChart data={data.patients.departments} delay={0.15} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <IssueTypeChart data={data.issueType} delay={0.2} />
        <PriorityChart data={data.priority} delay={0.25} />
      </div>
    </motion.div>
  );
}
