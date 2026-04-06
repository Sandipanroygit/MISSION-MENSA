import React from "react";
import { ArrowRight, Star, Target, TrendingUp } from "lucide-react";

// Child Component 1: What Your Child Will Learn
const WhatYourChildWillLearn: React.FC = () => {
  const learningPoints = [
    "The difference between needs and wants",
    "Saving, giving, budgeting, and smart spending",
    "Setting money goals and tracking them",
    "How to earn money through creativity and service",
  ];

  return (
    <section className="py-16 bg-[#FAF7F2] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-32 h-32 bg-[#FFC94B]/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-[#2CA4A4]/10 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-[#A5C85A] rounded-full animate-ping"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fadeInLeft">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-[#2CA4A4]/10 px-4 py-2 rounded-full">
                <TrendingUp className="w-4 h-4 text-[#2CA4A4]" />
                <span className="text-sm font-medium text-[#2CA4A4]">
                  Financial Literacy
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3E3E] leading-tight">
                Financial Literacy
              </h2>

              <p className="text-lg text-[#2CA4A4] font-medium">
                Raising Smart Spenders and Future Investors
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#2F3E3E]">
                What Your Child Will Learn
              </h3>

              <ul className="space-y-4">
                {learningPoints.map((point, index) => (
                  <li
                    key={index}
                    className="flex items-start space-x-3 animate-fadeInUp group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-[#A5C85A] rounded-full flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300">
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                    </div>
                    <span className="text-[#2F3E3E]/80 leading-relaxed group-hover:text-[#2F3E3E] transition-colors duration-300">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <button className="group bg-[#A5C85A] hover:bg-[#2CA4A4] text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2">
              <span>Start Learning</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>

          {/* Right Image Placeholder */}
          <div className="relative animate-fadeInRight">
            <div className="relative bg-gradient-to-br from-[#FFC94B]/10 to-[#A5C85A]/10 rounded-3xl p-8 backdrop-blur-sm">
              <div className="relative h-80 bg-gradient-to-br from-[#FAF7F2] to-[#FFC94B]/20 rounded-2xl overflow-hidden shadow-2xl border border-[#2CA4A4]/10">
                {/* Image placeholder */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#FAF7F2] to-[#FFC94B]/10">
                  <div className="text-center text-[#2F3E3E]/50">
                    <TrendingUp className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-sm">Financial Literacy Illustration</p>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute top-6 right-6 w-8 h-8 bg-[#FFC94B] rounded-full animate-bounce delay-100"></div>
                <div className="absolute bottom-8 left-8 w-6 h-6 bg-[#A5C85A] rounded-full animate-pulse"></div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#2CA4A4] rounded-full"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-[#8B5FBF] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Child Component 2: How It Works
const HowItWorks: React.FC = () => {
  const workFlows = [
    "Self-guided animated lessons with interactive money games",
    "Parent-child budgeting challenges and home store simulations",
    "Teacher-guided lessons for advanced money concepts in group settings",
  ];

  const activities = [
    "Design a personalized piggy bank and saving tracker",
    "Play 'Mensa Market Day' (a pretend store game)",
    "Create a giving plan for helping someone in need",
  ];

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-40 h-40 bg-[#5EC1E8]/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#FFC94B]/5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-[#8B5FBF] rounded-full animate-bounce"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Image Placeholder */}
          <div className="relative animate-fadeInLeft order-2 lg:order-1">
            <div className="relative bg-gradient-to-br from-[#5EC1E8]/10 to-[#2CA4A4]/10 rounded-3xl p-8 backdrop-blur-sm">
              <div className="relative h-80 bg-gradient-to-br from-[#FAF7F2] to-[#5EC1E8]/20 rounded-2xl overflow-hidden shadow-2xl border border-[#2CA4A4]/10">
                {/* Image placeholder */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#FAF7F2] to-[#5EC1E8]/10">
                  <div className="text-center text-[#2F3E3E]/50">
                    <Star className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-sm">Market Day Activity Illustration</p>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute top-6 left-6 w-6 h-6 bg-[#5EC1E8] rounded-full animate-pulse"></div>
                <div
                  className="absolute bottom-8 right-8 w-8 h-8 bg-[#FFC94B] rotate-45 animate-spin"
                  style={{ animationDuration: "4s" }}
                ></div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#A5C85A] rounded-full"></div>
              <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-[#8B5FBF] rounded-full"></div>
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-8 animate-fadeInRight order-1 lg:order-2">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#2F3E3E] leading-tight">
                How It Works
              </h2>

              <ul className="space-y-4">
                {workFlows.map((flow, index) => (
                  <li
                    key={index}
                    className="flex items-start space-x-3 animate-fadeInUp group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-[#2CA4A4] rounded-full flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300">
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                    </div>
                    <span className="text-[#2F3E3E]/80 leading-relaxed group-hover:text-[#2F3E3E] transition-colors duration-300">
                      {flow}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <button className="group bg-[#2CA4A4] hover:bg-[#5EC1E8] text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2">
              <span>Explore Activities</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>

            <div className="space-y-6 pt-8 border-t border-gray-100">
              <h3 className="text-xl font-bold text-[#2F3E3E]">
                Example Activities
              </h3>

              <ul className="space-y-4">
                {activities.map((activity, index) => (
                  <li
                    key={index}
                    className="flex items-start space-x-3 animate-fadeInUp group"
                    style={{ animationDelay: `${(index + 3) * 0.1}s` }}
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-[#FFC94B] rounded-full flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300">
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                    </div>
                    <span className="text-[#2F3E3E]/80 leading-relaxed group-hover:text-[#2F3E3E] transition-colors duration-300">
                      {activity}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <button className="group bg-[#A5C85A] hover:bg-[#FFC94B] text-[#2F3E3E] font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2">
              <span>View More Activities</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Child Component 3: Growth Milestones
const GrowthMilestones: React.FC = () => {
  const milestones = [
    "Weekly Smart Spender Stars",
    "Monthly Budgeting Champion Awards",
    "Money Moves Day challenge showcase",
  ];

  return (
    <section className="py-16 bg-[#FAF7F2] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-36 h-36 bg-[#8B5FBF]/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-[#FFC94B]/10 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-[#2CA4A4] rounded-full animate-ping"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fadeInLeft">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#2F3E3E] leading-tight">
                Growth Milestones
              </h2>

              <ul className="space-y-4">
                {milestones.map((milestone, index) => (
                  <li
                    key={index}
                    className="flex items-start space-x-3 animate-fadeInUp group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-[#FFC94B] rounded-full flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300">
                      <Star className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-[#2F3E3E]/80 leading-relaxed group-hover:text-[#2F3E3E] transition-colors duration-300">
                      {milestone}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <button className="group bg-[#8B5FBF] hover:bg-[#2CA4A4] text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>See Milestones</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>

          {/* Right Image Placeholder */}
          <div className="relative animate-fadeInRight">
            <div className="relative bg-gradient-to-br from-[#8B5FBF]/10 to-[#FFC94B]/10 rounded-3xl p-8 backdrop-blur-sm">
              <div className="relative h-80 bg-gradient-to-br from-[#FAF7F2] to-[#8B5FBF]/20 rounded-2xl overflow-hidden shadow-2xl border border-[#2CA4A4]/10">
                {/* Image placeholder */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#FAF7F2] to-[#8B5FBF]/10">
                  <div className="text-center text-[#2F3E3E]/50">
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <Target className="w-12 h-12" />
                      <Star className="w-16 h-16" />
                    </div>
                    <p className="text-sm">
                      Achievement & Milestones Illustration
                    </p>
                  </div>
                </div>

                {/* Floating trophy elements */}
                <div className="absolute top-8 right-8 w-10 h-10 bg-[#FFC94B] rounded-full flex items-center justify-center animate-bounce">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div className="absolute bottom-8 left-8 w-8 h-8 bg-[#8B5FBF] rounded-full flex items-center justify-center animate-pulse">
                  <Target className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#A5C85A] rounded-full"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-[#5EC1E8] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Parent Component
const FinancialLiteracy: React.FC = () => {
  return (
    <main className="min-h-screen bg-white">
      <WhatYourChildWillLearn />
      <HowItWorks />
      <GrowthMilestones />

      <style jsx>{`
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInLeft {
          animation: fadeInLeft 0.8s ease-out;
        }

        .animate-fadeInRight {
          animation: fadeInRight 0.8s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out both;
        }
      `}</style>
    </main>
  );
};

export default FinancialLiteracy;
