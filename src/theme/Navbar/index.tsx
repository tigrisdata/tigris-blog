import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import Link from "@docusaurus/Link";
import { useLocation } from "@docusaurus/router";
import useBaseUrl from "@docusaurus/useBaseUrl";
import clsx from "clsx";
import tigrisConfig from "@site/tigris.config";
import styles from "./styles.module.css";

/**
 * Site navigation, ported from the marketing site (tigrisdata/website,
 * src/components/Navbar.tsx) so the top bar is the same on the homepage, the
 * blog and the docs. Keep NAV, the markup and styles.module.css in sync with
 * that file and with tigris-os-docs/src/theme/Navbar.
 *
 * Three of the top-level items open a panel (Product, Developers, Company):
 * a featured card on the left, a short stacked list on the right, each entry
 * a title and one line. Pricing is a plain link. The panels open on hover
 * with a short grace period so the pointer can cross the gap, and on
 * click/Enter for touch and keyboard; Escape and clicking outside close them.
 * Below 800px the same groups render as sections of the mobile sheet.
 *
 * Hrefs in NAV are the website's own. `resolveHref` turns the ones that live
 * on this site (under SITE_BASE) into client-side links and makes the rest
 * absolute, so active-state matching works exactly like on the website.
 */

const WEBSITE = tigrisConfig.websiteUrl; // https://www.tigrisdata.com
const SITE_BASE = "/blog"; // where this Docusaurus site is mounted on WEBSITE

type MenuLink = {
  label: string;
  href: string;
  desc: string;
  external?: boolean;
};
type MenuGroup = {
  label: string;
  featured: MenuLink & { art: ReactNode };
  links: MenuLink[];
};
type NavItem =
  | { kind: "group"; group: MenuGroup }
  | { kind: "link"; label: string; href: string };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/* small line drawings for the featured cards; decorative, so aria-hidden */
const ArtBuckets = (
  <svg viewBox="0 0 200 120" aria-hidden className={styles.art} {...stroke}>
    <g opacity="0.9">
      <path d="M40 44l30-14 30 14-30 14z" />
      <path d="M40 44v30l30 14 30-14V44M70 58v30" />
    </g>
    <g opacity="0.55">
      <path d="M110 30l24-11 24 11-24 11z" />
      <path d="M110 30v24l24 11 24-11V30M134 41v24" />
    </g>
    <g opacity="0.35">
      <path d="M118 74l20-9 20 9-20 9z" />
      <path d="M118 74v20l20 9 20-9V74M138 83v20" />
    </g>
    <path d="M12 108h176" strokeDasharray="3 4" opacity="0.4" />
  </svg>
);

const ArtDocs = (
  <svg viewBox="0 0 200 120" aria-hidden className={styles.art} {...stroke}>
    <rect x="30" y="18" width="140" height="84" rx="3" opacity="0.7" />
    <path d="M30 34h140" opacity="0.7" />
    <circle cx="40" cy="26" r="2" fill="currentColor" opacity="0.7" />
    <circle cx="48" cy="26" r="2" fill="currentColor" opacity="0.45" />
    <circle cx="56" cy="26" r="2" fill="currentColor" opacity="0.3" />
    <path
      d="M44 50h20M72 50h56M44 62h36M88 62h30M44 74h14M66 74h50M44 86h60"
      opacity="0.5"
    />
    <path d="M46 50h16" strokeWidth="2" />
  </svg>
);

const ArtCompany = (
  <svg viewBox="0 0 200 120" aria-hidden className={styles.art} {...stroke}>
    <circle cx="100" cy="60" r="40" opacity="0.6" />
    <path
      d="M60 60h80M100 20c14 12 20 26 20 40s-6 28-20 40c-14-12-20-26-20-40s6-28 20-40Z"
      opacity="0.6"
    />
    <circle cx="100" cy="60" r="3" fill="currentColor" />
    <circle cx="78" cy="38" r="2.5" fill="currentColor" opacity="0.6" />
    <circle cx="126" cy="78" r="2.5" fill="currentColor" opacity="0.6" />
    <circle cx="120" cy="36" r="2.5" fill="currentColor" opacity="0.4" />
  </svg>
);

