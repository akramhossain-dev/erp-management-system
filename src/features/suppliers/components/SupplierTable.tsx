/**
 * SupplierTable.tsx — lists suppliers with page controls and delete dialog.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useDeleteSupplier } from "@/features/suppliers/hooks/useSupplierMutations";
import { formatDate } from "@/utils/formatters";
import { ROUTES } from "@/utils/constants";
import { cn } from "@/lib/utils";
import type { Supplier } from "@/types/entities";

// ─── Skeleton rows ────────────────────────────────────────────────────────────

function SkeletonRows({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i}>
          <td className="px-4 py-3"><div className="skeleton h-4 w-32 rounded" /></td>
          <td className="px-4 py-3 hidden md:table-cell"><div className="skeleton h-4 w-40 rounded" /></td>
          <td className="px-4 py-3 hidden sm:table-cell"><div className="skeleton h-4 w-28 rounded" /></td>
          <td className="px-4 py-3 hidden lg:table-cell"><div className="skeleton h-4 w-48 rounded" /></td>
          <td className="px-4 py-3 hidden xl:table-cell"><div className="skeleton h-4 w-20 rounded" /></td>
          <td className="px-4 py-3"><div className="flex gap-2"><div className="skeleton h-7 w-16 rounded-lg" /><div className="skeleton h-7 w-16 rounded-lg" /></div></td>
        </tr>
      ))}
    </>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ hasFilters, onClear }: { hasFilters: boolean; onClear: () => void }) {
  return (
    <tr>
      <td colSpan={6}>
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(100,116,139,0.1)", border: "1px solid var(--border-subtle)" }}
            aria-hidden="true"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
          </div>
          <div className="text-center">
            <p className="text-body text-text-secondary font-medium">
              {hasFilters ? "No suppliers match your search" : "No suppliers yet"}
            </p>
            <p className="text-body-sm text-text-muted mt-1">
              {hasFilters
                ? "Try adjusting your search criteria."
                : "Add your first supplier to get started."}
            </p>
          </div>
          {hasFilters && (
            <Button variant="outline" size="sm" onClick={onClear}
              style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}
            >
              Clear filters
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({
  page,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
}: {
  page:         number;
  totalPages:   number;
  totalCount:   number;
  pageSize:     number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  const from = ((page - 1) * pageSize) + 1;
  const to   = Math.min(page * pageSize, totalCount);

  return (
    <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
      <p className="text-caption text-text-muted">
        Showing <span className="text-text-secondary font-medium">{from}–{to}</span> of <span className="text-text-secondary font-medium">{totalCount.toLocaleString()}</span> suppliers
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="h-8 w-8 p-0 text-text-tertiary disabled:opacity-30"
          aria-label="Previous page"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </Button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => onPageChange(i + 1)}
            className={cn(
              "h-8 w-8 rounded-lg text-caption transition-colors",
              i + 1 === page
                ? "text-primary-400 font-semibold"
                : "text-text-tertiary hover:text-text-secondary hover:bg-white/5"
            )}
            style={i + 1 === page ? { background: "rgba(59,130,246,0.12)" } : {}}
            aria-current={i + 1 === page ? "page" : undefined}
          >
            {i + 1}
          </button>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="h-8 w-8 p-0 text-text-tertiary disabled:opacity-30"
          aria-label="Next page"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </Button>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface SupplierTableProps {
  suppliers:        Supplier[];
  isLoading:       boolean;
  isFetching?:     boolean;
  totalCount:      number;
  totalPages:      number;
  page:            number;
  pageSize:        number;
  onPageChange:    (p: number) => void;
  hasActiveFilters: boolean;
  onClearFilters:  () => void;
}

export function SupplierTable({
  suppliers,
  isLoading,
  isFetching,
  totalCount,
  totalPages,
  page,
  pageSize,
  onPageChange,
  hasActiveFilters,
  onClearFilters,
}: SupplierTableProps) {
  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null);
  const { mutate: deleteSupplier, isPending: isDeleting } = useDeleteSupplier();

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteSupplier(deleteTarget.id, {
      onSettled: () => setDeleteTarget(null),
    });
  };

  const HEADERS = ["Name", "Email", "Phone", "Address", "Created Date", "Actions"];

  return (
    <>
      <div className="erp-table-wrap relative overflow-hidden">
        {isFetching && !isLoading && (
          <div className="absolute inset-0 pointer-events-none z-10 bg-black/10 transition-opacity" aria-hidden="true" />
        )}

        <div className="overflow-x-auto">
          <table className="erp-table w-full text-left border-collapse" aria-label="Suppliers list">
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid var(--border-subtle)" }}>
                {HEADERS.map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className={cn(
                      "px-5 py-4 text-left text-caption text-text-muted font-semibold uppercase tracking-wider",
                      h === "Email"        && "hidden md:table-cell",
                      h === "Phone"        && "hidden sm:table-cell",
                      h === "Address"      && "hidden lg:table-cell",
                      h === "Created Date" && "hidden xl:table-cell",
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
              {isLoading ? (
                <SkeletonRows count={pageSize} />
              ) : suppliers.length === 0 ? (
                <EmptyState hasFilters={hasActiveFilters} onClear={onClearFilters} />
              ) : (
                suppliers.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-white/2 transition-colors duration-100 group"
                  >
                    {/* Name */}
                    <td className="px-5 py-4">
                      <span className="text-body-sm text-text-primary font-medium group-hover:text-primary-300 transition-colors">
                        {s.name}
                      </span>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-body-sm text-text-secondary">{s.email ?? "—"}</span>
                    </td>

                    {/* Phone */}
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className="text-body-sm text-text-secondary font-mono">{s.phone ?? "—"}</span>
                    </td>

                    {/* Address */}
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-body-sm text-text-tertiary truncate block max-w-xs">{s.address ?? "—"}</span>
                    </td>

                    {/* Created Date */}
                    <td className="px-5 py-4 hidden xl:table-cell">
                      <span className="text-body-sm text-text-tertiary">{formatDate(s.created_at)}</span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <Button
                          id={`supplier-edit-${s.id}`}
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(ROUTES.SUPPLIERS_EDIT(s.id))}
                          className="h-7 px-2.5 text-caption text-text-tertiary hover:text-primary-400 hover:bg-primary-500/10"
                        >
                          Edit
                        </Button>
                        <Button
                          id={`supplier-delete-${s.id}`}
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTarget(s)}
                          className="h-7 px-2.5 text-caption text-text-tertiary hover:text-danger-400 hover:bg-danger-400/10"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && suppliers.length > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Supplier"
        description={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete Supplier"
        variant="danger"
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </>
  );
}
