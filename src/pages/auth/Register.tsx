import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import { useRegister } from "@/hooks/useAuth";
import { getApiError, mapFieldErrors } from "@/utils/apiError";

// ─── Validation ───────────────────────────────────────────────────────────────

type FieldErrors = Record<string, string>;

function validate(
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string,
): FieldErrors {
  const errs: FieldErrors = {};

  if (!name.trim()) {
    errs.name = "Full name is required.";
  } else if (name.trim().length < 2) {
    errs.name = "Name must be at least 2 characters.";
  }

  if (!email.trim()) {
    errs.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errs.email = "Enter a valid email address.";
  }

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

export default function RegisterPage() {
  const navigate = useNavigate();
  const register = useRegister();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [householdName, setHouseholdName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const errs = validate(name, email, password, passwordConfirmation);
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});
    const payload = {
      full_name: name,
      email,
      password,
      password_confirmation: passwordConfirmation,
      ...(householdName.trim() ? { household_name: householdName.trim() } : {}),
    };

    register.mutate(
      {
        ...payload,
      },
      {
        onSuccess: () => navigate("/dashboard", { replace: true }),
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
        <h2 className="text-2xl font-black text-[#2F3E3E]">
          Create your account
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Get started — it only takes a minute.
        </p>
      </div>

      {/* Server-level error banner */}
      {serverError && !Object.keys(fieldErrors).length && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Full Name */}
        <Field
          id="name"
          label="Full name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={setName}
          placeholder="Enter name"
          error={fieldErrors.name}
        />

        {/* Email */}
        <Field
          id="email"
          label="Email address"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          error={fieldErrors.email}
        />

        {/* Household name (optional) */}
        <div className="space-y-1">
          <label
            htmlFor="household_name"
            className="block text-sm font-medium text-[#2F3E3E]"
          >
            Family / household name{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            id="household_name"
            type="text"
            autoComplete="organization"
            value={householdName}
            onChange={(e) => setHouseholdName(e.target.value)}
            placeholder="The Smiths"
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-[#2F3E3E] bg-white placeholder:text-gray-400 outline-none transition
              focus:ring-2 focus:ring-[#2CA4A4]/25 focus:border-[#2CA4A4]"
          />
          <p className="text-xs text-gray-400">
            We auto-create one from your name if left blank.
          </p>
        </div>

        {/* Password */}
        <PasswordField
          id="password"
          label="Password"
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
          show={showPassword}
          onToggle={() => setShowPassword((p) => !p)}
          error={fieldErrors.password}
          hint="At least 8 characters."
        />

        {/* Confirm Password */}
        <PasswordField
          id="password_confirmation"
          label="Confirm password"
          autoComplete="new-password"
          value={passwordConfirmation}
          onChange={setPasswordConfirmation}
          show={showPasswordConfirm}
          onToggle={() => setShowPasswordConfirm((p) => !p)}
          error={fieldErrors.password_confirmation}
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={register.isPending}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#2CA4A4] py-3 text-sm font-semibold text-white
            hover:bg-[#249090] active:bg-[#1e7c7c] disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {register.isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Creating account…
            </>
          ) : (
            "Create account"
          )}
        </button>
      </form>

      {/* Footer link */}
      <p className="mt-8 text-center text-sm text-gray-500">
        Already have an account?{" "}
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

// ─── Shared field sub-components (local to this file) ────────────────────────

interface FieldProps {
  id: string;
  label: string;
  type: string;
  autoComplete?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
}

function Field({
  id,
  label,
  type,
  autoComplete,
  value,
  onChange,
  placeholder,
  error,
}: FieldProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-[#2F3E3E]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-lg border px-4 py-3 text-sm text-[#2F3E3E] bg-white placeholder:text-gray-400 outline-none transition
          focus:ring-2 focus:ring-[#2CA4A4]/25 focus:border-[#2CA4A4]
          ${error ? "border-red-400 focus:ring-red-200 focus:border-red-400" : "border-gray-200"}`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface PasswordFieldProps {
  id: string;
  label: string;
  autoComplete?: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  error?: string;
  hint?: string;
}

function PasswordField({
  id,
  label,
  autoComplete,
  value,
  onChange,
  show,
  onToggle,
  error,
  hint,
}: PasswordFieldProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-[#2F3E3E]">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
          className={`w-full rounded-lg border px-4 py-3 pr-11 text-sm text-[#2F3E3E] bg-white placeholder:text-gray-400 outline-none transition
            focus:ring-2 focus:ring-[#2CA4A4]/25 focus:border-[#2CA4A4]
            ${error ? "border-red-400 focus:ring-red-200 focus:border-red-400" : "border-gray-200"}`}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}
