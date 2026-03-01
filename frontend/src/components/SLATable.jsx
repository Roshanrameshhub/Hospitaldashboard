import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown, AlertTriangle } from "lucide-react";

const priorityBadge = {
  High: "bg-red-500/15 text-red-400 border-red-500/20",
  Medium: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  Low: "bg-blue-500/15 text-blue-400 border-blue-500/20",
};

export default function SLATable({ breaches }) {
  const [sortKey, setSortKey] = useState("breach_amount_minutes");
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const sorted = [...breaches].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    if (typeof av === "number") return sortAsc ? av - bv : bv - av;
    return sortAsc
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av));
  });

  const columns = [
    { key: "ticket_id", label: "Ticket ID" },
    { key: "department", label: "Department" },
    { key: "priority", label: "Priority" },
    { key: "staff_assigned", label: "Staff" },
    { key: "resolution_time_minutes", label: "Resolution Time" },
    { key: "breach_amount_minutes", label: "Breach" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.6 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <h3 className="text-sm font-semibold text-gray-300">SLA Breaches</h3>
        </div>
        <span className="text-xs text-gray-500">
          {breaches.length} breaches found
        </span>
      </div>

      <div className="overflow-auto max-h-80 rounded-xl border border-white/5">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-[#0f1423] z-10">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="text-left text-gray-500 font-medium px-4 py-3 cursor-pointer hover:text-gray-300 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <ArrowUpDown className="h-3 w-3 opacity-40" />
                  </div>
                </th>
              ))}
              <th className="text-left text-gray-500 font-medium px-4 py-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sorted.map((row, i) => (
              <motion.tr
                key={row.ticket_id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className="hover:bg-white/[0.03] transition-colors"
              >
                <td className="px-4 py-3 font-mono text-gray-300">
                  {row.ticket_id}
                </td>
                <td className="px-4 py-3 text-gray-400">{row.department}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${priorityBadge[row.priority]}`}
                  >
                    {row.priority}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {row.staff_assigned}
                </td>
                <td className="px-4 py-3 text-gray-400 font-mono">
                  {Math.round(row.resolution_time_minutes)}m
                </td>
                <td className="px-4 py-3 text-red-400 font-mono font-medium">
                  +{Math.round(row.breach_amount_minutes)}m
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/20">
                    BREACH
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
