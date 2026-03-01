import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  return (
    <div
      className={`app-layout ${collapsed ? "sidebar-collapsed" : ""}`}
    >
      {/* LEFT: Sidebar (fixed 260px or 80px when collapsed) */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* CENTER: Main Content Area (fluid) */}
      <div className="main-content">
        <Header
          onMenuClick={() => setMobileOpen(true)}
          notificationOpen={notificationOpen}
          onNotificationClick={() => setNotificationOpen(!notificationOpen)}
        />

        {/* Main Scrollable Area */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-x-hidden overflow-y-auto">
          <Outlet context={{ notificationOpen, collapsed }} />
        </main>
      </div>
    </div>
  );
}
