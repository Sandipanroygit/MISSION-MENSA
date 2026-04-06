import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Home,
  Search,
  BookOpen,
  Users,
  Lightbulb,
  Heart,
  RefreshCw,
} from "lucide-react";

const Error404Page: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [currentTip, setCurrentTip] = useState(0);

  const learningTips = [
    "Did you know? Financial literacy helps kids make smart money decisions!",
    "Fun fact: Creative arts boost problem-solving skills in children!",
    "Learning tip: Physical wellness activities improve focus and concentration!",
    "Did you know? Emotional intelligence is just as important as IQ!",
  ];

  const quickLinks = [
    {
      title: "Explore Domains",
      description: "Discover our 12 learning areas",
      icon: Lightbulb,
      path: "/domains",
      color: "from-[#2CA4A4] to-[#5EC1E8]",
    },
    {
      title: "Start Learning",
      description: "Jump into a demo lesson",
      icon: BookOpen,
      path: "/demo",
      color: "from-[#FFC94B] to-[#A5C85A]",
    },
    {
      title: "Join Community",
      description: "Connect with other families",
      icon: Users,
      path: "/community",
      color: "from-[#8B5FBF] to-[#2CA4A4]",
    },
    {
      title: "Get Support",
      description: "We're here to help you",
      icon: Heart,
      path: "/contact",
      color: "from-[#A5C85A] to-[#FFC94B]",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % learningTips.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FAF7F2] via-[#5EC1E8]/5 to-[#A5C85A]/10 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#FFC94B]/10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-[#8B5FBF]/10 rounded-full animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-16 h-16 bg-[#2CA4A4]/10 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 right-1/3 w-20 h-20 bg-[#5EC1E8]/10 rounded-full animate-pulse delay-300"></div>

        {/* Learning icons floating */}
        <div className="absolute top-1/4 left-1/4 text-[#FFC94B]/20 animate-bounce delay-500">
          <BookOpen className="w-8 h-8" />
        </div>
        <div className="absolute top-1/3 right-1/4 text-[#8B5FBF]/20 animate-pulse delay-700">
          <Lightbulb className="w-10 h-10" />
        </div>
        <div className="absolute bottom-1/3 left-1/3 text-[#2CA4A4]/20 animate-bounce delay-1000">
          <Heart className="w-6 h-6" />
        </div>

        {/* Animated number particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute text-6xl font-bold text-[#2CA4A4]/5 animate-float"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 2) * 40}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`,
            }}
          >
            {i % 2 === 0 ? "4" : "0"}
          </div>
        ))}
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Main 404 Content */}
        <div className="text-center mb-16">
          {/* Large 404 Display */}
          <div
            className={`mb-8 transition-all duration-1000 ${
              isAnimating ? "scale-110 rotate-3" : "scale-100 rotate-0"
            }`}
          >
            <h1 className="text-8xl sm:text-9xl lg:text-[12rem] font-black bg-gradient-to-r from-[#2CA4A4] via-[#FFC94B] to-[#8B5FBF] bg-clip-text text-transparent leading-none animate-pulse">
              404
            </h1>
          </div>

          {/* Error Message */}
          <div className="animate-fadeInUp" style={{ animationDelay: "0.5s" }}>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2F3E3E] mb-6">
              Oops! This page went on a learning adventure!
            </h2>
            <p className="text-lg text-[#2F3E3E]/80 max-w-2xl mx-auto leading-relaxed mb-8">
              Don't worry - even the best explorers sometimes take a wrong turn.
              Let's get you back on track to discover amazing learning
              opportunities with Mensa!
            </p>
          </div>

          {/* Rotating Learning Tips */}
          <div
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 max-w-lg mx-auto mb-12 shadow-lg border border-[#2CA4A4]/10 animate-fadeInUp"
            style={{ animationDelay: "0.7s" }}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-[#FFC94B] rounded-full flex items-center justify-center animate-pulse">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-[#2F3E3E]">
                Learning Moment
              </span>
            </div>
            <p className="text-[#2F3E3E]/90 transition-all duration-500">
              {learningTips[currentTip]}
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fadeInUp"
            style={{ animationDelay: "0.9s" }}
          >
            <button className="group bg-[#2CA4A4] hover:bg-[#5EC1E8] text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
              <Home className="w-5 h-5" />
              <span>Go Home</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>

            <button className="group bg-[#FFC94B] hover:bg-[#A5C85A] text-[#2F3E3E] font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Search Content</span>
            </button>

            <button className="group bg-white hover:bg-[#8B5FBF] text-[#8B5FBF] hover:text-white border-2 border-[#8B5FBF] font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
              <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              <span>Try Again</span>
            </button>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="animate-fadeInUp" style={{ animationDelay: "1.1s" }}>
          <h3 className="text-2xl font-bold text-[#2F3E3E] text-center mb-8">
            While you're here, explore these popular sections:
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <div
                  key={link.title}
                  className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-gray-100 hover:border-[#2CA4A4]/20 cursor-pointer animate-fadeInUp`}
                  style={{ animationDelay: `${1.3 + index * 0.1}s` }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#2CA4A4]/10 to-[#5EC1E8]/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-6 h-6 text-[#2CA4A4] group-hover:scale-110 transition-transform duration-200" />
                  </div>

                  <h4 className="font-bold text-[#2F3E3E] mb-2 group-hover:text-[#2CA4A4] transition-colors duration-300">
                    {link.title}
                  </h4>
                  <p className="text-sm text-[#2F3E3E]/70 group-hover:text-[#2F3E3E]/90 transition-colors duration-300">
                    {link.description}
                  </p>

                  {/* Hover gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${link.color} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`}
                  ></div>

                  {/* Bottom accent line */}
                  <div
                    className={`absolute bottom-0 left-6 right-6 h-1 bg-gradient-to-r ${link.color} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center`}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Help Section */}
        <div
          className="text-center mt-16 animate-fadeInUp"
          style={{ animationDelay: "1.7s" }}
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-[#2CA4A4]/10 max-w-3xl mx-auto">
            <h4 className="text-xl font-bold text-[#2F3E3E] mb-4">
              Still can't find what you're looking for?
            </h4>
            <p className="text-[#2F3E3E]/80 mb-6">
              Our team is here to help guide you through your learning journey.
              We're always happy to assist!
            </p>
            <button className="bg-[#8B5FBF] hover:bg-[#2CA4A4] text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center space-x-2 mx-auto">
              <Heart className="w-5 h-5" />
              <span>Contact Support</span>
            </button>
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

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.1;
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
            opacity: 0.3;
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out both;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
};

export default Error404Page;
