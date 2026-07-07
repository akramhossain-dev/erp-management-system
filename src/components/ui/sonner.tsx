/**
 * Sonner Toaster — customized for the Modern Glass ERP dark theme.
 * Removes the next-themes dependency that Shadcn adds by default.
 */
import { Toaster as SonnerToaster } from "sonner";

type ToasterProps = React.ComponentProps<typeof SonnerToaster>;

export function Toaster(props: ToasterProps) {
  return (
    <SonnerToaster
      theme="dark"
      className="toaster"
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        style: {
          background: "var(--bg-surface-200)",
          border:     "1px solid var(--border-default)",
          color:      "var(--text-primary)",
          fontFamily: "var(--font-ui)",
        },
        classNames: {
          toast:         "!shadow-lg",
          title:         "!text-text-primary !font-medium",
          description:   "!text-text-secondary !text-sm",
          actionButton:  "!bg-primary-500 !text-white",
          cancelButton:  "!bg-bg-surface-400 !text-text-secondary",
          closeButton:   "!bg-bg-surface-400 !text-text-tertiary hover:!text-text-primary",
        },
      }}
      {...props}
    />
  );
}
