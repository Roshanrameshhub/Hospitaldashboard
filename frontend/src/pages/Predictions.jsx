import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, Users, Bed } from "lucide-react";
import SectionHeader from "../components/UI/SectionHeader";
import Card from "../components/UI/Card";
import Skeleton from "../components/Skeleton";
import AiInsightCard from "../components/AI/AiInsightCard";
import RiskMeter from "../components/AI/RiskMeter";
import RecommendationPanel from "../components/AI/RecommendationPanel";
import ForecastChart from "../components/AI/ForecastChart";
import OperationalImpactCard from "../components/AI/OperationalImpactCard";
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Section Header */}
      <SectionHeader
        title="AI Insights & Forecast"
        subtitle="Predictive analytics powered by machine learning"
      />

      {/* Main Content Grid - Desktop: 2 columns, Tablet: 1 column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Risk Meter + Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-6"
        >
          {/* Risk Overview Card */}
          <div className="glass-card p-6 flex flex-col items-center justify-center min-h-[280px]">
            <h3 className="text-sm font-semibold text-gray-300 mb-6">Overall Risk</h3>
            <RiskMeter level={data.prediction.risk_level} />
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400 mb-2">Confidence Score</p>
              <p className="text-2xl font-bold text-cyan-400">
                {data.prediction.confidence || 76}%
              </p>
            </div>
          </div>

          {/* Recommendations Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <RecommendationPanel recommendations={recommendations} />
          </motion.div>
        </motion.div>

        {/* Middle-Right Column: Forecast Chart + Insights Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Forecast Chart Card */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
              <h3 className="text-lg font-semibold text-white">
                Predicted Issue Volume
              </h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Forecast for the next 3 days
            </p>
            <ForecastChart data={forecastData} />
          </div>

          {/* Insights Grid - 2x2 on desktop, 1 column on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((ins, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.25 + idx * 0.05 }}
              >
                <AiInsightCard {...ins} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Full-Width Operational Impact Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
      >
        <OperationalImpactCard
          data={{
            icu_occupancy: data.prediction.icu_occupancy || 75,
            er_load: data.prediction.er_load || 82,
            staff_util: data.prediction.staff_util || 68,
          }}
        />
      </motion.div>
    </motion.div>
  );
}
