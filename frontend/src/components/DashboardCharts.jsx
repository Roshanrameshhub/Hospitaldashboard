import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell,
  Legend, LineChart, Line,
} from "recharts";

/* ─── Shared tooltip ───────────────────────────────────────────────── */

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#151a2d] border border-white/10 rounded-lg px-3 py-2.5 shadow-2xl">
      <p className="text-[10px] text-gray-400 mb-1.5 font-medium">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs font-semibold flex items-center gap-2" style={{ color: p.color || p.fill }}>
          <span className="h-2 w-2 rounded-full" style={{ background: p.color || p.fill }} />
          {p.name}: <span className="text-white">{typeof p.value === "number" ? p.value.toLocaleString() : p.value}</span>
        </p>
      ))}
    </div>
  );
};

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-[#151a2d] border border-white/10 rounded-lg px-3 py-2 shadow-2xl">
      <p className="text-xs font-semibold" style={{ color: d.payload.fill || d.color }}>
        {d.name}: <span className="text-white">{d.value}</span>
      </p>
    </div>
  );
};

/* ─── Reusable card ────────────────────────────────────────────────── */

export function ChartCard({ title, children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`glass-card p-4 sm:p-5 ${className}`}
    >
      <h3 className="text-xs sm:text-sm font-semibold text-gray-300 mb-3 sm:mb-4">{title}</h3>
      <div className="h-56 sm:h-64">{children}</div>
    </motion.div>
  );
}

/* ─── Workload by Department ───────────────────────────────────────── */

