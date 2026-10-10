'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import Layout from '@/components/admin/Layout';
import { api } from '@/services/api';
import { Plus, Pencil, Trash2, X, Upload, Image as ImageIcon } from 'lucide-react';

const SCHEMAS: Record<string, any> = {
  departments: {
    label: 'Departments',
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'scripture_quote', label: 'Scripture Quote', type: 'textarea' },
      { key: 'scripture_reference', label: 'Scripture Ref', type: 'text' },
      { key: 'external_link', label: 'External Link (URL)', type: 'url' },
      { key: 'cloudinary_secure_url', label: 'Cloudinary Image', type: 'image' },
      { key: 'sort_order', label: 'Sort Order', type: 'number', default: 0 },
    ],
    preview: (r: any) => r.name,
  },
  ministries: {
    label: 'Ministries',
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'scripture_quote', label: 'Scripture Quote', type: 'textarea' },
      { key: 'scripture_reference', label: 'Scripture Ref', type: 'text' },
      { key: 'cloudinary_secure_url', label: 'Cloudinary Image', type: 'image' },
      { key: 'sort_order', label: 'Sort Order', type: 'number', default: 0 },
    ],
    preview: (r: any) => r.name,
  },
  leadership: {
    label: 'Leadership',
    fields: [
      { key: 'name', label: 'Full Name', type: 'text', required: true },
      { key: 'position', label: 'Position', type: 'text', required: true },
      { key: 'photo_path', label: 'Photo Path (assets/img/…)', type: 'text' },
      { key: 'cloudinary_secure_url', label: 'Cloudinary Image', type: 'image' },
      { key: 'statement', label: 'Statement', type: 'textarea' },
      { key: 'sort_order', label: 'Sort Order', type: 'number', default: 0 },
    ],
    preview: (r: any) => `${r.name} — ${r.position}`,
  },
  sermons: {
    label: 'Sermons',
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'youtube_url', label: 'YouTube URL', type: 'url', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'is_featured', label: 'Featured (1/0)', type: 'number', default: 0 },
      { key: 'published_at', label: 'Published Date', type: 'date' },
    ],
    preview: (r: any) => r.title,
  },
  events: {
    label: 'Church Calendar Events',
    fields: [
      { key: 'title', label: 'Event Title', type: 'text', required: true },
      { key: 'event_date', label: 'Date', type: 'date', required: true },
      { key: 'facilitator', label: 'Facilitator', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
    ],
    preview: (r: any) => `${r.event_date} — ${r.title}`,
  },
  weekly_meetings: {
    label: 'Weekly Meetings',
    fields: [
      {
        key: 'day_of_week',
        label: 'Day',
        type: 'select',
        options: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        required: true,
      },
      { key: 'time_range', label: 'Time Range', type: 'text', required: true },
      { key: 'program_name', label: 'Program', type: 'text', required: true },
      { key: 'sort_order', label: 'Sort Order', type: 'number', default: 0 },
    ],
    preview: (r: any) => `${r.day_of_week} ${r.time_range} — ${r.program_name}`,
  },
  resources: {
    label: 'Resources',
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'cloudinary_secure_url', label: 'Icon / Thumbnail Image', type: 'image' },
      {
        key: 'link_url',
        label: 'Resource Link',
        type: 'file-or-url',
        required: true,
        placeholder: 'Paste external URL, or upload any file below',
      },
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'sort_order', label: 'Sort Order', type: 'number', default: 0 },
    ],
    preview: (r: any) => r.title,
  },
  missions: {
    label: 'Missions',
    fields: [
      { key: 'title', label: 'Mission Title', type: 'text', required: true },
      { key: 'theme_text', label: 'Theme Text', type: 'text' },
      { key: 'theme_verse', label: 'Theme Verse (Ref)', type: 'text' },
      { key: 'theme_song', label: 'Theme Song', type: 'text' },
      { key: 'start_date', label: 'Start Date', type: 'date' },
      { key: 'end_date', label: 'End Date', type: 'date' },
      { key: 'cloudinary_secure_url', label: 'Cloudinary Image', type: 'image' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'is_upcoming', label: 'Upcoming (1/0)', type: 'number', default: 0 },
      {
        key: 'whatsapp_link',
        label: 'WhatsApp Link (Join Us button)',
        type: 'url',
        placeholder: 'https://whatsapp.com/channel/... or https://chat.whatsapp.com/...',
      },
      { key: 'chair_name', label: 'Mission Chair Name', type: 'text' },
      { key: 'chair_title', label: 'Mission Chair Title', type: 'text' },
      { key: 'chair_message', label: 'Mission Chair Message', type: 'textarea' },
      { key: 'chair_cloudinary_secure_url', label: 'Mission Chair Photo', type: 'image' },
      { key: 'sort_order', label: 'Sort Order', type: 'number', default: 0 },
    ],
    preview: (r: any) => r.title,
  },
  announcements: {
    label: 'Announcements',
    fields: [
      { key: 'title', label: 'Announcement Title', type: 'text', required: true },
      { key: 'content', label: 'Content / Details', type: 'textarea', required: true },
      { key: 'sort_order', label: 'Sort Order (lower = first)', type: 'number', default: 0 },
    ],
    preview: (r: any) => r.title,
  },
  word_of_the_day: {
    label: 'Word of the Day',
    fields: [
      { key: 'content', label: 'Scripture / Quote', type: 'textarea', required: true },
      { key: 'reference', label: 'Bible Reference (e.g. John 3:16)', type: 'text', required: true },
    ],
    preview: (r: any) => `${r.reference} — ${(r.content || '').slice(0, 60)}…`,
  },
  sabbath_gallery: {
    label: 'Sabbath Gallery Collections',
    fields: [
      { key: 'title', label: 'Collection Title (e.g. Finalist Sabbath 2025)', type: 'text', required: true },
      {
        key: 'link_url',
        label: 'Photos Platform Link (Google Drive, Google Photos, Flickr link)',
        type: 'url',
        placeholder: 'https://drive.google.com/…',
      },
      {
        key: 'image_url',
        label: 'Cover Image (Upload file or paste image URL)',
        type: 'image',
        placeholder: 'Upload cover photo or paste image URL',
      },
      {
        key: 'icon',
        label: 'Collection Icon',
        type: 'select',
        options: ['crown', 'users', 'user', 'graduation-cap', 'gem', 'image'],
        default: 'users',
      },
      { key: 'date_taken', label: 'Date Taken', type: 'date' },
      { key: 'sort_order', label: 'Sort Order (lower = first)', type: 'number', default: 0 },
    ],
    preview: (r: any) => `${r.title} (${r.link_url || 'No Link'})`,
  },
  hero_slides: {
    label: 'Hero Slideshow & Page Banners',
    fields: [
      { key: 'title', label: 'Slide Title / Heading', type: 'text', required: true, placeholder: 'e.g. WELCOME TO TUMSDA' },
      { key: 'subtitle', label: 'Subtitle / Description', type: 'textarea', placeholder: 'e.g. The Church We Love The Most!' },
      { key: 'image_url', label: 'Slide Image (Upload photo or paste URL)', type: 'image', required: true },
      { key: 'button_text', label: 'Button Label (Optional)', type: 'text', placeholder: 'e.g. Welcome and Worship With Us' },
      { key: 'button_link', label: 'Button Link URL', type: 'text', placeholder: 'e.g. #, /about, or https://youtube.com/...' },
      {
        key: 'page',
        label: 'Target Page / Location',
        type: 'select',
        options: ['home', 'sermons', 'evangelism', 'about', 'departments', 'leadership'],
        default: 'home',
      },
      { key: 'sort_order', label: 'Slide Order (1 = first)', type: 'number', default: 1 },
      { key: 'is_active', label: 'Visibility Status', type: 'boolean', default: 1 },
    ],
    preview: (r: any) => `[${(r.page || 'home').toUpperCase()}] ${r.title} ${r.is_active ? '✓' : '(Hidden)'}`,
  },
  tumsda_digest: {
    label: 'TUMSDA Digest (Monthly Publication)',
    fields: [
      { key: 'title', label: 'Publication Name', type: 'text', required: true, default: 'TUMSDA Digest', placeholder: 'e.g. TUMSDA Digest' },
      { key: 'edition', label: 'Edition / Month', type: 'text', placeholder: 'e.g. October 2026 Edition (Volume 1, Issue 4)' },
      { key: 'description', label: 'Summary / Excerpt', type: 'textarea', placeholder: 'Short overview of this month\'s articles and spiritual theme...' },
      { key: 'cover_image_url', label: 'Cover / Thumbnail Image (Optional)', type: 'image' },
      { key: 'file_url', label: 'Digest Document File (Upload PDF, Word, or Image)', type: 'file', required: true },
      { key: 'file_name', label: 'File Display Name', type: 'text', placeholder: 'e.g. TUMSDA_Digest_Oct_2026.pdf' },
      { key: 'sort_order', label: 'Sort Order', type: 'number', default: 0 },
      { key: 'is_active', label: 'Publish Status (Active = Show on Home, Inactive = Hide)', type: 'boolean', default: 1 },
    ],
    preview: (r: any) => `${r.title} — ${r.edition || 'Latest Issue'} ${r.is_active ? '(Active on Home)' : '(Hidden)'}`,
  },
};

