'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import Layout from '@/components/admin/Layout';
import { paymentsApi } from '@/services/api';

export default function PaymentsListPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
    setLoading(true);
    try {
      const data = await paymentsApi.list();
      setPayments(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch payments records.');
    } finally {
      setLoading(false);
    }
  }

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      completed: 'badge-success',
      pending: 'badge-warning',
      failed: 'badge-danger',
      cancelled: 'badge-gray',
    };
    return <span className={`badge ${map[status] || 'badge-gray'}`}>{status}</span>;
  };

  return (
    <ProtectedRoute requireAdmin>
      <Layout title="Giving & Payments">
        <div className="flex items-center gap-3 mb-4" style={{ marginBottom: 20 }}>
          <h2 style={{ flex: 1, fontSize: 15, fontWeight: 600 }}>Giving &amp; Payments</h2>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="card">
          {loading ? (
            <div className="empty-state">
              <div className="spinner" />
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Phone</th>
                    <th>Donor Details</th>
                    <th>Amount</th>
                    <th>Purpose</th>
                    <th>Status</th>
                    <th>M-Pesa Receipt</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center text-muted">
                        No payment logs recorded yet.
                      </td>
                    </tr>
                  ) : (
                    payments.map((p) => (
                      <tr key={p.id}>
                        <td className="text-muted text-sm">{p.id}</td>
                        <td style={{ fontWeight: 600 }}>{p.phone_number}</td>
                        <td>
                          {p.donor_name ? (
                            <div>
                              <div style={{ fontWeight: 600 }}>{p.donor_name}</div>
                              <div className="text-muted text-sm">{p.donor_email}</div>
                            </div>
                          ) : (
                            <span className="text-muted text-sm" style={{ fontStyle: 'italic' }}>
                              Anonymous / Guest
                            </span>
                          )}
                        </td>
                        <td style={{ fontWeight: 700 }}>
                          KES {parseFloat(p.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td style={{ textTransform: 'capitalize' }}>{p.purpose.replace('_', ' ')}</td>
                        <td>{getStatusBadge(p.status)}</td>
                        <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{p.mpesa_receipt_number || '-'}</td>
                        <td className="text-muted text-sm">
                          {p.created_at ? new Date(p.created_at).toLocaleString() : '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
