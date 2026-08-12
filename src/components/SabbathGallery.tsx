'use client';

import { useState } from 'react';
import {
  X,
  Images,
  Crown,
  Users,
  User,
  GraduationCap,
  Gem,
  Calendar,
  ExternalLink,
} from 'lucide-react';

export interface GalleryCollection {
  id: number | string;
  title?: string | null;
  image_url?: string | null;
  imageUrl?: string | null;
  link_url?: string | null;
  linkUrl?: string | null;
  icon?: string | null;
  date_taken?: string | null;
  dateTaken?: string | null;
}

interface Props {
  photos?: GalleryCollection[];
  /** If true, renders collection cards grid for the homepage */
  previewMode?: boolean;
}

// Default seed collections matching screenshots including Normal Sabbath
const DEFAULT_COLLECTIONS: GalleryCollection[] = [
  {
    id: 'seed-0',
    title: 'Normal Sabbath',
    icon: 'calendar',
    image_url: '/assets/img/Sabbath.png',
    link_url: 'https://drive.google.com/',
  },
  {
    id: 'seed-1',
    title: 'Finalist Sabbath 2025',
    icon: 'crown',
    image_url: '/assets/img/ChurchChoir.png',
    link_url: 'https://drive.google.com/',
  },
  {
    id: 'seed-2',
    title: 'CUCASO 2025',
    icon: 'users',
    image_url: '/assets/img/ALO.png',
    link_url: 'https://drive.google.com/',
  },
  {
    id: 'seed-3',
    title: 'ALO Sabbath 2024',
    icon: 'user',
    image_url: '/assets/img/jpg/church.jpeg',
    link_url: 'https://drive.google.com/',
  },
  {
    id: 'seed-4',
    title: 'ALUMNI Sabbath 2024',
    icon: 'users',
    image_url: '/assets/img/icon2.png',
    link_url: 'https://drive.google.com/',
  },
  {
    id: 'seed-5',
    title: "Graduates' Sabbath 2024",
    icon: 'graduation-cap',
    image_url: '/assets/img/TUMSDA.png',
    link_url: 'https://drive.google.com/',
  },
  {
    id: 'seed-6',
    title: "Jewel's Sabbath 2024",
    icon: 'gem',
    image_url: '/assets/img/Sabbath.png',
    link_url: 'https://drive.google.com/',
  },
];

function getIconComponent(iconName?: string | null) {
  switch (iconName?.toLowerCase()) {
    case 'calendar':
    case 'sabbath':
    case 'normal':
      return <Calendar size={18} className="text-primary flex-shrink-0" />;
    case 'crown':
      return <Crown size={18} className="text-primary flex-shrink-0" />;
    case 'user':
      return <User size={18} className="text-primary flex-shrink-0" />;
    case 'graduation-cap':
    case 'graduation_cap':
    case 'cap':
      return <GraduationCap size={18} className="text-primary flex-shrink-0" />;
    case 'gem':
    case 'jewel':
      return <Gem size={18} className="text-primary flex-shrink-0" />;
    case 'users':
    default:
      return <Users size={18} className="text-primary flex-shrink-0" />;
  }
}

