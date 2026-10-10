"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  BookOpen,
  BrainCircuit,
  BriefcaseBusiness,
  ChartNoAxesColumnIncreasing,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Code2,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Sparkles,
  Timer,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { PublicUser } from "@/lib/auth";
import { clearAllResidualAndGuestData, setActiveUserScope } from "@/lib/user-progress-storage";
import { ThemeToggle } from "./theme-toggle";

const nav = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Courses", href: "/courses", icon: BookOpen },
  { label: "Coding practice", href: "/coding-practice", icon: Code2 },
  { label: "Assessments", href: "/assessments", icon: ClipboardCheck },
  { label: "Mock tests", href: "/mock-tests", icon: Timer },
  { label: "My progress", href: "/progress", icon: ChartNoAxesColumnIncreasing },
  { label: "Interview coach", href: "/interview-coach", icon: BrainCircuit },
];

const workspace = [
  { label: "Placement office", href: "/placement", icon: BriefcaseBusiness },
  { label: "Resume builder", href: "/resume-builder", icon: FileText },
];

export function AppShell({
  children,
  initialUser = null,
}: {
  children: ReactNode;
  initialUser?: PublicUser | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<PublicUser | null>(initialUser);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [signOutPending, setSignOutPending] = useState(false);
  const [signOutError, setSignOutError] = useState("");

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const notificationMenuRef = useRef<HTMLDivElement>(null);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);

  const title =
    [...nav, ...workspace].find((item) => item.href === pathname)?.label ??
    "PlacePrep AI";

  useEffect(() => {
    fetch("/api/auth/me")
      .then((response) => response.json())
      .then((result: { user: PublicUser | null }) => setUser(result.user))
      .catch(() => setUser(null));
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileDrawerOpen(false);
    setProfileOpen(false);
    setNotificationsOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileDrawerOpen]);

  useEffect(() => {
    if (!profileOpen && !notificationsOpen) return;
    function closeOnPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (
        profileOpen &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(target)
      ) {
        setProfileOpen(false);
      }
      if (
        notificationsOpen &&
        notificationMenuRef.current &&
        !notificationMenuRef.current.contains(target)
      ) {
        setNotificationsOpen(false);
      }
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setNotificationsOpen(false);
        setMobileDrawerOpen(false);
        if (profileOpen) profileButtonRef.current?.focus();
        else notificationButtonRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", closeOnPointerDown);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnPointerDown);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [profileOpen, notificationsOpen]);

  async function signOut() {
    setSignOutError("");
    setSignOutPending(true);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) {
        setSignOutError(`Sign out failed (HTTP ${response.status}). Please try again.`);
        return;
      }
      setActiveUserScope(null);
      clearAllResidualAndGuestData();
      setProfileOpen(false);
      setMobileDrawerOpen(false);
      setUser(null);
      router.push("/");
      router.refresh();
    } catch {
      setSignOutError("Could not connect to the server. Please try signing out again.");
    } finally {
      setSignOutPending(false);
    }
  }

  const initials =
    user?.name
      .split(/\s+/)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "?";

  return (
    <div className="shell">
      {/* Desktop & Tablet Sidebar */}
      <aside className="sidebar" aria-label="Main navigation">
        <Link href="/dashboard" className="brand">
          <span className="brand-mark">
            <Sparkles size={19} />
          </span>
          <span>
            PlacePrep AI
            <small>YOUR CAREER, IN FOCUS</small>
          </span>
        </Link>
        <div className="nav-label">Learning</div>
        <nav className="nav-list">
          {nav.map(({ label, href, icon: Icon }) => (
            <Link
              className={`nav-link ${pathname === href ? "active" : ""}`}
              href={href}
              key={href}
            >
              <Icon className="nav-icon" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="nav-label" style={{ marginTop: 25 }}>
          Workspaces
        </div>
        <nav className="nav-list">
          {workspace.map(({ label, href, icon: Icon }) => (
            <Link
              className={`nav-link ${pathname === href ? "active" : ""}`}
              href={href}
              key={href}
            >
              <Icon className="nav-icon" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <strong>Make your next move</strong>
            <p>Small steps today can open big doors tomorrow.</p>
            <Link href="/courses">
              Explore learning{" "}
              <ChevronRight size={12} style={{ verticalAlign: "middle" }} />
            </Link>
          </div>
          <div className="user-mini">
            <span className="avatar">{initials}</span>
            <span className="user-details">
              <strong>{user?.name ?? "Guest account"}</strong>
              <small>{user?.email ?? "Demo workspace"}</small>
            </span>
            {user ? (
              <button
                className="signout-button"
                type="button"
                onClick={signOut}
                disabled={signOutPending}
              >
                {signOutPending ? "Signing out…" : "Sign out"}
              </button>
            ) : (
              <Link className="signout-button" href="/login">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileDrawerOpen && (
        <div
          className="mobile-drawer-backdrop animate-fade-in"
          onClick={() => setMobileDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer Slide-Out Menu */}
      <aside
        className={`mobile-drawer ${mobileDrawerOpen ? "open" : ""}`}
        aria-label="Mobile Drawer Navigation"
        aria-hidden={!mobileDrawerOpen}
      >
        <div className="mobile-drawer-header">
          <Link
            href="/dashboard"
            className="brand"
            onClick={() => setMobileDrawerOpen(false)}
          >
            <span className="brand-mark">
              <Sparkles size={18} />
            </span>
            <span>
              PlacePrep AI
              <small>YOUR CAREER, IN FOCUS</small>
            </span>
          </Link>
          <button
            type="button"
            className="mobile-drawer-close"
            onClick={() => setMobileDrawerOpen(false)}
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mobile-drawer-body">
          <div className="nav-label">Learning</div>
          <nav className="nav-list">
            {nav.map(({ label, href, icon: Icon }) => (
              <Link
                className={`nav-link ${pathname === href ? "active" : ""}`}
                href={href}
                key={href}
                onClick={() => setMobileDrawerOpen(false)}
              >
                <Icon className="nav-icon" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="nav-label" style={{ marginTop: 20 }}>
            Workspaces
          </div>
          <nav className="nav-list">
            {workspace.map(({ label, href, icon: Icon }) => (
              <Link
                className={`nav-link ${pathname === href ? "active" : ""}`}
                href={href}
                key={href}
                onClick={() => setMobileDrawerOpen(false)}
              >
                <Icon className="nav-icon" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="help-card" style={{ marginTop: 20 }}>
            <strong>Make your next move</strong>
            <p>Small steps today can open big doors tomorrow.</p>
            <Link href="/courses" onClick={() => setMobileDrawerOpen(false)}>
              Explore learning{" "}
              <ChevronRight size={12} style={{ verticalAlign: "middle" }} />
            </Link>
          </div>
        </div>

        <div className="mobile-drawer-footer">
          <div className="user-mini">
            <span className="avatar">{initials}</span>
            <span className="user-details">
              <strong>{user?.name ?? "Guest account"}</strong>
              <small>{user?.email ?? "Demo workspace"}</small>
            </span>
            {user ? (
              <button
                className="signout-button"
                type="button"
                onClick={signOut}
                disabled={signOutPending}
              >
                {signOutPending ? "Signing out…" : "Sign out"}
              </button>
            ) : (
              <Link
                className="signout-button"
                href="/login"
                onClick={() => setMobileDrawerOpen(false)}
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main">
        <header className="topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="mobile-menu-trigger"
              onClick={() => setMobileDrawerOpen((prev) => !prev)}
              aria-label="Open navigation menu"
              aria-expanded={mobileDrawerOpen}
            >
              <Menu size={20} />
            </button>
            <div className="crumb">
              <span className="crumb-desktop"><b>Workspace</b><ChevronRight size={13} style={{ margin: "0 5px" }} /></span>
              <span className="crumb-title">{title}</span>
            </div>
          </div>

          <div className="top-right">
            <ThemeToggle compact />
            <div className="notification-menu-wrap" ref={notificationMenuRef}>
              <button
                ref={notificationButtonRef}
                className="icon-button"
                type="button"
                aria-label="Open notifications"
                aria-expanded={notificationsOpen}
                aria-controls="notifications-panel"
                onClick={() => {
                  setProfileOpen(false);
                  setNotificationsOpen((open) => !open);
                }}
              >
                <Bell size={17} />
              </button>
              {notificationsOpen && (
                <section
                  className="notification-popover"
                  id="notifications-panel"
                  aria-label="Notifications"
                >
                  <div className="eyebrow">NOTIFICATIONS</div>
                  <p>You’re all caught up. New updates will appear here.</p>
                </section>
              )}
            </div>

            <div className="profile-menu-wrap" ref={profileMenuRef}>
              <button
                ref={profileButtonRef}
                className="top-user profile-trigger"
                type="button"
                aria-label={
                  user ? `Open ${user.name} profile` : "Open guest profile"
                }
                aria-expanded={profileOpen}
                aria-controls="account-profile"
                onClick={() => {
                  setNotificationsOpen(false);
                  setProfileOpen((open) => !open);
                }}
              >
                {initials}
              </button>
              {profileOpen && (
                <section
                  className="profile-popover"
                  id="account-profile"
                  aria-label="Account profile"
                >
                  <div className="eyebrow">ACCOUNT PROFILE</div>
                  <div className="profile-card-head">
                    <span className="profile-avatar-large">{initials}</span>
                    <span className="profile-identity">
                      <strong>{user?.name ?? "Guest account"}</strong>
                      <small>{user?.email ?? "Not signed in"}</small>
                    </span>
                  </div>
                  {user ? (
                    <button
                      className="profile-action"
                      type="button"
                      onClick={signOut}
                      disabled={signOutPending}
                    >
                      <LogOut size={15} />
                      {signOutPending ? "Signing out…" : "Sign out"}
                    </button>
                  ) : (
                    <Link
                      className="profile-action"
                      href="/login"
                      onClick={() => setProfileOpen(false)}
                    >
                      Sign in
                    </Link>
                  )}
                </section>
              )}
            </div>
          </div>
        </header>

        {signOutError && (
          <p className="shell-alert" role="alert">
            {signOutError}
          </p>
        )}

        {/* Scrollable Sub-Navigation Bar for Mobile */}
        <nav className="mobile-nav" aria-label="Quick navigation">
          {nav.map(({ label, href }) => (
            <Link
              className={pathname === href ? "selected" : ""}
              href={href}
              key={href}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Page Content */}
        <div className="page-content-wrapper animate-fade-in">{children}</div>

        {/* Mobile Bottom Fixed Tab Bar */}
        <nav className="mobile-bottom-bar" aria-label="Mobile bottom navigation">
          {nav.slice(0, 5).map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`bottom-tab-item ${active ? "active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={19} className="bottom-tab-icon" />
                <span className="bottom-tab-label">{label}</span>
              </Link>
            );
          })}
        </nav>
      </main>
    </div>
  );
}

export function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="welcome">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  );
}

export function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="content soon-page">
      <section className="card soon-panel">
        <div className="stat-icon">
          <CircleHelp size={22} />
        </div>
        <div className="eyebrow" style={{ marginTop: 19 }}>
          Stage 1 preview
        </div>
        <h1>{title}</h1>
        <p>{description}</p>
        <p>
          This workspace is a clearly marked placeholder. Its workflows will be
          added in a later stage.
        </p>
        <Link className="text-link" href="/dashboard">
          Return to your dashboard <ChevronRight size={14} />
        </Link>
      </section>
    </div>
  );
}
