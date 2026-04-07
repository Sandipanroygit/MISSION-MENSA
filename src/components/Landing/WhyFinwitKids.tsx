import React, { useEffect, useRef, useState } from "react";
import { Bot, Brain, Network, GraduationCap } from "lucide-react";

const WhyFinwitKidsSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.2, // Trigger when 20% of the element is visible
        rootMargin: "0px 0px -50px 0px", // Start animation slightly before element is fully in view
      }
    );

    const currentRef = headerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const intelligenceComponents = [
    {
      icon: GraduationCap,
      title: "Human Intelligence",
      description:
        "Curiosity, judgement, values, creativity, and lived experience.",
      surface:
        "bg-[linear-gradient(145deg,#fff8e6_0%,#f7e9a7_52%,#ffd36a_100%)]",
      accent: "bg-gradient-to-r from-[#b96d00] via-[#FFC94B] to-[#ff8a00]",
      iconColor: "bg-[#8a4b00] text-[#fff8e6] shadow-[#8a4b00]/25",
      glow: "bg-[#FFC94B]/24",
      labelColor: "text-[#b96d00]",
      ringColor: "ring-[#f4d57a]/80",
    },
    {
      icon: Bot,
      title: "AI",
      description:
        "Pattern discovery, adaptive support, acceleration, and scale.",
      surface:
        "bg-[linear-gradient(145deg,#e9fbff_0%,#c8f3ff_54%,#8ee2f5_100%)]",
      accent: "bg-gradient-to-r from-[#036580] via-[#2CA4A4] to-[#5EC1E8]",
      iconColor: "bg-[#036580] text-[#e9fbff] shadow-[#036580]/25",
      glow: "bg-[#5EC1E8]/24",
      labelColor: "text-[#036580]",
      ringColor: "ring-[#9de8f6]/80",
    },
    {
      icon: Brain,
      title: "Personal AI Companion",
      description:
        "A learner-side partner that remembers context and supports growth.",
      surface:
        "bg-[linear-gradient(145deg,#f1f7ff_0%,#d8e8ff_52%,#b8d5ff_100%)]",
      accent: "bg-gradient-to-r from-[#234f12] via-[#5a8f20] to-[#A5C85A]",
      iconColor: "bg-[#234f12] text-[#f1f7ff] shadow-[#234f12]/25",
      glow: "bg-[#A5C85A]/24",
      labelColor: "text-[#4f7f17]",
      ringColor: "ring-[#c8df8a]/80",
    },
    {
      icon: Network,
      title: "Networked Intelligence",
      description:
        "Peers, mentors, institutions, and communities learning as a system.",
      surface:
        "bg-[linear-gradient(145deg,#fff0ec_0%,#ffd8cc_54%,#ffab92_100%)]",
      accent: "bg-gradient-to-r from-[#9d2711] via-[#ff4b21] to-[#ff9a70]",
      iconColor: "bg-[#9d2711] text-[#fff0ec] shadow-[#9d2711]/25",
      glow: "bg-[#ff4b21]/22",
      labelColor: "text-[#c1391a]",
      ringColor: "ring-[#ffbea9]/80",
    },
  ];
  return (
    <section className="py-20 bg-[#FAF7F2] relative overflow-hidden">
      {/* Sleek Animated SVG Background - Why Finwit Kids Theme */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Gradient definitions */}
            <linearGradient
              id="moduleGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#8B5FBF", stopOpacity: 0.35 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#5EC1E8", stopOpacity: 0.25 }}
              />
            </linearGradient>
            <linearGradient
              id="faithGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#FFC94B", stopOpacity: 0.4 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#A5C85A", stopOpacity: 0.3 }}
              />
            </linearGradient>
            <linearGradient
              id="familyGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#A855F7", stopOpacity: 0.35 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#C084FC", stopOpacity: 0.25 }}
              />
            </linearGradient>
            <linearGradient
              id="growthGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#10B981", stopOpacity: 0.35 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#34D399", stopOpacity: 0.25 }}
              />
            </linearGradient>
            <radialGradient id="glowPurple" cx="50%" cy="50%">
              <stop
                offset="0%"
                style={{ stopColor: "#8B5FBF", stopOpacity: 0.2 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#8B5FBF", stopOpacity: 0 }}
              />
            </radialGradient>
            <radialGradient id="glowYellow" cx="50%" cy="50%">
              <stop
                offset="0%"
                style={{ stopColor: "#FFC94B", stopOpacity: 0.15 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#FFC94B", stopOpacity: 0 }}
              />
            </radialGradient>
          </defs>

          {/* Floating books/modules representing modular learning */}
          <g opacity="0.4">
            {[...Array(6)].map((_, i) => {
              const x = i * 200 + 100;
              const y = 100 + (i % 3) * 250;
              const dur = 7 + i * 1.5;
              return (
                <g key={`book-${i}`}>
                  {/* Book cover */}
                  <rect
                    x={x}
                    y={y}
                    width="40"
                    height="55"
                    rx="2"
                    fill="url(#moduleGradient)"
                    stroke="#8B5FBF"
                    strokeWidth="1"
                  >
                    <animate
                      attributeName="y"
                      values={`${y}; ${y - 60}; ${y}`}
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                    />
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      values={`0 ${x + 20} ${y + 27.5}; -5 ${x + 20} ${
                        y + 27.5
                      }; 5 ${x + 20} ${y + 27.5}; 0 ${x + 20} ${y + 27.5}`}
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                    />
                  </rect>
                  {/* Book pages */}
                  <line
                    x1={x + 10}
                    y1={y + 15}
                    x2={x + 30}
                    y2={y + 15}
                    stroke="#8B5FBF"
                    strokeWidth="1"
                    opacity="0.5"
                  >
                    <animate
                      attributeName="y1"
                      values={`${y + 15}; ${y - 45}; ${y + 15}`}
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="y2"
                      values={`${y + 15}; ${y - 45}; ${y + 15}`}
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                    />
                  </line>
                  <line
                    x1={x + 10}
                    y1={y + 25}
                    x2={x + 30}
                    y2={y + 25}
                    stroke="#8B5FBF"
                    strokeWidth="1"
                    opacity="0.5"
                  >
                    <animate
                      attributeName="y1"
                      values={`${y + 25}; ${y - 35}; ${y + 25}`}
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="y2"
                      values={`${y + 25}; ${y - 35}; ${y + 25}`}
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                    />
                  </line>
                </g>
              );
            })}
          </g>

          {/* Glowing crosses representing Christian values */}
          <g opacity="0.35">
            {[...Array(4)].map((_, i) => {
              const x = i * 300 + 150;
              const y = 200 + (i % 2) * 350;
              const dur = 6 + i;
              return (
                <g key={`cross-${i}`}>
                  {/* Vertical bar */}
                  <rect
                    x={x - 3}
                    y={y - 25}
                    width="6"
                    height="50"
                    rx="2"
                    fill="url(#faithGradient)"
                  >
                    <animate
                      attributeName="opacity"
                      values="0.3;0.7;0.3"
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                    />
                  </rect>
                  {/* Horizontal bar */}
                  <rect
                    x={x - 18}
                    y={y - 3}
                    width="36"
                    height="6"
                    rx="2"
                    fill="url(#faithGradient)"
                  >
                    <animate
                      attributeName="opacity"
                      values="0.3;0.7;0.3"
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                    />
                  </rect>
                  {/* Glow effect */}
                  <circle cx={x} cy={y} r="30" fill="#FFC94B" opacity="0.1">
                    <animate
                      attributeName="r"
                      values="30;40;30"
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              );
            })}
          </g>

          {/* Connected hearts representing parent-child bond */}
          <g opacity="0.4">
            {[...Array(3)].map((_, i) => {
              const x1 = 200 + i * 400;
              const y1 = 150 + i * 200;
              const x2 = x1 + 50;
              const y2 = y1 + 30;
              const dur = 8 + i;
              return (
                <g key={`hearts-${i}`}>
                  {/* Parent heart (larger) */}
                  <path
                    d={`M ${x1} ${y1 + 15} C ${x1} ${y1 + 8} ${x1 - 8} ${y1} ${
                      x1 - 15
                    } ${y1} C ${x1 - 22} ${y1} ${x1 - 30} ${y1 + 8} ${
                      x1 - 30
                    } ${y1 + 15} C ${x1 - 30} ${y1 + 28} ${x1} ${
                      y1 + 40
                    } ${x1} ${y1 + 40} C ${x1} ${y1 + 40} ${x1 + 30} ${
                      y1 + 28
                    } ${x1 + 30} ${y1 + 15} C ${x1 + 30} ${y1 + 8} ${
                      x1 + 22
                    } ${y1} ${x1 + 15} ${y1} C ${x1 + 8} ${y1} ${x1} ${
                      y1 + 8
                    } ${x1} ${y1 + 15}`}
                    fill="url(#familyGradient)"
                  >
                    <animate
                      attributeName="opacity"
                      values="0.4;0.8;0.4"
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                    />
                    <animateTransform
                      attributeName="transform"
                      type="scale"
                      values="1;1.1;1"
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                      additive="sum"
                    />
                  </path>
                  {/* Child heart (smaller) */}
                  <path
                    d={`M ${x2} ${y2 + 10} C ${x2} ${y2 + 5} ${x2 - 5} ${y2} ${
                      x2 - 10
                    } ${y2} C ${x2 - 15} ${y2} ${x2 - 20} ${y2 + 5} ${
                      x2 - 20
                    } ${y2 + 10} C ${x2 - 20} ${y2 + 18} ${x2} ${
                      y2 + 26
                    } ${x2} ${y2 + 26} C ${x2} ${y2 + 26} ${x2 + 20} ${
                      y2 + 18
                    } ${x2 + 20} ${y2 + 10} C ${x2 + 20} ${y2 + 5} ${
                      x2 + 15
                    } ${y2} ${x2 + 10} ${y2} C ${x2 + 5} ${y2} ${x2} ${
                      y2 + 5
                    } ${x2} ${y2 + 10}`}
                    fill="url(#familyGradient)"
                  >
                    <animate
                      attributeName="opacity"
                      values="0.4;0.8;0.4"
                      dur={`${dur}s`}
                      begin="0.5s"
                      repeatCount="indefinite"
                    />
                    <animateTransform
                      attributeName="transform"
                      type="scale"
                      values="1;1.15;1"
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                      additive="sum"
                    />
                  </path>
                  {/* Connection line */}
                  <line
                    x1={x1 + 15}
                    y1={y1 + 20}
                    x2={x2 - 10}
                    y2={y2 + 10}
                    stroke="#A855F7"
                    strokeWidth="2"
                    opacity="0.3"
                    strokeDasharray="4,4"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="0"
                      to="8"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  </line>
                </g>
              );
            })}
          </g>

          {/* Growth arrows and trees representing age progression */}
          <g opacity="0.35">
            {[...Array(4)].map((_, i) => {
              const x = 150 + i * 280;
              const y = 600;
              const dur = 5 + i * 0.5;
              const treeHeight = 30 + i * 15;
              return (
                <g key={`growth-${i}`}>
                  {/* Tree trunk */}
                  <rect
                    x={x - 4}
                    y={y - treeHeight}
                    width="8"
                    height={treeHeight * 0.5}
                    fill="#A5C85A"
                    opacity="0.6"
                  />
                  {/* Tree foliage */}
                  <circle
                    cx={x}
                    cy={y - treeHeight}
                    r={10 + i * 3}
                    fill="url(#growthGradient)"
                  >
                    <animate
                      attributeName="r"
                      values={`${10 + i * 3};${12 + i * 3};${10 + i * 3}`}
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                  {/* Growth arrow */}
                  <path
                    d={`M${x + 25},${y - 10} L${x + 25},${
                      y - treeHeight + 10
                    } L${x + 20},${y - treeHeight + 15} M${x + 25},${
                      y - treeHeight + 10
                    } L${x + 30},${y - treeHeight + 15}`}
                    stroke="#10B981"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.5"
                  >
                    <animate
                      attributeName="opacity"
                      values="0.2;0.7;0.2"
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                    />
                  </path>
                </g>
              );
            })}
          </g>

          {/* Floating graduation caps representing learning */}
          <g opacity="0.4">
            {[...Array(5)].map((_, i) => {
              const x = 100 + i * 250;
              const y = 450 + (i % 2) * 100;
              const dur = 9 + i * 0.8;
              return (
                <g key={`cap-${i}`}>
                  {/* Cap top */}
                  <path
                    d={`M${x - 20},${y} L${x + 20},${y} L${x + 15},${y - 8} L${
                      x - 15
                    },${y - 8} Z`}
                    fill="url(#moduleGradient)"
                    stroke="#8B5FBF"
                    strokeWidth="1"
                  >
                    <animate
                      attributeName="y"
                      values={`${y}; ${y - 50}; ${y}`}
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                    />
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      values={`0 ${x} ${y}; 10 ${x} ${y}; -10 ${x} ${y}; 0 ${x} ${y}`}
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                    />
                  </path>
                  {/* Cap tassel */}
                  <line
                    x1={x}
                    y1={y - 8}
                    x2={x}
                    y2={y + 5}
                    stroke="#8B5FBF"
                    strokeWidth="1.5"
                  >
                    <animate
                      attributeName="y1"
                      values={`${y - 8}; ${y - 58}; ${y - 8}`}
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="y2"
                      values={`${y + 5}; ${y - 45}; ${y + 5}`}
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                    />
                  </line>
                  <circle cx={x} cy={y + 5} r="3" fill="#8B5FBF">
                    <animate
                      attributeName="cy"
                      values={`${y + 5}; ${y - 45}; ${y + 5}`}
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              );
            })}
          </g>

          {/* Animated puzzle pieces representing modular approach */}
          {[...Array(8)].map((_, i) => {
            const x = 50 + ((i * 140) % 1100);
            const y = 50 + Math.floor(i / 8) * 150;
            const dur = 6 + (i % 3);
            return (
              <g key={`puzzle-${i}`} opacity="0.3">
                <path
                  d={`M${x},${y} h20 a5,5 0 0 1 0,10 h-20 a5,5 0 0 1 0,-10 z`}
                  fill="#2CA4A4"
                >
                  <animate
                    attributeName="opacity"
                    values="0.2;0.5;0.2"
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values={`0 ${x + 10} ${y + 5}; 15 ${x + 10} ${y + 5}; -15 ${
                      x + 10
                    } ${y + 5}; 0 ${x + 10} ${y + 5}`}
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                </path>
              </g>
            );
          })}

          {/* Glowing orbs for ambiance */}
          <circle cx="150" cy="200" r="120" fill="url(#glowPurple)">
            <animate
              attributeName="r"
              values="120;150;120"
              dur="8s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="1000" cy="500" r="100" fill="url(#glowYellow)">
            <animate
              attributeName="r"
              values="100;130;100"
              dur="9s"
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx="600"
            cy="150"
            r="80"
            fill="url(#glowPurple)"
            opacity="0.5"
          >
            <animate
              attributeName="r"
              values="80;100;80"
              dur="7s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Sparkle stars scattered */}
          {[...Array(20)].map((_, i) => {
            const cx = (i * 73 + 40) % 1160;
            const cy = (i * 47 + 60) % 740;
            const dur = 2.5 + (i % 4) * 0.5;
            return (
              <g key={`star-${i}`} opacity="0.4">
                <circle cx={cx} cy={cy} r="2.5" fill="#FFC94B">
                  <animate
                    attributeName="opacity"
                    values="0;1;0"
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="r"
                    values="2.5;4;2.5"
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                </circle>
                <line
                  x1={cx}
                  y1={cy - 6}
                  x2={cx}
                  y2={cy + 6}
                  stroke="#FFC94B"
                  strokeWidth="1"
                >
                  <animate
                    attributeName="opacity"
                    values="0;1;0"
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                </line>
                <line
                  x1={cx - 6}
                  y1={cy}
                  x2={cx + 6}
                  y2={cy}
                  stroke="#FFC94B"
                  strokeWidth="1"
                >
                  <animate
                    attributeName="opacity"
                    values="0;1;0"
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                </line>
              </g>
            );
          })}

          {/* Curved connecting paths representing learning journey */}
          <path
            d="M 0,400 Q 200,350 400,400 T 800,400 T 1200,400"
            stroke="#2CA4A4"
            strokeWidth="2"
            fill="none"
            opacity="0.25"
            strokeDasharray="8,8"
          >
            <animate
              attributeName="d"
              values="M 0,400 Q 200,350 400,400 T 800,400 T 1200,400; M 0,400 Q 200,450 400,400 T 800,400 T 1200,400; M 0,400 Q 200,350 400,400 T 800,400 T 1200,400"
              dur="10s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="16"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
          <path
            d="M 0,300 Q 300,250 600,300 T 1200,300"
            stroke="#A855F7"
            strokeWidth="2"
            fill="none"
            opacity="0.25"
            strokeDasharray="8,8"
          >
            <animate
              attributeName="d"
              values="M 0,300 Q 300,250 600,300 T 1200,300; M 0,300 Q 300,350 600,300 T 1200,300; M 0,300 Q 300,250 600,300 T 1200,300"
              dur="12s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="16"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>

          {/* Clock hands representing age progression */}
          {[...Array(3)].map((_, i) => {
            const cx = 350 + i * 450;
            const cy = 650;
            const dur = 8 + i * 2;
            return (
              <g key={`clock-${i}`} opacity="0.3">
                <circle
                  cx={cx}
                  cy={cy}
                  r="25"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2"
                />
                <line
                  x1={cx}
                  y1={cy}
                  x2={cx}
                  y2={cy - 15}
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from={`0 ${cx} ${cy}`}
                    to={`360 ${cx} ${cy}`}
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                </line>
                <line
                  x1={cx}
                  y1={cy}
                  x2={cx + 10}
                  y2={cy}
                  stroke="#34D399"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from={`0 ${cx} ${cy}`}
                    to={`360 ${cx} ${cy}`}
                    dur={`${dur * 0.3}s`}
                    repeatCount="indefinite"
                  />
                </line>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-16">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-wide text-[#d71912]">
            Four Pillars of the Programme
          </p>
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 overflow-hidden transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <span
              className={`inline-block text-[#2F3E3E] hover:scale-110 transition-transform duration-300 cursor-pointer ${
                isVisible ? "animate-slideInLeft" : ""
              }`}
            >
              What we
            </span>{" "}
            <span
              className={`inline-block bg-gradient-to-r from-[#2CA4A4] to-[#5EC1E8] bg-clip-text text-transparent hover:from-[#5EC1E8] hover:to-[#2CA4A4] transition-all duration-500 hover:scale-110 cursor-pointer ${
                isVisible ? "animate-typewriter" : ""
              }`}
              style={{ animationDelay: "0.3s" }}
            >
              stand for
            </span>
          </h2>
          <div
            className={`w-24 h-1 bg-gradient-to-r from-[#FFC94B] to-[#A5C85A] mx-auto rounded-full transition-all duration-1000 ${
              isVisible
                ? "animate-expandWidth opacity-100"
                : "opacity-0 scale-x-0"
            }`}
          ></div>
        </div>

        <div className="group/collective relative mx-auto max-w-6xl">
          <div className="relative mx-auto flex min-h-[11rem] max-w-[26rem] flex-col items-center justify-center overflow-hidden rounded-full bg-[radial-gradient(circle_at_30%_25%,#A5C85A_0%,#24602f_46%,#123d22_100%)] px-8 py-7 text-center shadow-2xl shadow-[#234f12]/30 ring-8 ring-white/80 transition duration-700 group-hover/collective:scale-[1.03] group-hover/collective:ring-[#fff4d0]">
            <div className="absolute inset-0 rounded-full border border-[#d8fff9]/40" />
            <div className="absolute -left-8 -top-8 h-28 w-28 rounded-full bg-[#d8fff9]/25 blur-2xl" />
            <div className="absolute -bottom-10 right-2 h-32 w-32 rounded-full bg-[#FFC94B]/25 blur-2xl" />
            <p className="relative text-[10px] font-black uppercase tracking-[0.2em] text-[#FFC94B]">
              Mission MENSA
            </p>
            <h3 className="relative mt-2 font-serif text-2xl font-black leading-tight text-[#fff4d0] sm:text-3xl">
              Collective Intelligence
            </h3>
            <p className="relative mt-3 text-xs font-semibold leading-relaxed text-white/82 sm:text-sm">
              Four forces working as one learning system
            </p>
          </div>

          <div className="mt-8 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-stretch">
            {intelligenceComponents.map((component, index) => {
              const IconComponent = component.icon;
              return (
                <React.Fragment key={component.title}>
                  <div
                    className={`group/card relative flex min-h-[11.5rem] min-w-0 flex-col overflow-hidden rounded-lg border border-white/85 ${component.surface} p-3 shadow-xl shadow-[#234f12]/12 ring-1 ${component.ringColor} transition duration-700 hover:rotate-[-1.5deg] hover:scale-[1.02] hover:border-white hover:shadow-2xl hover:shadow-[#234f12]/20 sm:p-4 lg:h-full`}
                    style={{ animationDelay: `${index * 0.16}s` }}
                  >
                    <div className={`absolute inset-x-0 top-0 h-1.5 ${component.accent}`} />
                    <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full ${component.glow} blur-2xl transition duration-700 group-hover/card:scale-150`} />
                    <div className="absolute -bottom-10 left-4 h-24 w-24 rounded-full bg-white/28 blur-2xl transition duration-700 group-hover/card:scale-125" />
                    <div className="flex items-start gap-2.5">
                      <div className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${component.iconColor} shadow-lg transition duration-500 group-hover/card:rotate-6 group-hover/card:scale-110`}>
                        <div className="absolute inset-0 rounded-full border border-[#d8fff9]/35" />
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="relative min-w-0">
                        <p className={`text-[10px] font-black uppercase tracking-[0.14em] ${component.labelColor}`}>
                          Factor 0{index + 1}
                        </p>
                        <h3 className="mt-1 text-lg font-black leading-tight text-[#1c260f]">
                          {component.title}
                        </h3>
                      </div>
                    </div>
                    <p className="relative mt-3 text-sm leading-relaxed text-[#1c260f]/74">
                      {component.description}
                    </p>
                    <div className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-1000 group-hover/card:translate-x-[120%]" />
                  </div>
                  {index < intelligenceComponents.length - 1 ? (
                    <div className="flex items-center justify-center py-1 lg:py-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ff4b21] text-lg font-black text-white shadow-lg shadow-[#ff4b21]/25 ring-4 ring-white">
                        &times;
                      </div>
                    </div>
                  ) : null}
                </React.Fragment>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default WhyFinwitKidsSection;
