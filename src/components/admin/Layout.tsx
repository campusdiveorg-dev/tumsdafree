'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import {
  LayoutDashboard,
  Building2,
  BookOpen,
  Crown,
  Radio,
  Calendar,
  Clock,
  Compass,
  FileText,
  Users,
  CreditCard,
  LogOut,
  Megaphone,
  BookMarked,
  GalleryHorizontal,
} from 'lucide-react';

const NAV = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
  { section: 'Content' },
  { label: 'Departments', to: '/admin/content/departments', icon: <Building2 size={18} /> },
  { label: 'Ministries', to: '/admin/content/ministries', icon: <BookOpen size={18} /> },
  { label: 'Leadership', to: '/admin/content/leadership', icon: <Crown size={18} /> },
  { label: 'Sermons', to: '/admin/content/sermons', icon: <Radio size={18} /> },
  { label: 'Events', to: '/admin/content/events', icon: <Calendar size={18} /> },
  { label: 'Weekly Meetings', to: '/admin/content/weekly_meetings', icon: <Clock size={18} /> },
  { label: 'Missions', to: '/admin/content/missions', icon: <Compass size={18} /> },
  { label: 'Resources', to: '/admin/content/resources', icon: <FileText size={18} /> },
  { section: 'Church Updates' },
  { label: 'Announcements', to: '/admin/content/announcements', icon: <Megaphone size={18} /> },
  { label: 'Word of the Day', to: '/admin/content/word_of_the_day', icon: <BookMarked size={18} /> },
  { label: 'Sabbath Gallery', to: '/admin/content/sabbath_gallery', icon: <GalleryHorizontal size={18} /> },
  { section: 'People & Giving' },
  { label: 'Members', to: '/admin/members', icon: <Users size={18} /> },
  { label: 'Payments', to: '/admin/payments', icon: <CreditCard size={18} /> },
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
                <span className="nav-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>{item.icon}</span>
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
          <button className="btn btn-ghost btn-sm btn-full" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <LogOut size={16} />
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
