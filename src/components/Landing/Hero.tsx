import React, { useState, useEffect } from "react";
import CountUp from "react-countup";
import {
  ArrowRight,
  Sparkles,
  Heart,
  Star,
  Zap,
  Play,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import HeroImage from "@/assets/finwit_kids_hero.png";
import HeroImage2 from "@/assets/finwit_kids_hero2.png";
import HeroImage3 from "@/assets/finwit_kids_hero3.png";
import HeroImage4 from "@/assets/finwit_kids_hero4.png";

const HeroSection: React.FC = () => {
  // Carousel state and auto-transition
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Add your image paths here
  const carouselImages = [HeroImage, HeroImage2, HeroImage3, HeroImage4];

  // Navigation functions
  const goToPrevious = () => {
    setIsPaused(true);
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
    );
    // Resume auto-play after 3 seconds of inactivity
    setTimeout(() => setIsPaused(false), 3000);
  };

  const goToNext = () => {
    setIsPaused(true);
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % carouselImages.length
    );
    // Resume auto-play after 3 seconds of inactivity
    setTimeout(() => setIsPaused(false), 3000);
  };

  // Mouse enter/leave handlers
  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  // Auto-transition effect
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % carouselImages.length
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [carouselImages.length, isPaused]);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[#FAF7F2] via-[#5EC1E8]/5 to-[#A5C85A]/5 overflow-hidden">
      {/* Magical Animated SVG Background - Full Width & Responsive */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Gradient Definitions */}
            <linearGradient
              id="sunGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#FFC94B", stopOpacity: 0.8 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#F59E0B", stopOpacity: 0.6 }}
              />
            </linearGradient>
            <linearGradient
              id="cloudGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#FFFFFF", stopOpacity: 0.4 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#5EC1E8", stopOpacity: 0.3 }}
              />
            </linearGradient>
            <radialGradient id="bubbleGradient" cx="30%" cy="30%">
              <stop
                offset="0%"
                style={{ stopColor: "#FFFFFF", stopOpacity: 0.8 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#5EC1E8", stopOpacity: 0.3 }}
              />
            </radialGradient>
          </defs>

          {/* Animated Sun with Rays */}
          <g opacity="0.3">
            <circle cx="15%" cy="15%" r="40" fill="url(#sunGradient)">
              <animate
                attributeName="r"
                values="40;45;40"
                dur="4s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.8;1;0.8"
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>
            {/* Sun Rays */}
            {[...Array(8)].map((_, i) => {
              const angle = (i * 45 * Math.PI) / 180;
              const x1 = 15 + Math.cos(angle) * 5;
              const y1 = 15 + Math.sin(angle) * 5;
              const x2 = 15 + Math.cos(angle) * 8;
              const y2 = 15 + Math.sin(angle) * 8;
              return (
                <line
                  key={i}
                  x1={`${x1}%`}
                  y1={`${y1}%`}
                  x2={`${x2}%`}
                  y2={`${y2}%`}
                  stroke="#FFC94B"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.6"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from={`0 15 15`}
                    to={`360 15 15`}
                    dur="20s"
                    repeatCount="indefinite"
                  />
                </line>
              );
            })}
          </g>

          {/* Floating Clouds - Multiple Layers */}
          <g opacity="0.4">
            {/* Cloud 1 */}
            <g>
              <ellipse
                cx="20%"
                cy="20%"
                rx="60"
                ry="30"
                fill="url(#cloudGradient)"
              />
              <ellipse
                cx="18%"
                cy="22%"
                rx="40"
                ry="25"
                fill="url(#cloudGradient)"
              />
              <ellipse
                cx="22%"
                cy="22%"
                rx="45"
                ry="28"
                fill="url(#cloudGradient)"
              />
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 1500,0; 0,0"
                dur="60s"
                repeatCount="indefinite"
              />
            </g>
            {/* Cloud 2 */}
            <g>
              <ellipse
                cx="60%"
                cy="15%"
                rx="70"
                ry="35"
                fill="url(#cloudGradient)"
              />
              <ellipse
                cx="57%"
                cy="17%"
                rx="50"
                ry="30"
                fill="url(#cloudGradient)"
              />
              <ellipse
                cx="63%"
                cy="17%"
                rx="55"
                ry="32"
                fill="url(#cloudGradient)"
              />
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; -1500,0; 0,0"
                dur="70s"
                repeatCount="indefinite"
              />
            </g>
            {/* Cloud 3 - Small */}
            <g opacity="0.6">
              <ellipse
                cx="80%"
                cy="25%"
                rx="45"
                ry="22"
                fill="url(#cloudGradient)"
              />
              <ellipse
                cx="78%"
                cy="26%"
                rx="30"
                ry="18"
                fill="url(#cloudGradient)"
              />
              <ellipse
                cx="82%"
                cy="26%"
                rx="35"
                ry="20"
                fill="url(#cloudGradient)"
              />
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 1200,0; 0,0"
                dur="50s"
                repeatCount="indefinite"
              />
            </g>
          </g>

          {/* Colorful Birds Flying */}
          <g>
            <path
              d="M30,30 Q32,28 34,30 M34,30 Q36,28 38,30"
              stroke="#8B5FBF"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              opacity="0.4"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 1400,-100; 0,0"
                dur="25s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="d"
                values="M30,30 Q32,28 34,30 M34,30 Q36,28 38,30; M30,30 Q32,32 34,30 M34,30 Q36,32 38,30; M30,30 Q32,28 34,30 M34,30 Q36,28 38,30"
                dur="0.5s"
                repeatCount="indefinite"
              />
            </path>
            <path
              d="M70,40 Q72,38 74,40 M74,40 Q76,38 78,40"
              stroke="#2CA4A4"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              opacity="0.4"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; -1200,-80; 0,0"
                dur="30s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="d"
                values="M70,40 Q72,38 74,40 M74,40 Q76,38 78,40; M70,40 Q72,42 74,40 M74,40 Q76,42 78,40; M70,40 Q72,38 74,40 M74,40 Q76,38 78,40"
                dur="0.5s"
                repeatCount="indefinite"
              />
            </path>
          </g>

          {/* Floating Bubbles with Realistic Animation */}
          {[...Array(12)].map((_, i) => {
            const cx = (i * 8 + 10) % 100;
            const cy = 60 + (i % 3) * 15;
            const r = 8 + (i % 4) * 3;
            const dur = 8 + (i % 5) * 2;
            return (
              <circle
                key={i}
                cx={`${cx}%`}
                cy={`${cy}%`}
                r={r}
                fill="url(#bubbleGradient)"
                opacity="0.5"
              >
                <animate
                  attributeName="cy"
                  values={`${cy}%; ${cy - 80}%; ${cy}%`}
                  dur={`${dur}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cx"
                  values={`${cx}%; ${cx + 5}%; ${cx - 5}%; ${cx}%`}
                  dur={`${dur * 0.7}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="r"
                  values={`${r}; ${r + 2}; ${r}`}
                  dur={`${dur * 0.5}s`}
                  repeatCount="indefinite"
                />
              </circle>
            );
          })}

          {/* Shooting Stars */}
          <g opacity="0.5">
            <line
              x1="10%"
              y1="25%"
              x2="15%"
              y2="30%"
              stroke="#FFC94B"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur="3s"
                repeatCount="indefinite"
              />
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 100,100; 0,0"
                dur="3s"
                repeatCount="indefinite"
              />
            </line>
            <line
              x1="85%"
              y1="15%"
              x2="90%"
              y2="20%"
              stroke="#5EC1E8"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur="4s"
                begin="1s"
                repeatCount="indefinite"
              />
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 80,80; 0,0"
                dur="4s"
                begin="1s"
                repeatCount="indefinite"
              />
            </line>
          </g>

          {/* Confetti Pieces */}
          {[...Array(15)].map((_, i) => {
            const colors = [
              "#FFC94B",
              "#5EC1E8",
              "#8B5FBF",
              "#A5C85A",
              "#EC4899",
            ];
            const shapes = ["circle", "rect"];
            const shape = shapes[i % 2];
            const color = colors[i % colors.length];
            const x = (i * 7 + 5) % 95;
            const y = (i * 11) % 40;
            const size = 3 + (i % 3);
            const dur = 10 + (i % 8);

            if (shape === "circle") {
              return (
                <circle
                  key={`confetti-${i}`}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r={size}
                  fill={color}
                  opacity="0.4"
                >
                  <animate
                    attributeName="cy"
                    values={`${y}%; ${y + 60}%; ${y}%`}
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values={`0 ${x} ${y}; 360 ${x} ${y}`}
                    dur={`${dur * 0.3}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              );
            } else {
              return (
                <rect
                  key={`confetti-${i}`}
                  x={`${x}%`}
                  y={`${y}%`}
                  width={size * 1.5}
                  height={size}
                  fill={color}
                  opacity="0.4"
                >
                  <animate
                    attributeName="y"
                    values={`${y}%; ${y + 60}%; ${y}%`}
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values={`0 ${x} ${y}; 360 ${x} ${y}`}
                    dur={`${dur * 0.4}s`}
                    repeatCount="indefinite"
                  />
                </rect>
              );
            }
          })}

          {/* Magical Sparkles */}
          {[...Array(20)].map((_, i) => {
            const cx = (i * 5 + 3) % 98;
            const cy = (i * 7 + 10) % 90;
            const dur = 2 + (i % 3);
            return (
              <g key={`sparkle-${i}`} opacity="0.6">
                <circle cx={`${cx}%`} cy={`${cy}%`} r="2" fill="#FFC94B">
                  <animate
                    attributeName="opacity"
                    values="0;1;0"
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="r"
                    values="1;3;1"
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                </circle>
                <path
                  d={`M${cx},${cy - 3} L${cx},${cy + 3} M${cx - 3},${cy} L${
                    cx + 3
                  },${cy}`}
                  stroke="#FFC94B"
                  strokeWidth="1"
                >
                  <animate
                    attributeName="opacity"
                    values="0;1;0"
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                </path>
              </g>
            );
          })}

          {/* Bouncing Playground Ball */}
          <g opacity="0.3">
            <circle cx="90%" cy="70%" r="25" fill="#EC4899">
              <animate
                attributeName="cy"
                values="70%;50%;70%"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx="90%"
              cy="70%"
              r="25"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="3"
              opacity="0.6"
            >
              <animate
                attributeName="cy"
                values="70%;50%;70%"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <path
              d="M90,45 Q90,70 90,95"
              stroke="#FFFFFF"
              strokeWidth="3"
              opacity="0.6"
            >
              <animate
                attributeName="d"
                values="M90,45 Q90,70 90,95; M90,25 Q90,50 90,75; M90,45 Q90,70 90,95"
                dur="2s"
                repeatCount="indefinite"
              />
            </path>
          </g>

          {/* Paper Airplane Trail */}
          <g opacity="0.4">
            <path d="M5,60 L15,63 L12,68 L5,60 L12,68 L10,63 Z" fill="#2CA4A4">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 1300,-200; 0,0"
                dur="15s"
                repeatCount="indefinite"
              />
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 10 64; 20 10 64; 0 10 64"
                dur="3s"
                repeatCount="indefinite"
                additive="sum"
              />
            </path>
            {/* Dotted trail */}
            {[...Array(8)].map((_, i) => (
              <circle
                key={`trail-${i}`}
                cx="5"
                cy="60"
                r="1.5"
                fill="#2CA4A4"
                opacity="0.5"
              >
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values={`${i * -20},${i * 10}; ${1300 + i * -20},${
                    -200 + i * 10
                  }; ${i * -20},${i * 10}`}
                  dur="15s"
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </g>
        </svg>
      </div>

      {/* Decorative Background Elements - Enhanced with Interactive Patterns */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle outline icons in background */}
        <div className="absolute top-10 left-[5%] opacity-10 animate-float">
          <Sparkles className="w-16 h-16 text-[#2CA4A4]" strokeWidth={1} />
        </div>
        <div className="absolute top-32 right-[8%] opacity-10 animate-float-delayed">
          <Star className="w-20 h-20 text-[#FFC94B]" strokeWidth={1} />
        </div>
        <div className="absolute bottom-40 left-[15%] opacity-10 animate-float">
          <Heart className="w-14 h-14 text-[#8B5FBF]" strokeWidth={1} />
        </div>
        <div className="absolute top-1/2 right-[12%] opacity-10 animate-float-delayed">
          <Zap className="w-12 h-12 text-[#A5C85A]" strokeWidth={1} />
        </div>

        {/* Floating colorful shapes */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-[#FFC94B] rounded-full animate-bounce shadow-lg"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-[#8B5FBF] rotate-45 animate-pulse shadow-lg"></div>
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-[#2CA4A4] rounded-full animate-bounce-delayed shadow-lg"></div>
        <div className="absolute top-60 left-1/4 w-2 h-2 bg-[#A5C85A] rounded-full animate-ping"></div>
        <div className="absolute bottom-60 right-1/4 w-5 h-5 bg-[#5EC1E8]/40 rounded-full animate-pulse-slow"></div>

        {/* Rainbow arc decoration - inspired by the image */}
        <div className="absolute top-8 right-[20%] hidden lg:block opacity-50 hover:opacity-70 transition-opacity duration-300">
          <svg
            width="140"
            height="90"
            viewBox="0 0 120 80"
            className="animate-float"
          >
            <path
              d="M 10 70 Q 60 10, 110 70"
              stroke="#5EC1E8"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 15 70 Q 60 18, 105 70"
              stroke="#2CA4A4"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 20 70 Q 60 26, 100 70"
              stroke="#FFC94B"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 25 70 Q 60 34, 95 70"
              stroke="#A5C85A"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Circular navigation arrows similar to the image */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:block">
          <button className="w-14 h-14 rounded-full border-2 border-[#8B5FBF]/30 flex items-center justify-center hover:bg-[#8B5FBF]/10 hover:border-[#8B5FBF] transition-all duration-300 hover:scale-110 group">
            <ArrowRight className="w-6 h-6 text-[#8B5FBF] rotate-180 group-hover:scale-110 transition-transform" />
          </button>
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block">
          <button className="w-14 h-14 rounded-full border-2 border-[#8B5FBF]/30 flex items-center justify-center hover:bg-[#8B5FBF]/10 hover:border-[#8B5FBF] transition-all duration-300 hover:scale-110 group">
            <ArrowRight className="w-6 h-6 text-[#8B5FBF] group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Scroll to top button like in the image */}
        <div className="absolute bottom-8 right-8">
          <button className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-[#FFC94B] transition-all duration-300 hover:scale-110 group">
            <ArrowRight className="w-5 h-5 text-[#2CA4A4] -rotate-90 group-hover:text-white group-hover:-translate-y-1 transition-all" />
          </button>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[calc(100vh-6rem)] py-8 lg:py-12">
          {/* Left Content */}
          <div className="space-y-6 lg:space-y-8 animate-fadeInUp z-10">
            <div className="space-y-4 lg:space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span
                  className="inline-block text-[#2CA4A4] hover:scale-125 hover:-rotate-3 hover:skew-y-2 transition-all duration-500 cursor-pointer animate-tickerWord hover:text-[#5EC1E8] hover:drop-shadow-lg"
                  style={{
                    animationDelay: "0s",
                    animationDuration: "6s",
                  }}
                >
                  Mission
                </span>{" "}
                <span className="inline-block">
                  <span className="relative inline-block group cursor-pointer">
                    <span
                      className="bg-gradient-to-r from-[#8B5FBF] via-[#FFC94B] to-[#5EC1E8] bg-clip-text text-transparent hover:from-[#5EC1E8] hover:via-[#A5C85A] hover:to-[#8B5FBF] transition-all duration-700 animate-tickerWord hover:scale-125 inline-block hover:drop-shadow-2xl"
                      style={{
                        animationDelay: "1s",
                        animationDuration: "6s",
                        backgroundSize: "200% auto",
                      }}
                    >
                      MENSA
                    </span>
                    <svg
                      className="absolute -bottom-2 left-0 w-full h-3 text-[#FFC94B] opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-drawLine group-hover:animate-pulse"
                      viewBox="0 0 200 12"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0,8 Q50,0 100,8 T200,8"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                      />
                    </svg>
                    {/* Multiple sparkle effects on hover */}
                    <span className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-125">
                      <Sparkles className="w-6 h-6 text-[#FFC94B] animate-spin-slow" />
                    </span>
                    <span className="absolute -top-1 -left-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                      <Star className="w-5 h-5 text-[#5EC1E8] animate-pulse" />
                    </span>
                    <span className="absolute -bottom-1 right-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                      <Heart className="w-4 h-4 text-[#8B5FBF] animate-bounce" />
                    </span>
                  </span>
                </span>{" "}
                <span
                  className="inline-block text-[#8B5FBF] hover:scale-125 hover:rotate-3 hover:-skew-y-2 transition-all duration-500 cursor-pointer animate-tickerWord hover:text-[#FFC94B] hover:drop-shadow-lg"
                  style={{
                    animationDelay: "2s",
                    animationDuration: "6s",
                  }}
                >
                  Begins
                </span>
              </h1>

              <div className="space-y-3">
                <p
                  className="text-base sm:text-lg lg:text-xl text-[#2F3E3E]/70 max-w-2xl leading-relaxed group cursor-pointer animate-fadeInUp"
                  style={{ animationDelay: "1s" }}
                >
                  Mission MENSA is an advanced educational initiative designed
                  to identify and cultivate exceptional human potential in the
                  age of Artificial Intelligence. Developed under the vision of
                  Indus Trust, Bangalore, it combines human intelligence,
                  AI-powered learning systems, personal AI companions, and
                  networked global knowledge to build a new model of education
                  focused on discovering constructive outliers.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
              <button className="group relative bg-gradient-to-r from-[#8B5FBF] to-[#5EC1E8] hover:from-[#5EC1E8] hover:to-[#8B5FBF] text-white font-bold px-8 py-4 rounded-full transition-all duration-500 transform hover:scale-110 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-2 overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                <span className="relative z-10">Explore Mission MENSA</span>
                <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </button>

              <button className="group bg-white hover:bg-gradient-to-r hover:from-[#2CA4A4] hover:to-[#5EC1E8] text-[#2CA4A4] hover:text-white border-2 border-[#2CA4A4] hover:border-transparent font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
                <Play className="w-5 h-5 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
                <span>View Human Lab Vision</span>
              </button>
            </div>

            {/* Stats or badges - Enhanced with hover effects */}
            <div className="flex flex-wrap gap-6 lg:gap-8 pt-6 lg:pt-8">
              <div className="group text-center bg-white/50 backdrop-blur-sm px-6 py-4 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer">
                <div className="text-3xl lg:text-4xl font-bold text-[#2CA4A4] group-hover:scale-125 transition-transform duration-300">
                  <CountUp
                    end={1}
                    duration={2.5}
                    enableScrollSpy
                    scrollSpyOnce
                  />
                </div>
                <div className="text-xs lg:text-sm text-[#2F3E3E]/70 font-medium mt-1">
                  Human Lab
                </div>
              </div>
              <div className="group text-center bg-white/50 backdrop-blur-sm px-6 py-4 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer">
                <div className="text-3xl lg:text-4xl font-bold text-[#A5C85A] group-hover:scale-125 transition-transform duration-300">
                  <CountUp
                    start={1}
                    end={1}
                    duration={2.5}
                    enableScrollSpy
                    scrollSpyOnce
                  />
                </div>
                <div className="text-xs lg:text-sm text-[#2F3E3E]/70 font-medium mt-1">
                  AI Companion
                </div>
              </div>
              <div className="group text-center bg-white/50 backdrop-blur-sm px-6 py-4 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer">
                <div className="text-3xl lg:text-4xl font-bold text-[#8B5FBF] group-hover:scale-125 transition-transform duration-300">
                  <CountUp
                    end={100}
                    duration={2.5}
                    suffix="%"
                    enableScrollSpy
                    scrollSpyOnce
                  />
                </div>
                <div className="text-xs lg:text-sm text-[#2F3E3E]/70 font-medium mt-1">
                  Intelligence Driven
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Illustration with Enhanced Interactivity */}
          <div className="relative animate-fadeInRight group">
            <div className="relative rounded-3xl overflow-visible">
              {/* Main image container with hover effects */}
              <div
                className="relative h-[400px] sm:h-[500px] lg:h-[550px] bg-gradient-to-br from-[#FAF7F2] to-[#5EC1E8]/10 rounded-[3rem] overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-[1.02]"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* Decorative gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10"></div>

                {/* Floating interactive elements */}
                <div className="absolute top-6 right-6 w-10 h-10 bg-[#FFC94B] rounded-full animate-bounce-slow shadow-lg hover:scale-125 transition-transform duration-300 cursor-pointer"></div>
                <div className="absolute top-24 left-8 w-7 h-7 bg-[#5EC1E8]/60 rounded-full animate-pulse-slow hover:scale-125 transition-transform duration-300 cursor-pointer"></div>
                <div className="absolute bottom-24 right-12 w-5 h-5 bg-[#A5C85A] rounded-full animate-bounce-delayed shadow-lg hover:scale-125 transition-transform duration-300 cursor-pointer"></div>
                <div className="absolute top-1/3 right-16 w-6 h-6 bg-[#8B5FBF]/50 rounded-full animate-float hover:scale-125 transition-transform duration-300 cursor-pointer"></div>

                {/* Hero Image Carousel */}
                <div className="relative -top-12 flex items-center justify-center p-8 h-full">
                  {carouselImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Mensa learning experience ${index + 1}`}
                      className={`absolute inset-0 w-full h-full object-contain transition-all duration-1000 ease-in-out ${
                        index === currentImageIndex
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-95"
                      }`}
                    />
                  ))}
                </div>

                {/* Previous Arrow */}
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-[#8B5FBF] hover:text-white transition-all duration-300 group/arrow"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6 text-[#2F3E3E] group-hover/arrow:text-white transition-colors" />
                </button>

                {/* Next Arrow */}
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-[#8B5FBF] hover:text-white transition-all duration-300 group/arrow"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6 text-[#2F3E3E] group-hover/arrow:text-white transition-colors" />
                </button>

                {/* Carousel Indicators */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {carouselImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        index === currentImageIndex
                          ? "bg-[#8B5FBF] w-8"
                          : "bg-white/50 hover:bg-white/80"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Bottom decorative wave */}
                <svg
                  className="absolute bottom-0 left-0 w-full h-24 text-[#5EC1E8] opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                  viewBox="0 0 400 60"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,30 C100,60 200,0 300,30 C350,45 400,15 400,30 L400,60 L0,60 Z"
                    fill="currentColor"
                  />
                </svg>

                {/* Circular blob background - animated */}
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#FAF7F2] via-[#FFC94B]/20 to-transparent rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
              </div>

              {/* Decorative floating dots with hover effects */}
              <div className="absolute -top-4 -right-4 w-10 h-10 bg-[#FFC94B] rounded-full shadow-lg hover:scale-150 transition-all duration-300 cursor-pointer animate-pulse-slow"></div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-[#8B5FBF] rounded-full shadow-lg hover:scale-150 transition-all duration-300 cursor-pointer animate-bounce-slow"></div>
              <div className="absolute top-1/4 -left-6 w-6 h-6 bg-[#2CA4A4] rounded-full shadow-lg hover:scale-150 transition-all duration-300 cursor-pointer animate-float"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