export default function SabbathGallery({ photos = [], previewMode = false }: Props) {
  const [showModal, setShowModal] = useState(false);

  // Merge DB photos with seed collections if DB entries lack links/titles
  const collections: GalleryCollection[] =
    photos.length > 0
      ? photos.map((p, idx) => ({
          id: p.id || `photo-${idx}`,
          title: p.title || DEFAULT_COLLECTIONS[idx % DEFAULT_COLLECTIONS.length].title,
          image_url: p.image_url || p.imageUrl || DEFAULT_COLLECTIONS[idx % DEFAULT_COLLECTIONS.length].image_url,
          link_url: p.link_url || p.linkUrl || DEFAULT_COLLECTIONS[idx % DEFAULT_COLLECTIONS.length].link_url || 'https://drive.google.com/',
          icon: p.icon || DEFAULT_COLLECTIONS[idx % DEFAULT_COLLECTIONS.length].icon,
        }))
      : DEFAULT_COLLECTIONS;

  const handleCollectionClick = (url?: string | null) => {
    const targetUrl = url || 'https://drive.google.com/';
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  // ── HOMEPAGE PREVIEW MODE (Box Cards with Image Top & Icon/Title Below) ──
  if (previewMode) {
    // Show 4 collection boxes side by side
    const displayCollections = collections.slice(0, 4);

    return (
      <section className="sabbath-preview-section py-4">
        <div className="container">
          <div className="sabbath-preview-header d-flex align-items-center justify-content-between mb-3">
            <div>
              <h3 className="sabbath-preview-title fw-bold mb-1" style={{ color: '#0f2942', fontSize: '1.5rem' }}>
                Sabbath Was Nice
              </h3>
              <p className="sabbath-preview-sub text-muted mb-0 small">Moments from our worship family</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-link text-decoration-none sabbath-preview-link fw-semibold text-primary d-inline-flex align-items-center gap-1 p-0"
              style={{ color: '#0d6efd', fontSize: '0.95rem' }}
            >
              View Gallery <Images size={16} />
            </button>
          </div>

          {/* 4 Box Grid Layout with Image Top & White Footer Below */}
          <div className="row g-3">
            {displayCollections.map((item) => {
              const img = item.image_url || item.imageUrl || '/assets/img/Sabbath.png';
              return (
                <div key={item.id} className="col-6 col-md-3">
                  <div
                    className="sabbath-card-box rounded-4 shadow-sm border overflow-hidden bg-white cursor-pointer h-100 d-flex flex-column transition-all"
                    onClick={() => handleCollectionClick(item.link_url || item.linkUrl)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleCollectionClick(item.link_url || item.linkUrl)}
                  >
                    <div className="sabbath-card-img-wrapper position-relative w-100 overflow-hidden" style={{ height: '150px' }}>
                      <img
                        src={img}
                        alt={item.title || 'Sabbath Collection'}
                        className="sabbath-card-img w-100 h-100 object-fit-cover"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/assets/img/Sabbath.png';
                        }}
                      />
                    </div>
                    {/* Icon and Collection Title below the image */}
                    <div className="sabbath-card-body p-3 bg-white d-flex align-items-center justify-content-between flex-grow-1 border-top">
                      <div className="d-flex align-items-center gap-2 overflow-hidden">
                        {getIconComponent(item.icon)}
                        <span className="fw-semibold text-dark small text-truncate" style={{ fontSize: '0.88rem' }}>
                          {item.title}
                        </span>
                      </div>
                      <ExternalLink size={15} className="text-muted flex-shrink-0 ms-1" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Popup */}
        {showModal && (
          <CollectionsModal collections={collections} onClose={() => setShowModal(false)} />
        )}
      </section>
    );
  }

  // ── LEADERSHIP PAGE HERO BANNER MODE ──────────────────────────────────────
  return (
    <section className="sabbath-blue-strip-section my-4" id="sabbath-gallery">
      <div className="container">
        <div className="sabbath-blue-banner position-relative overflow-hidden rounded-4 p-4 p-md-5 text-center text-white shadow-lg">
          <div className="position-relative z-1 max-w-700 mx-auto">
            <h2 className="sabbath-banner-title fw-bold fs-2 mb-2">Sabbath Was Nice Gallery</h2>
            <p className="sabbath-banner-subtitle fs-6 text-white-90 mb-4 font-body">
              A collection of our Sabbath pictures capturing precious moments of worship, fellowship, and
              spiritual growth that define our church family's journey together.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="btn sabbath-banner-btn bg-white text-primary fw-bold rounded-pill px-4 py-2 shadow-sm d-inline-flex align-items-center gap-2 hover-scale"
            >
              <Images size={18} className="text-primary" /> View Gallery
            </button>
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <CollectionsModal collections={collections} onClose={() => setShowModal(false)} />
      )}
    </section>
  );
}

// ── COMPACT COLLECTIONS MODAL POPUP ──────────────────────────────────────────
function CollectionsModal({
  collections,
  onClose,
}: {
  collections: GalleryCollection[];
  onClose: () => void;
}) {
  return (
    <div
      className="sabbath-modal-backdrop position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      style={{ zIndex: 1060, backgroundColor: 'rgba(0, 0, 0, 0.55)', backdropFilter: 'blur(3px)' }}
    >
      <div className="sabbath-compact-modal bg-white rounded-4 shadow-lg p-4 position-relative animate-pop-in">
        {/* Floating Red Circular Close Button inside top-right corner */}
        <button
          onClick={onClose}
          className="sabbath-modal-close btn-close-red d-flex align-items-center justify-content-center rounded-circle border-0 text-white shadow-sm"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Modal Title with Blue Underline Accent */}
        <div className="text-center mb-3 pt-1">
          <h4 className="sabbath-modal-title fw-bold text-primary mb-1" style={{ fontSize: '1.4rem' }}>
            Sabbath Gallery <span className="sabbath-modal-title-accent">Collections</span>
          </h4>
          <div className="sabbath-title-underline mx-auto mb-2" style={{ width: '40px', height: '3px' }} />
          <p className="sabbath-modal-subtitle text-muted small mb-0 px-2">
            Explore our collection of Sabbath photos from various special events and celebrations throughout the year.
          </p>
        </div>

        {/* Scrollable Collection Buttons */}
        <div className="sabbath-collections-list d-flex flex-column gap-2.5 pe-1">
          {collections.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                const targetUrl = item.link_url || item.linkUrl || 'https://drive.google.com/';
                window.open(targetUrl, '_blank', 'noopener,noreferrer');
              }}
              className="btn sabbath-collection-btn d-flex align-items-center justify-content-between px-3 py-2.5 rounded-3 border-0 text-white shadow-sm transition-all"
            >
              <div className="d-flex align-items-center gap-2.5 overflow-hidden">
                {getIconComponent(item.icon)}
                <span className="fw-semibold small text-white text-start text-truncate">{item.title}</span>
              </div>
              <ExternalLink size={15} className="text-white-50 flex-shrink-0 ms-2" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
