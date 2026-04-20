import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Mail, ShieldCheck } from "lucide-react";
import {
  readContentCollection,
  readRemoteContentCollection,
  saveRemoteContentCollection,
} from "@/backend/contentStore";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

const ACCESS_STORAGE_KEY = "mission-mensa-site-access-v1";
const DEVICE_ID_STORAGE_KEY = "mission-mensa-device-id-v1";
const TRUSTED_DEVICE_STORAGE_KEY = "mission-mensa-trusted-device-v1";
const ADMIN_UNLOCK_PASSWORD = "26MENSA";

interface StoredAccess {
  email: string;
  unlockedAt: string;
}

interface TrustedDeviceRecord {
  deviceId: string;
  email: string;
  unlockedAt: string;
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function readStoredAccess() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(ACCESS_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<StoredAccess>;
    if (!parsed.email || !parsed.unlockedAt) {
      return null;
    }

    return {
      email: normalizeEmail(parsed.email),
      unlockedAt: parsed.unlockedAt,
    } satisfies StoredAccess;
  } catch {
    return null;
  }
}

function saveStoredAccess(email: string) {
  if (typeof window === "undefined") {
    return;
  }

  const payload: StoredAccess = {
    email: normalizeEmail(email),
    unlockedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(ACCESS_STORAGE_KEY, JSON.stringify(payload));
}

function readStoredTrustedDevice() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(TRUSTED_DEVICE_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<TrustedDeviceRecord>;
    if (!parsed.deviceId || !parsed.email || !parsed.unlockedAt) {
      return null;
    }

    return {
      deviceId: parsed.deviceId,
      email: normalizeEmail(parsed.email),
      unlockedAt: parsed.unlockedAt,
    } satisfies TrustedDeviceRecord;
  } catch {
    return null;
  }
}

function saveStoredTrustedDevice(record: TrustedDeviceRecord) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    TRUSTED_DEVICE_STORAGE_KEY,
    JSON.stringify({
      ...record,
      email: normalizeEmail(record.email),
    } satisfies TrustedDeviceRecord),
  );
}

