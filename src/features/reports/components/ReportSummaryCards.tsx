/**
 * ReportSummaryCards.tsx — Premium KPI summary cards for report views.
 */
interface SummaryCard {
  label:    string;
  value:    string | number;
  icon?:    React.ReactNode;
  color?:   string;
  change?:  string;
}

interface ReportSummaryCardsProps {
  cards: SummaryCard[];
}

export function ReportSummaryCards({ cards }: ReportSummaryCardsProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 16,
        marginBottom: 4,
      }}
    >
      {cards.map((card, idx) => (
        <div
          key={idx}
          style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--border-default)",
            borderRadius: 16,
            padding: "20px 22px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            transition: "border-color 200ms, box-shadow 200ms",
            position: "relative",
            overflow: "hidden",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)";
            (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--border-default)";
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
          }}
        >
          {/* Subtle glow orb in background */}
          {card.color && (
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: -20,
                right: -20,
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: card.color,
                opacity: 0.06,
                filter: "blur(20px)",
                pointerEvents: "none",
              }}
            />
          )}

          {/* Icon + label row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--text-muted)",
              }}
            >
              {card.label}
            </span>
            {card.icon && (
              <div
                aria-hidden="true"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: card.color ? `${card.color}15` : "var(--glass-bg-hover)",
                  border: `1px solid ${card.color ? `${card.color}28` : "var(--border-subtle)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {card.icon}
              </div>
            )}
          </div>

          {/* Value */}
          <div>
            <span
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              {card.value}
            </span>
            {card.change && (
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                {card.change}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
