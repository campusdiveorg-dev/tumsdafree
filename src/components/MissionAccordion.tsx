'use client';

import { useState } from 'react';
import { getImageUrl } from '@/lib/cloudinaryUrl';

interface MissionItem {
  id: number;
  title: string;
  // camelCase (Drizzle ORM) OR snake_case (raw pool) — accept both
  themeText?: string | null;
  theme_text?: string | null;
  themeVerse?: string | null;
  theme_verse?: string | null;
  themeSong?: string | null;
  theme_song?: string | null;
  startDate?: string | null;
  start_date?: string | null;
  endDate?: string | null;
  end_date?: string | null;
  description?: string | null;
  isUpcoming?: number | null;
  is_upcoming?: number | null;
  cloudinarySecureUrl?: string | null;
  cloudinary_secure_url?: string | null;
}

export default function MissionAccordion({ missions }: { missions: MissionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // helpers to read either camelCase or snake_case
  const g = (m: MissionItem, camel: keyof MissionItem, snake: keyof MissionItem) =>
    m[camel] ?? m[snake] ?? null;

  const formatDateShort = (d: string | null) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const formatDateFull = (d: string | null) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="mission-accordion" id="missionAccordion">
      {missions.map((mission, index) => {
        const isOpen = openIndex === index;
        const startDate = g(mission, 'startDate', 'start_date') as string | null;
        const endDate   = g(mission, 'endDate',   'end_date')   as string | null;
        const themeText = g(mission, 'themeText', 'theme_text') as string | null;
        const themeVerse = g(mission, 'themeVerse', 'theme_verse') as string | null;
        const themeSong  = g(mission, 'themeSong',  'theme_song')  as string | null;
        const isUpcoming = Number(g(mission, 'isUpcoming', 'is_upcoming') ?? 0);

        return (
          <div className={`mission-accordion-item ${isOpen ? 'active' : ''}`} key={mission.id}>
            <button
              className="mission-accordion-header"
              type="button"
              onClick={() => toggleAccordion(index)}
              aria-expanded={isOpen}
            >
              <span className="mission-accordion-left">
                {isUpcoming ? (
                  <span className="mission-badge upcoming">UPCOMING</span>
                ) : (
                  <span className="mission-badge past">PAST</span>
                )}
                <span className="mission-accordion-title">{mission.title}</span>
              </span>
              {startDate && endDate && (
                <span className="mission-accordion-date">
                  <i className="fas fa-calendar-alt me-1"></i>
                  {formatDateShort(startDate)} – {formatDateShort(endDate)}
                </span>
              )}
              <span className="mission-accordion-chevron">
                <i className="fas fa-chevron-down"></i>
              </span>
            </button>

            <div
              className="mission-accordion-collapse"
              id={`mission-collapse-${index}`}
              style={{ display: isOpen ? 'block' : 'none' }}
            >
              <div className="mission-accordion-body">
                {(mission.cloudinarySecureUrl || mission.cloudinary_secure_url) && (
                  <div style={{ marginBottom: 20, textAlign: 'center' }}>
                    <img
                      src={getImageUrl(mission, { width: 900 })}
                      alt={mission.title}
                      style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 8, objectFit: 'cover' }}
                    />
                  </div>
                )}
                {(themeText || themeVerse || themeSong) && (
                  <div className="mission-theme-banner">
                    <div className="mission-theme-inner">
                      <h3 className="mission-theme-title">{mission.title}</h3>
                      {themeText && <p className="mission-theme-text">{themeText}</p>}
                      <div className="mission-theme-meta">
                        {themeVerse && (
                          <span className="mission-meta-tag">
                            <i className="fas fa-book-open me-1"></i>
                            {themeVerse}
                          </span>
                        )}
                        {themeSong && (
                          <span className="mission-meta-tag">
                            <i className="fas fa-music me-1"></i>
                            {themeSong}
                          </span>
                        )}
                        {startDate && endDate && (
                          <span className="mission-meta-tag">
                            <i className="fas fa-calendar-alt me-1"></i>
                            {formatDateFull(startDate)} – {formatDateFull(endDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {mission.description && (
                  <div className="mission-description-section">
                    <div className="mission-description-card">
                      <div className="mission-desc-icon">
                        <i className="fas fa-globe-africa"></i>
                      </div>
                      <p>{mission.description}</p>
                    </div>
                  </div>
                )}

                {Boolean(isUpcoming) && (
                  <div className="mission-cta-section">
                    <div className="mission-cta-card">
                      <div className="mission-cta-icon">
                        <i className="fas fa-hands-helping"></i>
                      </div>
                      <h4>Join Us in This Mission</h4>
                      <p>
                        We warmly invite every member and friend of TUMSDA to take part in this mission — whether by
                        going with us physically, giving in support (financial or material), or standing with us in
                        prayer.
                      </p>
                      <div className="mission-cta-buttons">
                        <a
                          href="https://whatsapp.com/channel/0029Vb5zZEjBKfi4xoxGlI25"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-mission primary"
                        >
                          <i className="fab fa-whatsapp me-2"></i>Join Us
                        </a>
                        <button className="btn-mission outline support-btn">
                          <i className="fas fa-hand-holding-heart me-2"></i>Support
                        </button>
                        <button className="btn-mission outline mission-chair-btn">
                          <i className="fas fa-user-tie me-2"></i>Mission Chair
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
