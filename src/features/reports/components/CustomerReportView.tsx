/**
 * CustomerReportView.tsx — Customer spending and purchase frequency report view.
 */
import { useMemo } from "react";
import { ReportSummaryCards } from "./ReportSummaryCards";
import { ReportTable, type ReportColumnConfig } from "./ReportTable";
import { ReportFilters } from "./ReportFilters";
import { useReport } from "@/features/reports/hooks/useReport";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { exportToCSV } from "@/utils/csvExporter";
import { Button } from "@/components/ui/button";
import type { CustomerReportRow } from "@/features/reports/services/reportService";

export function CustomerReportView() {
  const { reportData, isLoading, filters, updateFilters, resetFilters } = useReport("customers");

  const filteredData = useMemo(() => {
    let list = (reportData ?? []) as CustomerReportRow[];

    if (filters.search?.trim()) {
      const term = filters.search.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          (c.email && c.email.toLowerCase().includes(term)) ||
          (c.phone && c.phone.includes(term))
      );
    }

    return list;
  }, [reportData, filters.search]);

  // Aggregated KPIs
  const totalCustomers = filteredData.length;
  const totalOrders    = filteredData.reduce((sum, c) => sum + c.total_orders, 0);
  const totalRevenue   = filteredData.reduce((sum, c) => sum + c.total_spent, 0);

  const handleExport = () => {
    const headers = ["Customer Name", "Email", "Phone", "Total Invoices", "Total Spent", "Last Purchase Date"];
    const rows = filteredData.map((c) => [
      c.name,
      c.email ?? "—",
      c.phone ?? "—",
      c.total_orders.toString(),
      c.total_spent.toFixed(2),
      c.last_purchase_date ? c.last_purchase_date : "—",
    ]);
    exportToCSV(`customer_spent_report_${new Date().toISOString().split("T")[0]}.csv`, headers, rows);
  };

  const columns: ReportColumnConfig<CustomerReportRow>[] = [
    {
      header: "Customer Name",
      render: (c) => c.name,
    },
    {
      header: "Email",
      render: (c) => c.email ?? <span className="text-text-muted">No Email</span>,
    },
    {
      header: "Phone",
      render: (c) => c.phone ? <span className="font-mono">{c.phone}</span> : <span className="text-text-muted">—</span>,
    },
    {
      header: "Invoices Count",
      render: (c) => c.total_orders.toLocaleString(),
      className: "text-right font-mono",
      totalKey: "total_orders",
    },
    {
      header: "Total Spent",
      render: (c) => formatCurrency(c.total_spent),
      className: "text-right font-mono font-semibold",
      totalKey: "total_spent",
    },
    {
      header: "Last Order Date",
      render: (c) => c.last_purchase_date ? formatDate(c.last_purchase_date) : <span className="text-text-muted">—</span>,
      className: "text-right",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Filters & Export header */}
      <div className="card-glass px-6 py-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4 flex-wrap">
        <ReportFilters
          reportType="customers"
          filters={filters}
          onUpdateFilters={updateFilters}
          onReset={resetFilters}
        />
        <Button
          id="export-csv-btn"
          onClick={handleExport}
          disabled={filteredData.length === 0}
          style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}
          variant="outline"
          className="gap-2 h-10 px-4.5 rounded-xl text-body"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
          Export CSV
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <ReportSummaryCards
        cards={[
          {
            label: "Total Customers",
            value: totalCustomers.toLocaleString(),
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            ),
          },
          {
            label: "Total Completed Orders",
            value: totalOrders.toLocaleString(),
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            ),
          },
          {
            label: "Accumulated Revenue",
            value: formatCurrency(totalRevenue),
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            ),
          },
        ]}
      />

      {/* Data Table */}
      <ReportTable data={filteredData} columns={columns} isLoading={isLoading} />
    </div>
  );
}
