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
      <div className="space-y-4 p-4">
        <Skeleton className="h-6 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {Array(3)
            .fill(0)
            .map((_,i)=><Skeleton key={i} className="h-48" />)}
        </div>
      </div>
    );
  if (error) return <p className="p-4 text-red-400">Failed to load data</p>;
  if (!data) return null;

  // derive forecast data from prediction
  const forecastData = data.prediction.last_3_days.map((v, i) => ({ date: `Day ${i + 1}`, value: v }));

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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-4">
      <SectionHeader
        title="AI Insights & Forecast"
        subtitle="Predictive analytics powered by machine learning"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* column 1: risk meter + recommendations */}
        <div className="space-y-5">
          <Card className="flex justify-center">
            <RiskMeter level={data.prediction.risk_level} />
          </Card>
          <RecommendationPanel recommendations={recommendations} />
        </div>

        {/* column 2: forecast chart */}
        <Card>
          <h4 className="text-sm font-semibold text-white mb-2">Trend Forecast</h4>
          <ForecastChart data={forecastData} />
        </Card>

        {/* column 3: insight cards grid */}
        <div className="grid grid-cols-1 gap-4">
          {insights.map((ins, idx) => (
            <AiInsightCard key={idx} {...ins} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
