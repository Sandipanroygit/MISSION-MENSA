import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  Brain,
  Bot,
  Compass,
  Lightbulb,
  Microscope,
  Network,
  Users,
} from "lucide-react";

// Domain type definition
export interface Domain {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  hoverColor: string;
}

// Domains data array - exported for reuse
const DOMAINS: Domain[] = [
  {
    icon: Network,
    title: "Collective Intelligence",
    description:
      "Integrating human intelligence, AI agents, and global knowledge systems to create a powerful new learning ecosystem.",
    color: "from-[#2CA4A4] to-[#5EC1E8]",
    bgColor: "bg-gradient-to-br from-[#2CA4A4] to-[#5EC1E8]",
    hoverColor: "group-hover:from-[#5EC1E8] group-hover:to-[#2CA4A4]",
  },
  {
    icon: Bot,
    title: "AI-Powered Learning",
    description:
      "Personal AI agents deliver adaptive learning, real-time feedback, and continuous performance tracking for every student.",
    color: "from-[#8B5FBF] to-[#2CA4A4]",
    bgColor: "bg-gradient-to-br from-[#8B5FBF] to-[#A855F7]",
    hoverColor: "group-hover:from-[#A855F7] group-hover:to-[#8B5FBF]",
  },
  {
    icon: Users,
    title: "Human Mentorship",
    description:
      "Focused on discipline, ethics, and self-awareness, mentors shape character alongside intellectual growth.",
    color: "from-[#FFC94B] to-[#A5C85A]",
    bgColor: "bg-gradient-to-br from-[#FFC94B] to-[#FBBF24]",
    hoverColor: "group-hover:from-[#FBBF24] group-hover:to-[#FFC94B]",
  },
  {
    icon: Compass,
    title: "Student Agency",
    description:
      "Students develop independent thinking, curiosity, and ownership of learning instead of passive dependence.",
    color: "from-[#8B5FBF] to-[#5EC1E8]",
    bgColor: "bg-gradient-to-br from-[#EC4899] to-[#F472B6]",
    hoverColor: "group-hover:from-[#F472B6] group-hover:to-[#EC4899]",
  },
  {
    icon: Lightbulb,
    title: "Innovation & Design",
    description:
      "Hands-on problem solving, design thinking, and real-world projects transform knowledge into creation.",
    color: "from-[#5EC1E8] to-[#2CA4A4]",
    bgColor: "bg-gradient-to-br from-[#3B82F6] to-[#60A5FA]",
    hoverColor: "group-hover:from-[#60A5FA] group-hover:to-[#3B82F6]",
  },
  {
    icon: Microscope,
    title: "Research & Analytics",
    description:
      "Students engage in STEAM-based learning that blends science, technology, engineering, arts, and mathematics through hands-on exploration and creative problem solving.",
    color: "from-[#A5C85A] to-[#FFC94B]",
    bgColor: "bg-gradient-to-br from-[#F59E0B] to-[#FBBF24]",
    hoverColor: "group-hover:from-[#FBBF24] group-hover:to-[#F59E0B]",
  },
];

// Reusable DomainsGrid Component
interface DomainsGridProps {
  domains?: Domain[];
  gridCols?: string; // Optional custom grid columns class
}