const NAV: NavItem[] = [
  {
    kind: "group",
    group: {
      label: "Product",
      featured: {
        label: "Object storage",
        href: "/features/",
        desc: "Bottomless, global by default, zero egress. Everything S3 has and everything it doesn’t.",
        art: ArtBuckets,
      },
      links: [
        {
          label: "Tigris Acceleration Gateway",
          href: "/accelerate/",
          desc: "A local NVMe cache that speaks S3",
        },
        {
          label: "Partner integrations API",
          href: "/partners/",
          desc: "Offer storage as part of your platform",
        },
        {
          label: "Zero-downtime migration",
          href: "https://www.tigrisdata.com/docs/migration/",
          desc: "Move buckets in place, keep both in sync",
        },
      ],
    },
  },
  {
    kind: "group",
    group: {
      label: "Developers",
      featured: {
        label: "Documentation",
        href: "/docs/",
        desc: "Quickstarts, the S3 API, SDKs and guides for every workload.",
        art: ArtDocs,
      },
      links: [
        {
          label: "Connect your agent",
          href: "/agents/",
          desc: "One command: MCP server and skills",
        },
        {
          label: "Blog",
          href: "/blog/",
          desc: "Engineering notes and case studies",
        },
        {
          label: "Changelog",
          href: "https://www.tigrisdata.com/docs/changelog/",
          desc: "What shipped, and when",
        },
        {
          label: "Community",
          href: "https://community.tigrisdata.com/",
          desc: "Ask, answer, and share",
          external: true,
        },
      ],
    },
  },
  {
    kind: "group",
    group: {
      label: "Company",
      featured: {
        label: "About Tigris",
        href: "/about/",
        desc: "Who we are, and why we built a storage cloud for any compute.",
        art: ArtCompany,
      },
      links: [
        {
          label: "Customers",
          href: "/customers/",
          desc: "Who runs on Tigris, in their words",
        },
        {
          label: "Status",
          href: "https://status.tigrisdata.com/",
          desc: "Uptime and incident history",
          external: true,
        },
        {
          label: "Trust center",
          href: "https://trust.tigrisdata.com/",
          desc: "SOC 2, HIPAA and security documentation",
          external: true,
        },
      ],
    },
  },
  { kind: "link", label: "Pricing", href: "/pricing/" },
];

const externalProps = (l: { external?: boolean }) =>
  l.external ? { target: "_blank" as const, rel: "noopener noreferrer" } : {};

/** A website href, resolved for this site: a route here, or an absolute URL. */
function resolveHref(href: string): { to: string } | { href: string } {
  const path = href.startsWith(WEBSITE) ? href.slice(WEBSITE.length) : href;
  if (!path.startsWith("/")) return { href };
  if (path.startsWith(`${SITE_BASE}/`))
    return { to: path.slice(SITE_BASE.length) };
  return { href: `${WEBSITE}${path}` };
}

