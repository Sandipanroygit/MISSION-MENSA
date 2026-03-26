import { type FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import { useResetPassword } from "@/hooks/useAuth";
import { getApiError, mapFieldErrors } from "@/utils/apiError";

// ─── Validation ───────────────────────────────────────────────────────────────

type FieldErrors = Record<string, string>;

function validate(password: string, passwordConfirmation: string): FieldErrors {
  const errs: FieldErrors = {};
  if (!password) {
    errs.password = "Password is required.";
  } else if (password.length < 8) {
    errs.password = "Password must be at least 8 characters.";
  }
  if (!passwordConfirmation) {
    errs.password_confirmation = "Please confirm your password.";
  } else if (password !== passwordConfirmation) {
    errs.password_confirmation = "Passwords do not match.";
  }
  return errs;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const resetPassword = useResetPassword();

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Guard: if no token/email in URL, show an error immediately
  const missingParams = !token || !email;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const errs = validate(password, passwordConfirmation);
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});

    resetPassword.mutate(
      { token, email, password, password_confirmation: passwordConfirmation },
      {
        onSuccess: () => setSuccess(true),
        onError: (error) => {
          const apiErr = getApiError(error);
          setServerError(apiErr.message);
          if (apiErr.errors) setFieldErrors(mapFieldErrors(apiErr.errors));
        },
      },
    );
  };

  /* ── Invalid / missing link ── */
  if (missingParams) {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <span className="text-2xl">🔗</span>
          </div>
          <h2 className="text-xl font-black text-[#2F3E3E]">
            Invalid reset link
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            This password reset link is missing required information. Please
            request a new one.
          </p>
          <Link
            to="/forgot-password"
            className="mt-6 inline-block rounded-lg bg-[#2CA4A4] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#249090] transition"
          >
            Request new link
          </Link>
        </div>
      </AuthLayout>
    );
  }

  /* ── Success state ── */
  if (success) {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#A5C85A]/15">
            <CheckCircle
              size={32}
              className="text-[#A5C85A]"
              strokeWidth={1.5}
            />
          </div>
          <h2 className="text-2xl font-black text-[#2F3E3E]">
            Password updated!
          </h2>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            Your password has been reset successfully. You can now sign in with
            your new password.
          </p>
          <button
            type="button"
            onClick={() => navigate("/login", { replace: true })}
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#2CA4A4] px-8 py-2.5 text-sm font-semibold text-white
              hover:bg-[#249090] active:bg-[#1e7c7c] transition"
          >
            Go to sign in
          </button>
        </div>
      </AuthLayout>
    );
  }

  /* ── Form ── */
  return (
    <AuthLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-black text-[#2F3E3E]">
          Set a new password
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Resetting password for{" "}
          <span className="font-medium text-[#2F3E3E]">{email}</span>
        </p>
      </div>

      {serverError && !Object.keys(fieldErrors).length && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* New password */}
        <div className="space-y-1">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[#2F3E3E]"
          >
            New password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
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
          {fieldErrors.password ? (
            <p className="text-xs text-red-500">{fieldErrors.password}</p>
          ) : (
            <p className="text-xs text-gray-400">At least 8 characters.</p>
          )}
        </div>

        {/* Confirm password */}
        <div className="space-y-1">
          <label
            htmlFor="password_confirmation"
            className="block text-sm font-medium text-[#2F3E3E]"
          >
            Confirm new password
          </label>
          <div className="relative">
            <input
              id="password_confirmation"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="••••••••"
              className={`w-full rounded-lg border px-4 py-3 pr-11 text-sm text-[#2F3E3E] bg-white placeholder:text-gray-400 outline-none transition
                focus:ring-2 focus:ring-[#2CA4A4]/25 focus:border-[#2CA4A4]
                ${fieldErrors.password_confirmation ? "border-red-400 focus:ring-red-200 focus:border-red-400" : "border-gray-200"}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {fieldErrors.password_confirmation && (
            <p className="text-xs text-red-500">
              {fieldErrors.password_confirmation}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={resetPassword.isPending}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#2CA4A4] py-3 text-sm font-semibold text-white
            hover:bg-[#249090] active:bg-[#1e7c7c] disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {resetPassword.isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving…
            </>
          ) : (
            "Reset password"
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-500">
        Remembered your password?{" "}
        <Link
          to="/login"
          className="font-semibold text-[#2CA4A4] hover:text-[#249090] transition"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
