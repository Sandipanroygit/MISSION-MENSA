import React, { useState } from "react";
import {
  Check,
  Sparkles,
  Award,
  Crown,
  Users,
  GraduationCap,
  ArrowRight,
  Info,
} from "lucide-react";

const Pricing: React.FC = () => {
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);

  const pricingPlans = [
    {
      id: 1,
      name: "Individual Access",
      price: "2,000",
      period: "per module/month",
      description: "Ideal for supplementing school learning",
      icon: Sparkles,
      color: "from-[#2CA4A4] to-[#5EC1E8]",
      bgColor: "bg-[#2CA4A4]/5",
      borderColor: "border-[#2CA4A4]/20",
      hoverBorderColor: "group-hover:border-[#2CA4A4]",
      features: [
        "Access to 1 learning domain",
        "Self-paced learning modules",
        "Interactive activities",
        "Progress tracking",
        "Digital certificates",
      ],
      popular: false,
      delay: "0s",
    },
    {
      id: 2,
      name: "Midi Bundle",
      price: "7,000",
      period: "per month",
      description: "Save more with bundled access",
      icon: Award,
      color: "from-[#8B5FBF] to-[#FFC94B]",
      bgColor: "bg-[#8B5FBF]/5",
      borderColor: "border-[#8B5FBF]/20",
      hoverBorderColor: "group-hover:border-[#8B5FBF]",
      features: [
        "Access to 4 learning domains",
        "All Individual Access features",
        "Priority support",
        "Monthly progress reports",
        "Family dashboard access",
      ],
      popular: true,
      delay: "0.1s",
    },
    {
      id: 3,
      name: "Full Curriculum",
      price: "18,000",
      period: "per month",
      description: "Best value with full growth benefits",
      icon: Crown,
      color: "from-[#FFC94B] to-[#A5C85A]",
      bgColor: "bg-[#FFC94B]/5",
      borderColor: "border-[#FFC94B]/20",
      hoverBorderColor: "group-hover:border-[#FFC94B]",
      features: [
        "Access to all 11 learning domains",
        "All Midi Bundle features",
        "Exclusive learning materials",
        "Quarterly assessment reports",
        "Direct educator consultation",
        "Transition celebration access",
      ],
      popular: false,
      delay: "0.2s",
    },
  ];

  const addOns = [
    {
      title: "Teacher-Guided Support",
      price: "5,000",
      period: "per child/month",
      description: "One-on-one guidance from certified educators",
      icon: GraduationCap,
      color: "from-[#2CA4A4] to-[#5EC1E8]",
    },
    {
      title: "Family Pack Discounts",
      price: "Variable",
      period: "pricing",
      description: "Special rates for multiple children in one family",
      icon: Users,
      color: "from-[#5EC1E8] to-[#8B5FBF]",
    },
  ];

  return (
    <section className="min-h-screen py-20 bg-gradient-to-b from-[#FAF7F2] via-white to-[#FAF7F2] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-40 h-40 bg-[#2CA4A4]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-48 h-48 bg-[#FFC94B]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-[#8B5FBF]/5 rounded-full blur-2xl animate-bounce"></div>

        {/* Floating decorative elements */}
        <div className="absolute top-32 right-1/4 w-3 h-3 bg-[#5EC1E8] rounded-full animate-ping"></div>
        <div className="absolute bottom-60 left-20 w-2 h-2 bg-[#A5C85A] rounded-full animate-bounce"></div>
        <div
          className="absolute top-96 right-16 w-4 h-4 bg-[#FFC94B] rotate-45"
          style={{ animation: "spin 8s linear infinite" }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fadeInUp">
          <div className="inline-block mb-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#2CA4A4]/10 to-[#5EC1E8]/10 rounded-full border border-[#2CA4A4]/20">
              <Sparkles className="w-5 h-5 text-[#2CA4A4]" />
              <span className="text-sm font-semibold text-[#2CA4A4]">
                Flexible Plans
              </span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3E3E] mb-6">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-[#2CA4A4] to-[#5EC1E8] bg-clip-text text-transparent">
              Learning Plan
            </span>
          </h1>
          <p className="text-lg text-[#2F3E3E]/70 max-w-2xl mx-auto">
            Flexible subscriptions that grow with your child.
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-[#FFC94B] via-[#A5C85A] to-[#2CA4A4] mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Pricing Cards Grid - Centered */}
        <div className="flex justify-center mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
            {pricingPlans.map((plan) => {
              const IconComponent = plan.icon;
              const isHovered = hoveredPlan === plan.id;

              return (
                <div
                  key={plan.id}
                  onMouseEnter={() => setHoveredPlan(plan.id)}
                  onMouseLeave={() => setHoveredPlan(null)}
                  className={`group relative bg-white rounded-3xl p-8 shadow-lg border-2 ${
                    plan.borderColor
                  } ${
                    plan.hoverBorderColor
                  } hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-3 animate-fadeInUp ${
                    plan.popular ? "ring-2 ring-[#8B5FBF] ring-offset-4" : ""
                  }`}
                  style={{ animationDelay: plan.delay }}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-[#8B5FBF] to-[#FFC94B] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  {/* Background gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${plan.color} rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  ></div>

                  {/* Floating background decoration */}
                  <div
                    className={`absolute -top-4 -right-4 w-24 h-24 ${plan.bgColor} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}
                  ></div>

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="mb-6">
                      <div
                        className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                      >
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Plan Name */}
                    <h3 className="text-2xl font-bold text-[#2F3E3E] mb-2">
                      {plan.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-[#2F3E3E]/70 mb-6">
                      {plan.description}
                    </p>

                    {/* Price */}
                    <div className="mb-8">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm text-[#2F3E3E]/70">KES</span>
                        <span className="text-4xl font-bold text-[#2F3E3E]">
                          {plan.price}
                        </span>
                      </div>
                      <p className="text-sm text-[#2F3E3E]/60 mt-1">
                        {plan.period}
                      </p>
                    </div>

                    {/* Divider */}
                    <div
                      className={`w-full h-px bg-gradient-to-r ${plan.color} mb-6 opacity-20`}
                    ></div>

                    {/* Features List */}
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div
                            className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center mt-0.5`}
                          >
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm text-[#2F3E3E]/80">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <button
                      className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform group-hover:scale-105 shadow-md hover:shadow-xl flex items-center justify-center gap-2`}
                    >
                      Choose Plan
                      <ArrowRight
                        className={`w-5 h-5 transition-transform duration-300 ${
                          isHovered ? "translate-x-1" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Corner decoration */}
                  <div className="absolute bottom-4 right-4 w-2 h-2 bg-[#A5C85A] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add-ons Section */}
        <div
          className="mb-16 animate-fadeInUp"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2F3E3E] mb-4">
              Enhance Your Learning Experience
            </h2>
            <p className="text-[#2F3E3E]/70 max-w-2xl mx-auto">
              Optional add-ons to maximize your child's educational journey
            </p>
          </div>

          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              {addOns.map((addon, index) => {
                const IconComponent = addon.icon;
                return (
                  <div
                    key={index}
                    className="group relative bg-white rounded-2xl p-6 shadow-md hover:shadow-xl border border-gray-100 hover:border-[#2CA4A4]/30 transition-all duration-500 transform hover:scale-105 overflow-hidden"
                    style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                  >
                    {/* Background gradient overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${addon.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                    ></div>

                    <div className="relative z-10 flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br ${addon.color} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                      >
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-[#2F3E3E] mb-1">
                          {addon.title}
                        </h3>
                        <p className="text-sm text-[#2F3E3E]/70 mb-3">
                          {addon.description}
                        </p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm text-[#2F3E3E]/70">
                            {addon.price === "Variable" ? "" : "KES"}
                          </span>
                          <span className="text-2xl font-bold text-[#2F3E3E]">
                            {addon.price}
                          </span>
                          <span className="text-sm text-[#2F3E3E]/60">
                            {addon.period}
                          </span>
                        </div>
                      </div>

                      {/* Info icon */}
                      <div className="flex-shrink-0">
                        <Info className="w-5 h-5 text-[#2F3E3E]/40 group-hover:text-[#2CA4A4] transition-colors duration-300" />
                      </div>
                    </div>

                    {/* Bottom accent line */}
                    <div
                      className={`absolute bottom-0 left-6 right-6 h-1 bg-gradient-to-r ${addon.color} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
                    ></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div
          className="text-center animate-fadeInUp bg-gradient-to-r from-[#2CA4A4]/5 via-[#5EC1E8]/5 to-[#FFC94B]/5 rounded-3xl p-10 border border-[#2CA4A4]/10 shadow-lg max-w-5xl mx-auto"
          style={{ animationDelay: "0.5s" }}
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-[#2F3E3E] mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-[#2F3E3E]/70 mb-8 max-w-2xl mx-auto">
            Join thousands of families investing in their children's holistic
            development with Mensa
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group bg-gradient-to-r from-[#2CA4A4] to-[#5EC1E8] hover:from-[#5EC1E8] hover:to-[#2CA4A4] text-white font-semibold px-10 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
              Create Parent Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <button className="bg-white hover:bg-[#FAF7F2] text-[#2CA4A4] hover:text-[#2F3E3E] font-semibold px-10 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-xl border-2 border-[#2CA4A4]/20 hover:border-[#2CA4A4]/40">
              Schedule a Demo
            </button>
          </div>

          {/* Trust indicators */}
          <div className="mt-8 pt-8 border-t border-[#2CA4A4]/10">
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-[#2F3E3E]/60">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-[#A5C85A]" />
                <span>No long-term contracts</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-[#A5C85A]" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-[#A5C85A]" />
                <span>7-day money-back guarantee</span>
              </div>
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

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  );
};

export default Pricing;
