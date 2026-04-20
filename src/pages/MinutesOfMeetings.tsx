import { useEffect, useState } from "react";
import ScrollToTop from "@/components/common/ScrolltoTop";
import {
  getPublishedMeetingMinutesEntries,
  getPublishedMeetingMinutesEntriesAsync,
  type MeetingMinutesEntry,
} from "./dashboard/meetingMinutesData";

const heroImage =
  "https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=1600";

function formatMeetingDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString();
}

export default function MinutesOfMeetingsPage() {
  const [entries, setEntries] = useState<MeetingMinutesEntry[]>(() =>
    getPublishedMeetingMinutesEntries(),
  );

  useEffect(() => {
    void getPublishedMeetingMinutesEntriesAsync().then(setEntries);
  }, []);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#F6F1E7_0%,#FBF8F1_34%,#F4F8F8_100%)] px-4 py-16 sm:px-6 lg:px-8">
      <ScrollToTop />
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-[linear-gradient(135deg,#163A44_0%,#1F616E_52%,#F2DFB7_100%)] px-8 py-12 shadow-[0_28px_80px_rgba(21,56,67,0.22)]">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="relative max-w-3xl">
            <p className="inline-flex rounded-full border border-white/18 bg-white/12 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-white shadow-lg backdrop-blur-sm">
              Public Notes
            </p>
            <h1 className="mt-5 text-4xl font-black leading-[1.05] text-white sm:text-5xl">
              Daily Minutes of Meetings
            </h1>
            <p className="mt-5 text-base leading-8 text-white/84 sm:text-lg">
              Published meeting notes, decisions, and action points from the
              Mission MENSA working groups.
            </p>
          </div>
        </div>

        <section className="mt-10 rounded-[2rem] border border-[#E0E9E9] bg-white p-6 shadow-sm sm:p-8">
          {entries.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-[#D8E0D8] bg-[#FAFBF9] px-6 py-12 text-center">
              <h2 className="text-lg font-semibold text-[#1D2A2A]">
                No published meeting minutes yet
              </h2>
              <p className="mt-2 text-sm text-[#6A7673]">
                Published entries from the dashboard draft page will appear
                here.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {entries.map((entry) => (
                <article
                  key={entry.id}
                  className="rounded-[1.5rem] border border-[#E7ECE7] bg-[#FCFDFC] p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-semibold text-[#1D2A2A]">
                        {entry.title}
                      </h2>
                      <p className="mt-1 text-sm text-[#6A7673]">
                        {formatMeetingDate(entry.meetingDate)} • by{" "}
                        {entry.authorName}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#E8F5E8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#285B2A]">
                      Published
                    </span>
                  </div>
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#32403E]">
                    {entry.minutes}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
