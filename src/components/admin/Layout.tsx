'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';

const NAV = [
  { label: 'Dashboard',      to: '/admin/dashboard',              icon: '📊' },
  { section: 'Content' },
  { label: 'Departments',    to: '/admin/content/departments',    icon: '🏛️' },
  { label: 'Ministries',     to: '/admin/content/ministries',     icon: '📖' },
  { label: 'Leadership',     to: '/admin/content/leadership',     icon: '👑' },
  { label: 'Sermons',        to: '/admin/content/sermons',        icon: '🎙️' },
  { label: 'Events',         to: '/admin/content/events',         icon: '📅' },
  { label: 'Weekly Meetings',to: '/admin/content/weekly_meetings',icon: '🗓️' },
  { label: 'Missions',       to: '/admin/content/missions',       icon: '✈️' },
  { label: 'Resources',      to: '/admin/content/resources',      icon: '📚' },
  { section: 'People & Giving' },
  { label: 'Members',        to: '/admin/members',                icon: '👥' },
  { label: 'Payments',       to: '/admin/payments',               icon: '💳' },
];

export default function AdminLayout({ children, title }: { children: ReactNode; title: string }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
    : 'AU';

  return (
    <div className="admin-shell">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <Link href="/admin/dashboard" className="sidebar-brand">
          <img src="/assets/img/icon.png" alt="TUMSDA" />
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-name">TUMSDA Admin</span>
            <span className="sidebar-brand-sub">Church Portal</span>
          </div>
        </Link>

        <nav className="sidebar-nav">
          {NAV.map((item, i) =>
            item.section ? (
              <div key={i} className="sidebar-section-label">{item.section}</div>
            ) : (
              <Link
                key={item.to}
                href={item.to!}
                className={pathname === item.to ? 'active' : ''}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <strong>{user?.name || 'Administrator'}</strong>
            <span>{user?.role || 'admin'}</span>
          </div>
          <button className="btn btn-ghost btn-sm btn-full" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="admin-main">
        <header className="admin-topbar">
          <span className="topbar-title">{title}</span>
          <div className="topbar-user">
            <span className="text-muted text-sm">{user?.name} · <strong>{user?.role}</strong></span>
            <div className="topbar-avatar">{initials}</div>
          </div>
        </header>
        <div className="admin-body">{children}</div>
      </div>
    </div>
  );
}
