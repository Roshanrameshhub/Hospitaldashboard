import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, Users, Bed, CheckCircle } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import SectionHeader from "../components/UI/SectionHeader";
import Skeleton from "../components/Skeleton";
import RiskMeter from "../components/AI/RiskMeter";
import RecommendationPanel from "../components/AI/RecommendationPanel";
import ForecastChart from "../components/AI/ForecastChart";
import OperationalImpactCard from "../components/AI/OperationalImpactCard";
import * as api from "../api";

export default function Predictions() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [allRead, setAllRead] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "SLA breach detected", time: "2m ago", severity: "critical", read: false },
    { id: 2, title: "Critical patient admitted", time: "10m ago", severity: "warning", read: false },
    { id: 3, title: "Staff shortage warning", time: "1h ago", severity: "info", read: false },
  ]);

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

  const handleMarkAllRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
    setAllRead(true);
    setTimeout(() => setAllRead(false), 3000);
  };

  if (loading)
    return (
      <div className="space-y-6 p-4 sm:p-6">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-center">
        <p className="text-red-400 text-lg">Failed to load AI predictions</p>
        <p className="text-gray-400 text-sm mt-2">
          Please refresh the page or contact support
        </p>
      </div>
    );

  if (!data)
    return (
      <div className="p-6 text-center">
        <p className="text-gray-400">AI insights will appear when sufficient data is available.</p>
      </div>
    );

  // Derive forecast data from prediction
  const forecastData = data.prediction.last_3_days.map((v, i) => ({
    date: `Day ${i + 1}`,
    value: v,
  }));

  const insights = [
    {
      icon: TrendingUp,
      title: "Issue Volume Rising",
      description: "Ticket count has increased over the past week.",
      confidence: 78,
      horizon: "Next 24h",
      severity: "info",
    },
    {
      icon: AlertTriangle,
      title: "SLA Risk",
      description: "Potential breaches predicted for midweek.",
      confidence: 63,
      horizon: "Next 7 days",
      severity: "warning",
    },
    {
      icon: Users,
      title: "Staffing Concern",
      description: "May need additional staff on night shifts.",
      confidence: 54,
      horizon: "Next 24h",
      severity: "info",
    },
    {
      icon: Bed,
      title: "Bed Usage High",
      description: "ICU occupancy expected to reach 90%.",
      confidence: 82,
      horizon: "Next 7 days",
      severity: "alert",
    },
  ];

  const recommendations = [
    "Increase ICU staff by 2",
    "Prepare 5 additional beds",
    "Shift ER resources for evening peak",
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1400px] mx-auto overflow-x-hidden">
      {/* Section Header */}
      <SectionHeader
        title="AI Insights & Forecast"
        subtitle="Predictive analytics powered by machine learning"
      />

      {/* Main 12-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT SIDE - 8 Columns: Charts and Operational Cards */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Predicted Issue Volume Chart - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="glass-card p-5 rounded-2xl h-full flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-cyan-400" />
                <h3 className="text-lg font-semibold text-white">
                  Predicted Issue Volume
                </h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Forecast for the next 3 days
              </p>
              <div className="flex-1 min-h-[300px]">
                <div className="w-full h-[320px] min-h-[300px]">
                  <ForecastChart data={data ? data.prediction.last_3_days.map((v, i) => ({
                    date: `Day ${i + 1}`,
                    value: v,
                  })) : []} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* 2. Two Cards Below - Operational Impact & SLA Risk */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Operational Impact Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <OperationalImpactCard
                data={{
                  icu_occupancy: data?.prediction?.icu_occupancy || 75,
                  er_load: data?.prediction?.er_load || 82,
                  staff_util: data?.prediction?.staff_util || 68,
                }}
              />
            </motion.div>

            {/* SLA Risk Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="glass-card p-5 rounded-2xl h-full flex flex-col"
            >
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                <h3 className="text-sm font-semibold text-white">
                  SLA Breach Risk
                </h3>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-xs text-gray-400">Mid-week Risk</p>
                    <p className="text-sm font-bold text-amber-400">
                      {data?.prediction?.sla_risk || 63}%
                    </p>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-red-500"
                      style={{ width: `${data?.prediction?.sla_risk || 63}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  Monitor peak hours closely. Consider staffing adjustments.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* RIGHT SIDE - 4 Columns: Risk Meter & Recommendations */}
        <div className="lg:col-span-4 space-y-6">
          {/* Risk Level Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="glass-card p-5 rounded-2xl h-full flex flex-col items-center justify-center"
          >
            <h3 className="text-sm font-semibold text-gray-300 mb-6">Overall Risk</h3>
            <RiskMeter level={data?.prediction?.risk_level || 2} />
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400 mb-2">Confidence Score</p>
              <p className="text-2xl font-bold text-cyan-400">
                {data?.prediction?.confidence || 76}%
              </p>
            </div>
          </motion.div>

          {/* Recommendations Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="glass-card p-5 rounded-2xl h-full flex flex-col"
          >
            <h3 className="text-sm font-semibold text-white mb-4">
              Recommendations
            </h3>
            <div className="flex-1 space-y-3">
              {recommendations.map((rec, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + idx * 0.05 }}
                  className="flex gap-3 items-start"
                >
                  <div className="h-2 w-2 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                  <p className="text-xs text-gray-300 break-words min-h-[80px]">
                    {rec}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Notifications Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="glass-card p-5 rounded-2xl h-full flex flex-col"
          >
            <h3 className="text-sm font-semibold text-white mb-4">
              Active Alerts
            </h3>
            <div className="flex-1 space-y-2">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 rounded-lg border-l-3 transition-opacity ${
                    notif.severity === "critical"
                      ? "border-l-red-500 bg-red-500/10"
                      : notif.severity === "warning"
                      ? "border-l-amber-500 bg-amber-500/10"
                      : "border-l-cyan-500 bg-cyan-500/10"
                  } ${notif.read ? "opacity-40" : ""}`}
                >
                  <p className="text-xs font-medium text-gray-300 truncate">
                    {notif.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                </div>
              ))}
            </div>
            <button
              onClick={handleMarkAllRead}
              className="text-xs text-cyan-400 hover:underline font-medium mt-4 transition-colors"
            >
              Mark all as read
            </button>
            {allRead && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-xs text-green-400 mt-3 bg-green-500/10 p-2 rounded"
              >
                <CheckCircle className="h-3 w-3" />
                All notifications marked as read
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
