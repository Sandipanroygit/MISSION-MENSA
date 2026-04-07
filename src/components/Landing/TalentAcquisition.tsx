import React from "react";
import { ClipboardCheck, School } from "lucide-react";

const assessmentSchools = [
  {
    name: "IICD",
    detail: "Grade 10 assessment",
    images: [
      "/talent-acquisition/iicd-grade-10-1.jpg",
      "/talent-acquisition/iicd-grade-10-2.jpg",
      "/talent-acquisition/iicd-grade-10-3.jpg",
    ],
  },
  {
    name: "Govt School, Dommasandra",
    detail: "44 students assessed",
    images: ["/talent-acquisition/govt-school-dommasandra-1.jpg"],
    rotate: true,
  },
  {
    name: "Saraswati Vidyaniketan, Dommasandra",
    detail: "71 Grade 8 students assessed",
    images: [
      "/talent-acquisition/saraswati-vidyaniketan-1.jpg",
      "/talent-acquisition/saraswati-vidyaniketan-2.jpg",
    ],
    rotate: true,
  },
];

const TalentAcquisitionSection: React.FC = () => {
  return (
    <section className="relative flex min-h-full items-center overflow-hidden bg-[#FAF7F2] py-3 lg:py-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-[#2CA4A4]/15 blur-3xl" />
        <div className="absolute bottom-10 right-0 h-80 w-80 rounded-full bg-[#FFC94B]/20 blur-3xl" />
        <div className="absolute right-1/4 top-1/3 h-56 w-56 rounded-full bg-[#A5C85A]/16 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-3 text-center animate-fadeInUp">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-[#d71912]">
            Assessment Phase 1
          </p>
          <h2 className="mb-2 text-2xl font-bold text-[#2F3E3E] sm:text-3xl lg:text-4xl">
            Talent Acquisition and{" "}
            <span className="bg-gradient-to-r from-[#2CA4A4] to-[#5EC1E8] bg-clip-text text-transparent">
              Recruitment
            </span>
          </h2>
          <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-[#FFC94B] to-[#A5C85A]" />
        </div>

        <div className="group relative overflow-hidden rounded-lg border border-[#d7eee8] bg-white p-4 shadow-xl shadow-[#2CA4A4]/10 transition-all duration-700 hover:-translate-y-1 hover:scale-[1.005] hover:shadow-2xl">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#d71912] via-[#FFC94B] to-[#2CA4A4] transition-all duration-500 group-hover:h-2.5" />
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#5EC1E8]/18 blur-3xl transition-transform duration-700 group-hover:scale-125" />
          <div className="absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-[#FFC94B]/18 blur-3xl transition-transform duration-700 group-hover:scale-125" />

          <div className="relative grid gap-3 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#d71912] sm:text-base">
                Assessment Phase 1
              </p>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-3">
              {[
                ["320", "Assessments completed till date"],
                ["03", "School cohorts documented"],
                ["Phase 1", "Screening and field outreach"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-lg border border-[#d7eee8] bg-[#f7fbfa] p-2.5 text-[#123d22] shadow-lg shadow-[#2CA4A4]/8"
                >
                  <p className="font-serif text-2xl font-black">{value}</p>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#5c6b63]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-3 grid gap-4 lg:grid-cols-3">
            {assessmentSchools.map((school) => (
              <article
                key={school.name}
                className="group/school relative overflow-hidden rounded-lg border border-[#e3efed] bg-white shadow-xl shadow-[#2CA4A4]/10 transition duration-500 hover:-translate-y-1 hover:shadow-2xl"
              >
                {school.stack ? (
                  <div className="relative h-72 overflow-hidden bg-[#eef7f4] p-2 sm:h-80">
                    {school.images.map((image, index) => (
                      <div
                        key={image}
                        className="absolute top-2 bottom-2 overflow-hidden rounded-lg border border-white/70 bg-white shadow-lg shadow-[#2CA4A4]/18 transition duration-700 group-hover/school:-translate-y-1"
                        style={{
                          left: `${index * 22 + 4}%`,
                          width: "52%",
                          zIndex: index + 1,
                          transform: `rotate(${(index - 1) * 2}deg)`,
                        }}
                      >
                        <img
                          src={image}
                          alt={`${school.name} assessment ${index + 1}`}
                          className="h-full w-full object-cover transition duration-700 group-hover/school:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-70" />
                        <span className="absolute left-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#FFC94B] text-[10px] font-black text-[#123d22] shadow-md">
                          {index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid h-72 grid-cols-2 gap-1 overflow-hidden bg-[#eef7f4] sm:h-80">
                    {school.images.map((image, index) => (
                      <div
                        key={image}
                        className={`relative overflow-hidden ${
                          school.images.length === 1 ||
                          (school.images.length === 3 && index === 0)
                            ? "col-span-2"
                            : ""
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${school.name} assessment ${index + 1}`}
                          className={`h-full w-full object-cover transition duration-700 group-hover/school:scale-105 ${
                            school.rotate ? "rotate-90 scale-[1.65]" : ""
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/32 via-transparent to-transparent opacity-70" />
                      </div>
                    ))}
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/78 via-black/42 to-transparent p-4 text-white">
                  <div className="flex items-end justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-2.5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/18 text-[#FFC94B] ring-1 ring-white/25 backdrop-blur-sm">
                        <School className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-base font-black leading-snug text-white">
                          {school.name}
                        </h4>
                        <p className="mt-0.5 text-xs font-bold text-[#FFC94B]">
                          {school.detail}
                        </p>
                      </div>
                    </div>
                    <span className="hidden shrink-0 items-center gap-1.5 rounded-lg bg-white/16 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/85 ring-1 ring-white/25 backdrop-blur-sm sm:flex">
                      <ClipboardCheck className="h-3.5 w-3.5 text-[#FFC94B]" />
                      Documented
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TalentAcquisitionSection;
