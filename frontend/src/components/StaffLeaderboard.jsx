import { motion } from "framer-motion";
import { Trophy, Medal, Star, User } from "lucide-react";

const rankIcons = [
  <Trophy className="h-4 w-4 text-amber-400" />,
  <Medal className="h-4 w-4 text-gray-400" />,
  <Medal className="h-4 w-4 text-amber-700" />,
];

export default function StaffLeaderboard({ staff }) {
  if (!staff?.staff) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="glass-card p-5"
    >
      <div className="flex items-center gap-2 mb-5">
        <Trophy className="h-4 w-4 text-amber-400" />
        <h3 className="text-sm font-semibold text-gray-300">
          Staff Performance Leaderboard
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {staff.staff.map((member, i) => {
          const isTop = i === 0;
          return (
            <motion.div
              key={member.staff}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + i * 0.08 }}
              whileHover={{ y: -4 }}
              className={`relative p-4 rounded-xl border transition-all duration-300 ${
                isTop
                  ? "bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border-amber-500/30 animate-glow"
                  : "bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.06]"
              }`}
            >
              {isTop && (
                <div className="absolute -top-2 -right-2">
                  <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                </div>
              )}

              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold ${
                    isTop
                      ? "bg-gradient-to-br from-amber-500 to-yellow-600 text-white"
                      : "bg-white/10 text-gray-400"
                  }`}
                >
                  {i < 3 ? rankIcons[i] : <User className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {member.staff}
                  </p>
                  <p className="text-[10px] text-gray-500">Rank #{i + 1}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Score</span>
                  <span className="text-white font-semibold">
                    {member.performance_score}
                  </span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${member.performance_score}%` }}
                    transition={{ delay: 1 + i * 0.1, duration: 0.8 }}
                    className={`h-full rounded-full ${
                      isTop
                        ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                        : "bg-gradient-to-r from-cyan-500 to-blue-500"
                    }`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <p className="text-[10px] text-gray-500">Handled</p>
                    <p className="text-xs font-semibold text-gray-300">
                      {member.issues_handled}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500">Avg Time</p>
                    <p className="text-xs font-semibold text-gray-300">
                      {Math.round(member.avg_resolution_time)}m
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500">SLA %</p>
                    <p className="text-xs font-semibold text-emerald-400">
                      {member.sla_compliance_rate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500">Open</p>
                    <p className="text-xs font-semibold text-amber-400">
                      {member.open_tickets}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
