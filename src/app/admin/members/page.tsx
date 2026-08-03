'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import Layout from '@/components/admin/Layout';
import { usersApi } from '@/services/api';

export default function MembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadMembers();
  }, []);

  async function loadMembers() {
    setLoading(true);
    try {
      const data = await usersApi.list();
      setMembers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch members.');
    } finally {
      setLoading(false);
    }
  }

  async function toggleRole(member: any) {
    const newRole = member.role === 'admin' ? 'member' : 'admin';
    if (window.confirm(`Are you sure you want to change role of ${member.name} to ${newRole}?`)) {
      setError('');
      setSuccess('');
      try {
        await usersApi.update(member.id, { role: newRole });
        setSuccess(`Successfully changed ${member.name}'s role to ${newRole}.`);
        loadMembers();
      } catch (err: any) {
        setError(err.message || 'Failed to update role.');
      }
    }
  }

  async function deactivate(member: any) {
    if (window.confirm(`Are you sure you want to deactivate ${member.name}?`)) {
      setError('');
      setSuccess('');
      try {
        await usersApi.deactivate(member.id);
        setSuccess(`Successfully deactivated user ${member.name}.`);
        loadMembers();
      } catch (err: any) {
        setError(err.message || 'Failed to deactivate member.');
      }
    }
  }

  async function activate(member: any) {
    if (window.confirm(`Are you sure you want to reactivate ${member.name}?`)) {
      setError('');
      setSuccess('');
      try {
        await usersApi.update(member.id, { is_active: 1 });
        setSuccess(`Successfully reactivated user ${member.name}.`);
        loadMembers();
      } catch (err: any) {
        setError(err.message || 'Failed to reactivate member.');
      }
    }
  }

  async function deleteMember(member: any) {
    if (
      window.confirm(
        `Are you sure you want to PERMANENTLY delete user ${member.name}? This action cannot be undone and will unset their id from all audit logs and payment records.`
      )
    ) {
      setError('');
      setSuccess('');
      try {
        await usersApi.delete(member.id);
        setSuccess(`Successfully deleted user ${member.name}.`);
        loadMembers();
      } catch (err: any) {
        setError(err.message || 'Failed to delete member.');
      }
    }
  }

  return (
    <ProtectedRoute requireAdmin>
      <Layout title="Member Accounts">
        <div className="flex items-center gap-3 mb-4" style={{ marginBottom: 20 }}>
          <h2 style={{ flex: 1, fontSize: 15, fontWeight: 600 }}>Member Accounts</h2>
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
                    <th>Name</th>
                    <th>Email Address</th>
                    <th>System Role</th>
                    <th>Active Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center text-muted">
                        No members found.
                      </td>
                    </tr>
                  ) : (
                    members.map((m) => (
                      <tr key={m.id}>
                        <td className="text-muted text-sm">{m.id}</td>
                        <td style={{ fontWeight: 600 }}>{m.name}</td>
                        <td>{m.email}</td>
                        <td>
                          <span className={`badge ${m.role === 'admin' ? 'badge-info' : 'badge-gray'}`}>
                            {m.role}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${m.is_active ? 'badge-success' : 'badge-danger'}`}>
                            {m.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            {m.is_active ? (
                              <>
                                <button className="btn btn-ghost btn-sm" onClick={() => toggleRole(m)}>
                                  Toggle Role
                                </button>
                                <button className="btn btn-ghost btn-sm" onClick={() => deactivate(m)}>
                                  Deactivate
                                </button>
                              </>
                            ) : (
                              <button className="btn btn-ghost btn-sm" onClick={() => activate(m)}>
                                Activate
                              </button>
                            )}
                            <button className="btn btn-danger btn-sm" onClick={() => deleteMember(m)}>
                              Delete
                            </button>
                          </div>
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