function getOrCreateDeviceId() {
  if (typeof window === "undefined") {
    return "";
  }

  const existingDeviceId = window.localStorage.getItem(DEVICE_ID_STORAGE_KEY);
  if (existingDeviceId) {
    return existingDeviceId;
  }

  const generatedDeviceId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `device-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  window.localStorage.setItem(DEVICE_ID_STORAGE_KEY, generatedDeviceId);
  return generatedDeviceId;
}

function isOtpRateLimitError(message: string) {
  const normalizedMessage = message.trim().toLowerCase();
  return (
    normalizedMessage.includes("rate limit") ||
    normalizedMessage.includes("security purposes")
  );
}

export default function SiteAccessGate({
  children,
}: {
  children: ReactNode;
}) {
  const [storedAccess, setStoredAccess] = useState<StoredAccess | null>(() =>
    readStoredAccess(),
  );
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [otpSentTo, setOtpSentTo] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCheckingDevice, setIsCheckingDevice] = useState(true);

  useEffect(() => {
    function syncAccess() {
      setStoredAccess(readStoredAccess());
    }

    window.addEventListener("storage", syncAccess);
    return () => window.removeEventListener("storage", syncAccess);
  }, []);

  useEffect(() => {
    async function hydrateTrustedDevice() {
      const deviceId = getOrCreateDeviceId();

      if (readStoredAccess()) {
        setIsCheckingDevice(false);
        return;
      }

      if (!deviceId) {
        setIsCheckingDevice(false);
        return;
      }

      const localTrustedDevice = readStoredTrustedDevice();
      if (localTrustedDevice?.deviceId === deviceId) {
        saveStoredAccess(localTrustedDevice.email);
        setStoredAccess(readStoredAccess());
        setIsCheckingDevice(false);
        return;
      }

      const persistedTrustedDevices = readContentCollection<TrustedDeviceRecord>(
        "trustedDevices",
        [],
      );

      const trustedDevices = await readRemoteContentCollection<TrustedDeviceRecord>(
        "trustedDevices",
        persistedTrustedDevices,
      );

      const trustedDevice = trustedDevices.find(
        (record) => record.deviceId === deviceId,
      );

      if (trustedDevice) {
        saveStoredTrustedDevice(trustedDevice);
        saveStoredAccess(trustedDevice.email);
        setStoredAccess(readStoredAccess());
      }

      setIsCheckingDevice(false);
    }

    void hydrateTrustedDevice();
  }, []);

  const normalizedEmail = useMemo(() => normalizeEmail(email), [email]);
  const emailAllowed = isValidEmail(normalizedEmail);

  if (storedAccess) {
    return <>{children}</>;
  }

  if (isCheckingDevice) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#163a44_0%,#1f5d68_44%,#f3dfb9_100%)] text-white">
        Checking access...
      </div>
    );
  }

  async function handleSendOtp() {
    setErrorMessage(null);
    setStatusMessage(null);

    if (!isSupabaseConfigured || !supabase) {
      setErrorMessage(
        "Email OTP is not configured. Add Supabase environment values first.",
      );
      return;
    }

    if (!emailAllowed) {
      setErrorMessage("Enter a valid email address.");
      return;
    }

    const targetEmail = normalizedEmail;
    setIsSending(true);

    const { error } = await supabase.auth.signInWithOtp({
      email: targetEmail,
      options: {
        shouldCreateUser: true,
      },
    });

    setIsSending(false);

    if (error) {
      if (isOtpRateLimitError(error.message)) {
        setOtpSentTo(targetEmail);
        setErrorMessage(
          "OTP requests are temporarily rate-limited by the authentication service. Use the latest code already sent to your email, or wait a bit before trying again.",
        );
        return;
      }

      setErrorMessage(error.message);
      return;
    }

    setOtpSentTo(targetEmail);
    setStatusMessage("OTP sent. Check your email and enter the code below.");
  }

  async function handleVerifyOtp() {
    setErrorMessage(null);
    setStatusMessage(null);

    if (!supabase || !otpSentTo) {
      setErrorMessage("Send OTP first.");
      return;
    }

    if (!otp.trim()) {
      setErrorMessage("Enter the OTP from your email.");
      return;
    }

    setIsVerifying(true);

    const { error } = await supabase.auth.verifyOtp({
      email: otpSentTo,
      token: otp.trim(),
      type: "email",
    });

    setIsVerifying(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    const deviceId = getOrCreateDeviceId();
    const existingDevices = await readRemoteContentCollection<TrustedDeviceRecord>(
      "trustedDevices",
      [],
    );
    const trustedDeviceRecord: TrustedDeviceRecord = {
      deviceId,
      email: otpSentTo,
      unlockedAt: new Date().toISOString(),
    };

    saveStoredTrustedDevice(trustedDeviceRecord);

    await saveRemoteContentCollection(
      "trustedDevices",
      [
        trustedDeviceRecord,
        ...existingDevices.filter((record) => record.deviceId !== deviceId),
      ],
    );

    saveStoredAccess(otpSentTo);
    setStoredAccess(readStoredAccess());
    setStatusMessage("Access verified.");
    void supabase.auth.signOut();
  }

  function handleAdminUnlock() {
    setErrorMessage(null);
    setStatusMessage(null);

    if (!adminPassword.trim()) {
      setErrorMessage("Enter the admin password.");
      return;
    }

    if (adminPassword.trim() !== ADMIN_UNLOCK_PASSWORD) {
      setErrorMessage("Incorrect admin password.");
      return;
    }

    saveStoredAccess("admin@missionmensa.local");
    setStoredAccess(readStoredAccess());
    setStatusMessage("Access verified.");
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#163a44_0%,#1f5d68_44%,#f3dfb9_100%)] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2.5rem] border border-white/12 bg-white/96 shadow-[0_28px_70px_rgba(16,42,47,0.22)] lg:grid-cols-[0.95fr_1.05fr]">
          <section className="relative overflow-hidden bg-[linear-gradient(160deg,#14353d_0%,#1a505b_58%,#2f7a7f_100%)] p-8 text-white sm:p-10">
            <div className="pointer-events-none absolute -left-10 top-0 h-32 w-32 rounded-full bg-[#ffc94b]/20 blur-3xl" />
            <div className="pointer-events-none absolute right-0 top-12 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/88">
                <ShieldCheck size={14} />
                One-Time Access Lock
              </div>
              <h1 className="mt-5 text-4xl font-black leading-tight text-white">
                Mission MENSA
                <span className="block text-[#ffe09d]">Restricted Access</span>
              </h1>
            </div>
          </section>

          <section className="p-8 sm:p-10">
            <div className="max-w-md">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#17353f]/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#17353f]">
                <Mail size={14} />
                Access Options
              </div>
              <h2 className="mt-4 text-3xl font-black leading-tight text-[#17353f]">
                Unlock this website
              </h2>

              <div className="mt-8 space-y-4">
                <div className="space-y-4 rounded-[1.7rem] border border-[#e2ebea] bg-[#f8fbfb] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#617275]">
                    Option 1: Email OTP
                  </p>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#617275]">
                      Email
                    </label>
                    <input
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="name@example.com"
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#1d2a2a] outline-none transition focus:border-[#17353f]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => void handleSendOtp()}
                    disabled={isSending}
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-[#17353f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#102a32] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSending ? "Sending OTP..." : "Send OTP"}
                  </button>

                  {otpSentTo && (
                    <div className="space-y-4 rounded-[1.7rem] border border-[#e2ebea] bg-[#f8fbfb] p-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#617275]">
                          OTP Code
                        </label>
                        <input
                          value={otp}
                          onChange={(event) => setOtp(event.target.value)}
                          placeholder="Enter the code from email"
                          className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#1d2a2a] outline-none transition focus:border-[#17353f]"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => void handleVerifyOtp()}
                        disabled={isVerifying}
                        className="inline-flex w-full items-center justify-center rounded-2xl bg-[#2e6c55] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#245543] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isVerifying ? "Verifying..." : "Verify OTP"}
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-4 rounded-[1.7rem] border border-[#e2ebea] bg-[#f8fbfb] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#617275]">
                    Option 2: Admin Password
                  </p>
                  <p className="text-sm text-[#617275]">
                    Ask Admin for the password.
                  </p>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#617275]">
                      Admin Password
                    </label>
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(event) => setAdminPassword(event.target.value)}
                      placeholder="Enter admin password"
                      className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#1d2a2a] outline-none transition focus:border-[#17353f]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAdminUnlock}
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-[#1e4b68] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#16374c]"
                  >
                    Unlock with Admin Password
                  </button>
                </div>

                {statusMessage && (
                  <div className="rounded-2xl border border-[#d7e8da] bg-[#eef8f0] px-4 py-3 text-sm text-[#29543a]">
                    {statusMessage}
                  </div>
                )}

                {errorMessage && (
                  <div className="rounded-2xl border border-[#efd2d2] bg-[#fff3f3] px-4 py-3 text-sm text-[#8a3f3f]">
                    {errorMessage}
                  </div>
                )}

              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
