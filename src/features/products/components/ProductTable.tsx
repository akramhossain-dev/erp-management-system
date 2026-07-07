/**
 * ProductTable — responsive data table for the product list.
 *
 * Columns: Name/SKU, Category, Purchase Price, Selling Price, Stock, Actions
 * Features: loading skeletons, empty state, delete confirmation, action menu
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useDeleteProduct } from "@/features/products/hooks/useProductMutations";
import { formatCurrency } from "@/utils/formatters";

import { ROUTES } from "@/utils/constants";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/entities";

// ─── Stock badge ──────────────────────────────────────────────────────────────

function StockBadge({ qty, minStock }: { qty: number; minStock: number }) {
  if (qty === 0) {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-caption font-medium px-2 py-0.5 rounded-full"
        style={{ background: "rgba(244,63,94,0.12)", color: "var(--danger-400)" }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-danger-500" aria-hidden="true" />
        Out of Stock
      </span>
    );
  }
  if (qty <= minStock) {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-caption font-medium px-2 py-0.5 rounded-full"
        style={{ background: "rgba(245,158,11,0.12)", color: "var(--warning-400)" }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-warning-500 animate-pulse" aria-hidden="true" />
        Low: {qty.toLocaleString()}
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1.5 text-caption font-medium px-2 py-0.5 rounded-full"
      style={{ background: "rgba(16,185,129,0.12)", color: "var(--success-400)" }}
    >
      {qty.toLocaleString()}
    </span>
  );
}

// ─── Skeleton rows ────────────────────────────────────────────────────────────

function SkeletonRows({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i}>
          <td className="px-4 py-3">
            <div className="skeleton h-4 w-36 rounded mb-1.5" />
            <div className="skeleton h-3 w-20 rounded" />
          </td>
          <td className="px-4 py-3 hidden md:table-cell">
            <div className="skeleton h-5 w-20 rounded-full" />
          </td>
          <td className="px-4 py-3 hidden lg:table-cell">
            <div className="skeleton h-4 w-20 rounded" />
          </td>
          <td className="px-4 py-3 hidden lg:table-cell">
            <div className="skeleton h-4 w-20 rounded" />
          </td>
          <td className="px-4 py-3">
            <div className="skeleton h-5 w-24 rounded-full" />
          </td>
          <td className="px-4 py-3">
            <div className="flex gap-2">
              <div className="skeleton h-7 w-16 rounded-lg" />
              <div className="skeleton h-7 w-16 rounded-lg" />
            </div>
          </td>
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
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          </div>
          <div className="text-center">
            <p className="text-body text-text-secondary font-medium">
              {hasFilters ? "No products match your filters" : "No products yet"}
            </p>
            <p className="text-body-sm text-text-muted mt-1">
              {hasFilters
                ? "Try adjusting your search or filter criteria."
                : "Add your first product to get started."}
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

// ─── Row actions ──────────────────────────────────────────────────────────────

function RowActions({
  product,
  onDeleteClick,
}: {
  product:       Product;
  onDeleteClick: (p: Product) => void;
}) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-1.5">
      <Button
        id={`product-edit-${product.id}`}
        variant="ghost"
        size="sm"
        onClick={() => navigate(ROUTES.PRODUCTS_EDIT(product.id))}
        className="h-7 px-2.5 text-caption text-text-tertiary hover:text-primary-400 hover:bg-primary-500/10"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
        Edit
      </Button>
      <Button
        id={`product-delete-${product.id}`}
        variant="ghost"
        size="sm"
        onClick={() => onDeleteClick(product)}
        className="h-7 px-2.5 text-caption text-text-tertiary hover:text-danger-400 hover:bg-danger-400/10"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14H6L5 6"/>
          <path d="M10 11v6M14 11v6"/>
          <path d="M9 6V4h6v2"/>
        </svg>
        Delete
      </Button>
    </div>
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
        Showing <span className="text-text-secondary font-medium">{from}–{to}</span> of <span className="text-text-secondary font-medium">{totalCount.toLocaleString()}</span> products
      </p>
      <div className="flex items-center gap-1">
        <Button
          id="product-table-prev-btn"
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
        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
          const pg = totalPages <= 7 ? i + 1
            : page <= 4 ? i + 1
            : page >= totalPages - 3 ? totalPages - 6 + i
            : page - 3 + i;
          return (
            <button
              key={pg}
              onClick={() => onPageChange(pg)}
              className={cn(
                "h-8 w-8 rounded-lg text-caption transition-colors",
                pg === page
                  ? "text-primary-400 font-semibold"
                  : "text-text-tertiary hover:text-text-secondary hover:bg-white/5"
              )}
              style={pg === page ? { background: "rgba(59,130,246,0.12)" } : {}}
              aria-current={pg === page ? "page" : undefined}
            >
              {pg}
            </button>
          );
        })}
        <Button
          id="product-table-next-btn"
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

// ─── Main Table ───────────────────────────────────────────────────────────────

interface ProductTableProps {
  products:        Product[];
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

export function ProductTable({
  products,
  isLoading,
  isFetching,
  totalCount,
  totalPages,
  page,
  pageSize,
  onPageChange,
  hasActiveFilters,
  onClearFilters,
}: ProductTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteProduct(deleteTarget.id, {
      onSettled: () => setDeleteTarget(null),
    });
  };

  const HEADERS = ["Product", "Category", "Purchase Price", "Selling Price", "Stock", "Actions"];

  return (
    <>
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{ border: "1px solid var(--border-subtle)" }}
      >
        {/* Fetching overlay — subtle opacity change */}
        {isFetching && !isLoading && (
          <div className="absolute inset-0 pointer-events-none z-10 bg-black/10 transition-opacity" aria-hidden="true" />
        )}

        <div className="overflow-x-auto">
          <table className="w-full" aria-label="Products list">
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid var(--border-subtle)" }}>
                {HEADERS.map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className={cn(
                      "px-4 py-3 text-left text-caption text-text-muted font-semibold uppercase tracking-wider",
                      h === "Category"       && "hidden md:table-cell",
                      h === "Purchase Price" && "hidden lg:table-cell",
                      h === "Selling Price"  && "hidden lg:table-cell",
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
              ) : products.length === 0 ? (
                <EmptyState hasFilters={hasActiveFilters} onClear={onClearFilters} />
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-white/2 transition-colors duration-100 group"
                  >
                    {/* Name + SKU */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-body-sm text-text-primary font-medium group-hover:text-primary-300 transition-colors">
                          {product.name}
                        </span>
                        <span className="text-caption text-text-muted font-mono">{product.sku}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      {product.category ? (
                        <Badge
                          variant="outline"
                          className="text-caption font-normal"
                          style={{ borderColor: "var(--border-default)", color: "var(--text-tertiary)" }}
                        >
                          {product.category}
                        </Badge>
                      ) : (
                        <span className="text-caption text-text-muted">—</span>
                      )}
                    </td>

                    {/* Purchase Price */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-body-sm text-text-secondary font-mono">
                        {formatCurrency(Number(product.purchase_price))}
                      </span>
                    </td>

                    {/* Selling Price */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-body-sm text-text-primary font-mono font-medium">
                        {formatCurrency(Number(product.selling_price))}
                      </span>
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-3">
                      <StockBadge
                        qty={Number(product.stock_quantity)}
                        minStock={Number(product.min_stock)}
                      />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <RowActions
                        product={product}
                        onDeleteClick={setDeleteTarget}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && products.length > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        )}
      </div>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Product"
        description={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}" (${deleteTarget.sku})? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete Product"
        variant="danger"
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </>
  );
}
