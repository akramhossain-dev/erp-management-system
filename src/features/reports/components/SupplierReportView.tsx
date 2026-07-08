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
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <ReportFilters
        reportType="suppliers"
        filters={filters}
        onUpdateFilters={updateFilters}
        onReset={resetFilters}
        onExport={handleExport}
        exportDisabled={filteredData.length === 0}
      />

      <ReportSummaryCards
        cards={[
          {
            label: "Total Suppliers",
            value: totalSuppliers.toLocaleString(),
            color: "#fb923c",
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13"/>
                <path d="M16 8h4l3 3v5h-7V8z"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            ),
          },
          {
            label: "Purchase Orders",
            value: totalPurchaseOrders.toLocaleString(),
            color: "#60a5fa",
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            ),
          },
          {
            label: "Total Supplied Value",
            value: formatCurrency(totalSuppliedValue),
            color: "#34d399",
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v12M15 9H11.5a2.5 2.5 0 0 0 0 5h3a2.5 2.5 0 0 1 0 5H9"/>
              </svg>
            ),
          },
        ]}
      />

      <ReportTable data={filteredData} columns={columns} isLoading={isLoading} />
    </div>
  );
}
