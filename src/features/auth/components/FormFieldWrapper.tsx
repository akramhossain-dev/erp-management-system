/**
 * FormFieldWrapper — styled form field with label and error message.
 * Used to wrap Shadcn Input components inside React Hook Form fields.
 */
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormFieldWrapperProps {
  label:     string;
  htmlFor:   string;
  error?:    string;
  required?: boolean;
  children:  ReactNode;
  className?: string;
}

export function FormFieldWrapper({
  label,
  htmlFor,
  error,
  required,
  children,
  className,
}: FormFieldWrapperProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="text-body-sm font-medium text-text-secondary"
      >
        {label}
        {required && (
          <span className="ml-1 text-danger-400" aria-hidden="true">*</span>
        )}
      </label>
      {children}
      {error && (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="text-caption text-danger-400 flex items-center gap-1.5"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="flex-shrink-0"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
