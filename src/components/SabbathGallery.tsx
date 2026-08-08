'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react';

interface Photo {
  id: number;
  image_url?: string;
  imageUrl?: string;
  title?: string | null;
  date_taken?: string | null;
  dateTaken?: string | null;
}

interface Props {
  photos: Photo[];
  /** If true, renders a compact 4-photo preview strip (for home page) */
  previewMode?: boolean;
}

export default function SabbathGallery({ photos, previewMode = false }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  if (photos.length === 0 && !previewMode) return null;
  if (photos.length === 0 && previewMode) return null;

  const getUrl = (p: Photo) => p.image_url || p.imageUrl || '';
  const getTitle = (p: Photo) => p.title || '';
  const getDate = (p: Photo) => {
    const d = p.date_taken || p.dateTaken;
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const openLightbox = (idx: number) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);
  const prev = () => setLightboxIdx((i) => (i === null ? 0 : (i - 1 + photos.length) % photos.length));
  const next = () => setLightboxIdx((i) => (i === null ? 0 : (i + 1) % photos.length));

  // ── PREVIEW MODE (home page strip) ──────────────────────────────────
  if (previewMode) {
    const slice = photos.slice(0, 4);
    return (
      <section className="sabbath-preview-section">
        <div className="container">
          <div className="sabbath-preview-header">
            <div>
              <h3 className="sabbath-preview-title">Sabbath Was Nice</h3>
              <p className="sabbath-preview-sub">Moments from our worship family</p>
            </div>
            <Link href="/leadership#sabbath-gallery" className="sabbath-preview-link">
              View Gallery <Images size={16} style={{ marginLeft: 4 }} />
            </Link>
          </div>
          <div className="sabbath-preview-grid">
            {slice.map((photo, idx) => (
              <div key={photo.id} className="sabbath-preview-item">
                <img
                  src={getUrl(photo)}
                  alt={getTitle(photo) || `Sabbath photo ${idx + 1}`}
                  className="sabbath-preview-img"
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                {getTitle(photo) && (
                  <div className="sabbath-preview-caption">{getTitle(photo)}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ── FULL GALLERY MODE (leadership page) ─────────────────────────────
  return (
    <section className="sabbath-gallery-section" id="sabbath-gallery">
      <div className="sabbath-gallery-hero">
        <div className="sabbath-gallery-hero-overlay">
          <h2 className="sabbath-gallery-hero-title">Sabbath Was Nice 📸</h2>
          <p className="sabbath-gallery-hero-sub">
            A collection of our Sabbath pictures capturing precious moments of worship,
            fellowship, and spiritual growth that define our church family's journey together.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="sabbath-gallery-grid">
          {photos.map((photo, idx) => (
            <div
              key={photo.id}
              className="sabbath-gallery-item"
              onClick={() => openLightbox(idx)}
              role="button"
              tabIndex={0}
              aria-label={getTitle(photo) || `Photo ${idx + 1}`}
              onKeyDown={(e) => e.key === 'Enter' && openLightbox(idx)}
            >
              <img
                src={getUrl(photo)}
                alt={getTitle(photo) || `Sabbath photo ${idx + 1}`}
                className="sabbath-gallery-img"
                loading="lazy"
                onError={(e) => {
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent) parent.style.display = 'none';
                }}
              />
              <div className="sabbath-gallery-overlay">
                {getTitle(photo) && <span className="sabbath-gallery-caption">{getTitle(photo)}</span>}
                {getDate(photo) && <span className="sabbath-gallery-date">{getDate(photo)}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightboxIdx !== null && (
        <div
          className="sabbath-lightbox"
          onClick={(e) => e.target === e.currentTarget && closeLightbox()}
          role="dialog"
          aria-modal="true"
        >
          <button className="sabbath-lightbox-close" onClick={closeLightbox} aria-label="Close">
            <X size={24} />
          </button>

          {photos.length > 1 && (
            <>
              <button className="sabbath-lightbox-nav sabbath-lightbox-prev" onClick={prev} aria-label="Previous">
                <ChevronLeft size={32} />
              </button>
              <button className="sabbath-lightbox-nav sabbath-lightbox-next" onClick={next} aria-label="Next">
                <ChevronRight size={32} />
              </button>
            </>
          )}

          <div className="sabbath-lightbox-content">
            <img
              src={getUrl(photos[lightboxIdx])}
              alt={getTitle(photos[lightboxIdx]) || `Photo ${lightboxIdx + 1}`}
              className="sabbath-lightbox-img"
            />
            {(getTitle(photos[lightboxIdx]) || getDate(photos[lightboxIdx])) && (
              <div className="sabbath-lightbox-info">
                {getTitle(photos[lightboxIdx]) && (
                  <span className="sabbath-lightbox-title">{getTitle(photos[lightboxIdx])}</span>
                )}
                {getDate(photos[lightboxIdx]) && (
                  <span className="sabbath-lightbox-date">{getDate(photos[lightboxIdx])}</span>
                )}
              </div>
            )}
            <div className="sabbath-lightbox-counter">
              {lightboxIdx + 1} / {photos.length}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
