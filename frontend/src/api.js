import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export const getKPIs = () => API.get("/kpis").then((r) => r.data);
export const getWorkload = () => API.get("/workload").then((r) => r.data);
export const getResolutionTrend = () => API.get("/resolution-trend").then((r) => r.data);
export const getPriorityDistribution = () => API.get("/priority-distribution").then((r) => r.data);
export const getIssueTypeAnalysis = () => API.get("/issue-type-analysis").then((r) => r.data);
export const getShiftAnalysis = () => API.get("/shift-analysis").then((r) => r.data);
export const getStaffPerformance = () => API.get("/staff-performance").then((r) => r.data);
export const getSLABreaches = () => API.get("/sla-breaches").then((r) => r.data);
export const getSLATrend = () => API.get("/sla-trend").then((r) => r.data);
export const getAlerts = () => API.get("/alerts").then((r) => r.data);
export const getPrediction = () => API.get("/prediction").then((r) => r.data);
export const getRecentActivity = () => API.get("/recent-activity").then((r) => r.data);
export const getPatients = () => API.get("/patients").then((r) => r.data);
export const getStaffDetails = () => API.get("/staff-details").then((r) => r.data);

export default API;
