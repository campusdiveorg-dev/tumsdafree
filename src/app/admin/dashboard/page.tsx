'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import Layout from '@/components/admin/Layout';
import { api } from '@/services/api';
import {
  Building2,
  BookOpen,
  Crown,
  Radio,
  Calendar,
  Clock,
  Compass,
  FileText,
} from 'lucide-react';

const CONTENT_TABLES = [
  { key: 'departments', label: 'Departments', icon: <Building2 size={24} /> },
  { key: 'ministries', label: 'Ministries', icon: <BookOpen size={24} /> },
  { key: 'leadership', label: 'Leadership', icon: <Crown size={24} /> },
  { key: 'sermons', label: 'Sermons', icon: <Radio size={24} /> },
  { key: 'events', label: 'Events', icon: <Calendar size={24} /> },
  { key: 'weekly_meetings', label: 'Weekly Meetings', icon: <Clock size={24} /> },
  { key: 'missions', label: 'Missions', icon: <Compass size={24} /> },
  { key: 'resources', label: 'Resources', icon: <FileText size={24} /> },
];

export default function DashboardPage() {
  const [counts, setCounts] = useState<Record<string, any>>({});
  const [members, setMembers] = useState<any>(0);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetches = CONTENT_TABLES.map((t) =>
      api
        .get(`/${t.key}`)
        .then((rows) => ({ [t.key]: rows.length }))
        .catch(() => ({ [t.key]: '?' }))
    );
    const memberFetch = api.get('/users').then((r) => r.length).catch(() => '?');
    const paymentFetch = api.get('/payments').then((r) => r).catch(() => []);

    Promise.all([...fetches, memberFetch, paymentFetch]).then((results) => {
      const countMap = results.slice(0, CONTENT_TABLES.length).reduce((a, c) => ({ ...a, ...c }), {});
      setCounts(countMap);
      setMembers(results[CONTENT_TABLES.length]);
      setPayments(results[CONTENT_TABLES.length + 1]);
      setLoading(false);
    });
  }, []);

  const totalGiven = payments
    .filter((p) => p.status === 'completed')
    .reduce((s, p) => s + parseFloat(p.amount || 0), 0);
  const pendingCount = payments.filter((p) => p.status === 'pending').length;
  const recentPayments = payments.slice(0, 5);

  return (
    <ProtectedRoute>
      <Layout title="Dashboard">
        {loading ? (
          <div className="loading-screen">
            <div className="spinner" />
            <p>Loading dashboard…</p>
          </div>
        ) : (
          <>
            {/* Top stats */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Members</div>
                <div className="stat-value">{members}</div>
                <div className="stat-sub">registered accounts</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Total Giving</div>
                <div className="stat-value">KES {totalGiven.toLocaleString()}</div>
                <div className="stat-sub">completed payments</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Pending M-Pesa</div>
                <div className="stat-value">{pendingCount}</div>
                <div className="stat-sub">awaiting confirmation</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Content Items</div>
                <div className="stat-value">
                  {Object.values(counts).reduce((a, c) => a + (parseInt(c) || 0), 0)}
                </div>
                <div className="stat-sub">across all sections</div>
              </div>
            </div>

            {/* Content quick-links */}
            <div className="card mb-4" style={{ marginBottom: 24 }}>
              <div className="card-header">Content Sections</div>
              <div className="card-body">
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                    gap: 12,
                  }}
                >
                  {CONTENT_TABLES.map((t) => (
                    <Link
                      key={t.key}
                      href={`/admin/content/${t.key}`}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '16px 12px',
                        border: '1px solid var(--border)',
                        borderRadius: 8,
                        textDecoration: 'none',
                        color: 'var(--text)',
                        transition: 'box-shadow .15s, border-color .15s',
                        background: '#fff',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--brand)')}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand)', marginBottom: 6 }}>
                        {t.icon}
                      </span>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{t.label}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        {counts[t.key] ?? '…'} items
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent payments */}
            <div className="card">
              <div className="card-header">
                Recent Payments
                <Link href="/admin/payments" className="btn btn-ghost btn-sm">
                  View all
                </Link>
              </div>
              {recentPayments.length === 0 ? (
                <div className="empty-state">
                  <h3>No payments yet</h3>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Donor</th>
                        <th>Phone</th>
                        <th>Amount</th>
                        <th>Purpose</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPayments.map((p) => (
                        <tr key={p.id}>
                          <td>{p.donor_name || <span className="text-muted">Anonymous</span>}</td>
                          <td>{p.phone_number}</td>
                          <td>KES {parseFloat(p.amount).toLocaleString()}</td>
                          <td style={{ textTransform: 'capitalize' }}>{p.purpose.replace('_', ' ')}</td>
                          <td>
                            <StatusBadge s={p.status} />
                          </td>
                          <td className="text-muted text-sm">{p.created_at?.slice(0, 10)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </Layout>
    </ProtectedRoute>
  );
}

function StatusBadge({ s }: { s: string }) {
  const map: Record<string, string> = {
    completed: 'badge-success',
    pending: 'badge-warning',
    failed: 'badge-danger',
    cancelled: 'badge-gray',
  };
  return <span className={`badge ${map[s] || 'badge-gray'}`}>{s}</span>;
}
