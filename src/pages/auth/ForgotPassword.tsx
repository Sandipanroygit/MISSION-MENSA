import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, Loader2, Mail } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import { useForgotPassword } from "@/hooks/useAuth";
import { getApiError, mapFieldErrors } from "@/utils/apiError";

// ─── Validation ───────────────────────────────────────────────────────────────

function validate(email: string): string | null {
  if (!email.trim()) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "Enter a valid email address.";
  return null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const err = validate(email);
    if (err) {
      setEmailError(err);
      return;
    }
    setEmailError(null);

    forgotPassword.mutate(
      { email },
      {
        onSuccess: () => setSubmitted(true),
        onError: (error) => {
          const apiErr = getApiError(error);
          if (apiErr.errors?.email) {
            setEmailError(mapFieldErrors(apiErr.errors).email);
          } else {
            setServerError(apiErr.message);
          }
        },
      },
    );
  };

  return (
    <AuthLayout>
      {/* Back link */}
      <Link
        to="/login"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#2CA4A4] transition"
      >
        <ArrowLeft size={14} />
        Back to sign in
      </Link>

      {submitted ? (
        /* ── Success state ── */
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#A5C85A]/15">
            <CheckCircle
              size={32}
              className="text-[#A5C85A]"
              strokeWidth={1.5}
            />
          </div>
          <h2 className="text-2xl font-black text-[#2F3E3E]">
            Check your inbox
          </h2>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
            If an account exists for{" "}
            <span className="font-medium text-[#2F3E3E]">{email}</span>, we've
            sent a password reset link. It may take a minute to arrive.
          </p>
          <p className="mt-6 text-xs text-gray-400">
            Didn&apos;t receive it?{" "}
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="text-[#2CA4A4] hover:text-[#249090] font-medium transition"
            >
              Try again
            </button>
          </p>
        </div>
      ) : (
        /* ── Form ── */
        <>
          <div className="mb-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2CA4A4]/10">
              <Mail size={22} className="text-[#2CA4A4]" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-black text-[#2F3E3E]">
              Forgot your password?
            </h2>
            <p className="mt-1 text-sm text-gray-500 leading-relaxed">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          {serverError && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
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
                  ${emailError ? "border-red-400 focus:ring-red-200 focus:border-red-400" : "border-gray-200"}`}
              />
              {emailError && (
                <p className="text-xs text-red-500">{emailError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={forgotPassword.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#2CA4A4] py-3 text-sm font-semibold text-white
                hover:bg-[#249090] active:bg-[#1e7c7c] disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {forgotPassword.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending…
                </>
              ) : (
                "Send reset link"
              )}
            </button>
          </form>
        </>
      )}
    </AuthLayout>
  );
}
