/**
 * RegisterForm — full name + email + password + confirm password sign-up form.
 *
 * Uses React Hook Form + Zod.
 * Shows PasswordStrength indicator while typing.
 * Handles email-confirmation flow (some Supabase projects require it).
 */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { PasswordInput } from "./PasswordInput";
import { PasswordStrength } from "./PasswordStrength";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { registerSchema, type RegisterFormValues } from "@/features/auth/schemas/authSchemas";
import { ROUTES } from "@/utils/constants";

export function RegisterForm() {
  const { register: registerUser, isMutating } = useAuth();
  const [emailConfirmationNeeded, setEmailConfirmationNeeded] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name:        "",
      email:            "",
      password:         "",
      confirm_password: "",
    },
  });

  const passwordValue = watch("password", "");

  const onSubmit = async (values: RegisterFormValues) => {
    const result = await registerUser(values);

    if (result.success && result.error === "CHECK_EMAIL") {
      // Supabase email confirmation is enabled in this project
      setRegisteredEmail(values.email);
      setEmailConfirmationNeeded(true);
      return;
    }

    if (!result.success && result.error) {
      toast.error("Registration failed", {
        description: result.error,
      });
    }

    if (result.success && !result.error) {
      toast.success("Account created!", {
        description: "Welcome to ERP Management System.",
      });
    }
  };

  // ── Email confirmation screen ─────────────────────────────────────────────

  if (emailConfirmationNeeded) {
    return (
      <div className="flex flex-col items-center gap-5 text-center py-2">
        {/* Mail icon */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.05))",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>

        <div>
          <h2 className="text-h3 text-text-primary font-semibold">Check your email</h2>
          <p className="text-body-sm text-text-tertiary mt-2">
            We sent a confirmation link to
          </p>
          <p className="text-body-sm text-primary-400 font-medium mt-0.5">
            {registeredEmail}
          </p>
          <p className="text-body-sm text-text-muted mt-3">
            Click the link in the email to activate your account, then sign in.
          </p>
        </div>

        <Link
          to={ROUTES.LOGIN}
          className="text-primary-400 hover:text-primary-300 font-medium text-body-sm transition-colors duration-150"
        >
          ← Back to sign in
        </Link>
      </div>
    );
  }

  // ── Registration form ─────────────────────────────────────────────────────

  return (
    <form
      id="register-form"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
      noValidate
    >
      {/* Heading */}
      <div className="mb-1">
        <h2 className="text-h3 text-text-primary font-semibold">Create account</h2>
        <p className="text-body-sm text-text-tertiary mt-1">
          Start managing your business today
        </p>
      </div>

      {/* Full Name */}
      <FormFieldWrapper
        label="Full name"
        htmlFor="register-name"
        error={errors.full_name?.message}
        required
      >
        <Input
          id="register-name"
          type="text"
          placeholder="John Smith"
          autoComplete="name"
          autoFocus
          aria-describedby={errors.full_name ? "register-name-error" : undefined}
          className={errors.full_name ? "border-danger-400 focus-visible:ring-danger-400/20" : ""}
          {...register("full_name")}
        />
      </FormFieldWrapper>

      {/* Email */}
      <FormFieldWrapper
        label="Email address"
        htmlFor="register-email"
        error={errors.email?.message}
        required
      >
        <Input
          id="register-email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          aria-describedby={errors.email ? "register-email-error" : undefined}
          className={errors.email ? "border-danger-400 focus-visible:ring-danger-400/20" : ""}
          {...register("email")}
        />
      </FormFieldWrapper>

      {/* Password */}
      <FormFieldWrapper
        label="Password"
        htmlFor="register-password"
        error={errors.password?.message}
        required
      >
        <PasswordInput
          id="register-password"
          placeholder="Create a strong password"
          autoComplete="new-password"
          hasError={!!errors.password}
          aria-describedby={errors.password ? "register-password-error" : undefined}
          {...register("password")}
        />
        <PasswordStrength password={passwordValue} />
      </FormFieldWrapper>

      {/* Confirm Password */}
      <FormFieldWrapper
        label="Confirm password"
        htmlFor="register-confirm-password"
        error={errors.confirm_password?.message}
        required
      >
        <PasswordInput
          id="register-confirm-password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          hasError={!!errors.confirm_password}
          aria-describedby={errors.confirm_password ? "register-confirm-password-error" : undefined}
          {...register("confirm_password")}
        />
      </FormFieldWrapper>

      {/* Submit */}
      <Button
        id="register-submit-btn"
        type="submit"
        disabled={isMutating}
        className="w-full mt-1"
        size="lg"
        style={{
          background: "linear-gradient(135deg, #3B82F6, #2563EB)",
          boxShadow: "0 0 20px rgba(59,130,246,0.25)",
        }}
      >
        {isMutating ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" aria-hidden="true" />
            Creating account…
          </span>
        ) : (
          "Create account"
        )}
      </Button>

      {/* Login link */}
      <p className="text-center text-body-sm text-text-tertiary">
        Already have an account?{" "}
        <Link
          to={ROUTES.LOGIN}
          className="text-primary-400 hover:text-primary-300 font-medium transition-colors duration-150"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
