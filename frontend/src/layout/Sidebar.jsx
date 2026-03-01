import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Building2,
  Users,
  ShieldAlert,
  BrainCircuit,
  Activity,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/departments", label: "Departments", icon: Building2 },
  { to: "/staff-analytics", label: "Staff Analytics", icon: Users },
  { to: "/sla-monitor", label: "SLA Monitor", icon: ShieldAlert },
  { to: "/predictions", label: "Predictions", icon: BrainCircuit },
];

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  width,
}) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const sidebarInner = (
    <div className="flex flex-col h-full">
      {/* ── Logo ──────────────────────────────────────────────────── */}
      <div
        className={`flex items-center gap-3 border-b border-white/5 ${
          collapsed ? "justify-center px-2 py-4" : "px-5 py-5"
        }`}
      >
        <div className="h-9 w-9 min-w-[36px] rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Activity className="h-5 w-5 text-white" />
        </div>

        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.2 }}
          >
            <h1 className="text-sm font-bold text-white tracking-tight leading-none">
              MedAdmin
            </h1>
            <p className="text-[9px] text-gray-500 uppercase tracking-widest mt-0.5">
              Analytics Hub
            </p>
          </motion.div>
        )}

        {/* Mobile‑only close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="ml-auto lg:hidden h-7 w-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-gray-400"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* ── Navigation ────────────────────────────────────────────── */}
      <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  collapsed ? "justify-center px-2 py-3" : "px-3 py-2.5"
                } ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/15 to-blue-500/10 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-500/5"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent"
                }`
              }
            >
              <Icon className="h-[18px] w-[18px] flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}

              {/* Collapsed tooltip */}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-gray-900 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-[60] border border-white/10 shadow-xl">
                  {item.label}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ── Bottom actions ────────────────────────────────────────── */}
      <div className="border-t border-white/5 p-2 space-y-1">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-full items-center gap-3 rounded-xl text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all px-3 py-2.5 text-sm"
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4 mx-auto" />
          ) : (
            <>
              <ChevronsLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm ${
            collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"
          }`}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop: sticky sidebar inside the grid cell ────────── */}
      <aside
        className="hidden lg:flex flex-col sticky top-0 h-screen border-r border-white/10 bg-[#0B0F19]/95 backdrop-blur-2xl overflow-y-auto overflow-x-hidden z-40"
        style={{ width: `${width}px`, minWidth: `${width}px` }}
      >
        {sidebarInner}
      </aside>

      {/* ── Mobile: fixed overlay ────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed left-0 top-0 h-screen w-[260px] z-[80] border-r border-white/10 bg-[#0B0F19] overflow-y-auto lg:hidden"
            >
              {sidebarInner}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
