'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);

  const handle = (e: any) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setBusy(true);
    try {
      await register(form.name, form.email, form.password);
      setSuccess('Account created! You can now sign in.');
      setTimeout(() => router.push('/admin/login'), 1800);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <img src="/assets/img/icon2.png" alt="TUMSDA" />
        </div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Join TUMSDA Church community</p>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Full name</label>
            <input
              type="text"
              name="name"
              required
              className="form-control"
              value={form.name}
              onChange={handle}
              placeholder="Jane Doe"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              type="email"
              name="email"
              required
              className="form-control"
              value={form.email}
              onChange={handle}
              placeholder="you@example.com"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              required
              className="form-control"
              value={form.password}
              onChange={handle}
              placeholder="Min 8 characters"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm password</label>
            <input
              type="password"
              name="confirm"
              required
              className="form-control"
              value={form.confirm}
              onChange={handle}
              placeholder="Repeat password"
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={busy}>
            {busy ? (
              <>
                <span className="spinner" /> Creating account…
              </>
            ) : (
              'Create account'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-4">
          Already have an account? <Link href="/admin/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
