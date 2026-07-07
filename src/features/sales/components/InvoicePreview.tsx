/**
 * InvoicePreview.tsx — Print-ready high-fidelity invoice sheet layout.
 *
 * Implements standard CSS printing controls to print as a clean A4 sheet,
 * hiding headers/sidebars, and providing direct PDF download/print triggers.
 */
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/utils/formatters";
import type { SaleWithItems } from "@/types/entities";

interface InvoicePreviewProps {
  sale: SaleWithItems;
}

export function InvoicePreview({ sale }: InvoicePreviewProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6">

      {/* ── Action Bar (Hidden during print) ───────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 card-glass p-5 print:hidden">
        <div>
          <span className="text-caption text-text-muted">Invoice Utility</span>
          <p className="text-body-sm text-text-secondary mt-0.5">Preview, print, or download invoice sheets.</p>
        </div>
        <Button
          id="print-invoice-btn"
          onClick={handlePrint}
          style={{
            background: "linear-gradient(135deg, #10B981, #059669)",
            color:      "white",
            border:     "none",
            boxShadow:  "0 0 15px rgba(16,185,129,0.2)",
          }}
          className="gap-2 font-semibold"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="6 9 6 2 18 2 18 9"/>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
            <rect x="6" y="14" width="12" height="8"/>
          </svg>
          Print Invoice / Save as PDF
        </Button>
      </div>

      {/* ── Invoice Sheet (Styled for Screen and Printer) ──────────────────── */}
      <div
        id="invoice-sheet"
        className="mx-auto w-full max-w-[850px] bg-white text-slate-900 p-8 sm:p-12 rounded-2xl shadow-xl flex flex-col gap-8 print:p-0 print:shadow-none print:rounded-none print:bg-white print:text-black"
        style={{ minHeight: "297mm" }} // Standard A4 ratio
      >
        {/* Print specific CSS rules */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body * {
              visibility: hidden;
            }
            #invoice-sheet, #invoice-sheet * {
              visibility: visible;
            }
            #invoice-sheet {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              max-width: 100% !important;
              padding: 0 !important;
              margin: 0 !important;
              box-shadow: none !important;
              border: none !important;
            }
          }
        `}} />

        {/* Invoice Header */}
        <div className="flex justify-between items-start gap-4 flex-wrap border-b pb-6 border-slate-200">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 print:text-black flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-lg font-bold" aria-hidden="true">G</span>
              GLASS ERP
            </h1>
            <p className="text-xs text-slate-500 mt-1">Modern Glass Enterprise Resource Planner</p>
          </div>
          <div className="text-right sm:text-right">
            <h2 className="text-2xl font-bold uppercase tracking-wide text-slate-700">INVOICE</h2>
            <p className="text-sm font-mono text-slate-800 font-semibold mt-1">{sale.invoice_number}</p>
          </div>
        </div>

        {/* Invoice Info Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm">
          {/* Bill To */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Bill To</span>
            <div className="mt-2 flex flex-col gap-1 text-slate-700">
              <p className="font-bold text-base text-slate-950">{sale.customer?.name ?? "Walk-in Customer"}</p>
              {sale.customer?.email && <p>{sale.customer.email}</p>}
              {sale.customer?.phone && <p className="font-mono">{sale.customer.phone}</p>}
              {sale.customer?.address && (
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed max-w-[280px]">
                  {sale.customer.address}
                </p>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-col sm:items-end gap-3.5">
            <div className="flex justify-between w-full max-w-[240px]">
              <span className="text-slate-400 font-medium">Invoice Date:</span>
              <span className="font-semibold text-slate-800">{formatDate(sale.sale_date)}</span>
            </div>
            <div className="flex justify-between w-full max-w-[240px]">
              <span className="text-slate-400 font-medium">Payment Status:</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                {sale.status.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between w-full max-w-[240px]">
              <span className="text-slate-400 font-medium">Due Balance:</span>
              <span className="font-bold text-slate-950">৳0.00</span>
            </div>
          </div>
        </div>

        {/* Product Items Table */}
        <div className="flex-1">
          <table className="w-full text-left text-sm" aria-label="Invoice products list">
            <thead>
              <tr className="border-b-2 border-slate-300 text-slate-500 font-bold">
                <th scope="col" className="pb-3">Product details</th>
                <th scope="col" className="pb-3 text-right">Unit Price</th>
                <th scope="col" className="pb-3 text-right">Quantity</th>
                <th scope="col" className="pb-3 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sale.sale_items?.map((item) => (
                <tr key={item.id}>
                  <td className="py-4">
                    <p className="font-bold text-slate-900">{item.product?.name ?? "Unknown"}</p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{item.product?.sku}</p>
                  </td>
                  <td className="py-4 text-right font-mono text-slate-600">
                    {formatCurrency(Number(item.unit_price))}
                  </td>
                  <td className="py-4 text-right font-mono text-slate-600">
                    {item.quantity.toLocaleString()}
                  </td>
                  <td className="py-4 text-right font-mono font-semibold text-slate-900">
                    {formatCurrency(Number(item.total_price))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Invoice Footer total / terms */}
        <div className="border-t pt-6 border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Notes / Footnotes</span>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed whitespace-pre-wrap max-w-sm">
              {sale.notes || "Thank you for choosing Glass ERP! Goods once sold cannot be returned without verified authorization."}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2.5">
            <div className="flex justify-between w-full max-w-[240px] text-slate-500">
              <span>Subtotal:</span>
              <span className="font-mono">{formatCurrency(Number(sale.total_amount))}</span>
            </div>
            <div className="flex justify-between w-full max-w-[240px] text-slate-500">
              <span>Discount / VAT:</span>
              <span className="font-mono">৳0.00</span>
            </div>
            <div className="w-full max-w-[240px] h-px bg-slate-200" aria-hidden="true" />
            <div className="flex justify-between w-full max-w-[240px] text-lg font-bold">
              <span className="text-slate-900">Grand Total:</span>
              <span className="text-emerald-700 font-mono">{formatCurrency(Number(sale.total_amount))}</span>
            </div>
          </div>
        </div>

        {/* Foot Signature */}
        <div className="flex justify-between items-center text-xs text-slate-400 mt-12 print:mt-16">
          <p>Generated by Glass ERP SaaS Application</p>
          <div className="w-24 border-t border-slate-300 text-center pt-1 print:block">
            Authorized sign
          </div>
        </div>

      </div>
    </div>
  );
}
