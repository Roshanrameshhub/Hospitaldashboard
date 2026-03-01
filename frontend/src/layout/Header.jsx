import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Menu, ChevronDown } from "lucide-react";
import NotificationBell from "../components/Notifications/NotificationBell";
import { useAuth } from "../context/AuthContext";

export default function Header({ onMenuClick, onNotificationClick, notificationOpen }) {
  const [time, setTime] = useState(new Date());
  const { user } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-30 border-b border-white/10 bg-[#0B0F19]/80 backdrop-blur-2xl px-4 sm:px-6 py-3"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden h-9 w-9 flex items-center justify-center rounded-lg hover:bg-white/10 text-gray-400 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              Hospital Operations
            </h2>
            <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">
              Real-time analytics &bull; Last 7 days
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
            <Clock className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-400 tabular-nums">
              {time.toLocaleTimeString()}
            </span>
          </div>

          <NotificationBell onToggle={onNotificationClick} isOpen={notificationOpen} />

          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-2 sm:px-3 py-1.5">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-cyan-500/20">
              {user?.username?.charAt(0).toUpperCase() || "A"}
            </div>
            <span className="hidden sm:block text-xs text-gray-300 font-medium">
              {user?.username || "Admin"}
            </span>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
