/**
 * LoginForm — email + password sign-in form.
 *
 * Uses React Hook Form + Zod for validation.
 * Delegates auth side-effects to useAuth().
 * Shows toast notification on error.
 */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { PasswordInput } from "./PasswordInput";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas/authSchemas";
import { ROUTES } from "@/utils/constants";

export function LoginForm() {
  const { login, isMutating } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    const result = await login(values);

    if (!result.success && result.error) {
      // Show toast for network/server errors
      toast.error(result.error, {
        description: "Please check your credentials and try again.",
      });
      // Also set field-level error for invalid credentials
      if (result.error.toLowerCase().includes("invalid")) {
        setError("password", { message: result.error });
      }
    }
  };

  return (
    <form
      id="login-form"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
      noValidate
    >
      {/* Heading */}
      <div className="mb-1">
        <h2 className="text-h3 text-text-primary font-semibold">Welcome back</h2>
        <p className="text-body-sm text-text-tertiary mt-1">
          Sign in to your ERP account
        </p>
      </div>

      {/* Email */}
      <FormFieldWrapper
        label="Email address"
        htmlFor="login-email"
        error={errors.email?.message}
        required
      >
        <Input
          id="login-email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          autoFocus
          aria-describedby={errors.email ? "login-email-error" : undefined}
          className={`auth-input-glass ${errors.email ? "border-danger-400 focus-visible:ring-danger-400/20" : ""}`}
          {...register("email")}
        />
      </FormFieldWrapper>

      {/* Password */}
      <FormFieldWrapper
        label="Password"
        htmlFor="login-password"
        error={errors.password?.message}
        required
      >
        <PasswordInput
          id="login-password"
          placeholder="Enter your password"
          autoComplete="current-password"
          hasError={!!errors.password}
          aria-describedby={errors.password ? "login-password-error" : undefined}
          className="auth-input-glass"
          {...register("password")}
        />
      </FormFieldWrapper>

      {/* Submit */}
      <Button
        id="login-submit-btn"
        type="submit"
        disabled={isMutating}
        className="w-full mt-1 auth-button-premium"
        size="lg"
      >
        {isMutating ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" aria-hidden="true" />
            Signing in…
          </span>
        ) : (
          "Sign in"
        )}
      </Button>

      {/* Register link */}
      <p className="text-center text-body-sm text-text-tertiary">
        Don't have an account?{" "}
        <Link
          to={ROUTES.REGISTER}
          className="text-primary-400 hover:text-primary-300 font-medium transition-colors duration-150"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
