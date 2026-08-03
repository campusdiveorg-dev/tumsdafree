'use client';

import { useState, FormEvent } from 'react';

export default function SupportForm() {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('mission_support');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'danger' } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, amount: Number(amount), purpose }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to initiate STK Push.');
      }

      setMessage({
        text: data.message || 'Check your phone for the M-Pesa payment prompt.',
        type: 'success',
      });
      setPhone('');
      setAmount('');
    } catch (err: any) {
      setMessage({ text: err.message || 'An error occurred.', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form id="mpesaForm" className="mt-3" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Phone Number (e.g. 254712345678)</label>
        <input
          type="tel"
          name="phone"
          className="form-control"
          required
          placeholder="2547xxxxxxxx"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Amount (KES)</label>
        <input
          type="number"
          name="amount"
          className="form-control"
          required
          min="1"
          placeholder="100"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Purpose</label>
        <select
          name="purpose"
          className="form-select"
          required
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
        >
          <option value="tithe">Tithe</option>
          <option value="offering">Offering</option>
          <option value="mission_support">Mission Support</option>
          <option value="other">Other</option>
        </select>
      </div>

      {message && (
        <div className={`alert alert-${message.type} mt-3`}>
          {message.text}
        </div>
      )}

      <button type="submit" className="btn btn-primary w-100 mt-2" disabled={loading}>
        {loading ? 'Sending prompt...' : 'Send STK Push'}
      </button>
    </form>
  );
}
