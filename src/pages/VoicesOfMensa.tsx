import VoicesOfMensaSection from "@/components/Landing/VoicesOfMensa";
import { useEffect, useState } from "react";
import {
  getPublishedVoiceEntries,
  getPublishedVoiceEntriesAsync,
} from "./dashboard/voiceData";

const voicesHeroImage =
  "https://commons.wikimedia.org/wiki/Special:FilePath/Indian%20Students%204616.JPG";

const VoicesOfMensaPage = () => {
  const [entries, setEntries] = useState(() =>
    getPublishedVoiceEntries().map((entry) => ({
      id: entry.id,
      quote: entry.quote,
      name: entry.speakerName,
      role: `${entry.audience}, ${entry.location}`,
      audience: entry.audience,
    })),
  );

  useEffect(() => {
    void getPublishedVoiceEntriesAsync().then((voiceEntries) => {
      setEntries(
        voiceEntries.map((entry) => ({
          id: entry.id,
          quote: entry.quote,
          name: entry.speakerName,
          role: `${entry.audience}, ${entry.location}`,
          audience: entry.audience,
        })),
      );
    });
  }, []);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#F5EFE4_0%,#FBF8F2_32%,#F4F8F8_100%)] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[2.8rem] border border-white/70 bg-[linear-gradient(135deg,#153843_0%,#1D5E69_52%,#F3E3BE_100%)] px-7 py-10 shadow-[0_28px_80px_rgba(21,56,67,0.22)] sm:px-10 lg:px-14 lg:py-14">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${voicesHeroImage})` }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(92deg,rgba(12,34,40,0.88)_0%,rgba(17,58,67,0.74)_40%,rgba(28,87,97,0.55)_68%,rgba(243,227,190,0.32)_100%)]" />
          <div className="pointer-events-none absolute -left-12 top-6 h-36 w-36 rounded-full bg-[#FFC94B]/22 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-white/12 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-16 h-40 w-40 rounded-full bg-[#5EC1E8]/18 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="max-w-3xl">
              <p className="inline-flex rounded-full border border-white/18 bg-white/12 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-white shadow-lg backdrop-blur-sm">
                Parent And Student Voices
              </p>
              <h1 className="mt-5 text-4xl font-black leading-[1.05] text-white sm:text-5xl lg:text-6xl">
                Voices of
                <span className="block text-[#FFE3A0]">Mission MENSA</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
                A public space for parent and student reflections, shaped from
                the dashboard draft section and presented as a more human layer
                of the program.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[1.8rem] border border-white/14 bg-white/10 p-5 backdrop-blur-sm">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-white/66">
                  Parent Lens
                </div>
                <p className="mt-3 text-sm leading-6 text-white/82">
                  Confidence, support, belonging, and growth seen at home.
                </p>
              </div>
              <div className="rounded-[1.8rem] border border-white/14 bg-[#102A31]/28 p-5">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-[#D9F5FF]">
                  Student Lens
                </div>
                <p className="mt-3 text-sm leading-6 text-white/78">
                  Curiosity, challenge, projects, and how learning feels from
                  the inside.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <VoicesOfMensaSection entries={entries} />
        </div>
      </div>
    </main>
  );
};

export default VoicesOfMensaPage;
