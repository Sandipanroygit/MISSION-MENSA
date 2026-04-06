import React from "react";

const NewsletterSection: React.FC = () => {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Sleek Animated SVG Background - Newsletter Theme */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Gradient definitions for sleek look */}
            <linearGradient
              id="mailGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#2CA4A4", stopOpacity: 0.4 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#5EC1E8", stopOpacity: 0.3 }}
              />
            </linearGradient>
            <linearGradient
              id="envelopeGradient"
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
                style={{ stopColor: "#A5C85A", stopOpacity: 0.35 }}
              />
            </linearGradient>
            <radialGradient id="glowNewsGradient" cx="50%" cy="50%">
              <stop
                offset="0%"
                style={{ stopColor: "#5EC1E8", stopOpacity: 0.25 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#5EC1E8", stopOpacity: 0 }}
              />
            </radialGradient>
            <radialGradient id="glowYellowGradient" cx="50%" cy="50%">
              <stop
                offset="0%"
                style={{ stopColor: "#FFC94B", stopOpacity: 0.2 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#FFC94B", stopOpacity: 0 }}
              />
            </radialGradient>
          </defs>

          {/* Floating envelopes */}
          <g opacity="0.4">
            {[...Array(5)].map((_, i) => {
              const x = i * 240 + 120;
              const y = 160 + (i % 3) * 200;
              const dur = 8 + i * 2;
              return (
                <g key={`envelope-${i}`}>
                  {/* Envelope body */}
                  <rect
                    x={x}
                    y={y}
                    width="50"
                    height="35"
                    rx="3"
                    fill="url(#envelopeGradient)"
                  >
                    <animate
                      attributeName="y"
                      values={`${y}; ${y - 80}; ${y}`}
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                    />
                  </rect>
                  {/* Envelope flap */}
                  <path
                    d={`M${x},${y} L${x + 25},${y + 17.5} L${x + 50},${y}`}
                    fill="url(#mailGradient)"
                    strokeWidth="2"
                  >
                    <animate
                      attributeName="d"
                      values={`M${x},${y} L${x + 25},${y + 17.5} L${
                        x + 50
                      },${y}; M${x},${y} L${x + 25},${y + 14} L${
                        x + 50
                      },${y}; M${x},${y} L${x + 25},${y + 17.5} L${
                        x + 50
                      },${y}`}
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                    />
                  </path>
                </g>
              );
            })}
          </g>

          {/* Animated email @ symbols */}
          <g opacity="0.35">
            {[...Array(4)].map((_, i) => {
              const x = i * 300 + 180;
              const y = 240 + (i % 2) * 320;
              const dur = 6 + i;
              return (
                <text
                  key={`at-${i}`}
                  x={x}
                  y={y}
                  fontSize="60"
                  fill="#2CA4A4"
                  fontWeight="bold"
                >
                  @
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from={`0 ${x} ${y}`}
                    to={`360 ${x} ${y}`}
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.2;0.5;0.2"
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                </text>
              );
            })}
          </g>

          {/* Notification bells */}
          {[...Array(3)].map((_, i) => {
            const x = i * 420 + 240;
            const y = 120 + i * 240;
            const dur = 5 + i;
            return (
              <g key={`bell-${i}`} opacity="0.4">
                {/* Bell shape */}
                <path
                  d={`M ${x} ${y + 20} Q ${x - 12} ${y} ${x - 12} ${y - 10} L ${
                    x - 12
                  } ${y - 16} Q ${x - 12} ${y - 24} ${x} ${y - 24} Q ${
                    x + 12
                  } ${y - 24} ${x + 12} ${y - 16} L ${x + 12} ${y - 10} Q ${
                    x + 12
                  } ${y} ${x} ${y + 20}`}
                  fill="#FFC94B"
                  strokeWidth="1"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values={`-10 ${x} ${y - 12}; 10 ${x} ${y - 12}; -10 ${x} ${
                      y - 12
                    }`}
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </path>
                {/* Bell clapper */}
                <circle cx={x} cy={y + 28} r="3" fill="#FFC94B" />
              </g>
            );
          })}

          {/* Flowing data streams (lines of dots) */}
          {[...Array(8)].map((_, i) => {
            const startX = i * 150;
            const dur = 4 + (i % 3);
            return (
              <g key={`stream-${i}`} opacity="0.5">
                {[...Array(6)].map((_, j) => (
                  <circle
                    key={`dot-${j}`}
                    cx={startX}
                    cy={j * 80}
                    r="3"
                    fill="#5EC1E8"
                  >
                    <animate
                      attributeName="cy"
                      values="-50;850;-50"
                      dur={`${dur}s`}
                      begin={`${j * 0.5}s`}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0;0.8;0"
                      dur={`${dur}s`}
                      begin={`${j * 0.5}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                ))}
              </g>
            );
          })}

          {/* Newsletter paper sheets */}
          <g opacity="0.35">
            {[...Array(3)].map((_, i) => {
              const x = i * 360 + 120;
              const y = 320 + (i % 2) * 160;
              const dur = 10 + i * 2;
              return (
                <g key={`paper-${i}`}>
                  <rect
                    x={x}
                    y={y}
                    width="45"
                    height="60"
                    rx="3"
                    fill="url(#mailGradient)"
                    stroke="#2CA4A4"
                    strokeWidth="1"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values={`0,0; 200,-80; 0,0`}
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                    />
                  </rect>
                  {/* Lines on paper */}
                  <line
                    x1={x + 8}
                    y1={y + 15}
                    x2={x + 37}
                    y2={y + 15}
                    stroke="#2CA4A4"
                    strokeWidth="2"
                    opacity="0.6"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values={`0,0; 200,-80; 0,0`}
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                    />
                  </line>
                  <line
                    x1={x + 8}
                    y1={y + 25}
                    x2={x + 37}
                    y2={y + 25}
                    stroke="#2CA4A4"
                    strokeWidth="2"
                    opacity="0.6"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values={`0,0; 200,-80; 0,0`}
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                    />
                  </line>
                  <line
                    x1={x + 8}
                    y1={y + 35}
                    x2={x + 37}
                    y2={y + 35}
                    stroke="#2CA4A4"
                    strokeWidth="2"
                    opacity="0.6"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values={`0,0; 200,-80; 0,0`}
                      dur={`${dur}s`}
                      repeatCount="indefinite"
                    />
                  </line>
                </g>
              );
            })}
          </g>

          {/* Glowing orbs */}
          <circle cx="180" cy="240" r="100" fill="url(#glowNewsGradient)">
            <animate
              attributeName="r"
              values="100;130;100"
              dur="6s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="1020" cy="520" r="90" fill="url(#glowYellowGradient)">
            <animate
              attributeName="r"
              values="90;120;90"
              dur="7s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Connection nodes network */}
          <g opacity="0.3">
            {[...Array(6)].map((_, i) => {
              const angle = (i * 60 * Math.PI) / 180;
              const cx = 600 + Math.cos(angle) * 240;
              const cy = 400 + Math.sin(angle) * 240;
              return (
                <g key={`node-${i}`}>
                  <circle cx={cx} cy={cy} r="6" fill="#2CA4A4">
                    <animate
                      attributeName="r"
                      values="6;10;6"
                      dur="4s"
                      begin={`${i * 0.7}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                  {/* Connection lines */}
                  {i < 5 && (
                    <line
                      x1={cx}
                      y1={cy}
                      x2={600 + Math.cos(((i + 1) * 60 * Math.PI) / 180) * 240}
                      y2={400 + Math.sin(((i + 1) * 60 * Math.PI) / 180) * 240}
                      stroke="#2CA4A4"
                      strokeWidth="2"
                      opacity="0.5"
                    >
                      <animate
                        attributeName="stroke-dasharray"
                        values="0,200; 200,0"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </line>
                  )}
                </g>
              );
            })}
          </g>

          {/* Sparkle stars */}
          {[...Array(15)].map((_, i) => {
            const cx = (i * 96 + 60) % 1140;
            const cy = (i * 56 + 80) % 720;
            const dur = 2 + (i % 3);
            return (
              <g key={`star-sparkle-${i}`} opacity="0.5">
                <circle cx={cx} cy={cy} r="3" fill="#FFC94B">
                  <animate
                    attributeName="opacity"
                    values="0;1;0"
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="r"
                    values="3;5;3"
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                </circle>
                <line
                  x1={cx}
                  y1={cy - 8}
                  x2={cx}
                  y2={cy + 8}
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
                  x1={cx - 8}
                  y1={cy}
                  x2={cx + 8}
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

          {/* Send arrows */}
          {[...Array(5)].map((_, i) => {
            const y = 150 + i * 150;
            const dur = 5 + i;
            return (
              <g key={`arrow-${i}`} opacity="0.4">
                <path
                  d={`M0,${y} L120,${y} M100,${y - 12} L120,${y} L100,${
                    y + 12
                  }`}
                  stroke="#A5C85A"
                  strokeWidth="3"
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

          {/* Curved wave lines */}
          <path
            d="M 0,240 Q 300,200 600,240 T 1200,240"
            stroke="#2CA4A4"
            strokeWidth="2"
            fill="none"
            opacity="0.3"
            strokeDasharray="10,10"
          >
            <animate
              attributeName="d"
              values="M 0,240 Q 300,200 600,240 T 1200,240; M 0,240 Q 300,280 600,240 T 1200,240; M 0,240 Q 300,200 600,240 T 1200,240"
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
            d="M 0,560 Q 300,520 600,560 T 1200,560"
            stroke="#5EC1E8"
            strokeWidth="2"
            fill="none"
            opacity="0.3"
            strokeDasharray="10,10"
          >
            <animate
              attributeName="d"
              values="M 0,560 Q 300,520 600,560 T 1200,560; M 0,560 Q 300,600 600,560 T 1200,560; M 0,560 Q 300,520 600,560 T 1200,560"
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
        </svg>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Header */}
        <div className="mb-12 animate-fadeInUp">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3E3E] mb-6 leading-tight">
            A new paradigm of{" "}
            <span className="bg-gradient-to-r from-[#2CA4A4] to-[#5EC1E8] bg-clip-text text-transparent">
              AI-age education.
            </span>
          </h2>

          <div className="w-32 h-1 bg-gradient-to-r from-[#FFC94B] via-[#A5C85A] to-[#2CA4A4] mx-auto rounded-full"></div>
        </div>

        {/* Summary Panel */}
        <div className="animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-[#A5C85A]/10 to-[#2CA4A4]/10 border border-[#2CA4A4]/20 rounded-3xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-[#2F3E3E] mb-4">
                Mission aligned
              </h3>
              <p className="text-[#2F3E3E]/80 leading-relaxed">
                Mission MENSA represents a step toward reimagining education
                itself, from a system that produces average outcomes to one
                that identifies and empowers individuals capable of shaping the
                future. Advanced AI systems, disciplined mentorship, and
                innovation-driven learning come together here to support
                long-term nation-building through the development of
                exceptional individuals.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div
          className="mt-16 animate-fadeInUp"
          style={{ animationDelay: "0.6s" }}
        >
          <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              {
                icon: "AI",
                title: "AI Systems",
                description:
                  "Advanced AI companions personalise learning and accelerate analytical development.",
              },
              {
                icon: "IQ",
                title: "Human Mentorship",
                description:
                  "Mentors cultivate discipline, ethics, emotional resilience, and purpose alongside technical growth.",
              },
              {
                icon: "LAB",
                title: "Nation Building",
                description:
                  "The project seeks to prototype a new model of schooling that develops exceptional individuals for long-term societal impact.",
              },
            ].map((benefit, index) => (
              <div
                key={benefit.title}
                className="group text-center animate-fadeInUp"
                style={{ animationDelay: `${0.8 + index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#FAF7F2] to-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110 border border-[#2CA4A4]/10">
                  <span className="text-2xl">{benefit.icon}</span>
                </div>
                <h4 className="font-semibold text-[#2F3E3E] mb-2">
                  {benefit.title}
                </h4>
                <p className="text-sm text-[#2F3E3E]/70 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
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
    </section>
  );
};

export default NewsletterSection;
