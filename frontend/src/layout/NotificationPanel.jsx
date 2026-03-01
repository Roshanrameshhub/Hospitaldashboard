import React from "react";
import { X } from "lucide-react";

export default function NotificationPanel({ onClose }) {
  const notifications = [
    { id: 1, title: "SLA breach detected", time: "2m ago", severity: "critical" },
    { id: 2, title: "Critical patient admitted", time: "10m ago", severity: "warning" },
    { id: 3, title: "Staff shortage warning", time: "1h ago", severity: "info" },
  ];

  return (
    <div className="notification-panel">
      <div className="sticky top-0 p-4 border-b border-white/10 bg-[#0B0F19]/95 backdrop-blur-sm flex items-center justify-between z-20">
        <h3 className="text-lg font-semibold text-white">Notifications</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-white/5"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="p-4 space-y-3 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">No notifications</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3 rounded-lg border transition-colors ${
                n.severity === "critical"
                  ? "bg-red-500/10 border-red-500/30"
                  : n.severity === "warning"
                  ? "bg-yellow-500/10 border-yellow-500/30"
                  : "bg-cyan-500/10 border-cyan-500/30"
              }`}
            >
              <p className="text-sm font-medium text-white">{n.title}</p>
              <p className="text-xs text-gray-400 mt-1">{n.time}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
