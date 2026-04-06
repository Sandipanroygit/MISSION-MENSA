import React, { useState } from "react";
import {
  ArrowRight,
  Palette,
  Paintbrush,
  Users,
  Home,
  GraduationCap,
  Award,
  Play,
  ChevronDown,
} from "lucide-react";

// Child Component 1: What Your Child Will Learn
const WhatYourChildWillLearn: React.FC = () => {
  const learningAreas = [
    {
      icon: Paintbrush,
      title: "Explorers",
      description:
        "Colors, shapes, puppet making, interactive storytelling with animated characters guide the learning.",
      color: "from-[#FFC94B] to-[#A5C85A]",
      bgColor: "bg-[#FFC94B]/10",
    },
    {
      icon: Palette,
      title: "Trailblazers",
      description:
        "Crafts, beginner acting, storytelling. Engage with animated characters to create your own cartoon characters.",
      color: "from-[#8B5FBF] to-[#5EC1E8]",
      bgColor: "bg-[#8B5FBF]/10",
    },
    {
      icon: Users,
      title: "Pathfinders",
      description:
        "Digital art, scriptwriting, performance, learn with interactive digital art tools and animated tutorials.",
      color: "from-[#2CA4A4] to-[#A5C85A]",
      bgColor: "bg-[#2CA4A4]/10",
    },
    {
      icon: Award,
      title: "Vanguards",
      description:
        "Portfolio creation, exhibitions, collaborative projects. Create professional work in virtual galleries with animated avatars.",
      color: "from-[#5EC1E8] to-[#FFC94B]",
      bgColor: "bg-[#5EC1E8]/10",
    },
  ];

  return (
    <section className="py-16 bg-[#FAF7F2] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-32 h-32 bg-[#FFC94B]/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-[#8B5FBF]/10 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-[#5EC1E8] rounded-full animate-ping"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fadeInUp">
          <div className="inline-flex items-center space-x-2 bg-[#FFC94B]/10 px-4 py-2 rounded-full mb-6">
            <Palette className="w-4 h-4 text-[#FFC94B]" />
            <span className="text-sm font-medium text-[#FFC94B]">
              Creative Arts & Craft
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3E3E] mb-6">
            Creative Arts & Craft
          </h1>

          <p className="text-lg text-[#2CA4A4] font-medium max-w-4xl mx-auto">
            Expressing imagination through art, drama, and design! Explore our
            vibrant world of creativity with interactive animations and fun art
            forms.
          </p>

          {/* Creative Header Image */}
          <div
            className="relative max-w-2xl mx-auto mt-8 animate-fadeInUp"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="relative h-32 bg-gradient-to-r from-[#FFC94B] via-[#8B5FBF] to-[#5EC1E8] rounded-2xl overflow-hidden shadow-xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="flex justify-center space-x-4 mb-2">
                    <Paintbrush className="w-6 h-6" />
                    <Palette className="w-8 h-8" />
                    <Users className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium">
                    Art Supplies & Creativity
                  </p>
                </div>
              </div>

              {/* Floating art elements */}
              <div className="absolute top-2 left-4 w-4 h-4 bg-white/30 rounded-full animate-bounce"></div>
              <div className="absolute bottom-2 right-4 w-3 h-3 bg-white/40 rounded-full animate-pulse"></div>
              <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-white/50 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>

        <div
          className="space-y-8 animate-fadeInUp"
          style={{ animationDelay: "0.4s" }}
        >
          <h2 className="text-2xl font-bold text-[#2F3E3E] text-center">
            What Your Child Will Learn
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {learningAreas.map((area, index) => {
              const IconComponent = area.icon;
              return (
                <div
                  key={area.title}
                  className={`group relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-fadeInUp border border-gray-100 hover:border-[#FFC94B]/20`}
                  style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                >
                  <div
                    className={`w-12 h-12 ${area.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className="w-6 h-6 text-[#2CA4A4]" />
                  </div>
                  <h3 className="font-bold text-[#2F3E3E] mb-3 group-hover:text-[#FFC94B] transition-colors duration-300">
                    {area.title}
                  </h3>
                  <p className="text-sm text-[#2F3E3E]/70 leading-relaxed group-hover:text-[#2F3E3E]/90 transition-colors duration-300">
                    {area.description}
                  </p>

                  {/* Hover gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${area.color} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`}
                  ></div>

                  {/* Bottom accent line */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${area.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

// Child Component 2: How It Works
const HowItWorks: React.FC = () => {
  const workFlows = [
    {
      icon: Paintbrush,
      title: "Self-guided",
      description: "Art tutorials, creative apps with animated guides",
      color: "from-[#FFC94B] to-[#A5C85A]",
    },
    {
      icon: Home,
      title: "Parent/Child",
      description: "DIY family projects with interactive cartoon instructions",
      color: "from-[#8B5FBF] to-[#5EC1E8]",
    },
    {
      icon: GraduationCap,
      title: "Teacher-assisted",
      description:
        "Group performances, showcases with animated characters and virtual stages",
      color: "from-[#2CA4A4] to-[#FFC94B]",
    },
  ];

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-40 h-40 bg-[#8B5FBF]/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#FFC94B]/5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-[#5EC1E8] rounded-full animate-bounce"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2F3E3E] mb-6">
            How It Works
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {workFlows.map((flow, index) => {
            const IconComponent = flow.icon;
            return (
              <div
                key={flow.title}
                className={`group relative text-center p-8 bg-[#FAF7F2] hover:bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-fadeInUp border border-gray-100 hover:border-[#FFC94B]/20`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                  <IconComponent className="w-8 h-8 text-[#2CA4A4] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-bold text-[#2F3E3E] mb-4 group-hover:text-[#FFC94B] transition-colors duration-300">
                  {flow.title}
                </h3>
                <p className="text-[#2F3E3E]/80 group-hover:text-[#2F3E3E] transition-colors duration-300 leading-relaxed">
                  {flow.description}
                </p>

                {/* Hover gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${flow.color} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Child Component 3: Example Activities & Growth Milestones
const ActivitiesAndMilestones: React.FC = () => {
  const activities = [
    {
      title: "Explorers",
      description: "Finger painting day with animated tutorial",
      ageGroup: "Ages 4-6",
      color: "from-[#FFC94B] to-[#A5C85A]",
    },
    {
      title: "Trailblazers",
      description: "Mini puppet theatre with cartoon puppets",
      ageGroup: "Ages 7-10",
      color: "from-[#8B5FBF] to-[#5EC1E8]",
    },
    {
      title: "Pathfinders",
      description: "Create a short comic strip with interactive tools",
      ageGroup: "Ages 11-14",
      color: "from-[#2CA4A4] to-[#A5C85A]",
    },
    {
      title: "Vanguards",
      description:
        "Design an art exhibition with virtual tours and animated guides",
      ageGroup: "Ages 15-18",
      color: "from-[#5EC1E8] to-[#FFC94B]",
    },
  ];

  const milestones = [
    {
      title: "Badges",
      description:
        '"Art Explorer," "Creative Genius," "Master Storyteller." Earn animated badges for achievements.',
      icon: Award,
    },
    {
      title: "Certificates",
      description: "Showcase achievements with interactive certificates",
      icon: Palette,
    },
    {
      title: "Events",
      description:
        "Mensa Art Expo with virtual stages and animated performances",
      icon: Users,
    },
  ];

  const [selectedAge, setSelectedAge] = useState("Select");
  const ageGroups = [
    "Select",
    "Explorers",
    "Trailblazers",
    "Pathfinders",
    "Vanguards",
  ];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getSelectedActivity = () => {
    if (selectedAge === "Select") return null;
    return activities.find((activity) => activity.title === selectedAge);
  };

  const selectedActivity = getSelectedActivity();

  return (
    <section className="py-16 bg-[#FAF7F2] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-36 h-36 bg-[#FFC94B]/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-[#8B5FBF]/10 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-[#2CA4A4] rounded-full animate-ping"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Example Activities */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-[#2F3E3E] mb-8 text-center animate-fadeInUp">
            Example Activities
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activities.map((activity, index) => (
              <div
                key={activity.title}
                className={`group relative text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-fadeInUp border border-gray-100 hover:border-[#FFC94B]/20`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-[#FFC94B]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Paintbrush className="w-6 h-6 text-[#FFC94B]" />
                </div>
                <h3 className="font-bold text-[#2F3E3E] mb-2 group-hover:text-[#FFC94B] transition-colors duration-300">
                  {activity.title}
                </h3>
                <p className="text-sm text-[#2F3E3E]/70 group-hover:text-[#2F3E3E]/90 transition-colors duration-300 leading-relaxed">
                  {activity.description}
                </p>

                {/* Hover gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${activity.color} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Milestones */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-[#2F3E3E] mb-8 text-center animate-fadeInUp">
            Growth Milestones
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {milestones.map((milestone, index) => {
              const IconComponent = milestone.icon;
              return (
                <div
                  key={milestone.title}
                  className={`group relative text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-fadeInUp border border-gray-100 hover:border-[#FFC94B]/20`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="w-16 h-16 bg-[#FFC94B]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-[#FFC94B]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#2F3E3E] mb-4 group-hover:text-[#FFC94B] transition-colors duration-300">
                    {milestone.title}
                  </h3>
                  <p className="text-[#2F3E3E]/80 group-hover:text-[#2F3E3E] transition-colors duration-300 leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sneak Peek by Age Group */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-[#2F3E3E] mb-8 text-center animate-fadeInUp">
            Sneak Peek by Age Group
          </h2>

          <div
            className="max-w-md mx-auto mb-8 animate-fadeInUp"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFC94B]/20 focus:border-[#FFC94B] transition-colors duration-200 flex items-center justify-between"
              >
                <span
                  className={
                    selectedAge === "Select"
                      ? "text-[#2F3E3E]/50"
                      : "text-[#2F3E3E]"
                  }
                >
                  {selectedAge}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[#2F3E3E]/40 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg">
                  {ageGroups.map((group) => (
                    <button
                      key={group}
                      onClick={() => {
                        setSelectedAge(group);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-[#FFC94B]/10 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
                    >
                      {group}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedActivity && (
              <div className="mt-6 p-6 bg-white rounded-xl shadow-lg border border-[#FFC94B]/10 animate-fadeInUp">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${selectedActivity.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <Paintbrush className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-[#2F3E3E] text-center mb-2">
                  {selectedActivity.title}
                </h3>
                <p className="text-sm text-[#2F3E3E]/80 text-center mb-2">
                  {selectedActivity.ageGroup}
                </p>
                <p className="text-[#2F3E3E] text-center">
                  {selectedActivity.description}
                </p>
              </div>
            )}
          </div>

          {/* Learning Areas Preview */}
          <div
            className="text-center mb-8 animate-fadeInUp"
            style={{ animationDelay: "0.4s" }}
          >
            <p className="text-[#2F3E3E]/80 mb-6">
              Key Learning Areas: Colors & Shapes, Creative Builders, Young
              Designers. Watch animated previews of our lessons!
            </p>
          </div>

          {/* Interactive Preview Box */}
          <div
            className="relative max-w-4xl mx-auto animate-fadeInUp"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="relative bg-gradient-to-br from-[#2CA4A4]/10 to-[#8B5FBF]/10 rounded-3xl p-8 backdrop-blur-sm">
              <div className="relative h-64 bg-gradient-to-br from-[#2CA4A4] via-[#5EC1E8] to-[#8B5FBF] rounded-2xl overflow-hidden shadow-2xl border border-[#FFC94B]/20">
                {/* Mystical forest scene placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm hover:scale-110 transition-transform duration-300 cursor-pointer">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                    <p className="text-sm font-medium">
                      Interactive Art Lesson Preview
                    </p>
                  </div>
                </div>

                {/* Magical floating elements */}
                <div className="absolute top-8 left-8 w-6 h-6 bg-[#FFC94B] rounded-full animate-bounce flex items-center justify-center">
                  <Paintbrush className="w-3 h-3 text-white" />
                </div>
                <div className="absolute top-12 right-12 w-8 h-8 bg-[#A5C85A] rounded-full animate-pulse flex items-center justify-center">
                  <Palette className="w-4 h-4 text-white" />
                </div>
                <div className="absolute bottom-12 left-1/4 w-5 h-5 bg-white/30 rounded-full animate-bounce delay-300"></div>
                <div className="absolute bottom-8 right-1/3 w-4 h-4 bg-[#FFC94B]/60 rounded-full animate-ping"></div>
              </div>

              {/* Decorative frame elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#FFC94B] rounded-full"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-[#8B5FBF] rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Imaginators Club */}
        <div
          className="text-center animate-fadeInUp"
          style={{ animationDelay: "0.8s" }}
        >
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-[#8B5FBF]/10 max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-[#8B5FBF] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Palette className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#2F3E3E] mb-4">
              Imaginators Club
            </h3>
            <p className="text-[#2F3E3E]/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              Monthly art challenges, gallery showcases, contests with animated
              themes and interactive elements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#8B5FBF] hover:bg-[#2CA4A4] text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                Select Domain
              </button>
              <button className="bg-[#FFC94B] hover:bg-[#A5C85A] text-[#2F3E3E] font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center space-x-2">
                <span>Demo Lesson with Animated Characters</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Parent Component
const CreativeArtsCraft: React.FC = () => {
  return (
    <main className="min-h-screen bg-white">
      <WhatYourChildWillLearn />
      <HowItWorks />
      <ActivitiesAndMilestones />

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

export default CreativeArtsCraft;
