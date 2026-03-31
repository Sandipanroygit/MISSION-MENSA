import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  TrendingUp,
  Settings,
  ChevronDown,
  LogOut,
  Menu,
  X,
  Bell,
} from "lucide-react";
import Logo from "@/assets/finwit_kids_logo_clear.png";
import { useAuthContext } from "@/context/AuthContext";
import { useLogout } from "@/hooks/useAuth";
import LearnerSwitcher from "@/components/dashboard/LearnerSwitcher";

const parentNavItems = [
  { name: "Overview", href: "/dashboard/overview", icon: LayoutDashboard },
  { name: "Learners", href: "/dashboard/learners", icon: Users },
  { name: "Subscriptions", href: "/dashboard/subscriptions", icon: TrendingUp },
  { name: "Resources", href: "/resources", icon: BookOpen },
];

const childNavItems = [
  { name: "My Dashboard", href: "/dashboard/child", icon: LayoutDashboard },
  { name: "Resources", href: "/resources", icon: BookOpen },
];

export default function DashboardHeader() {
  const location = useLocation();
  const { user, isParent, isAdmin } = useAuthContext();
  const navItems = isParent || isAdmin ? parentNavItems : childNavItems;
  const logout = useLogout();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  const handleLogout = () => {
    setUserMenuOpen(false);
    logout.mutate(undefined, {
      onSettled: () => (window.location.href = "/login"),
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ── Logo ──────────────────────────────────────────────────────── */}
        <Link to="/dashboard" className="flex-shrink-0">
          <img
            src={Logo}
            alt="FinWit Kids"
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* ── Desktop nav ───────────────────────────────────────────────── */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ name, href, icon: Icon }) => {
            const isActive = location.pathname.startsWith(href);
            return (
              <Link
                key={name}
                to={href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-[#2CA4A4]/10 text-[#2CA4A4]"
                      : "text-gray-500 hover:bg-gray-100 hover:text-[#2F3E3E]"
                  }`}
              >
                <Icon size={15} />
                {name}
              </Link>
            );
          })}
        </nav>

        {/* ── Learner switcher (parent only) ────────────────────────────── */}
        {(isParent || isAdmin) && <LearnerSwitcher />}

        {/* ── Right actions ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          {/* Notification bell placeholder */}
          <button
            aria-label="Notifications"
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-[#2F3E3E] transition-colors"
          >
            <Bell size={17} />
          </button>

          {/* User menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen((o) => !o)}
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-[#2F3E3E] shadow-sm hover:border-[#2CA4A4]/40 hover:shadow transition-all duration-200"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2CA4A4] text-xs font-bold text-white">
                {initials}
              </span>
              <span className="hidden sm:block max-w-[120px] truncate">
                {user?.name ?? "Account"}
              </span>
              <ChevronDown
                size={13}
                className={`text-gray-400 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-gray-100 bg-white shadow-xl overflow-hidden z-50">
                {/* User info */}
                <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#2CA4A4] text-sm font-bold text-white">
                    {initials}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#2F3E3E]">
                      {user?.name}
                    </p>
                    <p className="truncate text-xs text-gray-400">
                      {user?.email}
                    </p>
                  </div>
                </div>

                {/* Links */}
                <div className="py-1">
                  <Link
                    to="/dashboard/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#2F3E3E] hover:bg-[#FAF7F2] transition-colors"
                  >
                    <Settings size={14} className="text-gray-400" />
                    Account settings
                  </Link>
                </div>

                <div className="border-t border-gray-100 py-1">
                  <button
                    onClick={handleLogout}
                    disabled={logout.isPending}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    <LogOut size={14} />
                    {logout.isPending ? "Signing out…" : "Sign out"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile nav ──────────────────────────────────────────────────── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {navItems.map(({ name, href, icon: Icon }) => {
            const isActive = location.pathname.startsWith(href);
            return (
              <Link
                key={name}
                to={href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-[#2CA4A4]/10 text-[#2CA4A4] border-l-4 border-[#2CA4A4]"
                      : "text-[#2F3E3E] hover:bg-[#FAF7F2]"
                  }`}
              >
                <Icon
                  size={18}
                  className={isActive ? "text-[#2CA4A4]" : "text-gray-400"}
                />
                {name}
              </Link>
            );
          })}
          <div className="border-t border-gray-100 pt-2 mt-2">
            <button
              onClick={handleLogout}
              disabled={logout.isPending}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <LogOut size={18} />
              {logout.isPending ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
