/**
 * PurchaseReportView.tsx — Purchase Order metrics report view.
 */
import { ReportSummaryCards } from "./ReportSummaryCards";
import { ReportTable, type ReportColumnConfig } from "./ReportTable";
import { ReportFilters } from "./ReportFilters";
import { useReport } from "@/features/reports/hooks/useReport";
import { useSuppliers } from "@/features/suppliers/hooks/useSuppliers";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { exportToCSV } from "@/utils/csvExporter";
import type { PurchaseReportRow } from "@/features/reports/services/reportService";

export function PurchaseReportView() {
  const { reportData, isLoading, filters, updateFilters, resetFilters } = useReport("purchases");
  const { suppliers } = useSuppliers(1000); // load suppliers list for filter dropdown

  const filteredData = reportData as PurchaseReportRow[];

  // Aggregated KPIs
  const totalCount  = filteredData.length;
  const totalAmount = filteredData.reduce((sum, p) => sum + p.total_amount, 0);

  const handleExport = () => {
    const headers = ["Purchase ID", "Supplier Name", "Purchase Date", "Total Cost", "Quantity Sum"];
    const rows = filteredData.map((p) => [
      p.id,
      p.supplier_name,
      p.purchase_date,
      p.total_amount.toFixed(2),
      p.items_count.toString(),
    ]);
    exportToCSV(`purchases_report_${new Date().toISOString().split("T")[0]}.csv`, headers, rows);
  };

  const columns: ReportColumnConfig<PurchaseReportRow>[] = [
    {
      header: "Purchase ID",
      render: (p) => <span className="font-mono text-text-secondary">{p.id.split("-")[0].toUpperCase()}</span>,
    },
    {
      header: "Supplier",
      render: (p) => p.supplier_name,
    },
    {
      header: "Purchase Date",
      render: (p) => formatDate(p.purchase_date),
      className: "text-right",
    },
    {
      header: "Items Count",
      render: (p) => p.items_count.toLocaleString(),
      className: "text-right font-mono",
      totalKey: "items_count",
    },
    {
      header: "Total Cost",
      render: (p) => formatCurrency(p.total_amount),
      className: "text-right font-mono font-semibold",
      totalKey: "total_amount",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Filters + Export */}
      <ReportFilters
        reportType="purchases"
        filters={filters}
        onUpdateFilters={updateFilters}
        onReset={resetFilters}
        suppliers={suppliers}
        onExport={handleExport}
        exportDisabled={filteredData.length === 0}
      />

      {/* KPI Cards */}
      <ReportSummaryCards
        cards={[
          {
            label: "Total Purchases",
            value: totalCount.toLocaleString(),
            color: "#f59e0b",
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            ),
          },
          {
            label: "Total Cost",
            value: formatCurrency(totalAmount),
            color: "#34d399",
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
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
