/**
 * DashboardStats — grid of 6 KPI cards for the dashboard overview.
 */
import { KpiCard } from "@/components/common/KpiCard";
import { useDashboardStats } from "@/features/dashboard/hooks/useDashboardStats";

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const Icons = {
  products: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),
  customers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  suppliers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  ),
  purchases: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="21" r="1"/>
      <circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  ),
  sales: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  revenue: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
};

// ─── Format currency ──────────────────────────────────────────────────────────

function formatRevenue(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000)     return `$${(amount / 1_000).toFixed(1)}K`;
  return `$${amount.toFixed(2)}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DashboardStats() {
  const { data, isLoading } = useDashboardStats();

  const cards = [
    {
      title: "Total Products",
      value: data?.total_products ?? 0,
      icon:  Icons.products,
      color: "blue"  as const,
      trend: { value: 12, label: "vs last month", direction: "up" as const },
    },
    {
      title: "Customers",
      value: data?.total_customers ?? 0,
      icon:  Icons.customers,
      color: "green" as const,
      trend: { value: 8, label: "new this month", direction: "up" as const },
    },
    {
      title: "Suppliers",
      value: data?.total_suppliers ?? 0,
      icon:  Icons.suppliers,
      color: "amber" as const,
      trend: { value: 0, label: "no change", direction: "neutral" as const },
    },
    {
      title: "Total Purchases",
      value: data?.total_purchases ?? 0,
      icon:  Icons.purchases,
      color: "purple" as const,
      trend: { value: 5, label: "vs last month", direction: "up" as const },
    },
    {
      title: "Total Sales",
      value: data?.total_sales ?? 0,
      icon:  Icons.sales,
      color: "cyan" as const,
      trend: { value: 15, label: "vs last month", direction: "up" as const },
    },
    {
      title: "Total Revenue",
      value: formatRevenue(data?.total_revenue ?? 0),
      icon:  Icons.revenue,
      color: "rose" as const,
      trend: { value: 22, label: "vs last month", direction: "up" as const },
    },
  ];

  return (
    <section aria-label="Key performance indicators">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map((card) => (
          <KpiCard key={card.title} {...card} isLoading={isLoading} />
        ))}
      </div>
    </section>
  );
}
