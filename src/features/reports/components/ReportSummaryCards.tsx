/**
 * ReportSummaryCards.tsx — Reusable key KPI widgets row for report summary views.
 */
interface SummaryCard {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

interface ReportSummaryCardsProps {
  cards: SummaryCard[];
}

export function ReportSummaryCards({ cards }: ReportSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {cards.map((card, idx) => (
        <div key={idx} className="card-glass p-5 flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-caption text-text-muted font-medium">{card.label}</span>
            <span className="text-h3 text-text-primary font-bold">{card.value}</span>
          </div>
          {card.icon && (
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-subtle)" }}
              aria-hidden="true"
            >
              {card.icon}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
