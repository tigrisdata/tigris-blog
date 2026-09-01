import React, { useState, useEffect } from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { useLocation } from "@docusaurus/router";
import clsx from "clsx";
import tigrisConfig from "@site/tigris.config";
import styles from "./styles.module.css";

type NavLink = {
  label: string;
  href: string;
  external?: boolean;
  internal?: boolean;
};

const navLinks: NavLink[] = [
  { label: "About", href: `${tigrisConfig.websiteUrl}/about/` },
  { label: "Docs", href: `${tigrisConfig.docsUrl}/` },
  { label: "Blog", href: "/", internal: true },
  { label: "Customers", href: `${tigrisConfig.websiteUrl}/customers/` },
  { label: "Pricing", href: `${tigrisConfig.websiteUrl}/pricing/` },
  { label: "Partners", href: `${tigrisConfig.websiteUrl}/partners/` },
  { label: "Community", href: tigrisConfig.discordUrl, external: true },
];

function NavItem({
  link,
  active,
  className,
  onClick,
}: {
  link: NavLink;
  active: boolean;
  className: string;
  onClick?: () => void;
}) {
  const cls = clsx(className, active && styles.linkActive);
  if (link.internal) {
    return (
      <Link to={link.href} className={cls} onClick={onClick}>
        {link.label}
      </Link>
    );
  }
  return (
    <a
      href={link.href}
      className={cls}
      onClick={onClick}
      {...(link.external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {link.label}
    </a>
  );
}

export default function Navbar(): JSX.Element {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const logoSrc = useBaseUrl("/img/tigris-logo.svg");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (link: NavLink) =>
    link.internal ? location.pathname.startsWith("/blog") : false;

  return (
    <nav className={clsx(styles.nav, "navbar", scrolled && styles.scrolled)}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <a
            href={tigrisConfig.websiteUrl}
            className={styles.logo}
            aria-label="Tigris"
          >
            <img src={logoSrc} alt="Tigris" width={79} height={32} />
          </a>

          <div className={styles.links}>
            {navLinks.map((link) => (
              <NavItem
                key={link.label}
                link={link}
                active={isActive(link)}
                className={styles.link}
              />
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <a
            href={tigrisConfig.loginUrl}
            className={clsx(styles.btn, styles.btnSignin)}
          >
            Sign in
          </a>
          <a
            href={tigrisConfig.signUpUrl}
            className={clsx(styles.btn, styles.btnStarted)}
          >
            Get started
          </a>
        </div>

        <button
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
        <div className={styles.mobile}>
          {navLinks.map((link) => (
            <NavItem
              key={link.label}
              link={link}
              active={isActive(link)}
              className={styles.mobileLink}
              onClick={() => setMobileOpen(false)}
            />
          ))}
          <div className={styles.mobileActions}>
            <a
              href={tigrisConfig.loginUrl}
              className={clsx(styles.btn, styles.btnSignin)}
            >
              Sign in
            </a>
            <a
              href={tigrisConfig.signUpUrl}
              className={clsx(styles.btn, styles.btnStarted)}
            >
              Get started
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
