import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const SIDEBAR_W = 260;
const SIDEBAR_W_COLLAPSED = 80;
const NOTIFICATION_W = 320;

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const sidebarWidth = collapsed ? SIDEBAR_W_COLLAPSED : SIDEBAR_W;

  return (
    <div className="min-h-screen bg-[#0B0F19] flex">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        width={sidebarWidth}
      />

      {/* Main content flex container */}
      <div
        className="flex flex-col flex-1 min-w-0"
        style={{
          transition: "margin-right 0.3s ease",
        }}
      >
        <Header
          onMenuClick={() => setMobileOpen(true)}
          onNotificationClick={() => setNotificationOpen(!notificationOpen)}
          notificationOpen={notificationOpen}
        />

        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-x-hidden overflow-y-auto">
          <Outlet context={{ notificationOpen }} />
        </main>
      </div>

      {/* Desktop notification panel (sticky) - hidden on mobile */}
      {notificationOpen && (
        <div
          className="hidden lg:flex flex-col w-80 bg-[#0F1425] border-l border-white/10 overflow-hidden"
          style={{
            width: NOTIFICATION_W,
          }}
        >
          <div className="sticky top-0 p-4 border-b border-white/10 bg-[#0B0F19]/80 backdrop-blur-sm flex items-center justify-between z-20">
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
            <button
              onClick={() => setNotificationOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <p className="text-center text-gray-500 mt-10">No notifications</p>
          </div>
        </div>
      )}
    </div>
  );
}
