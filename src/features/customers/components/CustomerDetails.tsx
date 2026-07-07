/**
 * CustomerDetails.tsx — Detail display view for a customer.
 */
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/formatters";
import { ROUTES } from "@/utils/constants";
import type { Customer } from "@/types/entities";

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
      <span className="text-body-sm text-text-muted">{label}</span>
      <span className="text-body-sm text-text-primary font-medium text-right">{value}</span>
    </div>
  );
}

interface CustomerDetailsProps {
  customer: Customer;
}

export function CustomerDetails({ customer }: CustomerDetailsProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="card-glass p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-h3 text-text-primary font-bold">{customer.name}</h2>
            <p className="text-body-sm text-text-muted mt-1">Customer Profile</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to={ROUTES.CUSTOMERS}>
              <Button variant="outline" size="sm" style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}>
                ← Back
              </Button>
            </Link>
            <Link to={ROUTES.CUSTOMERS_EDIT(customer.id)}>
              <Button size="sm" style={{ background: "linear-gradient(135deg, #3B82F6, #2563EB)", color: "white", border: "none" }}>
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="card-glass p-6 flex flex-col gap-4">
        <h3 className="text-h4 text-text-primary font-semibold">Contact & Info</h3>
        <div>
          <DetailRow label="Email Address" value={customer.email ?? "—"} />
          <DetailRow label="Phone Number" value={customer.phone ?? "—"} />
          <DetailRow label="Address" value={customer.address ?? "—"} />
          <DetailRow label="Notes" value={customer.notes ?? "—"} />
          <DetailRow label="Joined Date" value={formatDate(customer.created_at)} />
        </div>
      </div>
    </div>
  );
}
