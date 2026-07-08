/**
 * Navbar — sticky top header bar for the ERP dashboard.
 *
 * Features:
 * - Page title + breadcrumb subtitle (derived from current route)
 * - Mobile hamburger menu toggle
 * - Notification bell (UI only)
 * - User avatar + dropdown (logout)
 * - Glass morphism background
 */
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthContext";
import { useAuth } from "@/features/auth";
import { MenuIcon, BellIcon, LogOutIcon } from "@/components/common/NavIcons";
import { ROUTES } from "@/utils/constants";

// ─── Route → Page meta ────────────────────────────────────────────────────────

const ROUTE_META: Record<string, { title: string; subtitle: string }> = {
  [ROUTES.DASHBOARD]: { title: "Dashboard",  subtitle: "Overview & analytics"    },
  [ROUTES.PRODUCTS]:  { title: "Products",   subtitle: "Inventory management"    },
  [ROUTES.CUSTOMERS]: { title: "Customers",  subtitle: "Customer relationship"   },
  [ROUTES.SUPPLIERS]: { title: "Suppliers",  subtitle: "Supplier management"     },
  [ROUTES.PURCHASES]: { title: "Purchases",  subtitle: "Purchase orders"         },
  [ROUTES.SALES]:     { title: "Sales",      subtitle: "Sales & invoices"        },
  [ROUTES.REPORTS]:   { title: "Reports",    subtitle: "Analytics & export"      },
};