export const DomainsGrid: React.FC<DomainsGridProps> = ({
  domains = DOMAINS,
  gridCols = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
}) => {
  return (
    <div className={`grid ${gridCols} gap-6 lg:gap-8`}>
      {domains.map((domain, index) => {
        const IconComponent = domain.icon;
        return (
          <div
            key={domain.title}
            className="block"
          >
            <div
              className={`group relative p-6 ${domain.bgColor} ${domain.hoverColor} rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:scale-110 hover:-rotate-1 animate-fadeInUp cursor-pointer overflow-hidden`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Decorative pattern overlay */}
              <div className="absolute inset-0 opacity-10">
                <svg
                  className="w-full h-full"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern
                      id={`pattern-${index}`}
                      x="0"
                      y="0"
                      width="40"
                      height="40"
                      patternUnits="userSpaceOnUse"
                    >
                      <circle cx="5" cy="5" r="2" fill="white" opacity="0.3" />
                      <circle
                        cx="25"
                        cy="15"
                        r="1.5"
                        fill="white"
                        opacity="0.2"
                      />
                      <circle
                        cx="15"
                        cy="25"
                        r="1"
                        fill="white"
                        opacity="0.4"
                      />
                      <circle
                        cx="35"
                        cy="35"
                        r="1.5"
                        fill="white"
                        opacity="0.25"
                      />
                    </pattern>
                  </defs>
                  <rect
                    width="100%"
                    height="100%"
                    fill={`url(#pattern-${index})`}
                  />
                </svg>
              </div>

              {/* Sparkles decoration */}
              <div className="absolute top-3 right-3 opacity-30 group-hover:opacity-50 transition-opacity duration-500">
                <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                <div className="absolute top-1 left-2 w-1 h-1 bg-white rounded-full animate-pulse"></div>
                <div className="absolute -top-1 left-1 w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
              </div>

              {/* Icon container */}
              <div className="relative w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 shadow-lg">
                <IconComponent className="w-8 h-8 text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />

                {/* Pulsing ring on hover */}
                <div className="absolute inset-0 border-3 border-white/40 rounded-2xl opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500"></div>
              </div>

              {/* Content */}
              <div className="space-y-3 relative z-10">
                <h3 className="text-lg font-bold text-white drop-shadow-md group-hover:scale-105 transition-transform duration-300 leading-tight">
                  {domain.title}
                </h3>
                <p className="text-sm text-white/90 group-hover:text-white transition-colors duration-300 leading-relaxed">
                  {domain.description}
                </p>
              </div>

              {/* Shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>

              {/* Floating decorative blurs */}
              <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute -top-3 -left-3 w-16 h-16 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

              {/* Bottom accent line */}
              <div
                className={`absolute bottom-0 left-6 right-6 h-1 bg-gradient-to-r ${domain.color} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center`}
              ></div>

              {/* Corner decoration */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-[#A5C85A] rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-300 delay-100"></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Main DomainsSection Component
const DomainsSection: React.FC = () => {
  const navigate = useNavigate();
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

  return (
    <section className="py-20 bg-white relative overflow-hidden" id="domains">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#FFC94B]/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-40 right-20 w-40 h-40 bg-[#5EC1E8]/5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-[#A5C85A]/5 rounded-full blur-xl"></div>

        {/* Floating shapes */}
        <div className="absolute top-32 right-1/3 w-3 h-3 bg-[#8B5FBF] rounded-full animate-pulse"></div>
        <div className="absolute bottom-60 left-20 w-2 h-2 bg-[#2CA4A4] rounded-full animate-bounce"></div>
        <div
          className="absolute top-80 right-16 w-4 h-4 bg-[#FFC94B] rotate-45 animate-spin"
          style={{ animationDuration: "8s" }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-16 relative">
          {/* Animated SVG Background for Kids */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <svg
              className="absolute w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Floating Stars */}
              <g className="animate-float">
                <path
                  d="M100,50 L105,65 L120,68 L110,80 L112,95 L100,88 L88,95 L90,80 L80,68 L95,65 Z"
                  fill="#FFC94B"
                  opacity="0.3"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 100 72"
                    to="360 100 72"
                    dur="8s"
                    repeatCount="indefinite"
                  />
                </path>
              </g>
              <g className="animate-bounce-slow">
                <path
                  d="M800,100 L803,110 L813,112 L806,119 L808,129 L800,124 L792,129 L794,119 L787,112 L797,110 Z"
                  fill="#5EC1E8"
                  opacity="0.4"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 800 114"
                    to="-360 800 114"
                    dur="10s"
                    repeatCount="indefinite"
                  />
                </path>
              </g>

              {/* Bouncing Balloons */}
              <g className="animate-float-delayed">
                <ellipse
                  cx="200"
                  cy="120"
                  rx="18"
                  ry="22"
                  fill="#A855F7"
                  opacity="0.3"
                />
                <path
                  d="M200,142 Q195,155 190,165"
                  stroke="#A855F7"
                  strokeWidth="1.5"
                  fill="none"
                  opacity="0.3"
                />
                <animate
                  attributeName="cy"
                  values="120;100;120"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </g>
              <g>
                <ellipse
                  cx="950"
                  cy="80"
                  rx="16"
                  ry="20"
                  fill="#10B981"
                  opacity="0.35"
                />
                <path
                  d="M950,100 Q945,113 940,123"
                  stroke="#10B981"
                  strokeWidth="1.5"
                  fill="none"
                  opacity="0.35"
                />
                <animate
                  attributeName="cy"
                  values="80;60;80"
                  dur="3.5s"
                  repeatCount="indefinite"
                />
              </g>

              {/* Happy Clouds */}
              <g className="animate-float">
                <ellipse
                  cx="150"
                  cy="40"
                  rx="25"
                  ry="15"
                  fill="#5EC1E8"
                  opacity="0.2"
                />
                <ellipse
                  cx="135"
                  cy="42"
                  rx="18"
                  ry="12"
                  fill="#5EC1E8"
                  opacity="0.2"
                />
                <ellipse
                  cx="165"
                  cy="42"
                  rx="20"
                  ry="13"
                  fill="#5EC1E8"
                  opacity="0.2"
                />
                <animate
                  attributeName="cx"
                  values="150;1200;150"
                  dur="40s"
                  repeatCount="indefinite"
                />
              </g>
              <g>
                <ellipse
                  cx="700"
                  cy="35"
                  rx="28"
                  ry="16"
                  fill="#A5C85A"
                  opacity="0.25"
                />
                <ellipse
                  cx="682"
                  cy="37"
                  rx="20"
                  ry="13"
                  fill="#A5C85A"
                  opacity="0.25"
                />
                <ellipse
                  cx="718"
                  cy="37"
                  rx="22"
                  ry="14"
                  fill="#A5C85A"
                  opacity="0.25"
                />
                <animate
                  attributeName="cx"
                  values="700;-100;700"
                  dur="35s"
                  repeatCount="indefinite"
                />
              </g>

              {/* Rainbow Arc */}
              <g opacity="0.15">
                <path
                  d="M50,150 Q300,50 550,150"
                  stroke="#EF4444"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M50,155 Q300,55 550,155"
                  stroke="#F59E0B"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M50,160 Q300,60 550,160"
                  stroke="#FFC94B"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M50,165 Q300,65 550,165"
                  stroke="#10B981"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M50,170 Q300,70 550,170"
                  stroke="#2CA4A4"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M50,175 Q300,75 550,175"
                  stroke="#5EC1E8"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M50,180 Q300,80 550,180"
                  stroke="#8B5FBF"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
              </g>

              {/* Flying Paper Airplanes */}
              <g>
                <path
                  d="M400,90 L420,95 L415,100 L400,90 L415,100 L410,95 Z"
                  fill="#2CA4A4"
                  opacity="0.3"
                >
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="0,0; 600,-50; 0,0"
                    dur="12s"
                    repeatCount="indefinite"
                  />
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values="0 410 95; 15 410 95; 0 410 95"
                    dur="2s"
                    repeatCount="indefinite"
                    additive="sum"
                  />
                </path>
              </g>

              {/* Twinkling Sparkles */}
              <circle cx="300" cy="60" r="2" fill="#FFC94B">
                <animate
                  attributeName="opacity"
                  values="0.2;1;0.2"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="r"
                  values="2;3;2"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="750" cy="120" r="2" fill="#A855F7">
                <animate
                  attributeName="opacity"
                  values="0.3;1;0.3"
                  dur="2.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="r"
                  values="2;3.5;2"
                  dur="2.5s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="500" cy="45" r="2" fill="#5EC1E8">
                <animate
                  attributeName="opacity"
                  values="0.2;1;0.2"
                  dur="3s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="r"
                  values="2;3;2"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Cute Smiley Faces */}
              <g opacity="0.2">
                <circle cx="850" cy="60" r="12" fill="#FFC94B" />
                <circle cx="846" cy="57" r="2" fill="#2F3E3E" />
                <circle cx="854" cy="57" r="2" fill="#2F3E3E" />
                <path
                  d="M846,63 Q850,66 854,63"
                  stroke="#2F3E3E"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
                <animate
                  attributeName="opacity"
                  values="0.2;0.4;0.2"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </g>

              {/* Colorful Hearts */}
              <g>
                <path
                  d="M250,100 C250,95 245,90 240,90 C235,90 230,95 230,100 C230,95 225,90 220,90 C215,90 210,95 210,100 C210,110 230,120 230,120 C230,120 250,110 250,100"
                  fill="#EC4899"
                  opacity="0.25"
                >
                  <animateTransform
                    attributeName="transform"
                    type="scale"
                    values="1;1.2;1"
                    dur="2s"
                    repeatCount="indefinite"
                    additive="sum"
                  />
                </path>
              </g>
            </svg>
          </div>
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
              Mission
            </span>{" "}
            <span
              className={`inline-block bg-gradient-to-r from-[#2CA4A4] to-[#5EC1E8] bg-clip-text text-transparent hover:from-[#5EC1E8] hover:to-[#2CA4A4] transition-all duration-500 hover:scale-110 cursor-pointer ${
                isVisible ? "animate-typewriter" : ""
              }`}
              style={{ animationDelay: "0.3s" }}
            >
              MENSA
            </span>{" "}
            <span
              className={`inline-block text-[#2F3E3E] hover:scale-110 transition-transform duration-300 cursor-pointer ${
                isVisible ? "animate-slideInLeft" : ""
              }`}
              style={{ animationDelay: "0.6s" }}
            >
              Framework
            </span>
          </h2>
          <div
            className={`w-32 h-1 bg-gradient-to-r from-[#FFC94B] via-[#A5C85A] to-[#2CA4A4] mx-auto rounded-full mb-8 transition-all duration-1000 ${
              isVisible
                ? "animate-expandWidth opacity-100"
                : "opacity-0 scale-x-0"
            }`}
            style={{ animationDelay: "0.9s" }}
          ></div>
          <p
            className={`text-lg text-[#2F3E3E]/80 max-w-3xl mx-auto mb-8 transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-5"
            }`}
          >
            Mission MENSA is designed as a live framework for discovering and
            nurturing exceptional potential through AI-powered learning,
            continuous observation, and innovation-driven development. The
            system is structured to generate both student growth and research
            insight.
          </p>
          <div
            className={`w-32 h-1 bg-gradient-to-r from-[#FFC94B] via-[#A5C85A] to-[#2CA4A4] mx-auto rounded-full transition-all duration-1000 delay-500 ${
              isVisible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
            }`}
          ></div>
        </div>

        {/* Domains Grid - Using the reusable component */}
        <DomainsGrid domains={DOMAINS} />

        {/* Bottom CTA */}
        <div
          className="text-center mt-16 animate-fadeInUp"
          style={{ animationDelay: "1.2s" }}
        >
          <div className="bg-gradient-to-r from-[#FAF7F2] to-white rounded-3xl p-8 shadow-lg border border-[#2CA4A4]/10 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-[#2F3E3E] mb-4">
              Ready to Explore the MENSA Framework?
            </h3>
            <p className="text-[#2F3E3E]/80 mb-6 max-w-2xl mx-auto">
              Explore the experimental model that integrates global knowledge
              networks, dedicated AI companions, and disciplined human
              mentorship into one operational learning environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/programs")}
                className="bg-[#2CA4A4] hover:bg-[#A5C85A] text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                View the Framework
              </button>
              <button className="bg-[#FFC94B] hover:bg-[#5EC1E8] text-[#2F3E3E] hover:text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                Review the Architecture
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
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

export default DomainsSection;
