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
import { Button } from "@/components/ui/button";
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
    <div className="flex flex-col gap-6">
      {/* Filters & Export header */}
      <div className="card-glass px-6 py-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4 flex-wrap">
        <ReportFilters
          reportType="purchases"
          filters={filters}
          onUpdateFilters={updateFilters}
          onReset={resetFilters}
          suppliers={suppliers}
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
            label: "Total Purchases Count",
            value: totalCount.toLocaleString(),
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            ),
          },
          {
            label: "Total Purchase Amount (Cost)",
            value: formatCurrency(totalAmount),
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
