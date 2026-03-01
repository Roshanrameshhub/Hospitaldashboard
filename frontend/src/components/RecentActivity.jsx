import { motion } from "framer-motion";
import { Activity } from "lucide-react";

const actionStyle = {
  Opened: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  "In Progress": "bg-amber-500/15 text-amber-400 border-amber-500/20",
  Resolved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
};

const priorityDot = {
  High: "bg-red-500",
  Medium: "bg-amber-500",
  Low: "bg-blue-500",
};

export default function RecentActivity({ data }) {
  if (!data?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="glass-card p-4 sm:p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-4 w-4 text-cyan-400" />
        <h3 className="text-xs sm:text-sm font-semibold text-gray-300">Recent Activity</h3>
        <span className="ml-auto text-[10px] text-gray-600">Last {data.length} events</span>
      </div>

      <div className="overflow-auto max-h-72 rounded-xl border border-white/5">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-[#0f1423] z-10">
            <tr>
              <th className="text-left text-gray-500 font-medium px-3 py-2.5">Ticket</th>
              <th className="text-left text-gray-500 font-medium px-3 py-2.5">Department</th>
              <th className="text-left text-gray-500 font-medium px-3 py-2.5">Type</th>
              <th className="text-left text-gray-500 font-medium px-3 py-2.5">Priority</th>
              <th className="text-left text-gray-500 font-medium px-3 py-2.5">Staff</th>
              <th className="text-left text-gray-500 font-medium px-3 py-2.5">Action</th>
              <th className="text-left text-gray-500 font-medium px-3 py-2.5">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((row, i) => (
              <motion.tr
                key={row.ticket_id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className="hover:bg-white/[0.03] transition-colors"
              >
                <td className="px-3 py-2.5 font-mono text-gray-300">{row.ticket_id}</td>
                <td className="px-3 py-2.5 text-gray-400">{row.department}</td>
                <td className="px-3 py-2.5 text-gray-400">{row.issue_type}</td>
                <td className="px-3 py-2.5">
                  <span className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${priorityDot[row.priority]}`} />
                    <span className="text-gray-400">{row.priority}</span>
                  </span>
                </td>
                <td className="px-3 py-2.5 text-gray-400">{row.staff}</td>
                <td className="px-3 py-2.5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${actionStyle[row.action]}`}>
                    {row.action}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-gray-500 font-mono text-[10px]">
                  {new Date(row.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
