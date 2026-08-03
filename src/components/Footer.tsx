'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SupportForm from './SupportForm';

export default function Footer() {
  const pathname = usePathname();
  const [activePopup, setActivePopup] = useState<string | null>(null);

  // Bind global event listeners for buttons that open popups (e.g. from page content)
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.support-btn')) {
        e.preventDefault();
        setActivePopup('support');
      } else if (target.closest('.mission-chair-btn')) {
        e.preventDefault();
        setActivePopup('missionChair');
      } else if (target.closest('.gallery-btn')) {
        e.preventDefault();
        setActivePopup('gallery');
      } else if (target.closest('.contact-btn')) {
        e.preventDefault();
        setActivePopup('contact');
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="site-footer">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="footer-section">
                <p className="footer-official-statement">
                  tumsda.org is the official website of the Seventh-day Adventist Church, Technical University of Mombasa.
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="footer-section">
                <div className="footer-legal-links">
                  <a
                    href="https://adventist.org/trademark-and-logo-usage"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="legal-item"
                  >
                    <div className="legal-bars">
                      <div className="legal-bar legal-bar-1"></div>
                      <div className="legal-bar legal-bar-2"></div>
                      <div className="legal-bar legal-bar-3"></div>
                    </div>
                    <span>TRADEMARK AND LOGO USAGE</span>
                  </a>
                  <a
                    href="https://adventist.org/legal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="legal-item"
                  >
                    <div className="legal-bars">
                      <div className="legal-bar legal-bar-1"></div>
                      <div className="legal-bar legal-bar-2"></div>
                      <div className="legal-bar legal-bar-3"></div>
                    </div>
                    <span>LEGAL NOTICE</span>
                  </a>
                  <a
                    href="https://privacy.adventist.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="legal-item"
                  >
                    <div className="legal-bars">
                      <div className="legal-bar legal-bar-1"></div>
                      <div className="legal-bar legal-bar-2"></div>
                      <div className="legal-bar legal-bar-3"></div>
                    </div>
                    <span>PRIVACY POLICY</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-copyright-section">
            <p className="footer-copyright">&copy; {currentYear} Technical University of Mombasa SDA Church.</p>
            <p className="footer-address">Tom Mboya Street Tudor, Msa. P.O Box 90420-80100 MSA Kenya</p>
          </div>
        </div>
      </footer>

      {/* Support Popup Card */}
      <div id="supportPopup" className={`popup-overlay ${activePopup === 'support' ? 'active' : ''}`}>
        <div className="popup-card">
          <button className="popup-close" id="supportClose" onClick={() => setActivePopup(null)}>
            &times;
          </button>
          <div className="popup-content">
            <h3>Support</h3>
            <p>Little is much when God is in it. Support our mission through M-Pesa STK Push:</p>

            <SupportForm />

            <div className="mt-4 text-muted small">
              <p>
                Or use Till Number: <strong>3482464</strong> (Name: RHODA MUTANU)
              </p>
            </div>

            <p className="mt-3">
              <strong>Thank You! May God Bless You Abundantly!</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Mission Chair Popup Card */}
      <div id="missionChairPopup" className={`popup-overlay ${activePopup === 'missionChair' ? 'active' : ''}`}>
        <div className="popup-card">
          <button className="popup-close" id="missionChairClose" onClick={() => setActivePopup(null)}>
            &times;
          </button>
          <div className="popup-content">
            <h3>Mission Chair Message</h3>
            <div className="mission-chair-message">
              <p>
                As we prepare for this year's mission in Challa, my heart is filled with anticipation and prayer. Each
                mission is more than a program; it is an opportunity to touch lives for eternity.
              </p>
              <p>
                I urge you, my brothers and sisters, to partner with us in any way you can. Come with us to the field if
                you are able. If you cannot, support with your resources. And above all, remember to pray for the
                mission.
              </p>
              <p>Let us go to Challa with one voice, one heart, and one mission: to proclaim the soon return of Jesus.</p>
            </div>
            <div className="mission-chair-signature">
              <p>
                <strong>Daniel Mochoge</strong>
                <br />
                Mission Chair
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sabbath Gallery Popup Card */}
      <div id="galleryPopup" className={`popup-overlay ${activePopup === 'gallery' ? 'active' : ''}`}>
        <div className="popup-card">
          <button className="popup-close" id="galleryClose" onClick={() => setActivePopup(null)}>
            &times;
          </button>
          <div className="popup-content">
            <h3>Sabbath Gallery Collections</h3>
            <p className="text-muted mb-4">
              Explore our collection of Sabbath photos from various special events and celebrations throughout the
              year.
            </p>
            <div className="gallery-links-grid">
              <a
                href="https://photos.app.goo.gl/PUo6c4YmVQ3y2vvx6"
                target="_blank"
                rel="noopener noreferrer"
                className="gallery-link"
              >
                <i className="fas fa-crown"></i>
                <span>Finalist Sabbath 2025</span>
              </a>
              <a
                href="https://photos.app.goo.gl/UjttHTMwkvJ6Z7F18"
                target="_blank"
                rel="noopener noreferrer"
                className="gallery-link"
              >
                <i className="fas fa-users"></i>
                <span>CUCASO 2025</span>
              </a>
              <a
                href="https://photos.app.goo.gl/DBQUrjHioUXGJf6H8"
                target="_blank"
                rel="noopener noreferrer"
                className="gallery-link"
              >
                <i className="fas fa-female"></i>
                <span>ALO Sabbath 2024</span>
              </a>
              <a
                href="https://photos.app.goo.gl/sHDiLWxWK4cU5fcb9"
                target="_blank"
                rel="noopener noreferrer"
                className="gallery-link"
              >
                <i className="fas fa-users"></i>
                <span>ALUMNI Sabbath 2024</span>
              </a>
              <a
                href="https://photos.app.goo.gl/iJLVVn3DaYG5jkP96"
                target="_blank"
                rel="noopener noreferrer"
                className="gallery-link"
              >
                <i className="fas fa-graduation-cap"></i>
                <span>Graduates' Sabbath 2024</span>
              </a>
              <a
                href="https://photos.app.goo.gl/o1GsUc6vFgjYFKwYA"
                target="_blank"
                rel="noopener noreferrer"
                className="gallery-link"
              >
                <i className="fas fa-gem"></i>
                <span>Jewel's Sabbath 2024</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Us Popup Card */}
      <div id="contactPopup" className={`popup-overlay ${activePopup === 'contact' ? 'active' : ''}`}>
        <div className="popup-card">
          <button className="popup-close" id="contactClose" onClick={() => setActivePopup(null)}>
            &times;
          </button>
          <div className="popup-content">
            <h3>Contact Us</h3>
            <p>Get in touch with us for any questions, prayer requests, or to learn more about our church family.</p>
            <div className="contact-info-grid">
              <div className="contact-info-item">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <h5>Location</h5>
                  <p>
                    Tom Mboya Street Tudor, Msa
                    <br />
                    P.O Box 90420-80100 MSA Kenya
                  </p>
                </div>
              </div>
              <div className="contact-info-item">
                <i className="fas fa-phone"></i>
                <div>
                  <h5>Phone</h5>
                  <p>
                    <a href="tel:+254712345678">+254712345678</a>
                  </p>
                </div>
              </div>
              <div className="contact-info-item">
                <i className="fas fa-envelope"></i>
                <div>
                  <h5>Email</h5>
                  <p>
                    <a href="mailto:tumsda@gmail.com">tumsda@gmail.com</a>
                  </p>
                </div>
              </div>
              <div className="contact-info-item">
                <i className="fas fa-clock"></i>
                <div>
                  <h5>Service Times</h5>
                  <p>
                    Sabbath School: 9:00 AM
                    <br />
                    Divine Service: 11:00 AM
                  </p>
                </div>
              </div>
            </div>
            <div className="contact-cta">
              <Link href="/leadership#contact" className="btn btn-primary" onClick={() => setActivePopup(null)}>
                Send Message
              </Link>
              <a
                href="https://whatsapp.com/channel/0029Vb5zZEjBKfi4xoxGlI25"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
