import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ScrollToTop from "@/components/common/ScrolltoTop";
import {
  getPublishedMeetingMinutesEntries,
  getPublishedMeetingMinutesEntriesAsync,
  type MeetingMinutesEntry,
} from "./dashboard/meetingMinutesData";

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

function getCoverImage(id: string) {
  return (
    MOM_IMAGES[id] ??
    "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200"
  );
}

function formatMeetingDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString();
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

export default function MinutesOfMeetingReadPage() {
  const { minutesId } = useParams();
  const decodedId = decodeURIComponent(minutesId ?? "");
  const [entries, setEntries] = useState<MeetingMinutesEntry[]>(() =>
    getPublishedMeetingMinutesEntries(),
  );

  useEffect(() => {
    void getPublishedMeetingMinutesEntriesAsync().then(setEntries);
  }, []);

  const entry = useMemo(
    () => entries.find((item) => item.id === decodedId),
    [decodedId, entries],
  );

  if (!entry) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#F6F1E7_0%,#FBF8F1_34%,#F4F8F8_100%)] px-4 py-16 sm:px-6 lg:px-8">
        <ScrollToTop />
        <div className="mx-auto max-w-4xl rounded-3xl border border-[#E0E9E9] bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-[#1D2A2A]">MOM not found</h1>
          <Link
            to="/minutes-of-meetings"
            className="mt-4 inline-flex rounded-full border border-[#173B45]/20 px-4 py-2 text-sm font-semibold text-[#173B45]"
          >
            Back to all MOMs
          </Link>
        </div>
      </main>
    );
  }

  const blocks = splitMinutesBlocks(entry.minutes);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#F6F1E7_0%,#FBF8F1_34%,#F4F8F8_100%)] px-4 py-16 sm:px-6 lg:px-8">
      <ScrollToTop />
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-[#E0E9E9] bg-white shadow-sm">
        <img
          src={getCoverImage(entry.id)}
          alt={formatHeading(entry.title)}
          className="h-56 w-full object-cover"
        />
        <div className="p-7 sm:p-10">
          <Link
            to="/minutes-of-meetings"
            className="inline-flex rounded-full border border-[#173B45]/20 px-4 py-2 text-sm font-semibold text-[#173B45]"
          >
            Back to all MOMs
          </Link>
          <h1 className="mt-5 text-3xl font-black tracking-tight text-[#122E34] sm:text-4xl">
            {formatHeading(entry.title)}
          </h1>
          <p className="mt-2 text-sm text-[#5E6F73]">
            {formatMeetingDate(entry.meetingDate)} • by {entry.authorName}
          </p>

          <div className="mt-6 space-y-4 text-[15px] leading-7 text-[#22383C]">
            {blocks.map((block, blockIndex) => {
              if (block.type === "paragraph") {
                return (
                  <p key={`${entry.id}-p-${blockIndex}`} className="font-medium">
                    {renderFormattedLine(block.text)}
                  </p>
                );
              }

              return (
                <ul
                  key={`${entry.id}-u-${blockIndex}`}
                  className="list-disc space-y-1 pl-6 text-[#33474A]"
                >
                  {block.items.map((item, itemIndex) => (
                    <li key={`${entry.id}-u-${blockIndex}-${itemIndex}`}>
                      {renderFormattedLine(item)}
                    </li>
                  ))}
                </ul>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