function getPageMeta(pathname: string): { title: string; subtitle: string } {
  if (ROUTE_META[pathname]) return ROUTE_META[pathname];
  const match = Object.entries(ROUTE_META).find(([route]) =>
    route !== ROUTES.DASHBOARD && pathname.startsWith(route)
  );
  return match ? match[1] : { title: "ERP System", subtitle: "Management Suite" };
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function UserAvatar({ name, size = 34 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      style={{
        width: size,
        height: size,
        minWidth: size,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: 700,
        color: "white",
        flexShrink: 0,
        userSelect: "none",
        background: "linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%)",
        boxShadow: "0 0 10px rgba(59,130,246,0.3)",
      }}
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
  const location               = useLocation();
  const { user }               = useAuthContext();
  const { logout, isMutating } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { title: pageTitle, subtitle: pageSubtitle } = getPageMeta(location.pathname);
  const userName    = user?.user_metadata?.full_name ?? user?.email ?? "User";
  const userEmail   = user?.email ?? "";
  const displayName = userName.length > 22 ? userName.split(" ")[0] : userName;

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
      style={{
        position: "sticky",
        top: 0,
        zIndex: 35,
        height,
        minHeight: height,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 16px",
        flexShrink: 0,
        background: "rgba(11, 15, 25, 0.88)",
        backdropFilter: "blur(20px) saturate(160%)",
        WebkitBackdropFilter: "blur(20px) saturate(160%)",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      {/* ── Left: hamburger + page title ──────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>

        {/* Mobile hamburger — hidden on lg+ */}
        <button
          id="mobile-menu-btn"
          onClick={onMobileMenuToggle}
          aria-label="Open navigation menu"
          className="flex items-center justify-center lg:hidden"
          style={{
            width: 36,
            height: 36,
            minWidth: 36,
            borderRadius: 9,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "var(--text-tertiary)",
            transition: "background 150ms, color 150ms",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "var(--glass-bg-hover)";
            (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "var(--text-tertiary)";
          }}
        >
          <MenuIcon size={20} />
        </button>

        {/* Page title + subtitle */}
        <div style={{ minWidth: 0, flex: 1 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 600,
              color: "var(--text-primary)",
              lineHeight: "1.25",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {pageTitle}
          </h1>
          <p
            className="hidden sm:block"
            style={{
              margin: 0,
              fontSize: 11.5,
              color: "var(--text-muted)",
              lineHeight: "1.3",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {pageSubtitle}
          </p>
        </div>
      </div>

      {/* ── Right: notifications + user menu ──────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>

        {/* Notification bell */}
        <button
          id="notifications-btn"
          aria-label="Notifications"
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            borderRadius: 9,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "var(--text-tertiary)",
            transition: "background 150ms, color 150ms",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "var(--glass-bg-hover)";
            (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "var(--text-tertiary)";
          }}
        >
          <BellIcon size={18} />
          {/* Notification dot */}
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "var(--primary-500)",
              boxShadow: "0 0 5px rgba(59,130,246,0.8)",
            }}
          />
        </button>

        {/* Divider */}
        <div aria-hidden="true" style={{ width: 1, height: 20, background: "var(--border-default)", margin: "0 6px" }} />

        {/* User menu button */}
        <div style={{ position: "relative" }}>
          <button
            id="user-menu-btn"
            onClick={() => setUserMenuOpen((prev) => !prev)}
            aria-label="User menu"
            aria-expanded={userMenuOpen}
            aria-haspopup="menu"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "5px 10px 5px 6px",
              borderRadius: 10,
              border: "none",
              background: userMenuOpen ? "rgba(255,255,255,0.06)" : "transparent",
              cursor: "pointer",
              transition: "background 150ms",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
            }}
            onMouseLeave={(e) => {
              if (!userMenuOpen) (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            <UserAvatar name={userName} size={32} />

            {/* Name + email — hidden on mobile */}
            <div
              className="hidden sm:flex"
              style={{ flexDirection: "column", alignItems: "flex-start", minWidth: 0 }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  whiteSpace: "nowrap",
                  maxWidth: 130,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  lineHeight: "1.25",
                }}
              >
                {displayName}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  whiteSpace: "nowrap",
                  maxWidth: 130,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  lineHeight: "1.25",
                }}
              >
                {userEmail}
              </span>
            </div>

            {/* Chevron */}
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="hidden sm:block"
              style={{
                color: "var(--text-muted)",
                transform: userMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 200ms",
                flexShrink: 0,
              }}
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {/* Dropdown */}
          {userMenuOpen && (
            <>
              {/* Backdrop */}
              <div
                style={{ position: "fixed", inset: 0, zIndex: 40 }}
                onClick={() => setUserMenuOpen(false)}
                aria-hidden="true"
              />

              <div
                role="menu"
                aria-label="User options"
                className="animate-scale-in"
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 8px)",
                  width: 230,
                  zIndex: 50,
                  borderRadius: 12,
                  overflow: "hidden",
                  background: "var(--bg-surface-100)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid var(--border-default)",
                  boxShadow: "var(--shadow-xl), 0 0 0 1px rgba(59,130,246,0.05)",
                }}
              >
                {/* User info */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "14px 16px",
                    borderBottom: "1px solid var(--border-subtle)",
                  }}
                >
                  <UserAvatar name={userName} size={34} />
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: 150,
                      }}
                    >
                      {userName}
                    </p>
                    <p
                      style={{
                        margin: "2px 0 0",
                        fontSize: 11,
                        color: "var(--text-muted)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: 150,
                      }}
                    >
                      {userEmail}
                    </p>
                  </div>
                </div>

                {/* Sign out button */}
                <div style={{ padding: "6px" }}>
                  <button
                    id="navbar-logout-btn"
                    role="menuitem"
                    onClick={handleLogout}
                    disabled={isMutating}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "9px 12px",
                      borderRadius: 8,
                      border: "none",
                      background: "transparent",
                      cursor: isMutating ? "not-allowed" : "pointer",
                      color: "var(--danger-400)",
                      fontSize: 13,
                      fontWeight: 500,
                      transition: "background 150ms, color 150ms",
                      opacity: isMutating ? 0.5 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!isMutating) (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                    }}
                  >
                    {isMutating ? (
                      <span
                        aria-hidden="true"
                        style={{
                          width: 15,
                          height: 15,
                          borderRadius: "50%",
                          border: "2px solid rgba(239,68,68,0.3)",
                          borderTopColor: "#ef4444",
                          animation: "spin 0.7s linear infinite",
                          display: "inline-block",
                        }}
                      />
                    ) : (
                      <LogOutIcon size={15} />
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
