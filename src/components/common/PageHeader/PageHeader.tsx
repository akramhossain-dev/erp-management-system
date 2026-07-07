/**
 * PageHeader — reusable page header component.
 *
 * Renders a consistent page title, count badge, description,
 * and optional action button area used across all ERP module pages.
 *
 * Phase 10: Standardized across Products, Customers, Suppliers,
 *           Purchases, Sales pages.
 */
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  /** Main page title */
  title:       string;
  /** Short description below the title */
  description?: string;
  /** Optional count badge next to title (e.g. total records) */
  count?:       number | null;
  /** Badge color theme */
  countColor?:  "blue" | "green" | "amber" | "purple" | "cyan";
  /** Content to render in the right action area */
  actions?:    ReactNode;
  className?:  string;
  /** Whether count is still loading */
  isLoading?:  boolean;
}

const COUNT_STYLES = {
  blue:   { bg: "rgba(59,130,246,0.12)",  color: "var(--primary-400)",  border: "rgba(59,130,246,0.2)"  },
  green:  { bg: "rgba(16,185,129,0.12)",  color: "var(--success-400)",  border: "rgba(16,185,129,0.2)"  },
  amber:  { bg: "rgba(245,158,11,0.12)",  color: "var(--warning-400)",  border: "rgba(245,158,11,0.2)"  },
  purple: { bg: "rgba(139,92,246,0.12)",  color: "#a78bfa",             border: "rgba(139,92,246,0.2)"  },
  cyan:   { bg: "rgba(6,182,212,0.12)",   color: "var(--info-400)",     border: "rgba(6,182,212,0.2)"   },
};

export function PageHeader({
  title,
  description,
  count,
  countColor  = "blue",
  actions,
  className,
  isLoading,
}: PageHeaderProps) {
  const countStyle = COUNT_STYLES[countColor];
  const showCount  = !isLoading && count !== null && count !== undefined;

  return (
    <div className={cn("flex items-start justify-between gap-4 flex-wrap", className)}>
      {/* Left: title + description */}
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-h2 text-text-primary font-bold tracking-tight">
            {title}
          </h2>
          {showCount && (
            <span
              className="text-caption font-semibold px-2.5 py-0.5 rounded-full"
              style={{
                background: countStyle.bg,
                color:      countStyle.color,
                border:     `1px solid ${countStyle.border}`,
              }}
            >
              {count!.toLocaleString()}
            </span>
          )}
          {isLoading && (
            <span className="skeleton h-5 w-10 rounded-full" />
          )}
        </div>
        {description && (
          <p className="text-body-sm text-text-secondary mt-1.5">
            {description}
          </p>
        )}
      </div>

      {/* Right: actions slot */}
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
