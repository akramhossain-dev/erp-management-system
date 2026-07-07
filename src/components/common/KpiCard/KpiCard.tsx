/**
 * KpiCard — reusable glass morphism KPI metric card.
 *
 * Used across the dashboard for all KPI metrics.
 * Supports loading skeleton state.
 * Phase 10: Enhanced with animated hover glow, improved trend badge,
 *           and staggered enter animations.
 */
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title:     string;
  value:     string | number;
  icon:      ReactNode;
  /** Optional trend indicator */
  trend?:    { value: number; label: string; direction: "up" | "down" | "neutral" };
  /** Color theme for the icon background */
  color?:    "blue" | "green" | "amber" | "purple" | "rose" | "cyan";
  isLoading?: boolean;
  className?: string;
  /** Stagger delay index (0-5) for entrance animation */
  staggerIndex?: number;
}

const COLOR_MAP = {
  blue:   { bg: "rgba(59,130,246,0.1)",  border: "rgba(59,130,246,0.2)",  icon: "#60a5fa", glow: "rgba(59,130,246,0.12)"  },
  green:  { bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.2)",  icon: "#34d399", glow: "rgba(16,185,129,0.12)"  },
  amber:  { bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.2)",  icon: "#fbbf24", glow: "rgba(245,158,11,0.12)"  },
  purple: { bg: "rgba(139,92,246,0.1)",  border: "rgba(139,92,246,0.2)",  icon: "#a78bfa", glow: "rgba(139,92,246,0.12)"  },
  rose:   { bg: "rgba(244,63,94,0.1)",   border: "rgba(244,63,94,0.2)",   icon: "#fb7185", glow: "rgba(244,63,94,0.12)"   },
  cyan:   { bg: "rgba(6,182,212,0.1)",   border: "rgba(6,182,212,0.2)",   icon: "#22d3ee", glow: "rgba(6,182,212,0.12)"   },
};

const STAGGER_CLASSES = [
  "stagger-1",
  "stagger-2",
  "stagger-3",
  "stagger-4",
  "stagger-5",
  "stagger-6",
];

export function KpiCard({
  title,
  value,
  icon,
  trend,
  color = "blue",
  isLoading = false,
  className,
  staggerIndex,
}: KpiCardProps) {
  const colors = COLOR_MAP[color];
  const staggerClass = staggerIndex !== undefined
    ? STAGGER_CLASSES[staggerIndex % STAGGER_CLASSES.length]
    : "";

  return (
    <article
      className={cn(
        "card-kpi group relative overflow-hidden animate-slide-up",
        staggerClass,
        className,
      )}
      aria-label={`${title}: ${isLoading ? "loading" : value}`}
    >
      {/* Subtle ambient glow on hover — matches icon color */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(ellipse 80% 60% at 20% 60%, ${colors.glow} 0%, transparent 70%)` }}
        aria-hidden="true"
      />

      {/* Top-right decorative circle */}
      <div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-500 pointer-events-none"
        style={{ background: colors.icon }}
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-4">
        {/* Header: icon + trend */}
        <div className="flex items-start justify-between">
          {/* Icon container */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
            style={{
              background: colors.bg,
              border:     `1px solid ${colors.border}`,
              boxShadow:  `0 0 12px ${colors.glow}`,
            }}
            aria-hidden="true"
          >
            <span style={{ color: colors.icon }} className="w-5 h-5 flex items-center justify-center">
              {icon}
            </span>
          </div>

          {/* Trend badge */}
          {trend && !isLoading && (
            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-caption font-semibold"
              style={{
                background: trend.direction === "up"
                  ? "rgba(16,185,129,0.12)"
                  : trend.direction === "down"
                    ? "rgba(244,63,94,0.12)"
                    : "rgba(100,116,139,0.1)",
                color: trend.direction === "up"
                  ? "var(--success-400)"
                  : trend.direction === "down"
                    ? "var(--danger-400)"
                    : "var(--text-tertiary)",
                border: `1px solid ${
                  trend.direction === "up"
                    ? "rgba(16,185,129,0.2)"
                    : trend.direction === "down"
                      ? "rgba(244,63,94,0.2)"
                      : "rgba(100,116,139,0.12)"
                }`,
              }}
            >
              {trend.direction === "up" && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              )}
              {trend.direction === "down" && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              )}
              {trend.value > 0 && trend.direction !== "neutral" ? `${trend.value}%` : "—"}
            </div>
          )}
        </div>

        {/* Value */}
        {isLoading ? (
          <div className="flex flex-col gap-2">
            <div className="skeleton h-8 w-24 rounded-lg" />
            <div className="skeleton h-4 w-32 rounded" />
            <div className="skeleton h-3 w-20 rounded" />
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <span className="text-3xl font-extrabold tracking-tight text-text-primary tabular-nums">
              {typeof value === "number" ? value.toLocaleString() : value}
            </span>
            <span className="text-body-sm text-text-secondary font-medium">{title}</span>
            {trend && (
              <span className="text-caption text-text-muted mt-0.5">{trend.label}</span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
