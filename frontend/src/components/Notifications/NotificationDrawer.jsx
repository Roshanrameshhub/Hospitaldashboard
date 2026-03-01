import React from "react";
import { motion } from "framer-motion";
import NotificationItem from "./NotificationItem";

export default function NotificationDrawer({ open, notifications, onClose, markAsRead, markAll }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: open ? "0%" : "100%" }}
        transition={{ type: "tween" }}
        className="fixed top-0 right-0 h-full w-[320px] bg-[#0B0F19] z-50 shadow-2xl flex flex-col"
      >
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">Notifications</h3>
          <button className="text-sm text-gray-400 hover:text-white" onClick={markAll}>
            Mark all as read
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {notifications.length === 0 && (
            <p className="text-center text-gray-500 mt-10">No alerts</p>
          )}
          {notifications.map((n, i) => (
            <NotificationItem
              key={i}
              notification={n}
              onClick={() => markAsRead(i)}
            />
          ))}
        </div>
      </motion.div>
    </>
  );
}
