/**
 * Auth feature — public API barrel export.
 * Import auth functionality from here, not from internal paths.
 *
 * @example
 * import { LoginForm, useAuth } from "@/features/auth";
 */

// Components
export { LoginForm }         from "./components/LoginForm";
export { RegisterForm }      from "./components/RegisterForm";
export { PasswordInput }     from "./components/PasswordInput";
export { PasswordStrength }  from "./components/PasswordStrength";
export { FormFieldWrapper }  from "./components/FormFieldWrapper";

// Hooks
export { useAuth } from "./hooks/useAuth";

// Service
export { authService, getAuthErrorMessage } from "./services/authService";

// Schemas & types
export {
  loginSchema,
  registerSchema,
  type LoginFormValues,
  type RegisterFormValues,
} from "./schemas/authSchemas";