function NavLink({
  href,
  className,
  children,
  ...rest
}: {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  onMouseEnter?: () => void;
  target?: "_blank";
  rel?: string;
}) {
  const r = resolveHref(href);
  if ("to" in r) {
    return (
      <Link to={r.to} className={className} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={r.href} className={className} {...rest}>
      {children}
    </a>
  );
}

const BRAND_LOGO = `${WEBSITE}/brand/color-light/Logo.svg`;

function LogoContextMenu({
  x,
  y,
  onClose,
}: {
  x: number;
  y: number;
  onClose: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: y, left: x });

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const rect = menu.getBoundingClientRect();
    const clampedX = Math.min(x, window.innerWidth - rect.width - 8);
    const clampedY = Math.min(y, window.innerHeight - rect.height - 8);
    setPos({ top: Math.max(8, clampedY), left: Math.max(8, clampedX) });
  }, [x, y]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        onClose();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label="Logo options"
      className={styles.ctx}
      style={{ top: pos.top, left: pos.left }}
    >
      <div className={styles.ctxPreview}>
        <img src={BRAND_LOGO} alt="Tigris logo" width={118} height={48} />
      </div>
      <div className={styles.ctxList}>
        <button
          type="button"
          role="menuitem"
          onClick={async () => {
            try {
              const res = await fetch(BRAND_LOGO);
              if (!res.ok) throw new Error("Could not fetch logo SVG");
              const svg = await res.text();
              await navigator.clipboard.writeText(svg);
            } catch {
              window.open(BRAND_LOGO, "_blank");
            }
            onClose();
          }}
          className={styles.ctxItem}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="5" y="5" width="9" height="9" rx="1.5" />
            <path d="M5 11H3.5A1.5 1.5 0 012 9.5v-7A1.5 1.5 0 013.5 1h7A1.5 1.5 0 0112 2.5V5" />
          </svg>
          Copy logo SVG
        </button>
        <a
          href={`${WEBSITE}/downloads/tigris-logos.zip`}
          download="tigris-logos.zip"
          onClick={onClose}
          role="menuitem"
          className={styles.ctxItem}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 2v8m0 0L5 7m3 3l3-3" />
            <path d="M2 12v1.5a.5.5 0 00.5.5h11a.5.5 0 00.5-.5V12" />
          </svg>
          Download logo
        </a>
        <a
          href={`${WEBSITE}/downloads/Tigris-Brand-Kit.zip`}
          download="Tigris-Brand-Kit.zip"
          onClick={onClose}
          role="menuitem"
          className={styles.ctxItem}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="12" height="12" rx="2" />
            <path d="M6 6h4M6 8.5h4M6 11h2" />
          </svg>
          Download brand kit
        </a>
      </div>
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={clsx(styles.chevron, open && styles.chevronOpen)}
    >
      <path
        d="M2.5 4.5 6 8l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuPanel({
  group,
  onNavigate,
}: {
  group: MenuGroup;
  onNavigate: () => void;
}) {
  const { featured, links } = group;
  return (
    <div className={styles.panel}>
      <NavLink
        href={featured.href}
        onClick={onNavigate}
        className={styles.featured}
      >
        <span className={styles.featuredTitle}>{featured.label}</span>
        <span className={styles.featuredDesc}>{featured.desc}</span>
        <span className={styles.featuredArt}>{featured.art}</span>
      </NavLink>
      <ul className={styles.panelList}>
        {links.map((l) => (
          <li key={l.label} className={styles.panelItem}>
            <NavLink
              href={l.href}
              onClick={onNavigate}
              {...externalProps(l)}
              className={styles.panelLink}
            >
              <span className={styles.panelTitle}>
                {l.label}
                {l.external && (
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden
                    className={styles.extIcon}
                  >
                    <path
                      d="M3.33 12.67L12.67 3.33M12.67 3.33H5.33M12.67 3.33v7.34"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <span className={styles.panelDesc}>{l.desc}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Navbar(): ReactNode {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const { pathname } = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<number | null>(null);
  const logoSrc = useBaseUrl("/img/tigris-logo.svg");

  const closeContextMenu = useCallback(() => setContextMenu(null), []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);
  const open = useCallback(
    (label: string) => {
      cancelClose();
      setOpenMenu(label);
    },
    [cancelClose]
  );
  // a grace period so the pointer can cross from the trigger to the panel
  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 140);
  }, [cancelClose]);
  const closeNow = useCallback(() => {
    cancelClose();
    setOpenMenu(null);
  }, [cancelClose]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape and clicks outside the nav close whichever panel is open
  useEffect(() => {
    if (!openMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeNow();
    };
    const onDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node))
        closeNow();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [openMenu, closeNow]);

  // route change closes everything
  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  // the sheet is hidden at desktop widths, so close it there; otherwise it
  // comes back when the window shrinks again
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 800px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMobileOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // `pathname` includes the base URL (/blog/...), so it matches website hrefs
  const isActivePath = (href: string) => {
    if (href.startsWith("http")) return false;
    const base = href.replace(/#.*$/, "").replace(/\/$/, "");
    if (!base) return false;
    return pathname.startsWith(base);
  };
  const groupActive = (g: MenuGroup) =>
    [g.featured, ...g.links].some((l) => isActivePath(l.href));

  return (
    <>
      {contextMenu && (
        <LogoContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={closeContextMenu}
        />
      )}
      {/* `navbar` is kept because Docusaurus reads `.navbar` for the TOC
          scroll offset; styles.nav resets infima's navbar styles. */}
      <nav
        ref={navRef}
        className={clsx("navbar", styles.nav, scrolled && styles.scrolled)}
      >
        <div className={styles.inner}>
          <div className={styles.left}>
            <a
              href={`${WEBSITE}/`}
              className={styles.logo}
              onContextMenu={(e) => {
                e.preventDefault();
                setContextMenu({ x: e.clientX, y: e.clientY });
              }}
            >
              <img src={logoSrc} alt="Tigris" width={79} height={32} />
            </a>

            <ul className={styles.links}>
              {NAV.map((item) => {
                if (item.kind === "link") {
                  return (
                    <li key={item.label} className={styles.item}>
                      <NavLink
                        href={item.href}
                        onMouseEnter={scheduleClose}
                        className={clsx(
                          styles.topLink,
                          isActivePath(item.href) && styles.active
                        )}
                      >
                        {item.label}
                      </NavLink>
                    </li>
                  );
                }
                const g = item.group;
                const isOpen = openMenu === g.label;
                return (
                  <li
                    key={g.label}
                    className={styles.item}
                    onMouseEnter={() => open(g.label)}
                    onMouseLeave={scheduleClose}
                    onFocus={cancelClose}
                    onBlur={(e) => {
                      // keyboard users tabbing out of the whole group close it
                      if (!e.currentTarget.contains(e.relatedTarget as Node))
                        scheduleClose();
                    }}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      onClick={(e) => {
                        // hover already opened it, so a pointer click keeps it open;
                        // a keyboard "click" (detail 0) toggles
                        if (isOpen && e.detail === 0) closeNow();
                        else open(g.label);
                      }}
                      className={clsx(
                        styles.trigger,
                        isOpen
                          ? styles.triggerOpen
                          : groupActive(g) && styles.active
                      )}
                    >
                      {g.label}
                      <Chevron open={isOpen} />
                    </button>
                    {/* the padding-top is the bridge: keeps the pointer
                        "inside" while it crosses from the trigger down to the
                        panel */}
                    {isOpen && (
                      <div className={styles.panelWrap}>
                        <MenuPanel group={g} onNavigate={closeNow} />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={styles.actions}>
            <a
              href={tigrisConfig.loginUrl}
              className={clsx(styles.btn, styles.btnSecondary)}
            >
              Sign in
            </a>
            <a
              href={tigrisConfig.signUpUrl}
              className={clsx(styles.btn, styles.btnPrimary)}
            >
              Get started
            </a>
          </div>

          <button
            type="button"
            className={styles.menuBtn}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {mobileOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className={styles.sheet}>
            {NAV.map((item) => {
              if (item.kind === "link") {
                return (
                  <NavLink
                    key={item.label}
                    href={item.href}
                    className={clsx(
                      styles.mobileLink,
                      isActivePath(item.href) && styles.mobileActive
                    )}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                );
              }
              const g = item.group;
              return (
                <div key={g.label} className={styles.mobileGroup}>
                  <p className={styles.label}>{g.label}</p>
                  {[g.featured, ...g.links].map((l) => (
                    <NavLink
                      key={l.label}
                      href={l.href}
                      {...externalProps(l)}
                      className={clsx(
                        styles.mobileSubLink,
                        isActivePath(l.href) && styles.mobileActive
                      )}
                      onClick={() => setMobileOpen(false)}
                    >
                      {l.label}
                    </NavLink>
                  ))}
                </div>
              );
            })}
            <div className={styles.mobileActions}>
              <a
                href={tigrisConfig.loginUrl}
                className={clsx(styles.btn, styles.btnSecondary)}
              >
                Sign in
              </a>
              <a
                href={tigrisConfig.signUpUrl}
                className={clsx(styles.btn, styles.btnPrimary)}
              >
                Get started
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
