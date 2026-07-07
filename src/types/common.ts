/**
 * Shared utility types used across the application.
 */

/** Makes all nested properties optional */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/** Makes specific keys required */
export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;

/** Strict Omit — errors on missing keys */
export type StrictOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/** Component children prop */
export interface WithChildren {
  children: React.ReactNode;
}

/** Component className prop */
export interface WithClassName {
  className?: string;
}

/** Loading state type */
export type LoadingState = "idle" | "loading" | "success" | "error";

/** Status values for entities */
export type StatusValue = "pending" | "completed" | "cancelled" | "active" | "inactive";

/** Form mode */
export type FormMode = "create" | "edit" | "view";

/** Theme */
export type Theme = "dark" | "light" | "system";
