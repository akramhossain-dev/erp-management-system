/**
 * ProductReportView.tsx — Product Inventory report view.
 */
import { useMemo } from "react";
import { ReportSummaryCards } from "./ReportSummaryCards";
import { ReportTable, type ReportColumnConfig } from "./ReportTable";
import { ReportFilters } from "./ReportFilters";
import { useReport } from "@/features/reports/hooks/useReport";
import { formatCurrency } from "@/utils/formatters";
import { exportToCSV } from "@/utils/csvExporter";
import type { ProductReportRow } from "@/features/reports/services/reportService";

export function ProductReportView() {
  const { reportData, isLoading, filters, updateFilters, resetFilters } = useReport("products");

  // Local filtering (in-memory for instant feedback)
  const filteredData = useMemo(() => {
    let list = (reportData ?? []) as ProductReportRow[];

    if (filters.search?.trim()) {
      const term = filters.search.toLowerCase().trim();
      list = list.filter((p) => p.name.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term));
    }

    if (filters.category) {
      list = list.filter((p) => p.category === filters.category);
    }

    return list;
  }, [reportData, filters.search, filters.category]);

  // Extract unique categories for filter
  const categories = useMemo(() => {
    const set = new Set((reportData as ProductReportRow[] ?? []).map((p) => p.category).filter(Boolean));
    return Array.from(set) as string[];
  }, [reportData]);

  // Aggregated KPIs
  const totalProducts = filteredData.length;
  const totalStock    = filteredData.reduce((sum, p) => sum + p.stock_quantity, 0);
  const totalValue    = filteredData.reduce((sum, p) => sum + p.inventory_value, 0);

  const handleExport = () => {
    const headers = ["Product Name", "SKU", "Category", "Cost Price", "Retail Price", "Stock", "Inventory Value"];
    const rows = filteredData.map((p) => [
      p.name,
      p.sku,
      p.category ?? "—",
      p.purchase_price.toFixed(2),
      p.selling_price.toFixed(2),
      p.stock_quantity.toString(),
      p.inventory_value.toFixed(2),
    ]);
    exportToCSV(`product_inventory_report_${new Date().toISOString().split("T")[0]}.csv`, headers, rows);
  };

  const columns: ReportColumnConfig<ProductReportRow>[] = [
    {
      header: "Product Name",
      render: (p) => p.name,
    },
    {
      header: "SKU",
      render: (p) => <span className="font-mono text-text-secondary">{p.sku}</span>,
    },
    {
      header: "Category",
      render: (p) => p.category ?? "—",
    },
    {
      header: "Cost Price",
      render: (p) => formatCurrency(p.purchase_price),
      className: "text-right font-mono",
    },
    {
      header: "Retail Price",
      render: (p) => formatCurrency(p.selling_price),
      className: "text-right font-mono",
    },
    {
      header: "Stock",
      render: (p) => p.stock_quantity.toLocaleString(),
      className: "text-right font-mono",
      totalKey: "stock_quantity",
    },
    {
      header: "Value (Cost)",
      render: (p) => formatCurrency(p.inventory_value),
      className: "text-right font-mono font-semibold",
      totalKey: "inventory_value",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <ReportFilters
        reportType="products"
        filters={filters}
        onUpdateFilters={updateFilters}
        onReset={resetFilters}
        categories={categories}
        onExport={handleExport}
        exportDisabled={filteredData.length === 0}
      />

      <ReportSummaryCards
        cards={[
          {
            label: "Total Products",
            value: totalProducts.toLocaleString(),
            color: "#60a5fa",
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
            ),
          },
          {
            label: "Total Stock Units",
            value: totalStock.toLocaleString(),
            color: "#a78bfa",
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
            ),
          },
          {
            label: "Total Inventory Value",
            value: formatCurrency(totalValue),
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
