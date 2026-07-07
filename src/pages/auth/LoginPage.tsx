/**
 * LoginPage — renders inside AuthLayout's <Outlet>.
 * AuthLayout already provides the glass card container and brand header.
 */
import { LoginForm } from "@/features/auth";

export function LoginPage() {
  return <LoginForm />;
}
