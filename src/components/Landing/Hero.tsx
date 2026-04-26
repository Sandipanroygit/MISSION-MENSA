import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HeroSection: React.FC = () => {
  const heroStats = [
    { number: "01", value: "Top 2%", label: "Target Percentile" },
    { number: "02", value: "Grade 9", label: "Entry Cohort" },
    { number: "03", value: "2-Stage", label: "Screening Model" },
    { number: "04", value: "MENSA", label: "Assessment Partner" },
  ];

  const carouselImages = [
    "https://induscommunityschool.com/wp-content/uploads/2023/04/sponser-child-new.jpg",
    "https://induscommunityschool.com/wp-content/uploads/2023/04/banner-3.jpg",
    "https://induscommunityschool.com/wp-content/uploads/2023/04/banner-1.jpg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToPrevious = () => {
    setIsPaused(true);
    setCurrentImageIndex((prev) =>
      prev === 0 ? carouselImages.length - 1 : prev - 1,
    );
    setTimeout(() => setIsPaused(false), 3000);
  };

  const goToNext = () => {
    setIsPaused(true);
    setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    setTimeout(() => setIsPaused(false), 3000);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [carouselImages.length, isPaused]);

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(160deg,#eff9f6_0%,#e2f2ec_42%,#d7ebe4_100%)]">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#5EC1E8]/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#2CA4A4]/18 blur-3xl" />
      <div className="pointer-events-none absolute left-1/3 top-1/2 h-40 w-40 rounded-full bg-[#FFC94B]/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#1f5d69]">
                01 Home
              </p>
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#b84d2e]">
                Indus International School x Mensa India x Bengaluru
              </p>
            </div>

            <div className="space-y-4">
              <h1 className="font-serif text-4xl leading-[0.95] text-[#123f49] sm:text-5xl lg:text-6xl">
                Mission Mensa
                <span className="mt-3 block text-2xl font-semibold italic leading-snug text-[#256c7a] sm:text-3xl lg:text-4xl">
                  India's First School for Future Nation Builders
                </span>
              </h1>

              <p className="max-w-2xl text-sm leading-relaxed text-[#294f57] sm:text-base">
                This project identifies students of exceptional intellectual
                talent, but its long-term ambition must evolve toward
                identifying and nurturing exceptional talent across multiple
                intelligences. At the core of Mission Mensa is nation-building,
                which requires exceptional individuals across many domains of
                human capability.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {heroStats.map((stat) => (
                <article
                  key={stat.value}
                  className="group relative overflow-hidden rounded-2xl border-2 border-[#6ea7b3]/70 bg-[linear-gradient(160deg,#f9fffd_0%,#eaf7f3_52%,#dceee8_100%)] p-4 shadow-[0_16px_28px_-20px_rgba(26,92,100,0.85)] transition hover:-translate-y-1"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#2f7f95] via-[#2CA4A4] to-[#5EC1E8]" />
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-[#93c9c4] px-2.5 py-1 text-[10px] font-black text-[#1d6070]">
                      {stat.number}
                    </span>
                    <span className="h-2 w-2 rounded-full bg-[#2CA4A4] shadow-[0_0_16px_rgba(44,164,164,0.8)]" />
                  </div>
                  <p className="mt-4 whitespace-nowrap font-serif text-2xl leading-none text-[#124753] sm:text-3xl xl:text-2xl">
                    {stat.value}
                  </p>
                  <p className="mt-3 text-[10px] font-black uppercase tracking-[0.17em] text-[#3d6971]">
                    {stat.label}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="relative">
            <div
              className="relative h-[340px] overflow-hidden rounded-[2rem] border-2 border-[#6ea7b3]/65 bg-white shadow-[0_28px_52px_-28px_rgba(20,75,83,0.95)] sm:h-[420px] lg:h-[500px]"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#133f4a]/18 via-transparent to-transparent" />
              {carouselImages.map((image, index) => (
                <img
                  key={image}
                  src={image}
                  alt={`Mensa learning experience ${index + 1}`}
                  className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
                    index === currentImageIndex
                      ? "scale-100 opacity-100"
                      : "scale-105 opacity-0"
                  }`}
                />
              ))}

              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/85 shadow-lg transition hover:bg-white"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5 text-[#234b56]" />
              </button>

              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/85 shadow-lg transition hover:bg-white"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5 text-[#234b56]" />
              </button>

              <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2.5 rounded-full transition-all ${
                      index === currentImageIndex
                        ? "w-8 bg-[#2CA4A4]"
                        : "w-2.5 bg-white/75 hover:bg-white"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
