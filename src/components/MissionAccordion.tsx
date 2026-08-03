'use client';

import { useState } from 'react';

interface MissionItem {
  id: number;
  title: string;
  themeText?: string | null;
  themeVerse?: string | null;
  themeSong?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  description?: string | null;
  isUpcoming: number;
}

export default function MissionAccordion({ missions }: { missions: MissionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
        return (
          <div className={`mission-accordion-item ${isOpen ? 'active' : ''}`} key={mission.id}>
            <button
              className="mission-accordion-header"
              type="button"
              onClick={() => toggleAccordion(index)}
              aria-expanded={isOpen}
            >
              <span className="mission-accordion-left">
                {mission.isUpcoming ? (
                  <span className="mission-badge upcoming">UPCOMING</span>
                ) : (
                  <span className="mission-badge past">PAST</span>
                )}
                <span className="mission-accordion-title">{mission.title}</span>
              </span>
              {mission.startDate && mission.endDate && (
                <span className="mission-accordion-date">
                  <i className="fas fa-calendar-alt me-1"></i>
                  {formatDateShort(mission.startDate)} – {formatDateShort(mission.endDate)}
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
                {(mission.themeText || mission.themeVerse || mission.themeSong) && (
                  <div className="mission-theme-banner">
                    <div className="mission-theme-inner">
                      <h3 className="mission-theme-title">{mission.title}</h3>
                      {mission.themeText && <p className="mission-theme-text">{mission.themeText}</p>}
                      <div className="mission-theme-meta">
                        {mission.themeVerse && (
                          <span className="mission-meta-tag">
                            <i className="fas fa-book-open me-1"></i>
                            {mission.themeVerse}
                          </span>
                        )}
                        {mission.themeSong && (
                          <span className="mission-meta-tag">
                            <i className="fas fa-music me-1"></i>
                            {mission.themeSong}
                          </span>
                        )}
                        {mission.startDate && mission.endDate && (
                          <span className="mission-meta-tag">
                            <i className="fas fa-calendar-alt me-1"></i>
                            {formatDateFull(mission.startDate)} – {formatDateFull(mission.endDate)}
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

                {Boolean(mission.isUpcoming) && (
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
