'use client';

import { useState, FormEvent } from 'react';

export default function SupportForm() {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('mission_support');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'danger' } | null>(null);
  const [loading, setLoading] = useState(false);

  const pollStatus = (checkoutRequestId: string) => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const queryRes = await fetch('/api/payments/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ checkoutRequestId }),
        });
        const queryData = await queryRes.json();
        const payload = queryData?.data || queryData;

        if (payload?.ResultCode === '0' || payload?.status === 'completed') {
          clearInterval(interval);
          setMessage({
            text: 'Payment received successfully! Thank you for your contribution.',
            type: 'success',
          });
          setLoading(false);
          setPhone('');
          setAmount('');
        } else if (payload?.ResultCode === '1032') {
          clearInterval(interval);
          setMessage({
            text: 'Payment was cancelled on your phone.',
            type: 'danger',
          });
          setLoading(false);
        } else if (payload?.ResultCode && payload?.ResultCode !== '4999' && payload?.ResultCode !== '0') {
          clearInterval(interval);
          setMessage({
            text: `Payment failed: ${payload.ResultDesc || 'Transaction could not be completed.'}`,
            type: 'danger',
          });
          setLoading(false);
        }
      } catch (e) {
        console.error('Polling error', e);
      }

      if (attempts >= 15) {
        clearInterval(interval);
        setMessage({
          text: 'Payment prompt timed out or pending. If you entered your PIN, it will reflect shortly.',
          type: 'warning' as any,
        });
        setLoading(false);
      }
    }, 2500);
  };

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
        text: 'Prompt sent! Please enter your M-Pesa PIN on your phone...',
        type: 'success',
      });

      if (data?.data?.checkout_request_id) {
        pollStatus(data.data.checkout_request_id);
      } else {
        setLoading(false);
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'An error occurred.', type: 'danger' });
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
