import React from "react";
import Logo from "../../assets/missionmensa.png";
const Footer: React.FC = () => {
  return (
    <footer className="bg-[#FAF7F2] border-t border-gray-200 relative overflow-hidden">
      {/* Sleek Animated SVG Background - Footer Theme */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 400"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Gradient definitions */}
            <linearGradient id="footerTeal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop
                offset="0%"
                style={{ stopColor: "#2CA4A4", stopOpacity: 0.35 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#5EC1E8", stopOpacity: 0.25 }}
              />
            </linearGradient>
            <linearGradient id="footerYellow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop
                offset="0%"
                style={{ stopColor: "#FFC94B", stopOpacity: 0.35 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#A5C85A", stopOpacity: 0.25 }}
              />
            </linearGradient>
            <linearGradient id="footerPurple" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop
                offset="0%"
                style={{ stopColor: "#8B5FBF", stopOpacity: 0.3 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#A855F7", stopOpacity: 0.2 }}
              />
            </linearGradient>
            <radialGradient id="footerGlow" cx="50%" cy="50%">
              <stop
                offset="0%"
                style={{ stopColor: "#2CA4A4", stopOpacity: 0.2 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#2CA4A4", stopOpacity: 0 }}
              />
            </radialGradient>
          </defs>

          {/* Connection network representing community */}
          <g opacity="0.35">
            {[...Array(8)].map((_, i) => {
              const angle = (i * 45 * Math.PI) / 180;
              const cx = 600 + Math.cos(angle) * 180;
              const cy = 200 + Math.sin(angle) * 100;
              return (
                <g key={`network-${i}`}>
                  <circle cx={cx} cy={cy} r="5" fill="#2CA4A4">
                    <animate
                      attributeName="r"
                      values="5;8;5"
                      dur="5s"
                      begin={`${i * 0.6}s`}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.4;0.8;0.4"
                      dur="5s"
                      begin={`${i * 0.6}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                  {/* Connection lines */}
                  {i < 7 && (
                    <line
                      x1={cx}
                      y1={cy}
                      x2={600 + Math.cos(((i + 1) * 45 * Math.PI) / 180) * 180}
                      y2={200 + Math.sin(((i + 1) * 45 * Math.PI) / 180) * 100}
                      stroke="#2CA4A4"
                      strokeWidth="1.5"
                      opacity="0.4"
                    >
                      <animate
                        attributeName="stroke-dasharray"
                        values="0,150; 150,0"
                        dur="4s"
                        repeatCount="indefinite"
                      />
                    </line>
                  )}
                </g>
              );
            })}
          </g>

          {/* Social media icons floating */}
          <g opacity="0.4">
            {[...Array(6)].map((_, i) => {
              const x = 150 + i * 200;
              const y = 80 + (i % 2) * 50;
              const dur = 7 + i;
              return (
                <g key={`social-${i}`}>
                  {/* Social circle */}
                  <circle
                    cx={x}
                    cy={y}
                    r="18"
                    fill="url(#footerTeal)"
                    stroke="#2CA4A4"
                    strokeWidth="2"
                  >
                    <animate
                      attributeName="cy"
                      values={`${y}; ${y - 40}; ${y}`}
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="r"
                      values="18;22;18"
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                  {/* Like/heart icon inside */}
                  <path
                    d={`M${x},${y + 3} L${x - 4},${y - 2} L${x - 4},${y - 5} C${
                      x - 4
                    },${y - 7} ${x - 2},${y - 8} ${x},${y - 7} C${x + 2},${
                      y - 8
                    } ${x + 4},${y - 7} ${x + 4},${y - 5} L${x + 4},${y - 2} Z`}
                    fill="#2CA4A4"
                    opacity="0.6"
                  >
                    <animate
                      attributeName="d"
                      values={`M${x},${y + 3} L${x - 4},${y - 2} L${x - 4},${
                        y - 5
                      } C${x - 4},${y - 7} ${x - 2},${y - 8} ${x},${y - 7} C${
                        x + 2
                      },${y - 8} ${x + 4},${y - 7} ${x + 4},${y - 5} L${
                        x + 4
                      },${y - 2} Z; M${x},${y - 37} L${x - 4},${y - 42} L${
                        x - 4
                      },${y - 45} C${x - 4},${y - 47} ${x - 2},${y - 48} ${x},${
                        y - 47
                      } C${x + 2},${y - 48} ${x + 4},${y - 47} ${x + 4},${
                        y - 45
                      } L${x + 4},${y - 42} Z; M${x},${y + 3} L${x - 4},${
                        y - 2
                      } L${x - 4},${y - 5} C${x - 4},${y - 7} ${x - 2},${
                        y - 8
                      } ${x},${y - 7} C${x + 2},${y - 8} ${x + 4},${y - 7} ${
                        x + 4
                      },${y - 5} L${x + 4},${y - 2} Z`}
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                    />
                  </path>
                </g>
              );
            })}
          </g>

          {/* Navigation arrows representing links */}
          <g opacity="0.35">
            {[...Array(5)].map((_, i) => {
              const y = 150 + i * 60;
              const dur = 6 + i * 0.5;
              return (
                <g key={`nav-arrow-${i}`}>
                  <path
                    d={`M100,${y} L180,${y} M165,${y - 8} L180,${y} L165,${
                      y + 8
                    }`}
                    stroke="#A5C85A"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.5"
                  >
                    <animate
                      attributeName="opacity"
                      values="0;0.7;0"
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                    />
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values={`0,0; 100,0; 0,0`}
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                    />
                  </path>
                </g>
              );
            })}
          </g>

          {/* Document/page icons representing resources */}
          <g opacity="0.4">
            {[...Array(4)].map((_, i) => {
              const x = 900 + i * 80;
              const y = 120 + (i % 2) * 80;
              const dur = 8 + i;
              return (
                <g key={`doc-${i}`}>
                  {/* Document */}
                  <rect
                    x={x}
                    y={y}
                    width="35"
                    height="48"
                    rx="3"
                    fill="url(#footerYellow)"
                    stroke="#FFC94B"
                    strokeWidth="1.5"
                  >
                    <animate
                      attributeName="y"
                      values={`${y}; ${y - 30}; ${y}`}
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                    />
                  </rect>
                  {/* Lines on document */}
                  <line
                    x1={x + 8}
                    y1={y + 15}
                    x2={x + 27}
                    y2={y + 15}
                    stroke="#FFC94B"
                    strokeWidth="2"
                    opacity="0.6"
                  >
                    <animate
                      attributeName="y1"
                      values={`${y + 15}; ${y - 15}; ${y + 15}`}
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="y2"
                      values={`${y + 15}; ${y - 15}; ${y + 15}`}
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                    />
                  </line>
                  <line
                    x1={x + 8}
                    y1={y + 23}
                    x2={x + 27}
                    y2={y + 23}
                    stroke="#FFC94B"
                    strokeWidth="2"
                    opacity="0.6"
                  >
                    <animate
                      attributeName="y1"
                      values={`${y + 23}; ${y - 7}; ${y + 23}`}
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="y2"
                      values={`${y + 23}; ${y - 7}; ${y + 23}`}
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                    />
                  </line>
                  <line
                    x1={x + 8}
                    y1={y + 31}
                    x2={x + 27}
                    y2={y + 31}
                    stroke="#FFC94B"
                    strokeWidth="2"
                    opacity="0.6"
                  >
                    <animate
                      attributeName="y1"
                      values={`${y + 31}; ${y + 1}; ${y + 31}`}
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="y2"
                      values={`${y + 31}; ${y + 1}; ${y + 31}`}
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                    />
                  </line>
                </g>
              );
            })}
          </g>

          {/* Footer wave pattern */}
          <g opacity="0.3">
            <path
              d="M 0,320 Q 200,280 400,320 T 800,320 T 1200,320"
              stroke="#2CA4A4"
              strokeWidth="2.5"
              fill="none"
              strokeDasharray="8,8"
            >
              <animate
                attributeName="d"
                values="M 0,320 Q 200,280 400,320 T 800,320 T 1200,320; M 0,320 Q 200,360 400,320 T 800,320 T 1200,320; M 0,320 Q 200,280 400,320 T 800,320 T 1200,320"
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
            <path
              d="M 0,360 Q 300,340 600,360 T 1200,360"
              stroke="#5EC1E8"
              strokeWidth="2"
              fill="none"
              strokeDasharray="6,6"
              opacity="0.6"
            >
              <animate
                attributeName="d"
                values="M 0,360 Q 300,340 600,360 T 1200,360; M 0,360 Q 300,380 600,360 T 1200,360; M 0,360 Q 300,340 600,360 T 1200,360"
                dur="10s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="12"
                dur="2s"
                repeatCount="indefinite"
              />
            </path>
          </g>

          {/* Sparkle stars */}
          {[...Array(15)].map((_, i) => {
            const cx = (i * 95 + 50) % 1150;
            const cy = (i * 47 + 60) % 360;
            const dur = 2.5 + (i % 3) * 0.5;
            return (
              <g key={`sparkle-${i}`} opacity="0.45">
                <circle cx={cx} cy={cy} r="2.5" fill="#FFC94B">
                  <animate
                    attributeName="opacity"
                    values="0;1;0"
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="r"
                    values="2.5;4.5;2.5"
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                </circle>
                <line
                  x1={cx}
                  y1={cy - 7}
                  x2={cx}
                  y2={cy + 7}
                  stroke="#FFC94B"
                  strokeWidth="1.5"
                >
                  <animate
                    attributeName="opacity"
                    values="0;1;0"
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                </line>
                <line
                  x1={cx - 7}
                  y1={cy}
                  x2={cx + 7}
                  y2={cy}
                  stroke="#FFC94B"
                  strokeWidth="1.5"
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

          {/* Link chain icons representing connectivity */}
          {[...Array(4)].map((_, i) => {
            const x = 250 + i * 250;
            const y = 300;
            const dur = 7 + i;
            return (
              <g key={`link-${i}`} opacity="0.35">
                {/* First link */}
                <ellipse
                  cx={x - 8}
                  cy={y}
                  rx="10"
                  ry="14"
                  fill="none"
                  stroke="url(#footerPurple)"
                  strokeWidth="3"
                  transform={`rotate(-45 ${x - 8} ${y})`}
                >
                  <animate
                    attributeName="opacity"
                    values="0.4;0.8;0.4"
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                </ellipse>
                {/* Second link */}
                <ellipse
                  cx={x + 8}
                  cy={y}
                  rx="10"
                  ry="14"
                  fill="none"
                  stroke="url(#footerPurple)"
                  strokeWidth="3"
                  transform={`rotate(45 ${x + 8} ${y})`}
                >
                  <animate
                    attributeName="opacity"
                    values="0.4;0.8;0.4"
                    dur={`${dur}s`}
                    begin="0.5s"
                    repeatCount="indefinite"
                  />
                </ellipse>
              </g>
            );
          })}

          {/* Glowing orbs for ambiance */}
          <circle cx="150" cy="200" r="100" fill="url(#footerGlow)">
            <animate
              attributeName="r"
              values="100;125;100"
              dur="8s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="1050" cy="150" r="90" fill="#FFC94B" opacity="0.12">
            <animate
              attributeName="r"
              values="90;115;90"
              dur="7s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="600" cy="80" r="70" fill="#8B5FBF" opacity="0.1">
            <animate
              attributeName="r"
              values="70;90;70"
              dur="9s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Rising bubbles representing growth */}
          {[...Array(8)].map((_, i) => {
            const x = i * 150 + 75;
            const dur = 6 + (i % 3);
            return (
              <circle
                key={`bubble-${i}`}
                cx={x}
                cy="400"
                r="4"
                fill="#5EC1E8"
                opacity="0.4"
              >
                <animate
                  attributeName="cy"
                  values="400;-50;400"
                  dur={`${dur}s`}
                  begin={`${i * 0.8}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="r"
                  values="4;6;4"
                  dur={`${dur}s`}
                  begin={`${i * 0.8}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0;0.6;0"
                  dur={`${dur}s`}
                  begin={`${i * 0.8}s`}
                  repeatCount="indefinite"
                />
              </circle>
            );
          })}

          {/* Cross/plus icons representing connections */}
          {[...Array(6)].map((_, i) => {
            const x = 180 + i * 200;
            const y = 250 + (i % 2) * 50;
            const dur = 5 + i * 0.5;
            return (
              <g key={`plus-${i}`} opacity="0.4">
                <line
                  x1={x}
                  y1={y - 8}
                  x2={x}
                  y2={y + 8}
                  stroke="#A5C85A"
                  strokeWidth="2.5"
                >
                  <animate
                    attributeName="opacity"
                    values="0.3;0.7;0.3"
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from={`0 ${x} ${y}`}
                    to={`360 ${x} ${y}`}
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                </line>
                <line
                  x1={x - 8}
                  y1={y}
                  x2={x + 8}
                  y2={y}
                  stroke="#A5C85A"
                  strokeWidth="2.5"
                >
                  <animate
                    attributeName="opacity"
                    values="0.3;0.7;0.3"
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from={`0 ${x} ${y}`}
                    to={`360 ${x} ${y}`}
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                </line>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="mb-8">
          {/* Logo and Description */}
          <div className="animate-fadeInUp">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-[110px] flex items-center justify-center">
                <img src={Logo} alt="Mission MENSA Logo" className="block w-full h-auto object-contain" />
              </div>
              <span className="text-[#2F3E3E] font-bold text-lg">
                Mensa
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 mb-8"></div>

        {/* Bottom Section */}
        <div
          className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 animate-fadeInUp"
          style={{ animationDelay: "0.4s" }}
        >
          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="max-w-md text-sm text-[#2F3E3E]/60">
              Enter a learning ecosystem where human potential meets
              Artificial Intelligence designed to cultivate thinkers,
              innovators, and future nation-builders.
            </p>
          </div>

          {/* Additional Links */}
          <div className="flex space-x-6">
            <a
              href="#privacy"
              className="text-[#2F3E3E]/60 hover:text-[#2CA4A4] text-sm transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              className="text-[#2F3E3E]/60 hover:text-[#2CA4A4] text-sm transition-colors duration-200"
            >
              Terms of Service
            </a>
            <a
              href="#cookies"
              className="text-[#2F3E3E]/60 hover:text-[#2CA4A4] text-sm transition-colors duration-200"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out both;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