export function WorkloadChart({ data, delay = 0 }) {
  if (!data) return null;
  return (
    <ChartCard title="Workload by Department" delay={delay}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="department" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <defs>
            <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.3} />
            </linearGradient>
            <linearGradient id="gradOpen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <Bar dataKey="total" name="Total" fill="url(#gradTotal)" radius={[5, 5, 0, 0]} />
          <Bar dataKey="open" name="Open" fill="url(#gradOpen)" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* ─── Resolution Trend ─────────────────────────────────────────────── */

export function ResolutionTrendChart({ data, delay = 0 }) {
  if (!data) return null;
  return (
    <ChartCard title="Resolution Trend (7 Days)" delay={delay}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="gradArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => new Date(d + "T00:00").toLocaleDateString("en-US", { weekday: "short" })} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#06b6d4" strokeWidth={2.5} fill="url(#gradArea)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* ─── Open vs Closed Donut ─────────────────────────────────────────── */

const DONUT_COLORS = ["#f59e0b", "#10b981"];

export function OpenClosedDonut({ kpis, delay = 0 }) {
  if (!kpis) return null;
  const data = [
    { name: "Open", value: kpis.open_issues },
    { name: "Resolved", value: kpis.resolved_issues },
  ];
  const total = kpis.open_issues + kpis.resolved_issues;

  return (
    <ChartCard title="Open vs Resolved" delay={delay}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius="55%" outerRadius="80%" paddingAngle={4} dataKey="value" strokeWidth={0}>
            {data.map((_, i) => <Cell key={i} fill={DONUT_COLORS[i]} />)}
          </Pie>
          <Tooltip content={<PieTooltip />} />
          <Legend verticalAlign="bottom" iconType="circle" formatter={(v) => <span className="text-gray-400 text-xs ml-1">{v}</span>} />
          <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" className="fill-white text-2xl font-bold">{total}</text>
          <text x="50%" y="56%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-500 text-[10px]">Total</text>
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* ─── Priority Distribution ────────────────────────────────────────── */

const PRIORITY_COLORS = { High: "#ef4444", Medium: "#f59e0b", Low: "#3b82f6" };

export function PriorityChart({ data, delay = 0 }) {
  if (!data) return null;
  return (
    <ChartCard title="Priority Distribution" delay={delay}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis dataKey="priority" type="category" tick={{ fontSize: 11 }} width={55} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="count" name="Count" radius={[0, 5, 5, 0]}>
            {data.map((entry, i) => <Cell key={i} fill={PRIORITY_COLORS[entry.priority]} fillOpacity={0.85} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* ─── Shift Analysis ───────────────────────────────────────────────── */

const SHIFT_COLORS = { Morning: "#f59e0b", Afternoon: "#06b6d4", Night: "#8b5cf6" };

export function ShiftChart({ data, delay = 0 }) {
  if (!data) return null;
  return (
    <ChartCard title="Shift Analysis" delay={delay}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="shift" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="count" name="Tickets" radius={[5, 5, 0, 0]}>
            {data.map((entry, i) => <Cell key={i} fill={SHIFT_COLORS[entry.shift]} fillOpacity={0.85} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* ─── Issue Type Analysis ──────────────────────────────────────────── */

const ISSUE_COLORS = ["#06b6d4", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444"];

export function IssueTypeChart({ data, delay = 0 }) {
  if (!data) return null;
  return (
    <ChartCard title="Issue Type Analysis" delay={delay}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="issue_type" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="count" name="Count" radius={[5, 5, 0, 0]}>
            {data.map((_, i) => <Cell key={i} fill={ISSUE_COLORS[i]} fillOpacity={0.85} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* ─── NEW: Patient Load by Department ──────────────────────────────── */

export function PatientLoadChart({ data, delay = 0 }) {
  if (!data) return null;
  return (
    <ChartCard title="Department-wise Patient Load" delay={delay}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="department" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <defs>
            <linearGradient id="gradPatient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.3} />
            </linearGradient>
            <linearGradient id="gradCritical" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <Bar dataKey="current_count" name="Total Patients" fill="url(#gradPatient)" radius={[5, 5, 0, 0]} />
          <Bar dataKey="critical" name="Critical" fill="url(#gradCritical)" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* ─── NEW: Staff Distribution Pie ──────────────────────────────────── */

const ROLE_COLORS = ["#06b6d4", "#10b981", "#f59e0b"];

export function StaffDistributionPie({ data, delay = 0 }) {
  if (!data) return null;
  const pieData = [
    { name: "Doctors", value: data.by_role.doctors },
    { name: "Nurses", value: data.by_role.nurses },
    { name: "Technicians", value: data.by_role.technicians },
  ];

  return (
    <ChartCard title="Staff Distribution by Role" delay={delay}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={pieData} cx="50%" cy="50%" innerRadius="48%" outerRadius="76%" paddingAngle={3} dataKey="value" strokeWidth={0}>
            {pieData.map((_, i) => <Cell key={i} fill={ROLE_COLORS[i]} />)}
          </Pie>
          <Tooltip content={<PieTooltip />} />
          <Legend verticalAlign="bottom" iconType="circle" formatter={(v) => <span className="text-gray-400 text-xs ml-1">{v}</span>} />
          <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" className="fill-white text-xl font-bold">{data.total_staff}</text>
          <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-500 text-[10px]">Total Staff</text>
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* ─── NEW: SLA Breaches Over Time ──────────────────────────────────── */

export function SLATrendChart({ data, delay = 0 }) {
  if (!data) return null;
  return (
    <ChartCard title="SLA Breaches Over Time" delay={delay}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => new Date(d + "T00:00").toLocaleDateString("en-US", { weekday: "short" })} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="breaches" name="Breaches" stroke="#ef4444" strokeWidth={2.5} dot={{ fill: "#ef4444", r: 4 }} activeDot={{ r: 6, stroke: "#ef4444", strokeWidth: 2, fill: "#0B0F19" }} />
          <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 3 }} strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* ─── NEW: Staff Workload Comparison ───────────────────────────────── */

export function StaffWorkloadChart({ data, delay = 0 }) {
  if (!data) return null;
  return (
    <ChartCard title="Staff Workload Comparison" delay={delay}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis dataKey="staff" type="category" tick={{ fontSize: 10 }} width={60} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="issues_handled" name="Handled" fill="#06b6d4" radius={[0, 4, 4, 0]} fillOpacity={0.8} />
          <Bar dataKey="open_tickets" name="Open" fill="#f59e0b" radius={[0, 4, 4, 0]} fillOpacity={0.8} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* ─── NEW: SLA Compliance by Department ────────────────────────────── */

export function SLAByDepartmentChart({ workload, breaches, delay = 0 }) {
  if (!workload || !breaches) return null;
  const breachByDept = {};
  breaches.forEach((b) => {
    breachByDept[b.department] = (breachByDept[b.department] || 0) + 1;
  });

  const data = workload.map((w) => {
    const resolved = w.total - w.open;
    const deptBreaches = breachByDept[w.department] || 0;
    const compliance = resolved > 0 ? Math.round(((resolved - deptBreaches) / resolved) * 100) : 100;
    return { department: w.department, compliance, breaches: deptBreaches };
  });

  return (
    <ChartCard title="SLA Compliance by Department" delay={delay}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="department" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} unit="%" />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="compliance" name="Compliance %" radius={[5, 5, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.compliance >= 80 ? "#10b981" : entry.compliance >= 60 ? "#f59e0b" : "#ef4444"} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
