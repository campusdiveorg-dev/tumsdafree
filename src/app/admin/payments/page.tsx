'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import Layout from '@/components/admin/Layout';
import { paymentsApi } from '@/services/api';
import { Trash2, Radio, RefreshCw } from 'lucide-react';

export default function PaymentsListPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [clearing, setClearing] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
    setLoading(true);
    setError('');
    try {
      const data = await paymentsApi.list();
      setPayments(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch payments records.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteSingle(id: number) {
    if (!window.confirm(`Delete payment record #${id}? This cannot be undone.`)) return;
    setDeletingId(id);
    setError('');
    setSuccess('');
    try {
      await paymentsApi.delete(id);
      setSuccess(`Deleted payment record #${id}.`);
      loadPayments();
    } catch (err: any) {
      setError(err.message || 'Failed to delete payment record.');
    } finally {
      setDeletingId(null);
    }
  }

  async function handleClearAll() {
    const confirmation = window.confirm(
      'WARNING: Are you sure you want to CLEAR ALL payment records?\n\nUse this option if your M-Pesa Paybill / Till Number was changed to start recording fresh data.'
    );
    if (!confirmation) return;

    setClearing(true);
    setError('');
    setSuccess('');
    try {
      await paymentsApi.clearAll();
      setSuccess('All payment records have been cleared successfully.');
      loadPayments();
    } catch (err: any) {
      setError(err.message || 'Failed to clear payment records.');
    } finally {
      setClearing(false);
    }
  }

  async function handleRegisterC2B() {
    setRegistering(true);
    setError('');
    setSuccess('');
    try {
      const res = await paymentsApi.registerC2B();
      setSuccess(res.message || 'Successfully registered M-Pesa C2B payment webhook!');
    } catch (err: any) {
      setError(err.message || 'Failed to register M-Pesa webhook URL.');
    } finally {
      setRegistering(false);
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

  const totalCompleted = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

  return (
    <ProtectedRoute requireAdmin>
      <Layout title="Giving & Payments">
        <div className="flex items-center gap-3 mb-4" style={{ marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Giving &amp; Payments</h2>
            <p className="text-muted text-sm" style={{ margin: 0 }}>
              Total Completed: <strong style={{ color: 'var(--success)' }}>KES {totalCompleted.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={handleRegisterC2B}
              disabled={registering}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              title="Register webhook to record all direct Paybill payments made outside website"
            >
              <Radio size={15} /> {registering ? 'Registering…' : 'Register Direct Paybill Webhook'}
            </button>

            <button
              className="btn btn-ghost btn-sm"
              onClick={loadPayments}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
            >
              <RefreshCw size={14} /> Refresh
            </button>

            {payments.length > 0 && (
              <button
                className="btn btn-danger btn-sm"
                onClick={handleClearAll}
                disabled={clearing}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <Trash2 size={15} /> {clearing ? 'Clearing…' : 'Clear All Records (New Paybill)'}
              </button>
            )}
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

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
                    <th style={{ width: 90 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center text-muted">
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
                              {p.donor_email && <div className="text-muted text-sm">{p.donor_email}</div>}
                            </div>
                          ) : (
                            <span className="text-muted text-sm" style={{ fontStyle: 'italic' }}>
                              Direct M-Pesa / Guest
                            </span>
                          )}
                        </td>
                        <td style={{ fontWeight: 700 }}>
                          KES {parseFloat(p.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td style={{ textTransform: 'capitalize' }}>{(p.purpose || 'offering').replace('_', ' ')}</td>
                        <td>{getStatusBadge(p.status)}</td>
                        <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{p.mpesa_receipt_number || '-'}</td>
                        <td className="text-muted text-sm">
                          {p.created_at ? new Date(p.created_at).toLocaleString() : '-'}
                        </td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteSingle(p.id)}
                            disabled={deletingId === p.id}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                            title="Delete this payment record"
                          >
                            <Trash2 size={14} />
                            {deletingId === p.id ? '…' : 'Delete'}
                          </button>
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
