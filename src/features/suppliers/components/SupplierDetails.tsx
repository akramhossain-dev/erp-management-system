/**
 * SupplierDetails.tsx — Detail display view for a supplier.
 */
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/formatters";
import { ROUTES } from "@/utils/constants";
import type { Supplier } from "@/types/entities";

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
      <span className="text-body-sm text-text-muted">{label}</span>
      <span className="text-body-sm text-text-primary font-medium text-right">{value}</span>
    </div>
  );
}

interface SupplierDetailsProps {
  supplier: Supplier;
}

export function SupplierDetails({ supplier }: SupplierDetailsProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="card-glass p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-h3 text-text-primary font-bold">{supplier.name}</h2>
            <p className="text-body-sm text-text-muted mt-1">Supplier Profile</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to={ROUTES.SUPPLIERS}>
              <Button variant="outline" size="sm" style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}>
                ← Back
              </Button>
            </Link>
            <Link to={ROUTES.SUPPLIERS_EDIT(supplier.id)}>
              <Button size="sm" style={{ background: "linear-gradient(135deg, #10B981, #059669)", color: "white", border: "none" }}>
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="card-glass p-6 flex flex-col gap-4">
        <h3 className="text-h4 text-text-primary font-semibold">Contact & Info</h3>
        <div>
          <DetailRow label="Email Address" value={supplier.email ?? "—"} />
          <DetailRow label="Phone Number" value={supplier.phone ?? "—"} />
          <DetailRow label="Address" value={supplier.address ?? "—"} />
          <DetailRow label="Notes" value={supplier.notes ?? "—"} />
          <DetailRow label="Joined Date" value={formatDate(supplier.created_at)} />
        </div>
      </div>
    </div>
  );
}
