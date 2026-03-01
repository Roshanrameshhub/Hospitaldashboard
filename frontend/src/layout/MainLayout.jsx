import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const SIDEBAR_W = 260;
const SIDEBAR_W_COLLAPSED = 80;

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarWidth = collapsed ? SIDEBAR_W_COLLAPSED : SIDEBAR_W;

  return (
    <div
      className="layout-grid min-h-screen bg-[#0B0F19]"
      style={{
        display: "grid",
        gridTemplateColumns: `${sidebarWidth}px 1fr`,
        transition: "grid-template-columns 0.3s ease",
      }}
    >
      {/* Column 1 — Sidebar (sticky inside its grid cell) */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        width={sidebarWidth}
      />

      {/* Column 2 — Header + scrollable content */}
      <div className="flex flex-col min-h-screen min-w-0">
        <Header onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
