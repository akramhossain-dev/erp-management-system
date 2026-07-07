/**
 * RegisterPage — renders inside AuthLayout's <Outlet>.
 * AuthLayout already provides the glass card container and brand header.
 */
import { RegisterForm } from "@/features/auth";

export function RegisterPage() {
  return <RegisterForm />;
}
