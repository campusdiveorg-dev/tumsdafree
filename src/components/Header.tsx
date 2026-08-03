'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Skip rendering public header inside admin route segment
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const isNavActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname?.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/departments', label: 'Departments' },
    { href: '/ministries', label: 'Ministries' },
    { href: '/evangelism', label: 'Evangelism' },
    { href: '/sermons', label: 'Sermons' },
    { href: '/leadership', label: 'Leadership' },
  ];

  return (
    <>
      {/* Mobile Side Panel Menu */}
      <div className={`mobile-side-panel ${mobileMenuOpen ? 'active' : ''}`} id="mobileSidePanel">
        <div className="side-panel-overlay" id="sidePanelOverlay" onClick={() => setMobileMenuOpen(false)}></div>
        <div className="side-panel-content">
          <div className="side-panel-search">
            <div className="search-container">
              <span className="search-placeholder">Search...</span>
              <div className="search-line"></div>
            </div>
          </div>
          <nav className="side-panel-nav">
            <ul className="side-panel-menu">
              {navItems.map((item) => (
                <li className="side-panel-item" key={item.href}>
                  <Link
                    className={`side-panel-link ${isNavActive(item.href) ? 'active' : ''}`}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <button className="side-panel-close" id="sidePanelClose" onClick={() => setMobileMenuOpen(false)}>
          ×
        </button>
      </div>

      <header>
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top">
          <div className="container">
            <Link className="navbar-brand d-flex align-items-center gap-2" href="/">
              <img
                src="/assets/img/logo.jpg"
                alt="TUMSDA Logo"
                width="36"
                height="36"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </Link>
            <button
              className="navbar-toggler d-lg-none"
              type="button"
              id="mobileMenuToggle"
              aria-label="Toggle mobile menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse d-none d-lg-block" id="mainNav">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                {navItems.map((item) => (
                  <li className="nav-item" key={item.href}>
                    <Link className={`nav-link ${isNavActive(item.href) ? 'active' : ''}`} href={item.href}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
