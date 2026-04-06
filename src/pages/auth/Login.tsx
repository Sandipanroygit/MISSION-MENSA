import { type FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import { useLogin } from "@/hooks/useAuth";
import { getApiError, mapFieldErrors } from "@/utils/apiError";

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
          setServerError(apiErr.message);
          if (apiErr.errors) setFieldErrors(mapFieldErrors(apiErr.errors));
        },
      },
    );
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
    </AuthLayout>
  );
}
