const intelligencePathways = [
  "Analytical and logical intelligence",
  "Creative and artistic intelligence",
  "Entrepreneurial and opportunity intelligence",
  "Social and leadership intelligence",
  "Technological and systems intelligence",
  "Spatial intelligence",
  "Kinaesthetic intelligence",
  "Moral and philosophical intelligence",
];

const aboutMensaHero =
  "https://induscommunityschool.com/wp-content/uploads/2023/04/banner-3.jpg";

const prototypeTeam = [
  "PhD Psychologist",
  "AI Expert + Learning Experience Designer",
  "NID Designer (SUY)",
  "Data and Research Lead",
  "Talent Identification & Recruitment Lead",
  "Only 1 Mentor / Orchestrator. Train individual ASAP",
  "Cluster Lead",
];

const AboutMensa = () => {
  return (
    <main className="min-h-screen bg-[#FAF7F2] px-4 py-16 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-5xl overflow-hidden rounded-lg border border-white/80 bg-white shadow-2xl shadow-[#234f12]/14">
        <div
          className="relative min-h-[23rem] overflow-hidden border-b border-[#d7e6a7]/80 bg-cover bg-center px-6 py-12 sm:px-10 lg:px-12"
          style={{ backgroundImage: `url(${aboutMensaHero})` }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,61,34,0.92)_0%,rgba(18,61,34,0.72)_42%,rgba(18,61,34,0.32)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/35 to-transparent" />
          <div className="relative flex min-h-[17rem] max-w-3xl flex-col justify-end">
            <p className="inline-flex w-fit rounded-full bg-[#FFC94B] px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#1c260f] shadow-lg shadow-black/20">
              About Mensa
            </p>
            <h1 className="mt-5 max-w-2xl font-serif text-4xl font-black leading-tight text-[#fff4d0] drop-shadow-xl sm:text-5xl lg:text-6xl">
              Building a National Talent Architecture
            </h1>
            <p className="mt-5 max-w-xl text-base font-semibold leading-relaxed text-white/88 sm:text-lg">
              Identifying exceptional potential early and creating the
              conditions for disciplined, AI-enabled, mentor-led growth.
            </p>
          </div>
        </div>

        <div className="px-6 py-10 sm:px-10 lg:px-12">
          <div className="relative border-y border-[#d7e6a7] bg-[#fbfff1] px-5 py-6 sm:px-7">
            <span className="absolute left-0 top-6 h-16 w-1.5 rounded-r-full bg-[#d71912]" />
            <p className="relative pl-5 font-serif text-2xl font-black leading-snug text-[#123d22] sm:text-3xl">
              When exceptional talent remains undiscovered or unsupported,
              societies lose an important source of intellectual and creative
              capital.
            </p>
            <div className="mt-5 h-1 w-28 rounded-full bg-[#FFC94B]" />
          </div>

          <div className="mt-8 border-l-4 border-[#A5C85A] pl-5 text-lg leading-8 text-[#24322a] sm:pl-7">
            <div className="space-y-5">
              <p>
                Mission Mensa seeks to address this challenge by creating an
                environment, where outliers can be identified early and given
                the tools and opportunities to develop their full potential.
              </p>

              <p>
                The emergence of Artificial Intelligence now makes this
                objective more achievable than ever before. AI-enabled learning
                systems can provide personalised learning, accelerate
                conceptual understanding of knowledge, and expose students to
                global networks.
              </p>

              <p>
                When combined with strong mentorship and disciplined learning,
                these tools make it possible to cultivate exceptional talent at
                a scale that was previously difficult.
              </p>

              <p>
                Mission Mensa, therefore, represents not only an educational
                experiment, but also a step toward building a national talent
                architecture capable of supporting the long-term development of
                society.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#d71912]">
              Intelligence Pathways
            </p>
            <p className="mt-3 text-lg leading-8 text-[#24322a]">
              Mission Mensa therefore recognises that, exceptional individuals
              may emerge through different intellectual and creative pathways.
              These would include forms of intelligence that contributes to
              progress of society encompassing:
            </p>

            <ol className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {intelligencePathways.map((pathway, index) => (
                <li
                  key={pathway}
                  className="flex gap-3 text-base font-semibold leading-7 text-[#24322a]"
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f1fae1] text-sm font-black text-[#234f12] ring-1 ring-[#d7e6a7]">
                    {index + 1}
                  </span>
                  <span>{pathway}.</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </article>

      <section className="relative mx-auto mt-12 max-w-5xl overflow-hidden rounded-lg border border-[#d9e8e8] bg-[#f8fbfb] px-5 py-8 shadow-2xl shadow-[#2CA4A4]/10 sm:px-8 lg:px-10">
        <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-[#d71912] via-[#FFC94B] to-[#2CA4A4]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(94,193,232,0.18),transparent_18rem),radial-gradient(circle_at_10%_92%,rgba(255,201,75,0.18),transparent_16rem)]" />
        <div className="relative">
          <p className="mb-5 inline-flex rounded-full bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#d71912] shadow-sm ring-1 ring-[#e7eeee]">
            Prototype Team
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            {prototypeTeam.map((role, index) => {
              const accents = [
                "from-[#d71912] to-[#ff8a80]",
                "from-[#2CA4A4] to-[#5EC1E8]",
                "from-[#FFC94B] to-[#F59E0B]",
                "from-[#A5C85A] to-[#6EA72A]",
              ];
              const accent = accents[index % accents.length];

              return (
                <div
                  key={role}
                  className="group relative flex min-h-20 items-center gap-4 overflow-hidden rounded-lg border border-white bg-white p-4 text-[#123d22] shadow-lg shadow-[#123d22]/7 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className={`absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b ${accent}`} />
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${accent} text-sm font-black text-white shadow-md transition duration-300 group-hover:scale-105`}>
                    {index + 1}
                  </span>
                  <p className="text-base font-bold leading-snug">{role}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutMensa;
