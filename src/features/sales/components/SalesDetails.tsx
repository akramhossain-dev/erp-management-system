/**
 * SalesDetails.tsx — details container for a sale.
 *
 * Wraps the InvoicePreview sheet to give the user a complete layout.
 */
import { InvoicePreview } from "./InvoicePreview";
import type { SaleWithItems } from "@/types/entities";

interface SalesDetailsProps {
  sale: SaleWithItems;
}

export function SalesDetails({ sale }: SalesDetailsProps) {
  return (
    <div className="flex flex-col gap-6">
      <InvoicePreview sale={sale} />
    </div>
  );
}
