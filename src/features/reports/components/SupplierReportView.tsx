/**
 * SupplierReportView.tsx — Supplier purchases and aggregate value report view.
 */
import { useMemo } from "react";
import { ReportSummaryCards } from "./ReportSummaryCards";
import { ReportTable, type ReportColumnConfig } from "./ReportTable";
import { ReportFilters } from "./ReportFilters";
import { useReport } from "@/features/reports/hooks/useReport";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { exportToCSV } from "@/utils/csvExporter";
import { Button } from "@/components/ui/button";
import type { SupplierReportRow } from "@/features/reports/services/reportService";

export function SupplierReportView() {
  const { reportData, isLoading, filters, updateFilters, resetFilters } = useReport("suppliers");

  const filteredData = useMemo(() => {
    let list = (reportData ?? []) as SupplierReportRow[];

    if (filters.search?.trim()) {
      const term = filters.search.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(term) ||
          (s.email && s.email.toLowerCase().includes(term)) ||
          (s.phone && s.phone.includes(term))
      );
    }

    return list;
  }, [reportData, filters.search]);

  // Aggregated KPIs
  const totalSuppliers    = filteredData.length;
  const totalPurchaseOrders = filteredData.reduce((sum, s) => sum + s.total_supplies, 0);
  const totalSuppliedValue  = filteredData.reduce((sum, s) => sum + s.total_supplied_val, 0);

  const handleExport = () => {
    const headers = ["Supplier Name", "Email", "Phone", "Total Purchase Orders", "Total Supplied Value", "Last Supply Date"];
    const rows = filteredData.map((s) => [
      s.name,
      s.email ?? "—",
      s.phone ?? "—",
      s.total_supplies.toString(),
      s.total_supplied_val.toFixed(2),
      s.last_supply_date ? s.last_supply_date : "—",
    ]);
    exportToCSV(`supplier_supplies_report_${new Date().toISOString().split("T")[0]}.csv`, headers, rows);
  };

  const columns: ReportColumnConfig<SupplierReportRow>[] = [
    {
      header: "Supplier Name",
      render: (s) => s.name,
    },
    {
      header: "Email",
      render: (s) => s.email ?? <span className="text-text-muted">No Email</span>,
    },
    {
      header: "Phone",
      render: (s) => s.phone ? <span className="font-mono">{s.phone}</span> : <span className="text-text-muted">—</span>,
    },
    {
      header: "PO Count",
      render: (s) => s.total_supplies.toLocaleString(),
      className: "text-right font-mono",
      totalKey: "total_supplies",
    },
    {
      header: "Total Supplied Value",
      render: (s) => formatCurrency(s.total_supplied_val),
      className: "text-right font-mono font-semibold",
      totalKey: "total_supplied_val",
    },
    {
      header: "Last Supply Date",
      render: (s) => s.last_supply_date ? formatDate(s.last_supply_date) : <span className="text-text-muted">—</span>,
      className: "text-right",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Filters & Export header */}
      <div className="card-glass px-6 py-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4 flex-wrap">
        <ReportFilters
          reportType="suppliers"
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
            label: "Total Suppliers",
            value: totalSuppliers.toLocaleString(),
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
            label: "Purchase Orders Count",
            value: totalPurchaseOrders.toLocaleString(),
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            ),
          },
          {
            label: "Total Supplied (Cost)",
            value: formatCurrency(totalSuppliedValue),
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v12M15 9H11.5a2.5 2.5 0 0 0 0 5h3a2.5 2.5 0 0 1 0 5H9"/>
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
