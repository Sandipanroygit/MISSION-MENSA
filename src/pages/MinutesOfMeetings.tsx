import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ScrollToTop from "@/components/common/ScrolltoTop";
import {
  getPublishedMeetingMinutesEntries,
  getPublishedMeetingMinutesEntriesAsync,
  type MeetingMinutesEntry,
} from "./dashboard/meetingMinutesData";

const heroImage =
  "https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=1600";

const MOM_IMAGES: Record<string, string> = {
  "mom-blockchain-and-mensa-15th-april-26-docx":
    "https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "minutes-of-meeting-docx":
    "https://images.pexels.com/photos/1181534/pexels-photo-1181534.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "mom-project-mensa-8th-april-26-docx":
    "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "mom-human-lab-26-mar2026-docx":
    "https://images.pexels.com/photos/7096/people-woman-coffee-meeting.jpg?auto=compress&cs=tinysrgb&w=1200",
  "mom-human-lab-23rd-mar-26-docx":
    "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "mom-human-lab-16th-march-2026-docx":
    "https://images.pexels.com/photos/7176026/pexels-photo-7176026.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "mom-human-lab-9th-march-26-docx":
    "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1200",
};

type MinutesBlock =
  | { type: "paragraph"; text: string }
  | { type: "bullets"; items: string[] };

function formatMeetingDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString();
}

function getCoverImage(id: string) {
  return (
    MOM_IMAGES[id] ??
    "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200"
  );
}

function normalizeText(value: string) {
  return value
    .replace(/Ã¢â‚¬Â¢/g, "•")
    .replace(/Ã¢â‚¬â€/g, "—")
    .replace(/Ã¢â‚¬â€œ/g, "–")
    .replace(/Ã¢â‚¬â„¢/g, "'")
    .replace(/Ã¢â‚¬Å“/g, '"')
    .replace(/Ã¢â‚¬Â/g, '"')
    .replace(/â€¢/g, "•")
    .replace(/â€”/g, "—")
    .replace(/â€“/g, "–")
    .replace(/â€™/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"');
}

function cleanSpacing(value: string) {
  return value
    .replace(/([A-Za-z])(\d)/g, "$1 $2")
    .replace(/(\d)([A-Za-z])/g, "$1 $2")
    .replace(/([:;,.!?])([A-Za-z0-9])/g, "$1 $2")
    .replace(/\)\s*Date:/g, ") Date:")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function formatHeading(value: string) {
  return cleanSpacing(normalizeText(value));
}

function splitMinutesBlocks(minutes: string): MinutesBlock[] {
  const lines = normalizeText(minutes).split(/\r?\n/);
  const blocks: MinutesBlock[] = [];
  let currentBullets: string[] = [];

  function flushBullets() {
    if (currentBullets.length) {
      blocks.push({ type: "bullets", items: currentBullets });
      currentBullets = [];
    }
  }

  for (const rawLine of lines) {
    const line = cleanSpacing(rawLine.trim());
    if (!line) {
      flushBullets();
      continue;
    }

    if (line.startsWith("- ")) {
      currentBullets.push(line.slice(2).trim());
      continue;
    }

    flushBullets();
    blocks.push({ type: "paragraph", text: line });
  }

  flushBullets();
  return blocks;
}

function renderFormattedLine(text: string) {
  const emphasisMatch = text.match(
    /^(Action Item|Conclusion|Meeting Notes|Key Discussions)\s*:\s*(.*)$/i,
  );
  if (emphasisMatch) {
    return (
      <>
        <span className="font-bold">{emphasisMatch[1]}:</span>{" "}
        <span className="italic">{emphasisMatch[2]}</span>
      </>
    );
  }

  if (/^\d+[\.)]\s+/.test(text)) {
    return <span className="font-semibold">{text}</span>;
  }

  return text;
}

export default function MinutesOfMeetingsPage() {
  const [entries, setEntries] = useState<MeetingMinutesEntry[]>(() =>
    getPublishedMeetingMinutesEntries(),
  );

  useEffect(() => {
    void getPublishedMeetingMinutesEntriesAsync().then(setEntries);
  }, []);

  const summarized = useMemo(
    () =>
      entries.map((entry) => ({
        entry,
        previewBlocks: splitMinutesBlocks(entry.minutes).slice(0, 4),
      })),
    [entries],
  );

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
              {summarized.map(({ entry, previewBlocks }) => (
                <article
                  key={entry.id}
                  className="overflow-hidden rounded-[1.4rem] border border-[#E7ECE7] bg-[#FCFDFC] shadow-sm"
                >
                  <div className="grid md:grid-cols-[180px_1fr]">
                    <div className="relative h-28 md:h-full">
                        <img
                          src={getCoverImage(entry.id)}
                          alt={formatHeading(entry.title)}
                          className="h-full w-full object-cover"
                        />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,35,40,0)_0%,rgba(13,35,40,0.45)_100%)]" />
                    </div>

                    <div className="p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h2 className="text-xl font-black tracking-tight text-[#122E34] sm:text-2xl">
                            {formatHeading(entry.title)}
                          </h2>
                          <p className="mt-1 text-sm text-[#5E6F73]">
                            {formatMeetingDate(entry.meetingDate)} • by {entry.authorName}
                          </p>
                        </div>
                        <span className="rounded-full bg-[#E8F5E8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#285B2A]">
                          Published
                        </span>
                      </div>

                      <div className="mt-3 space-y-2 text-[14px] leading-6 text-[#22383C]">
                        {previewBlocks.map((block, blockIndex) => {
                          if (block.type === "paragraph") {
                            return (
                              <p key={`${entry.id}-p-${blockIndex}`} className="font-medium line-clamp-2">
                                {renderFormattedLine(block.text)}
                              </p>
                            );
                          }

                          return (
                            <ul
                              key={`${entry.id}-u-${blockIndex}`}
                              className="list-disc space-y-1 pl-5 text-[#33474A]"
                            >
                              {block.items.slice(0, 2).map((item, itemIndex) => (
                                <li key={`${entry.id}-u-${blockIndex}-${itemIndex}`}>{renderFormattedLine(item)}</li>
                              ))}
                            </ul>
                          );
                        })}
                      </div>

                      <Link
                        to={`/minutes-of-meetings/${encodeURIComponent(entry.id)}`}
                        className="mt-4 inline-flex items-center rounded-full border border-[#173B45]/20 bg-white px-4 py-2 text-sm font-semibold text-[#173B45] transition hover:bg-[#F1F7F8]"
                      >
                        Read more
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