function emptyForm(fields: any[]) {
  return Object.fromEntries(fields.map((f) => [f.key, f.default ?? '']));
}

function FieldInput({
  field,
  value,
  onChange,
  onImageUpload,
}: {
  field: any;
  value: any;
  onChange: any;
  onImageUpload?: (file: File) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const base = { className: 'form-control', name: field.key, value: value ?? '', onChange };
  if (field.type === 'textarea') return <textarea {...base} rows={3} />;
  if (field.type === 'select')
    return (
      <select {...base}>
        <option value="">— select —</option>
        {field.options.map((o: string) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );

  if (field.type === 'boolean') {
    const isChecked = value === 1 || value === '1' || value === true;
    return (
      <select
        {...base}
        value={isChecked ? '1' : '0'}
        onChange={(e) => onChange({ target: { name: field.key, value: e.target.value === '1' ? 1 : 0 } })}
      >
        <option value="1">Active / Visible (Published)</option>
        <option value="0">Draft / Inactive (Hidden)</option>
      </select>
    );
  }

  if (field.type === 'file') {
    return (
      <div className="flex flex-col gap-2">
        <input type="text" {...base} placeholder="Cloudinary file URL or paste link" />
        <div className="flex items-center gap-2 mt-1">
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,application/pdf,image/*"
            className="form-control form-control-sm"
            disabled={uploading}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setUploading(true);
              try {
                const fd = new FormData();
                fd.append('file', file);
                fd.append('table', 'digest');
                const res = await fetch('/api/cloudinary/upload', {
                  method: 'POST',
                  body: fd,
                });
                const data = await res.json();
                if (res.ok && data.secure_url) {
                  onChange({
                    target: { name: field.key, value: data.secure_url },
                  });
                } else {
                  alert(data.error || 'Upload failed');
                }
              } catch (err: any) {
                alert('File upload error: ' + err.message);
              } finally {
                setUploading(false);
              }
            }}
          />
          {uploading && <span className="text-sm text-muted">Uploading file…</span>}
        </div>
        {value && (
          <div className="small text-muted mt-1">
            Uploaded: <a href={value} target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-underline fw-semibold">Open / Preview File</a>
          </div>
        )}
      </div>
    );
  }

  if (field.type === 'image') {
    return (
      <div className="flex flex-col gap-2">
        <input type="text" {...base} placeholder="Cloudinary image URL" />
        <div className="flex items-center gap-2 mt-1">
          <input
            type="file"
            accept="image/*"
            className="form-control form-control-sm"
            disabled={uploading}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setUploading(true);
              try {
                const fd = new FormData();
                fd.append('file', file);
                const res = await fetch('/api/cloudinary/upload', {
                  method: 'POST',
                  body: fd,
                });
                const data = await res.json();
                if (res.ok && data.secure_url) {
                  onChange({
                    target: { name: field.key, value: data.secure_url },
                  });
                  if (field.key === 'cloudinary_secure_url') {
                    onChange({
                      target: { name: 'cloudinary_public_id', value: data.public_id },
                    });
                  }
                } else {
                  alert(data.error || 'Upload failed');
                }
              } catch (err: any) {
                alert('Image upload error: ' + err.message);
              } finally {
                setUploading(false);
              }
            }}
          />
          {uploading && <span className="text-sm text-muted">Uploading to Cloudinary…</span>}
        </div>
        {value && (
          <img src={value} alt="Preview" style={{ maxWidth: 120, maxHeight: 80, objectFit: 'cover', borderRadius: 4, marginTop: 4 }} />
        )}
      </div>
    );
  }

  // File-or-URL field: paste any external URL OR upload any file to Cloudinary
  if (field.type === 'pdf' || field.type === 'file-or-url') {
    // A Cloudinary-hosted file has res.cloudinary.com in the URL
    const isCloudinaryFile = value && String(value).includes('res.cloudinary.com');

    // Guess the file extension for icon display
    const ext = isCloudinaryFile ? String(value).split('.').pop()?.toLowerCase() ?? '' : '';
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
    const isPdf   = ext === 'pdf';

    return (
      <div className="flex flex-col gap-2">
        <input
          type="url"
          {...base}
          placeholder={field.placeholder || 'Paste external URL or upload a file below'}
        />
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
          — or upload any file (PDF, Word, image, audio, video… max 50 MB) —
        </div>
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="*"
            className="form-control form-control-sm"
            disabled={uploading}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setUploading(true);
              try {
                const fd = new FormData();
                fd.append('file', file);
                const res = await fetch('/api/cloudinary/upload', {
                  method: 'POST',
                  body: fd,
                });
                const data = await res.json();
                if (res.ok && data.secure_url) {
                  onChange({ target: { name: field.key, value: data.secure_url } });
                } else {
                  alert(data.error || 'File upload failed');
                }
              } catch (err: any) {
                alert('Upload error: ' + err.message);
              } finally {
                setUploading(false);
              }
            }}
          />
          {uploading && <span className="text-sm text-muted">Uploading to Cloudinary…</span>}
        </div>
        {isCloudinaryFile && value && (
          <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
            {isImage ? (
              <img src={value} alt="Preview" style={{ maxWidth: 100, maxHeight: 70, objectFit: 'cover', borderRadius: 4 }} />
            ) : (
              <span style={{ fontSize: 20 }}>
                {isPdf ? '📄' : '📁'}
              </span>
            )}
            <a href={value} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12 }}>Preview / Download</a>
          </div>
        )}
      </div>
    );
  }

  return <input type={field.type || 'text'} {...base} />;
}

export default function ContentTableClient({ table: propTable }: { table?: string }) {
  const params = useParams();
  const table = propTable || (params?.table as string) || '';
  const schema = SCHEMAS[table];

  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editRow, setEditRow] = useState<any>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState('');
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = useCallback(() => {
    if (!table) return;
    setLoading(true);
    setError('');
    api
      .get(`/${table}`)
      .then(setRows)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [table]);

  useEffect(() => {
    load();
  }, [load]);

  if (!schema)
    return (
      <ProtectedRoute requireAdmin>
        <Layout title="Not Found">
          <p>Unknown section: {table}</p>
        </Layout>
      </ProtectedRoute>
    );

  const openCreate = () => {
    setEditRow(null);
    setForm(emptyForm(schema.fields));
    setSaveErr('');
    setShowModal(true);
  };

  const openEdit = (row: any) => {
    setEditRow(row);
    setForm(Object.fromEntries(schema.fields.map((f: any) => [f.key, row[f.key] ?? ''])));
    setSaveErr('');
    setShowModal(true);
  };

  const handleChange = (e: any) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async (e: any) => {
    e.preventDefault();
    setSaveErr('');
    setSaving(true);
    try {
      if (editRow) {
        await api.put(`/${table}/${editRow.id}`, form);
      } else {
        await api.post(`/${table}`, form);
      }
      setShowModal(false);
      load();
    } catch (err: any) {
      setSaveErr(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this item? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await api.delete(`/${table}/${id}`);
      load();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <Layout title={schema.label}>
        <div className="flex items-center gap-3 mb-4" style={{ marginBottom: 20 }}>
          <h2 style={{ flex: 1, fontSize: 15, fontWeight: 600 }}>
            {rows.length} item{rows.length !== 1 ? 's' : ''}
          </h2>
          <button className="btn btn-primary" onClick={openCreate} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Plus size={16} /> Add {schema.label.replace(/s$/, '')}
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="card">
          {loading ? (
            <div className="empty-state">
              <div className="spinner" />
            </div>
          ) : rows.length === 0 ? (
            <div className="empty-state">
              <h3>No {schema.label.toLowerCase()} yet</h3>
              <p>Click "Add" to create your first entry.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Item</th>
                    <th style={{ width: 140 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td className="text-muted text-sm">{row.id}</td>
                      <td
                        style={{
                          maxWidth: 480,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {schema.preview(row)}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button className="btn btn-ghost btn-sm" onClick={() => openEdit(row)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <Pencil size={14} /> Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            disabled={deleting === row.id}
                            onClick={() => handleDelete(row.id)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                          >
                            {deleting === row.id ? '…' : <><Trash2 size={14} /> Delete</>}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showModal && (
          <div className="admin-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
            <div className="admin-modal">
              <div className="admin-modal-header">
                {editRow ? `Edit ${schema.label.replace(/s$/, '')}` : `New ${schema.label.replace(/s$/, '')}`}
                <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setShowModal(false)}>
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSave}>
                <div className="admin-modal-body">
                  {saveErr && <div className="alert alert-danger">{saveErr}</div>}
                  {schema.fields.map((field: any) => (
                    <div className="form-group" key={field.key}>
                      <label className="form-label">
                        {field.label}
                        {field.required && <span style={{ color: 'var(--danger)' }}> *</span>}
                      </label>
                      <FieldInput field={field} value={form[field.key]} onChange={handleChange} />
                    </div>
                  ))}
                </div>
                <div className="admin-modal-footer">
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? (
                      <>
                        <span className="spinner" /> Saving…
                      </>
                    ) : (
                      'Save'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </Layout>
    </ProtectedRoute>
  );
}
