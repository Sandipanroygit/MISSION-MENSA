export interface VoiceCard {
  id: string;
  quote: string;
  name: string;
  role: string;
  audience: "Parent" | "Student";
}

const ACCENTS = ["#FFC94B", "#5EC1E8", "#A5C85A", "#F28B82"] as const;

interface VoicesOfMensaSectionProps {
  entries: VoiceCard[];
}

export default function VoicesOfMensaSection({
  entries,
}: VoicesOfMensaSectionProps) {
  const parentEntries = entries.filter((entry) => entry.audience === "Parent");
  const studentEntries = entries.filter((entry) => entry.audience === "Student");

  function renderEntryGrid(items: VoiceCard[], emptyLabel: string) {
    if (!items.length) {
      return (
        <div className="rounded-[1.9rem] border border-[#E7ECE7] bg-[#FCFDFC] p-6 text-sm leading-7 text-[#5E6F73]">
          {emptyLabel}
        </div>
      );
    }

    return (
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 pr-2 [scrollbar-width:thin] [scrollbar-color:#c9d7d5_transparent]">
        {items.map((item, index) => (
          <article
            key={item.id}
            className="group min-w-[260px] max-w-[260px] flex-shrink-0 snap-start rounded-[1.9rem] border border-[#E3EBE8] bg-[linear-gradient(180deg,#FFFFFF_0%,#F6FBFA_100%)] p-5 shadow-[0_16px_34px_rgba(25,53,58,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_38px_rgba(25,53,58,0.12)] sm:min-w-[285px] sm:max-w-[285px]"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div
                className="h-1.5 w-16 rounded-full"
                style={{ backgroundColor: ACCENTS[index % ACCENTS.length] }}
              />
              <div className="text-4xl font-black leading-none text-[#DCE8E4] transition group-hover:text-[#C8D9D3]">
                "
              </div>
            </div>
            <p className="text-[15px] leading-6 text-[#314244]">{item.quote}</p>
            <div className="mt-5">
              <div className="text-sm font-bold text-[#17353F]">{item.name}</div>
              <div className="text-xs uppercase tracking-[0.18em] text-[#7B8B8E]">
                {item.role}
              </div>
            </div>
          </article>
        ))}
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-[2.7rem] border border-[#E1E9E6] bg-[linear-gradient(180deg,#FFFFFF_0%,#F7FAF9_100%)] px-6 py-12 shadow-[0_24px_70px_rgba(29,53,58,0.08)] sm:px-10 lg:px-12">
      <div className="space-y-8">
        <div className="space-y-8">
          <section>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-1.5 rounded-full bg-[#FFC94B]" />
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#A57A11]">
                    Families
                  </p>
                  <h3 className="text-2xl font-black text-[#17353F]">
                    Parent Feedback
                  </h3>
                </div>
              </div>
              <div className="rounded-full border border-[#E3EBE8] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#6A7B7F] shadow-sm">
                Swipe to explore
              </div>
            </div>
            <p className="mb-5 max-w-2xl text-sm leading-7 text-[#6C7A7D]">
              Reflections from families on growth, confidence, and the support
              students experience across the journey.
            </p>
            <div className="rounded-[2rem] bg-[#FFF9E9] p-4 sm:p-5">
              {renderEntryGrid(
                parentEntries,
                "Published parent feedback will appear here once it is added in the dashboard draft section.",
              )}
            </div>
          </section>

          <section>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-1.5 rounded-full bg-[#5EC1E8]" />
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#246C80]">
                    Learners
                  </p>
                  <h3 className="text-2xl font-black text-[#17353F]">
                    Student Feedback
                  </h3>
                </div>
              </div>
              <div className="rounded-full border border-[#E3EBE8] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#6A7B7F] shadow-sm">
                Swipe to explore
              </div>
            </div>
            <p className="mb-5 max-w-2xl text-sm leading-7 text-[#6C7A7D]">
              Student voices on challenge, curiosity, project work, and how the
              program feels from within the learning experience.
            </p>
            <div className="rounded-[2rem] bg-[#EEF8FB] p-4 sm:p-5">
              {renderEntryGrid(
                studentEntries,
                "Published student feedback will appear here once it is added in the dashboard draft section.",
              )}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
