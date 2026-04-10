import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Home,
  Info,
  MessageCircle,
  MessagesSquare,
  LayoutDashboard,
  ChevronDown,
  LogOut,
} from "lucide-react";
import Logo from "../../assets/missionmensa.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import { useLogout } from "@/hooks/useAuth";
// ─── User chip (avatar + dropdown) shown in the public header when logged in ──

const UserChip: React.FC = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const logout = useLogout();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-[#2CA4A4]/20 bg-white/80 px-3 py-1.5 text-sm font-medium text-[#2F3E3E] shadow-sm hover:border-[#2CA4A4]/40 transition-all duration-200"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2CA4A4] text-xs font-bold text-white">
          {initials}
        </span>
        <span className="hidden sm:block max-w-[120px] truncate">
          {user?.name ?? "Account"}
        </span>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-gray-100 bg-white shadow-xl z-50 overflow-hidden">
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="text-xs text-gray-400">Signed in as</p>
            <p className="truncate text-sm font-semibold text-[#2F3E3E]">
              {user?.email}
            </p>
          </div>
          <button
            onClick={() => {
              setOpen(false);
              navigate("/dashboard");
            }}
            className="flex w-full items-center gap-2.5 px-4 py-3 text-sm text-[#2F3E3E] hover:bg-[#FAF7F2] transition-colors"
          >
            <LayoutDashboard size={15} className="text-[#2CA4A4]" />
            Dashboard
          </button>
          <button
            onClick={() => {
              setOpen(false);
              logout.mutate(undefined, {
                onSettled: () => (window.location.href = "/login"),
              });
            }}
            className="flex w-full items-center gap-2.5 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Main Header ──────────────────────────────────────────────────────────────

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuthContext();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      // Update scrolled state for additional styling
      setIsScrolled(scrollPosition > 10);
      setIsHeaderHidden(scrollPosition > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mainNavItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "About Mensa", href: "/about-mensa", icon: Info },
    { name: "Feedback", href: "/voices-of-mensa", icon: MessagesSquare },
    { name: "Blogs", href: "/about-us", icon: Info },
    { name: "Discussion", href: "/programs", icon: MessageCircle },
    // { name: "Community", href: "/community", icon: Users },
  ];

  return (
    <header
      className={`sticky top-0 w-full z-50 transition-transform duration-300 ease-in-out ${
        isHeaderHidden && !isMenuOpen ? "-translate-y-full" : "translate-y-0"
      } ${
        isScrolled
          ? "bg-white/95 backdrop-blur-sm shadow-lg"
          : "bg-white/90 backdrop-blur-sm shadow-md"
      }`}
    >
      {/* Subtle Animated SVG Background - Non-obstructive */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Soft gradient definitions */}
            <linearGradient
              id="headerGradient1"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#2CA4A4", stopOpacity: 0.3 }}
              />
              <stop
                offset="50%"
                style={{ stopColor: "#5EC1E8", stopOpacity: 0.25 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#A5C85A", stopOpacity: 0.3 }}
              />
            </linearGradient>
            <linearGradient
              id="headerGradient2"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#FFC94B", stopOpacity: 0.25 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#8B5FBF", stopOpacity: 0.3 }}
              />
            </linearGradient>
            <radialGradient id="orbGradient1" cx="50%" cy="50%">
              <stop
                offset="0%"
                style={{ stopColor: "#2CA4A4", stopOpacity: 0.15 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#2CA4A4", stopOpacity: 0 }}
              />
            </radialGradient>
            <radialGradient id="orbGradient2" cx="50%" cy="50%">
              <stop
                offset="0%"
                style={{ stopColor: "#5EC1E8", stopOpacity: 0.15 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#5EC1E8", stopOpacity: 0 }}
              />
            </radialGradient>
          </defs>

          {/* Gentle wave patterns - more visible */}
          <path
            d="M0,50 Q250,30 500,50 T1000,50 T1500,50 T2000,50"
            fill="none"
            stroke="url(#headerGradient1)"
            strokeWidth="2"
            opacity="0.5"
          >
            <animate
              attributeName="d"
              values="M0,50 Q250,30 500,50 T1000,50 T1500,50 T2000,50;M0,50 Q250,70 500,50 T1000,50 T1500,50 T2000,50;M0,50 Q250,30 500,50 T1000,50 T1500,50 T2000,50"
              dur="8s"
              repeatCount="indefinite"
            />
          </path>
          <path
            d="M0,60 Q300,40 600,60 T1200,60 T1800,60 T2400,60"
            fill="none"
            stroke="url(#headerGradient2)"
            strokeWidth="2"
            opacity="0.4"
          >
            <animate
              attributeName="d"
              values="M0,60 Q300,40 600,60 T1200,60 T1800,60 T2400,60;M0,60 Q300,80 600,60 T1200,60 T1800,60 T2400,60;M0,60 Q300,40 600,60 T1200,60 T1800,60 T2400,60"
              dur="10s"
              repeatCount="indefinite"
            />
          </path>

          {/* Floating dots - larger and more visible */}
          {[...Array(12)].map((_, i) => {
            const colors = [
              "#2CA4A4",
              "#5EC1E8",
              "#FFC94B",
              "#A5C85A",
              "#8B5FBF",
            ];
            const color = colors[i % colors.length];
            const cx = (i * 8 + 5) % 100;
            const cy = 30 + (i % 3) * 20;
            const dur = 5 + (i % 4);
            return (
              <circle
                key={`dot-${i}`}
                cx={`${cx}%`}
                cy={`${cy}%`}
                r="2.5"
                fill={color}
                opacity="0.4"
              >
                <animate
                  attributeName="cy"
                  values={`${cy}%; ${cy - 20}%; ${cy}%`}
                  dur={`${dur}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.3;0.6;0.3"
                  dur={`${dur}s`}
                  repeatCount="indefinite"
                />
              </circle>
            );
          })}

          {/* Sparkle effects - more visible */}
          {[...Array(8)].map((_, i) => {
            const cx = (i * 12 + 8) % 95;
            const cy = 35 + (i % 3) * 15;
            const dur = 2.5 + (i % 2);
            return (
              <g key={`sparkle-${i}`} opacity="0.5">
                <circle cx={`${cx}%`} cy={`${cy}%`} r="1.5" fill="#FFC94B">
                  <animate
                    attributeName="opacity"
                    values="0;0.8;0"
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="r"
                    values="1;2.5;1"
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                </circle>
                {/* Sparkle cross */}
                <line
                  x1={`${cx}%`}
                  y1={`${cy - 3}%`}
                  x2={`${cx}%`}
                  y2={`${cy + 3}%`}
                  stroke="#FFC94B"
                  strokeWidth="0.5"
                >
                  <animate
                    attributeName="opacity"
                    values="0;0.8;0"
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                </line>
                <line
                  x1={`${cx - 3}%`}
                  y1={`${cy}%`}
                  x2={`${cx + 3}%`}
                  y2={`${cy}%`}
                  stroke="#FFC94B"
                  strokeWidth="0.5"
                >
                  <animate
                    attributeName="opacity"
                    values="0;0.8;0"
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                </line>
              </g>
            );
          })}

          {/* Gradient orbs - more visible */}
          <circle cx="10%" cy="50%" r="40" fill="url(#orbGradient1)">
            <animate
              attributeName="r"
              values="40;50;40"
              dur="6s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="90%" cy="50%" r="35" fill="url(#orbGradient2)">
            <animate
              attributeName="r"
              values="35;45;35"
              dur="7s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="50%" cy="60%" r="30" fill="#A5C85A" opacity="0.08">
            <animate
              attributeName="r"
              values="30;40;30"
              dur="8s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Drifting shapes - more visible */}
          <rect
            x="20%"
            y="40%"
            width="3"
            height="3"
            fill="#8B5FBF"
            opacity="0.3"
            rx="0.5"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 80,0; 0,0"
              dur="12s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 20 40; 180 20 40; 0 20 40"
              dur="8s"
              repeatCount="indefinite"
              additive="sum"
            />
          </rect>
          <rect
            x="70%"
            y="55%"
            width="3"
            height="3"
            fill="#A5C85A"
            opacity="0.3"
            rx="0.5"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; -60,0; 0,0"
              dur="15s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 70 55; -180 70 55; 0 70 55"
              dur="10s"
              repeatCount="indefinite"
              additive="sum"
            />
          </rect>

          {/* Small hearts */}
          {[...Array(3)].map((_, i) => {
            const cx = (i * 30 + 15) % 90;
            const dur = 8 + i * 2;
            return (
              <g key={`heart-${i}`} opacity="0.25">
                <path
                  d={`M${cx},45 L${cx + 2},47 L${cx + 4},45 L${cx + 4},43 Q${
                    cx + 4
                  },41 ${cx + 2},41 Q${cx},41 ${cx},43 Q${cx},41 ${
                    cx - 2
                  },41 Q${cx - 4},41 ${cx - 4},43 L${cx - 4},45 L${
                    cx - 2
                  },47 Z`}
                  fill="#EC4899"
                >
                  <animateTransform
                    attributeName="transform"
                    type="scale"
                    values="1;1.2;1"
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                    additive="sum"
                  />
                </path>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center min-h-18 py-2">
          {/* Logo - Left Side */}
          <Link to="/" className="flex-shrink-0">
            <div className="flex items-center space-x-2">
              <div className="w-[150px] sm:w-[180px] flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                <img
                  src={Logo}
                  alt="Mission MENSA Logo"
                  className="block w-full h-auto object-contain"
                />
              </div>
            </div>
          </Link>

          {/* Desktop Navigation - Center and Right */}
          <div className="hidden lg:flex items-center space-x-8 flex-1 justify-end">
            {/* Main Navigation Items */}
            <nav className="flex items-center space-x-1">
              {mainNavItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-1.5 font-medium transition-all duration-300 relative group whitespace-nowrap px-4 py-2.5 rounded-lg ${
                      isActive
                        ? "text-[#2CA4A4] bg-[#2CA4A4]/10"
                        : "text-[#2F3E3E] hover:text-[#2CA4A4] hover:bg-[#2CA4A4]/5"
                    }`}
                  >
                    <IconComponent
                      size={18}
                      className={`transition-all duration-300 ${
                        isActive ? "text-[#2CA4A4]" : "group-hover:scale-110"
                      }`}
                    />
                    <span className="text-sm">{item.name}</span>
                    <span
                      className={`absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-[#2CA4A4] to-[#5EC1E8] transition-transform duration-300 rounded-full ${
                        isActive
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    ></span>
                  </Link>
                );
              })}
            </nav>

            {/* Auth actions */}
            {isAuthenticated ? (
              <UserChip />
            ) : (
              <Link
                to="/login"
                className="bg-[#FFC94B] hover:bg-[#A5C85A] text-[#2F3E3E] font-semibold px-6 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-xl whitespace-nowrap text-sm"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="block lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#2F3E3E] hover:text-[#2CA4A4] transition-colors duration-200 p-2 rounded-lg hover:bg-[#2CA4A4]/5"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`block lg:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "max-h-[500px] opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="py-4 space-y-2 bg-white/95 backdrop-blur-sm rounded-2xl mt-2 shadow-xl border border-[#2CA4A4]/10">
            {/* Main Nav Items */}
            <div className="space-y-1">
              {mainNavItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 mx-2 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "text-[#2CA4A4] bg-[#2CA4A4]/10 border-l-4 border-[#2CA4A4]"
                        : "text-[#2F3E3E] hover:text-[#2CA4A4] hover:bg-[#FAF7F2] hover:translate-x-1"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <IconComponent
                      size={20}
                      className={`transition-transform duration-300 ${
                        isActive ? "text-[#2CA4A4]" : ""
                      }`}
                    />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-[#2CA4A4]/20 to-transparent mx-4"></div>

            {/* Mobile auth actions */}
            <div className="px-4 pt-2 space-y-2">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="w-full flex items-center justify-center gap-2 bg-[#2CA4A4] text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center bg-[#FFC94B] hover:bg-[#A5C85A] text-[#2F3E3E] font-semibold px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
