/**
 * Navbar — top header bar for the ERP dashboard.
 *
 * Features:
 * - Page title (derived from current route)
 * - Mobile hamburger menu toggle
 * - Notification bell (UI only — Phase 4)
 * - User avatar + dropdown (logout)
 * - Glass morphism background
 */
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthContext";
import { useAuth } from "@/features/auth";
import { MenuIcon, BellIcon, LogOutIcon } from "@/components/common/NavIcons";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/utils/constants";

// ─── Route → Page Title map ───────────────────────────────────────────────────

const ROUTE_TITLES: Record<string, string> = {
  [ROUTES.DASHBOARD]: "Dashboard",
  [ROUTES.PRODUCTS]:  "Products",
  [ROUTES.CUSTOMERS]: "Customers",
  [ROUTES.SUPPLIERS]: "Suppliers",
  [ROUTES.PURCHASES]: "Purchases",
  [ROUTES.SALES]:     "Sales",
  [ROUTES.REPORTS]:   "Reports",
};

function getPageTitle(pathname: string): string {
  // Exact match first
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname];
  // Prefix match for sub-routes
  const match = Object.entries(ROUTE_TITLES).find(([route]) =>
    route !== ROUTES.DASHBOARD && pathname.startsWith(route)
  );
  return match ? match[1] : "ERP System";
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-caption font-bold text-white flex-shrink-0"
      style={{ background: "linear-gradient(135deg, #3B82F6, #7C3AED)" }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

interface NavbarProps {
  onMobileMenuToggle: () => void;
  height?: number;
}

export function Navbar({ onMobileMenuToggle, height = 64 }: NavbarProps) {
  const location          = useLocation();
  const { user }          = useAuthContext();
  const { logout, isMutating } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const pageTitle  = getPageTitle(location.pathname);
  const userName   = user?.user_metadata?.full_name ?? user?.email ?? "User";
  const userEmail  = user?.email ?? "";
  const displayName = userName.length > 20 ? userName.split(" ")[0] : userName;

  const handleLogout = async () => {
    setUserMenuOpen(false);
    try {
      await logout();
    } catch {
      toast.error("Failed to sign out. Please try again.");
    }
  };

  return (
    <header
      id="top-navbar"
      className="sticky top-0 z-40 flex items-center gap-4 px-6 flex-shrink-0"
      style={{
        height,
        background:     "rgba(8, 12, 20, 0.85)",
        backdropFilter: "blur(16px) saturate(180%)",
        borderBottom:   "1px solid var(--border-subtle)",
      }}
    >
      {/* ── Left: Mobile menu + Page title ─────────────────────────────── */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Mobile hamburger — only shown on small screens */}
        <button
          id="mobile-menu-btn"
          onClick={onMobileMenuToggle}
          className={cn(
            "lg:hidden p-2 rounded-xl text-text-tertiary hover:text-text-primary",
            "hover:bg-white/5 transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
          )}
          aria-label="Open navigation menu"
        >
          <MenuIcon size={20} />
        </button>

        {/* Page title */}
        <div className="min-w-0">
          <h1 className="text-h4 text-text-primary font-semibold truncate">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* ── Right: Notifications + User menu ──────────────────────────── */}
      <div className="flex items-center gap-2 flex-shrink-0">

        {/* Notification bell (UI only) */}
        <button
          id="notifications-btn"
          className={cn(
            "relative p-2 rounded-xl text-text-tertiary hover:text-text-primary",
            "hover:bg-white/5 transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
          )}
          aria-label="Notifications"
        >
          <BellIcon size={18} />
          {/* Dot indicator */}
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-500 ring-2"
            style={{ borderColor: "var(--bg-base)" }}
            aria-hidden="true"
          />
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-white/10 mx-1" aria-hidden="true" />

        {/* User menu */}
        <div className="relative">
          <button
            id="user-menu-btn"
            onClick={() => setUserMenuOpen((prev) => !prev)}
            className={cn(
              "flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl",
              "hover:bg-white/5 transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
              userMenuOpen && "bg-white/5",
            )}
            aria-label="User menu"
            aria-expanded={userMenuOpen}
            aria-haspopup="menu"
          >
            <UserAvatar name={userName} />
            <div className="hidden sm:flex flex-col items-start min-w-0">
              <span className="text-body-sm text-text-primary font-medium truncate max-w-[120px]">
                {displayName}
              </span>
              <span className="text-caption text-text-muted truncate max-w-[120px]">
                {userEmail}
              </span>
            </div>
            {/* Chevron */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn("text-text-muted transition-transform duration-200 hidden sm:block", userMenuOpen && "rotate-180")}
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {/* Dropdown menu */}
          {userMenuOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setUserMenuOpen(false)}
                aria-hidden="true"
              />
              <div
                role="menu"
                aria-label="User options"
                className="absolute right-0 top-full mt-2 w-56 z-50 rounded-xl overflow-hidden"
                style={{
                  background:    "var(--bg-surface-300)",
                  border:        "1px solid var(--border-default)",
                  boxShadow:     "var(--shadow-xl)",
                }}
              >
                {/* User info header */}
                <div
                  className="px-4 py-3"
                  style={{ borderBottom: "1px solid var(--border-subtle)" }}
                >
                  <p className="text-body-sm text-text-primary font-medium truncate">{userName}</p>
                  <p className="text-caption text-text-muted truncate">{userEmail}</p>
                </div>

                {/* Sign out */}
                <div className="p-1">
                  <button
                    id="navbar-logout-btn"
                    role="menuitem"
                    onClick={handleLogout}
                    disabled={isMutating}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg",
                      "text-body-sm text-danger-400 hover:text-danger-300",
                      "hover:bg-danger-400/10 transition-colors duration-150",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-400",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                    )}
                  >
                    {isMutating ? (
                      <span className="w-4 h-4 border-2 border-current/40 border-t-current rounded-full animate-spin" aria-hidden="true" />
                    ) : (
                      <LogOutIcon size={16} />
                    )}
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
