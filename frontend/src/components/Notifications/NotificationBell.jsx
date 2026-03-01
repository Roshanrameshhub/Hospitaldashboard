import React, { useState, useRef, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { motion } from "framer-motion";

// mock data generator
import { AlertTriangle, Users, Zap } from "lucide-react";

const defaultNotifications = [
  { icon: AlertTriangle, title: "SLA breach detected", time: "2m ago", severity: "critical", read: false },
  { icon: Users, title: "Critical patient admitted", time: "10m ago", severity: "warning", read: false },
  { icon: Zap, title: "Staff shortage warning", time: "1h ago", severity: "info", read: false },
  { icon: AlertTriangle, title: "System prediction alert", time: "3h ago", severity: "info", read: false },
];

export default function NotificationBell({ onToggle, isOpen }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(defaultNotifications);
  const buttonRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggle = () => {
    const newState = !open;
    setOpen(newState);
    if (onToggle) onToggle(newState);
  };

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

  const handleClose = () => {
    setOpen(false);
    if (onToggle) onToggle(false);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        className={`relative h-9 w-9 flex items-center justify-center rounded-lg border transition-colors ${
          open || isOpen ? "bg-white/15 border-white/30" : "bg-white/5 border-white/10 hover:bg-white/10"
        }`}
        onClick={toggle}
      >
        <Bell className="h-4 w-4 text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-red-500 rounded-full" />
        )}
      </button>

      {/* Notification Dialog - Floating Dropdown */}
      {(open || isOpen) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          className="notification-dialog"
        >
          <div className="notification-dialog-header">
            <h4>Notifications</h4>
            <button
              onClick={handleClose}
              className="notification-dialog-close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="px-2 pb-2">
            {notifications.length === 0 ? (
              <div className="notification-item-empty">No notifications</div>
            ) : (
              notifications.map((n, i) => (
                <div
                  key={i}
                  className={`notification-item ${n.severity}`}
                  onClick={() => markAsRead(i)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="notification-item-title">{n.title}</div>
                  <div className="notification-item-time">{n.time}</div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="border-t border-white/10 px-4 py-2">
              <button
                onClick={markAll}
                className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
              >
                Mark all as read
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
