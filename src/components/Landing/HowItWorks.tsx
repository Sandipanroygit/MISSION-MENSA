import React from "react";
import {
  User,
  Smile,
  GraduationCap,
  Plus,
} from "lucide-react";
const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      icon: User,
      title: "Insights & Blog",
      description:
        "Research, field notes, and reflections from the programme team.",
      color: "from-[#2CA4A4] to-[#5EC1E8]",
      bgColor: "bg-gradient-to-br from-[#2CA4A4] to-[#5EC1E8]",
      hoverColor: "group-hover:from-[#5EC1E8] group-hover:to-[#2CA4A4]",
      textColor: "text-white",
    },
    {
      icon: Smile,
      title: "Project Plan",
      description:
        "Live roadmap showing phases, milestones, and ownership.",
      color: "from-[#FFC94B] to-[#A5C85A]",
      bgColor: "bg-gradient-to-br from-[#FFC94B] to-[#FBBF24]",
      hoverColor: "group-hover:from-[#FBBF24] group-hover:to-[#FFC94B]",
      textColor: "text-white",
    },
    {
      icon: GraduationCap,
      title: "Discussions",
      description:
        "An open forum to share experiences, challenges, and ideas.",
      color: "from-[#8B5FBF] to-[#2CA4A4]",
      bgColor: "bg-gradient-to-br from-[#8B5FBF] to-[#A855F7]",
      hoverColor: "group-hover:from-[#A855F7] group-hover:to-[#8B5FBF]",
      textColor: "text-white",
    },
  ];

  return (
    <section className="py-20 bg-[#FAF7F2] relative overflow-hidden">
      {/* Animated SVG Background - Spans Entire Component */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 900"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Enhanced Gradient definitions */}
            <linearGradient
              id="quoteGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#2CA4A4", stopOpacity: 0.45 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#5EC1E8", stopOpacity: 0.35 }}
              />
            </linearGradient>
            <linearGradient id="stepGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop
                offset="0%"
                style={{ stopColor: "#FFC94B", stopOpacity: 0.4 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#A5C85A", stopOpacity: 0.35 }}
              />
            </linearGradient>
            <linearGradient
              id="testimonialGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#8B5FBF", stopOpacity: 0.4 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#A855F7", stopOpacity: 0.3 }}
              />
            </linearGradient>
            <radialGradient id="glowTeal" cx="50%" cy="50%">
              <stop
                offset="0%"
                style={{ stopColor: "#2CA4A4", stopOpacity: 0.3 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#2CA4A4", stopOpacity: 0 }}
              />
            </radialGradient>
            <radialGradient id="glowYellow" cx="50%" cy="50%">
              <stop
                offset="0%"
                style={{ stopColor: "#FFC94B", stopOpacity: 0.25 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#FFC94B", stopOpacity: 0 }}
              />
            </radialGradient>
            <radialGradient id="glowPurple" cx="50%" cy="50%">
              <stop
                offset="0%"
                style={{ stopColor: "#8B5FBF", stopOpacity: 0.25 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#8B5FBF", stopOpacity: 0 }}
              />
            </radialGradient>
          </defs>

          {/* Large decorative quote marks */}
          <g opacity="0.35">
            <text
              x="120"
              y="180"
              fontSize="160"
              fill="#2CA4A4"
              fontFamily="Georgia, serif"
              fontWeight="bold"
            >
              "
              <animate
                attributeName="opacity"
                values="0.2;0.5;0.2"
                dur="6s"
                repeatCount="indefinite"
              />
            </text>
            <text
              x="1020"
              y="765"
              fontSize="160"
              fill="#5EC1E8"
              fontFamily="Georgia, serif"
              fontWeight="bold"
            >
              "
              <animate
                attributeName="opacity"
                values="0.2;0.5;0.2"
                dur="7s"
                repeatCount="indefinite"
              />
            </text>
          </g>

          {/* Floating speech bubbles - Enhanced */}
          <g opacity="0.4">
            {[...Array(5)].map((_, i) => {
              const x = 180 + i * 250;
              const y = 540 + (i % 2) * 180;
              const dur = 6 + i;
              return (
                <g key={`bubble-${i}`}>
                  {/* Speech bubble body */}
                  <ellipse
                    cx={x}
                    cy={y}
                    rx="50"
                    ry="40"
                    fill="url(#quoteGradient)"
                    stroke="#2CA4A4"
                    strokeWidth="2"
                  >
                    <animate
                      attributeName="cy"
                      values={`${y}; ${y - 60}; ${y}`}
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="rx"
                      values="50;55;50"
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                    />
                  </ellipse>
                  {/* Speech bubble tail */}
                  <path
                    d={`M ${x - 15} ${y + 30} L ${x - 25} ${y + 50} L ${
                      x - 10
                    } ${y + 35}`}
                    fill="url(#quoteGradient)"
                    stroke="#2CA4A4"
                    strokeWidth="1.5"
                  >
                    <animate
                      attributeName="d"
                      values={`M ${x - 15} ${y + 30} L ${x - 25} ${y + 50} L ${
                        x - 10
                      } ${y + 35}; M ${x - 15} ${y - 30} L ${x - 25} ${
                        y - 10
                      } L ${x - 10} ${y - 25}; M ${x - 15} ${y + 30} L ${
                        x - 25
                      } ${y + 50} L ${x - 10} ${y + 35}`}
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                    />
                  </path>
                  {/* Mini dots inside bubble */}
                  <circle cx={x - 15} cy={y} r="3" fill="#2CA4A4">
                    <animate
                      attributeName="opacity"
                      values="0.3;0.8;0.3"
                      dur={`${dur * 0.5}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx={x} cy={y} r="3" fill="#2CA4A4">
                    <animate
                      attributeName="opacity"
                      values="0.3;0.8;0.3"
                      dur={`${dur * 0.5}s`}
                      begin="0.2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx={x + 15} cy={y} r="3" fill="#2CA4A4">
                    <animate
                      attributeName="opacity"
                      values="0.3;0.8;0.3"
                      dur={`${dur * 0.5}s`}
                      begin="0.4s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              );
            })}
          </g>

          {/* Vibrant rotating stars */}
          {[...Array(18)].map((_, i) => {
            const colors = [
              "#FFC94B",
              "#5EC1E8",
              "#A5C85A",
              "#EC4899",
              "#8B5FBF",
              "#2CA4A4",
            ];
            const color = colors[i % colors.length];
            const cx = (i * 120 + 60) % 1140;
            const cy = (i * 78 + 90) % 810;
            const size = 8 + (i % 3) * 4;
            const dur = 4 + (i % 3);
            return (
              <g key={`star-${i}`} opacity="0.5">
                <polygon
                  points={`${cx},${cy - size} ${cx + size * 0.3},${
                    cy - size * 0.3
                  } ${cx + size},${cy} ${cx + size * 0.3},${
                    cy + size * 0.3
                  } ${cx},${cy + size} ${cx - size * 0.3},${cy + size * 0.3} ${
                    cx - size
                  },${cy} ${cx - size * 0.3},${cy - size * 0.3}`}
                  fill={color}
                  stroke={color}
                  strokeWidth="1"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from={`0 ${cx} ${cy}`}
                    to={`360 ${cx} ${cy}`}
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.3;0.8;0.3"
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                </polygon>
              </g>
            );
          })}

          {/* Enhanced glowing orbs */}
          <circle cx="300" cy="225" r="110" fill="url(#glowTeal)">
            <animate
              attributeName="r"
              values="110;140;110"
              dur="6s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.8;1;0.8"
              dur="6s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="900" cy="630" r="100" fill="url(#glowYellow)">
            <animate
              attributeName="r"
              values="100;130;100"
              dur="7s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="150" cy="700" r="90" fill="url(#glowPurple)">
            <animate
              attributeName="r"
              values="90;115;90"
              dur="8s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="1050" cy="200" r="85" fill="#A5C85A" opacity="0.2">
            <animate
              attributeName="r"
              values="85;110;85"
              dur="6.5s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Floating hearts - Enhanced */}
          {[...Array(8)].map((_, i) => {
            const x = (i * 216 + 144) % 1080;
            const y = 450 + (i % 3) * 135;
            const dur = 8 + i;
            return (
              <g key={`heart-${i}`} opacity="0.45">
                <path
                  d={`M ${x} ${y + 15} C ${x} ${y} ${x - 15} ${y - 15} ${
                    x - 15
                  } ${y - 15} C ${x - 15} ${y - 24} ${x - 6} ${y - 30} ${x} ${
                    y - 24
                  } C ${x + 6} ${y - 30} ${x + 15} ${y - 24} ${x + 15} ${
                    y - 15
                  } C ${x + 15} ${y - 15} ${x} ${y} ${x} ${y + 15} Z`}
                  fill="#EC4899"
                  stroke="#EC4899"
                  strokeWidth="1.5"
                >
                  <animate
                    attributeName="opacity"
                    values="0.3;0.7;0.3"
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values={`0,0; 0,-300; 0,0`}
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                  <animateTransform
                    attributeName="transform"
                    type="scale"
                    values="1;1.3;1"
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                    additive="sum"
                  />
                </path>
              </g>
            );
          })}

          {/* Vibrant wavy lines */}
          <path
            d="M 0,450 Q 300,400 600,450 T 1200,450"
            stroke="#2CA4A4"
            strokeWidth="3"
            fill="none"
            opacity="0.35"
            strokeDasharray="10,10"
          >
            <animate
              attributeName="d"
              values="M 0,450 Q 300,400 600,450 T 1200,450; M 0,450 Q 300,500 600,450 T 1200,450; M 0,450 Q 300,400 600,450 T 1200,450"
              dur="8s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="20"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
          <path
            d="M 0,630 Q 300,580 600,630 T 1200,630"
            stroke="#5EC1E8"
            strokeWidth="3"
            fill="none"
            opacity="0.35"
            strokeDasharray="10,10"
          >
            <animate
              attributeName="d"
              values="M 0,630 Q 300,580 600,630 T 1200,630; M 0,630 Q 300,680 600,630 T 1200,630; M 0,630 Q 300,580 600,630 T 1200,630"
              dur="10s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="20"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
          <path
            d="M 0,200 Q 200,150 400,200 T 800,200 T 1200,200"
            stroke="#A5C85A"
            strokeWidth="2.5"
            fill="none"
            opacity="0.3"
            strokeDasharray="8,8"
          >
            <animate
              attributeName="d"
              values="M 0,200 Q 200,150 400,200 T 800,200 T 1200,200; M 0,200 Q 200,250 400,200 T 800,200 T 1200,200; M 0,200 Q 200,150 400,200 T 800,200 T 1200,200"
              dur="9s"
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

          {/* Enhanced thumbs up icons */}
          {[...Array(6)].map((_, i) => {
            const x = (i * 420 + 180) % 960;
            const y = (i * 225 + 180) % 720;
            const dur = 6 + i * 0.5;
            return (
              <g key={`thumb-${i}`} opacity="0.4">
                <rect
                  x={x}
                  y={y}
                  width="18"
                  height="28"
                  rx="4"
                  fill="#FFC94B"
                  stroke="#FFC94B"
                  strokeWidth="1.5"
                >
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values={`0,15; 0,-15; 0,15`}
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.4;0.8;0.4"
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                </rect>
                <rect
                  x={x - 8}
                  y={y - 5}
                  width="14"
                  height="14"
                  rx="7"
                  fill="#FFC94B"
                  stroke="#FFC94B"
                  strokeWidth="1.5"
                >
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values={`0,15; 0,-15; 0,15`}
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.4;0.8;0.4"
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                </rect>
              </g>
            );
          })}

          {/* Enhanced circular dots pattern - Multiple rings */}
          {[...Array(20)].map((_, i) => {
            const angle = (i * 18 * Math.PI) / 180;
            const cx = 600 + Math.cos(angle) * 280;
            const cy = 450 + Math.sin(angle) * 280;
            const dur = 8;
            return (
              <circle
                key={`dot-${i}`}
                cx={cx}
                cy={cy}
                r="4"
                fill="#8B5FBF"
                opacity="0.4"
              >
                <animate
                  attributeName="r"
                  values="4;8;4"
                  dur={`${dur}s`}
                  begin={`${i * 0.4}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.3;0.7;0.3"
                  dur={`${dur}s`}
                  begin={`${i * 0.4}s`}
                  repeatCount="indefinite"
                />
              </circle>
            );
          })}

          {/* Inner ring of dots */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const cx = 600 + Math.cos(angle) * 150;
            const cy = 450 + Math.sin(angle) * 150;
            return (
              <circle
                key={`inner-dot-${i}`}
                cx={cx}
                cy={cy}
                r="5"
                fill="#2CA4A4"
                opacity="0.45"
              >
                <animate
                  attributeName="r"
                  values="5;9;5"
                  dur="6s"
                  begin={`${i * 0.5}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.3;0.7;0.3"
                  dur="6s"
                  begin={`${i * 0.5}s`}
                  repeatCount="indefinite"
                />
              </circle>
            );
          })}

          {/* Sparkle crosses for extra vibrancy */}
          {[...Array(25)].map((_, i) => {
            const cx = (i * 73 + 50) % 1150;
            const cy = (i * 53 + 70) % 830;
            const dur = 2.5 + (i % 4) * 0.5;
            return (
              <g key={`sparkle-${i}`} opacity="0.5">
                <circle cx={cx} cy={cy} r="3" fill="#FFC94B">
                  <animate
                    attributeName="opacity"
                    values="0;1;0"
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="r"
                    values="3;6;3"
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                </circle>
                <line
                  x1={cx}
                  y1={cy - 10}
                  x2={cx}
                  y2={cy + 10}
                  stroke="#FFC94B"
                  strokeWidth="2"
                >
                  <animate
                    attributeName="opacity"
                    values="0;1;0"
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                </line>
                <line
                  x1={cx - 10}
                  y1={cy}
                  x2={cx + 10}
                  y2={cy}
                  stroke="#FFC94B"
                  strokeWidth="2"
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

          {/* Flowing arrows representing process/steps */}
          {[...Array(4)].map((_, i) => {
            const y = 250 + i * 150;
            const dur = 6 + i;
            return (
              <g key={`arrow-${i}`} opacity="0.4">
                <path
                  d={`M0,${y} L100,${y} M80,${y - 15} L100,${y} L80,${y + 15}`}
                  stroke="#A5C85A"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                >
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values={`0,0; 1200,0; 0,0`}
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0;0.8;0"
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                </path>
              </g>
            );
          })}

          {/* Additional decorative blurs - Enhanced */}
          <circle cx="120" cy="135" r="110" fill="#5EC1E8" opacity="0.15">
            <animate
              attributeName="r"
              values="110;140;110"
              dur="7s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="1080" cy="765" r="100" fill="#FFC94B" opacity="0.18">
            <animate
              attributeName="r"
              values="100;130;100"
              dur="6s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="600" cy="100" r="90" fill="#EC4899" opacity="0.12">
            <animate
              attributeName="r"
              values="90;115;90"
              dur="8s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* How It Works Section */}
        <div className="mb-20">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fadeInUp">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-wide text-[#d71912]">
              Explore Our Work
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3E3E] mb-6">
              Navigate the{" "}
              <span className="bg-gradient-to-r from-[#2CA4A4] to-[#5EC1E8] bg-clip-text text-transparent">
                programme
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#FFC94B] to-[#A5C85A] mx-auto rounded-full"></div>
          </div>

          {/* Steps Grid */}
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-12">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={step.title}
                  className={`group relative text-center animate-fadeInUp`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {/* Step card */}
                  <div
                    className={`relative ${step.bgColor} ${step.hoverColor} min-h-[20rem] rounded-lg p-8 shadow-xl shadow-[#234f12]/15 hover:shadow-2xl transition-all duration-700 transform hover:scale-105 hover:-translate-y-2 overflow-hidden cursor-pointer`}
                  >
                    <div className="absolute inset-x-0 top-0 h-1.5 bg-white/70 transition-all duration-500 group-hover:h-2.5" />
                    <div className="absolute right-5 top-5 font-serif text-7xl text-white/10 transition-all duration-500 group-hover:scale-110 group-hover:text-white/15">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    {/* Decorative pattern overlay */}
                    <div className="absolute inset-0 opacity-10">
                      <svg
                        className="w-full h-full"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <pattern
                            id={`step-pattern-${index}`}
                            x="0"
                            y="0"
                            width="50"
                            height="50"
                            patternUnits="userSpaceOnUse"
                          >
                            <circle
                              cx="10"
                              cy="10"
                              r="2"
                              fill="white"
                              opacity="0.4"
                            />
                            <circle
                              cx="30"
                              cy="20"
                              r="1.5"
                              fill="white"
                              opacity="0.3"
                            />
                            <circle
                              cx="20"
                              cy="35"
                              r="1"
                              fill="white"
                              opacity="0.5"
                            />
                            <circle
                              cx="40"
                              cy="40"
                              r="1.5"
                              fill="white"
                              opacity="0.3"
                            />
                            <path
                              d="M 5 45 L 15 45"
                              stroke="white"
                              strokeWidth="0.5"
                              opacity="0.2"
                            />
                            <path
                              d="M 25 10 L 35 10"
                              stroke="white"
                              strokeWidth="0.5"
                              opacity="0.2"
                            />
                          </pattern>
                        </defs>
                        <rect
                          width="100%"
                          height="100%"
                          fill={`url(#step-pattern-${index})`}
                        />
                      </svg>
                    </div>

                    {/* Animated sparkles */}
                    <div className="absolute top-4 right-4 opacity-30 group-hover:opacity-50 transition-opacity duration-500">
                      <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                      <div className="absolute top-1 left-2 w-1 h-1 bg-white rounded-full animate-pulse"></div>
                      <div className="absolute -top-1 left-1 w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                    </div>

                    {/* Icon container */}
                    <div className="relative w-16 h-16 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-7 mx-auto transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg">
                      <IconComponent className="w-10 h-10 text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />

                      {/* Pulsing ring on hover */}
                      <div className="absolute inset-0 border-4 border-white/40 rounded-lg opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500"></div>
                    </div>

                    {/* Content */}
                    <div className="space-y-4 relative z-10 text-left">
                      <p className="inline-flex rounded-full border border-white/30 px-3 py-1 text-xs font-semibold text-white/80">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3
                        className={`text-2xl font-bold ${step.textColor} drop-shadow-md group-hover:translate-x-1 transition-transform duration-300`}
                      >
                        {step.title}
                      </h3>
                      <p
                        className={`${step.textColor} opacity-90 group-hover:opacity-100 transition-opacity duration-300 leading-relaxed`}
                      >
                        {step.description}
                      </p>
                    </div>

                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>

                    {/* Floating decorative blurs */}
                    <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="absolute -top-3 -left-3 w-16 h-16 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  </div>

                  {/* Connection line (hidden on mobile, shown on desktop) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-20 left-full w-12 z-10">
                      <div className="flex items-center justify-center h-16">
                        <Plus className="w-6 h-6 text-[#2CA4A4] animate-pulse" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};

export default HowItWorksSection;
