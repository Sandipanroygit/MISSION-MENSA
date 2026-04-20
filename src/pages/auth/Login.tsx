import { type FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { AxiosError } from "axios";
import AuthLayout from "@/components/auth/AuthLayout";
import { useLogin } from "@/hooks/useAuth";
import { getApiError, mapFieldErrors } from "@/utils/apiError";
import {
  getMeetingMinutesDraftsAsync,
  upsertMeetingMinutesDraft,
  upsertMeetingMinutesDraftAsync,
  type MeetingMinutesDraft,
} from "@/pages/dashboard/meetingMinutesData";

// ─── Validation ───────────────────────────────────────────────────────────────

type FieldErrors = Record<string, string>;

function validate(email: string, password: string): FieldErrors {
  const errs: FieldErrors = {};
  if (!email.trim()) {
    errs.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errs.email = "Enter a valid email address.";
  }
  if (!password) {
    errs.password = "Password is required.";
  }
  return errs;
}

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function createDraftId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `minutes-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: Location })?.from?.pathname ?? "/dashboard";

  const login = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingDate, setMeetingDate] = useState(getTodayDate());
  const [meetingMinutes, setMeetingMinutes] = useState("");
  const [minutesError, setMinutesError] = useState<string | null>(null);
  const [minutesMessage, setMinutesMessage] = useState<string | null>(null);
  const [isSavingMinutes, setIsSavingMinutes] = useState(false);
  const [recentMinutesDrafts, setRecentMinutesDrafts] = useState<
    MeetingMinutesDraft[]
  >([]);

  useEffect(() => {
    void getMeetingMinutesDraftsAsync().then((entries) => {
      setRecentMinutesDrafts(entries.slice(0, 5));
    });
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const errs = validate(email, password);
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});

    login.mutate(
      { email, password },
      {
        onSuccess: () => {
          window.location.href = from;
        },
        onError: (error) => {
          const apiErr = getApiError(error);
          const isCredentialError =
            error instanceof AxiosError &&
            (error.response?.status === 401 || error.response?.status === 422);
          const nextFieldErrors = apiErr.errors
            ? mapFieldErrors(apiErr.errors)
            : {};

          if (isCredentialError && !nextFieldErrors.password) {
            nextFieldErrors.password = "Email or password is incorrect.";
          }

          setServerError(
            isCredentialError
              ? "Email or password is incorrect."
              : apiErr.message,
          );
          setFieldErrors(nextFieldErrors);
        },
      },
    );
  };

  const handleSaveMinutesDraft = async (e: FormEvent) => {
    e.preventDefault();
    setMinutesError(null);
    setMinutesMessage(null);

    if (!meetingTitle.trim()) {
      setMinutesError("Meeting title is required.");
      return;
    }

    if (!meetingDate.trim()) {
      setMinutesError("Meeting date is required.");
      return;
    }

    if (!meetingMinutes.trim()) {
      setMinutesError("Minutes details are required.");
      return;
    }

    const now = new Date().toISOString();
    const entry: MeetingMinutesDraft = {
      id: createDraftId(),
      title: meetingTitle,
      meetingDate,
      minutes: meetingMinutes,
      authorEmail:
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase())
          ? email.trim().toLowerCase()
          : "guest@missionmensa.local",
      createdAt: now,
      updatedAt: now,
    };

    const localEntries = upsertMeetingMinutesDraft(entry);
    setRecentMinutesDrafts(localEntries.slice(0, 5));
    setIsSavingMinutes(true);

    try {
      const syncedEntries = await upsertMeetingMinutesDraftAsync(entry);
      setRecentMinutesDrafts(syncedEntries.slice(0, 5));
      setMinutesMessage("Daily minutes draft saved.");
      setMeetingTitle("");
      setMeetingMinutes("");
    } catch {
      setMinutesError("Saved locally. Supabase sync failed.");
    } finally {
      setIsSavingMinutes(false);
    }
  };

  return (
    <AuthLayout>
      {/* Heading */}
      <div className="mb-8">
        <h2 className="text-2xl font-black text-[#2F3E3E]">Welcome back</h2>
        <p className="mt-1 text-sm text-gray-500">
          Sign in to your Mensa account.
        </p>
      </div>

      {/* Server-level error banner */}
      {serverError && !Object.keys(fieldErrors).length && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Email */}
        <div className="space-y-1">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#2F3E3E]"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={`w-full rounded-lg border px-4 py-3 text-sm text-[#2F3E3E] bg-white placeholder:text-gray-400 outline-none transition
              focus:ring-2 focus:ring-[#2CA4A4]/25 focus:border-[#2CA4A4]
              ${fieldErrors.email ? "border-red-400 focus:ring-red-200 focus:border-red-400" : "border-gray-200"}`}
          />
          {fieldErrors.email && (
            <p className="text-xs text-red-500">{fieldErrors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#2F3E3E]"
            >
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-[#2CA4A4] hover:text-[#249090] transition"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full rounded-lg border px-4 py-3 pr-11 text-sm text-[#2F3E3E] bg-white placeholder:text-gray-400 outline-none transition
                focus:ring-2 focus:ring-[#2CA4A4]/25 focus:border-[#2CA4A4]
                ${fieldErrors.password ? "border-red-400 focus:ring-red-200 focus:border-red-400" : "border-gray-200"}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="text-xs text-red-500">{fieldErrors.password}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={login.isPending}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#2CA4A4] py-3 text-sm font-semibold text-white
            hover:bg-[#249090] active:bg-[#1e7c7c] disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {login.isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      {/* Footer link */}
      <p className="mt-8 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          className="font-semibold text-[#2CA4A4] hover:text-[#249090] transition"
        >
          Create one
        </Link>
      </p>

      <section
        id="minutes-of-meetings"
        className="mt-10 rounded-2xl border border-[#dbe9e9] bg-white/90 p-5"
      >
        <div className="mb-4">
          <h3 className="text-base font-bold text-[#2F3E3E]">
            Daily Minutes of Meetings
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Draft meeting minutes here. Entries are synced to Supabase.
          </p>
        </div>

        {minutesMessage && (
          <div className="mb-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
            {minutesMessage}
          </div>
        )}

        {minutesError && (
          <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {minutesError}
          </div>
        )}

        <form onSubmit={handleSaveMinutesDraft} className="space-y-3">
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#2F3E3E]">
              Meeting Title
            </label>
            <input
              type="text"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              placeholder="Daily standup - product and engineering"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#2F3E3E] outline-none transition focus:border-[#2CA4A4] focus:ring-2 focus:ring-[#2CA4A4]/20"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#2F3E3E]">
              Meeting Date
            </label>
            <input
              type="date"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#2F3E3E] outline-none transition focus:border-[#2CA4A4] focus:ring-2 focus:ring-[#2CA4A4]/20"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#2F3E3E]">
              Minutes
            </label>
            <textarea
              value={meetingMinutes}
              onChange={(e) => setMeetingMinutes(e.target.value)}
              rows={5}
              placeholder="Agenda, decisions, action items, owners, and due dates"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#2F3E3E] outline-none transition focus:border-[#2CA4A4] focus:ring-2 focus:ring-[#2CA4A4]/20"
            />
          </div>

          <button
            type="submit"
            disabled={isSavingMinutes}
            className="inline-flex items-center justify-center rounded-lg bg-[#1f6f8b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#18576d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSavingMinutes ? "Saving..." : "Save Minutes Draft"}
          </button>
        </form>

        <div className="mt-5">
          <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
            Recent Minutes
          </h4>
          {recentMinutesDrafts.length === 0 ? (
            <p className="mt-2 text-sm text-gray-500">No drafts yet.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {recentMinutesDrafts.map((entry) => (
                <li
                  key={entry.id}
                  className="rounded-lg border border-gray-200 bg-[#f8fbfb] px-3 py-2"
                >
                  <p className="text-sm font-semibold text-[#2F3E3E]">
                    {entry.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {entry.meetingDate} • {entry.authorEmail}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </AuthLayout>
  );
}
