"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, Phone, X } from "lucide-react";
import { business } from "@/data/business";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <Link
      aria-label={`${business.name} home`}
      className={`brand${footer ? "brand-footer" : ""}`}
      href="/"
    >
      <span className="brand-copy">
        <span className="brand-name">
          Tamez <span>&amp;</span> Sons<span className="brand-period">.</span>
        </span>
        <span className="brand-subtitle">Auto repair services</span>
      </span>
    </Link>
  );
}

export function StudioNavigation({ scene = false }: { scene?: boolean }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const navigation = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    navigation.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        setMenuOpen(false);
        toggle.current?.focus();
      }
      if (event.key === "Tab") {
        const items = [
          ...(navigation.current?.querySelectorAll<HTMLAnchorElement>("a") ??
            []),
          toggle.current,
        ].filter(Boolean) as HTMLElement[];
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [menuOpen]);

  return (
    <header
      className={`${scene ? "masthead" : "site-header"} studio-navigation${menuOpen ? "navigation-open" : ""}`}
    >
      <div className="navigation-inner">
        <Brand />
        <nav
          aria-label="Main navigation"
          className={`main-nav${menuOpen ? "is-open" : ""}`}
          id="main-navigation"
          ref={navigation}
        >
          {links.map((link) => (
            <Link
              aria-current={pathname === link.href ? "page" : undefined}
              className="nav-link"
              href={link.href}
              key={link.href}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
              <ArrowUpRight aria-hidden="true" size={15} />
            </Link>
          ))}
          <a className="mobile-menu-call" href={business.phoneHref}>
            <Phone aria-hidden="true" size={16} />
            {business.phone}
          </a>
          <p className="mobile-menu-location">
            Houston, Texas · Independent concept
          </p>
        </nav>
        <a className="header-call" href={business.phoneHref}>
          Call the shop <ArrowUpRight aria-hidden="true" size={16} />
        </a>
        <button
          aria-controls="main-navigation"
          aria-expanded={menuOpen}
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          className="menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          ref={toggle}
          type="button"
        >
          {menuOpen ? (
            <X aria-hidden="true" size={23} />
          ) : (
            <Menu aria-hidden="true" size={23} />
          )}
        </button>
      </div>
    </header>
  );
}

export function SiteHeader() {
  return <StudioNavigation />;
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-main">
          <div className="footer-brand-group">
            <Brand footer />
            <p>
              Automotive repair &amp; maintenance.
              <br />
              Houston, Texas.
            </p>
          </div>
          <div className="footer-nav-group">
            <p className="footer-label">Explore</p>
            {links.map((link) => (
              <Link href={link.href} key={link.href}>
                {link.label}
                <ArrowUpRight aria-hidden="true" size={13} />
              </Link>
            ))}
          </div>
          <div className="footer-contact-group">
            <p className="footer-label">Find the shop</p>
            <a className="footer-phone" href={business.phoneHref}>
              {business.phone}
            </a>
            <a href={business.directionsHref} rel="noreferrer" target="_blank">
              {business.address[0]}
              <br />
              {business.address[1]}
            </a>
            <small>{business.addressStatus}</small>
          </div>
          <div className="footer-hours-group">
            <p className="footer-label">Reported hours</p>
            {business.hours.map((item) => (
              <p className="footer-hours" key={item.days}>
                <span>{item.days}</span>
                <span>{item.value}</span>
              </p>
            ))}
            <small>{business.hoursStatus}</small>
          </div>
        </div>
        <p className="footer-concept">{business.websiteConceptNotice}</p>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {business.shortName} · Website concept
          </span>
          <span>Auto repair &amp; maintenance · Houston, Texas</span>
        </div>
      </div>
    </footer>
  );
}
