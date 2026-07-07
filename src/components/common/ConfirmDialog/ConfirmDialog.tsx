/**
 * ConfirmDialog — accessible modal confirmation dialog.
 *
 * Used before destructive actions (delete, cancel, etc.)
 * Built on Shadcn Dialog primitives with custom ERP glass styling.
 */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open:           boolean;
  onOpenChange:   (open: boolean) => void;
  title:          string;
  description:    string;
  confirmLabel?:  string;
  cancelLabel?:   string;
  variant?:       "danger" | "warning" | "default";
  onConfirm:      () => void;
  isLoading?:     boolean;
}

const VARIANT_COLORS = {
  danger:  { icon: "#fb7185", bg: "rgba(244,63,94,0.12)", border: "rgba(244,63,94,0.2)" },
  warning: { icon: "#fbbf24", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.2)" },
  default: { icon: "#60a5fa", bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.2)" },
};

function VariantIcon({ variant }: { variant: NonNullable<ConfirmDialogProps["variant"]> }) {
  const c = VARIANT_COLORS[variant];
  return (
    <div
      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 mx-auto mb-4"
      style={{ background: c.bg, border: `1px solid ${c.border}` }}
      aria-hidden="true"
    >
      {variant === "danger" || variant === "warning" ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c.icon} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c.icon} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      )}
    </div>
  );
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel  = "Cancel",
  variant      = "danger",
  onConfirm,
  isLoading    = false,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        style={{
          background:    "var(--bg-surface-300)",
          border:        "1px solid var(--border-default)",
          boxShadow:     "var(--shadow-xl)",
        }}
      >
        <DialogHeader className="items-center text-center">
          <VariantIcon variant={variant} />
          <DialogTitle className="text-h4 text-text-primary">
            {title}
          </DialogTitle>
          <DialogDescription className="text-body-sm text-text-secondary mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-row justify-center gap-3 mt-2 sm:justify-center">
          <Button
            id="confirm-dialog-cancel-btn"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1 sm:flex-none sm:min-w-[120px]"
            style={{
              borderColor: "var(--border-default)",
              color:       "var(--text-secondary)",
              background:  "transparent",
            }}
          >
            {cancelLabel}
          </Button>
          <Button
            id="confirm-dialog-confirm-btn"
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 sm:flex-none sm:min-w-[120px]"
            style={{
              background: variant === "danger"
                ? "rgba(244,63,94,0.85)"
                : variant === "warning"
                  ? "rgba(245,158,11,0.85)"
                  : "var(--primary-600)",
              color: "white",
              border: "none",
            }}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" aria-hidden="true" />
                Deleting…
              </span>
            ) : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
