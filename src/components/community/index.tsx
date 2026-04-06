import React, { useState } from "react";
import {
  ArrowRight,
  MessageCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Star,
  Users,
} from "lucide-react";

// Child Component 1: Forum
const Forum: React.FC = () => {
  return (
    <section className="py-16 bg-[#FAF7F2] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-32 h-32 bg-[#2CA4A4]/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-[#FFC94B]/10 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-[#5EC1E8] rounded-full animate-ping"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fadeInUp">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3E3E] mb-6">
            Community
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div className="space-y-8 animate-fadeInLeft">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#2F3E3E] flex items-center space-x-3">
                <MessageCircle className="w-6 h-6 text-[#2CA4A4]" />
                <span>Forum</span>
              </h2>

              <div className="space-y-4 text-[#2F3E3E]/80 leading-relaxed">
                <p>
                  Join our vibrant community of parents, educators, and
                  children! Share your experiences, ask questions, and connect
                  with others on a similar journey.
                </p>
              </div>
            </div>

            <button className="group bg-[#2CA4A4] hover:bg-[#5EC1E8] text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2">
              <span>Go to Forum</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>

          {/* Right Image Placeholder */}
          <div className="relative animate-fadeInRight">
            <div className="relative bg-gradient-to-br from-[#2CA4A4]/10 to-[#5EC1E8]/10 rounded-3xl p-8 backdrop-blur-sm">
              <div className="relative h-64 bg-gradient-to-br from-[#FAF7F2] to-[#2CA4A4]/20 rounded-2xl overflow-hidden shadow-2xl border border-[#2CA4A4]/10">
                {/* Image placeholder */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#FAF7F2] to-[#2CA4A4]/10">
                  <div className="text-center text-[#2F3E3E]/50">
                    <Users className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-sm">Community Forum</p>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute top-6 right-6 w-8 h-8 bg-[#2CA4A4] rounded-full animate-bounce delay-100"></div>
                <div className="absolute bottom-8 left-8 w-6 h-6 bg-[#FFC94B] rounded-full animate-pulse"></div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#5EC1E8] rounded-full"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-[#8B5FBF] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Child Component 2: Events with Calendar
const Events: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState("July 2024");
  const [selectedDate, setSelectedDate] = useState(5);

  const months = ["July 2024", "August 2024"];
  const monthIndex = months.indexOf(currentMonth);

  const calendarDays = {
    "July 2024": [
      [null, 1, 2, 3, 4, 5, 6],
      [7, 8, 9, 10, 11, 12, 13],
      [14, 15, 16, 17, 18, 19, 20],
      [21, 22, 23, 24, 25, 26, 27],
      [28, 29, 30, 31, null, null, null],
    ],
    "August 2024": [
      [null, null, null, null, 1, 2, 3],
      [4, 5, 6, 7, 8, 9, 10],
      [11, 12, 13, 14, 15, 16, 17],
      [18, 19, 20, 21, 22, 23, 24],
      [25, 26, 27, 28, 29, 30, 31],
    ],
  };

  const goToPrevMonth = () => {
    if (monthIndex > 0) {
      setCurrentMonth(months[monthIndex - 1]);
    }
  };

  const goToNextMonth = () => {
    if (monthIndex < months.length - 1) {
      setCurrentMonth(months[monthIndex + 1]);
    }
  };

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-40 h-40 bg-[#A5C85A]/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#5EC1E8]/5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-[#FFC94B] rounded-full animate-bounce"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8 animate-fadeInUp">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#2F3E3E] flex items-center space-x-3">
              <Calendar className="w-6 h-6 text-[#2CA4A4]" />
              <span>Events</span>
            </h2>

            <div className="space-y-4 text-[#2F3E3E]/80 leading-relaxed">
              <p>
                Explore our calendar of virtual and in-person events designed to
                engage and inspire children. From workshops to meetups, there's
                something for everyone.
              </p>
            </div>
          </div>

          {/* Calendar */}
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={goToPrevMonth}
                disabled={monthIndex === 0}
                className="p-2 hover:bg-[#2CA4A4]/10 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5 text-[#2CA4A4]" />
              </button>

              <h3 className="text-lg font-bold text-[#2F3E3E]">
                {currentMonth}
              </h3>

              <button
                onClick={goToNextMonth}
                disabled={monthIndex === months.length - 1}
                className="p-2 hover:bg-[#2CA4A4]/10 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5 text-[#2CA4A4]" />
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                <div
                  key={day}
                  className="h-8 flex items-center justify-center font-medium text-[#2F3E3E]/60 text-sm"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="space-y-2">
              {calendarDays[currentMonth].map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 gap-2">
                  {week.map((day, dayIndex) => (
                    <button
                      key={dayIndex}
                      onClick={() => day && setSelectedDate(day)}
                      disabled={!day}
                      className={`h-10 w-10 flex items-center justify-center text-sm rounded-full transition-all duration-200 ${
                        day === selectedDate
                          ? "bg-[#2CA4A4] text-white font-semibold"
                          : day
                          ? "hover:bg-[#2CA4A4]/10 text-[#2F3E3E]"
                          : "cursor-default"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Child Component 3: Featured Kids
const FeaturedKids: React.FC = () => {
  const featuredKids = [
    {
      name: "Sophia's Story",
      description:
        "Sophia, Age 10, shares her experience with our Financial Literacy program.",
      image: "/placeholder-sophia.jpg",
    },
    {
      name: "Ethan's Journey",
      description:
        "Ethan, Age 8, talks about how our programs helped him grow.",
      image: "/placeholder-ethan.jpg",
    },
    {
      name: "Olivia's Adventure",
      description:
        "Olivia, Age 12, discusses her journey with our Coding curriculum.",
      image: "/placeholder-olivia.jpg",
    },
  ];

  return (
    <section className="py-16 bg-[#FAF7F2] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-36 h-36 bg-[#5EC1E8]/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-[#FFC94B]/10 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-[#A5C85A] rounded-full animate-ping"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2F3E3E] mb-6 flex items-center justify-center space-x-3">
            <Star className="w-8 h-8 text-[#2CA4A4]" />
            <span>Featured Kids</span>
          </h2>
          <p className="text-[#2F3E3E]/80 max-w-3xl mx-auto">
            Meet some of the amazing children who are part of the Mensa
            community! Learn about their achievements and stories.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {featuredKids.map((kid, index) => (
            <div
              key={kid.name}
              className={`group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-fadeInUp border border-gray-100 hover:border-[#2CA4A4]/20`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Image placeholder */}
              <div className="relative w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#2CA4A4]/20 to-[#5EC1E8]/20 rounded-full overflow-hidden shadow-lg">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FAF7F2] to-[#2CA4A4]/10">
                  <div className="text-center text-[#2F3E3E]/50">
                    <Users className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-xs">{kid.name.split("'")[0]}</p>
                  </div>
                </div>

                {/* Decorative ring */}
                <div className="absolute inset-0 rounded-full border-4 border-[#2CA4A4]/20 group-hover:border-[#2CA4A4]/40 transition-colors duration-300"></div>
              </div>

              {/* Content */}
              <div className="text-center space-y-4">
                <h3 className="text-lg font-bold text-[#2F3E3E] group-hover:text-[#2CA4A4] transition-colors duration-300">
                  {kid.name}
                </h3>
                <p className="text-sm text-[#2F3E3E]/70 group-hover:text-[#2F3E3E]/90 transition-colors duration-300 leading-relaxed">
                  {kid.description}
                </p>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#FFC94B] rounded-full animate-bounce opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-[#A5C85A] rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#2CA4A4]/5 to-[#5EC1E8]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          className="text-center mt-16 animate-fadeInUp"
          style={{ animationDelay: "0.6s" }}
        >
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-[#2CA4A4]/10 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-[#2F3E3E] mb-4">
              Join Our Community Today!
            </h3>
            <p className="text-[#2F3E3E]/80 mb-6 max-w-2xl mx-auto">
              Connect with other families, share experiences, and be part of a
              supportive community dedicated to holistic child development.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#2CA4A4] hover:bg-[#5EC1E8] text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Join Community</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-[#FFC94B] hover:bg-[#A5C85A] text-[#2F3E3E] font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Parent Component
const Community: React.FC = () => {
  return (
    <main className="min-h-screen bg-white">
      <Forum />
      <Events />
      <FeaturedKids />

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

export default Community;
