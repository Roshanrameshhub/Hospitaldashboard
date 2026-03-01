import React, { useState } from "react";
import { Bell } from "lucide-react";
import NotificationDrawer from "./NotificationDrawer";

// mock data generator
import { AlertTriangle, Users, Zap } from "lucide-react";

const defaultNotifications = [
  { icon: AlertTriangle, title: "SLA breach detected", time: "2m ago", severity: "critical", read: false },
  { icon: Users, title: "Critical patient admitted", time: "10m ago", severity: "warning", read: false },
  { icon: Zap, title: "Staff shortage warning", time: "1h ago", severity: "info", read: false },
  { icon: AlertTriangle, title: "System prediction alert", time: "3h ago", severity: "info", read: false },
];

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(defaultNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggle = () => setOpen((v) => !v);
  const markAsRead = (idx) => {
    setNotifications((prev) => {
      const copy = [...prev];
      copy[idx].read = true;
      return copy;
    });
  };
  const markAll = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <>
      <button
        className="relative h-9 w-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        onClick={toggle}
      >
        <Bell className="h-4 w-4 text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-red-500 rounded-full" />
        )}
      </button>
      <NotificationDrawer
        open={open}
        notifications={notifications}
        onClose={() => setOpen(false)}
        markAsRead={markAsRead}
        markAll={markAll}
      />
    </>
  );
}
