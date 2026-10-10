import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SabbathGallery from '@/components/SabbathGallery';
import { db } from '@/lib/db';
import {
  missions,
  wordOfTheDay as wordTable,
  announcements as annTable,
  sabbathGallery as galleryTable,
  heroSlides as heroSlidesTable,
  tumsdaDigest as tumsdaDigestTable,
} from '@/lib/schema';
import { eq, asc, desc, and } from 'drizzle-orm';
import Link from 'next/link';
import { Download, FileText, ExternalLink, Calendar, Clock, Bell, Quote, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'TUMSDA Church — Welcome | Seventh-day Adventist, Mombasa Kenya',
  description:
    'Welcome to TUMSDA Church — a vibrant Seventh-day Adventist Sabbath school at the Technical University of Mombasa (TUM), Tudor. Join us for worship, Bible study, choir music, and community missions.',
  keywords: [
    'TUMSDA Church',
    'Seventh-day Adventist Mombasa',
    'SDA church Kenya',
    'church TUM Tudor',
    'Sabbath worship Mombasa',
    'TUMSDA choir',
    'Christian community Mombasa',
  ],
  alternates: {
    canonical: 'https://tumsdachurch.org',
  },
  openGraph: {
    title: 'TUMSDA Church — Welcome | Seventh-day Adventist, Mombasa',
    description:
      'Join TUMSDA Church for Sabbath worship, Bible study, sacred music, and outreach at the Technical University of Mombasa, Kenya.',
    url: 'https://tumsdachurch.org',
    images: [{ url: 'https://tumsdachurch.org/assets/og-image.png', width: 1200, height: 630 }],
  },
};

export const revalidate = 60; // Revalidate every 60 seconds

const DEFAULT_SLIDES = [
  {
    id: 1,
    title: 'WELCOME TO TUMSDA',
    subtitle: 'The Church We Love The Most!',
    imageUrl: '/assets/img/Sabbath.png',
    buttonText: 'Welcome and Worship With Us',
    buttonLink: '#',
  },
  {
    id: 2,
    title: 'Listen to the Heavenly Music',
    subtitle: 'Experience sacred music with the TUMSDA Church Choir',
    imageUrl: '/assets/img/ChurchChoir.png',
    buttonText: 'Listen Now',
    buttonLink: 'https://www.youtube.com/@tumsdachurchchoir',
  },
  {
    id: 3,
    title: 'Strong to Serve',
    subtitle: 'Fellowship and discipleship across all departments',
    imageUrl: '/assets/img/ALO.png',
    buttonText: 'Explore Departments',
    buttonLink: '/departments',
  },
  {
    id: 4,
    title: 'The Bible and the Bible Alone',
    subtitle: 'Guided by sacred Scripture and the Spirit of Prophecy',
    imageUrl: '/assets/img/jpg/church.jpeg',
    buttonText: 'Our Beliefs',
    buttonLink: '/about',
  },
];

export default async function HomePage() {
  let upcomingMission = null;
  let wordOfTheDay = null;
  let announcements: any[] = [];
  let galleryPreview: any[] = [];
  let slides: any[] = [];
  let digest: any = null;

  try {
    // 1. Dynamic Hero Slides from Database
    slides = await db
      .select()
      .from(heroSlidesTable)
      .where(and(eq(heroSlidesTable.page, 'home'), eq(heroSlidesTable.isActive, 1)))
      .orderBy(asc(heroSlidesTable.sortOrder), asc(heroSlidesTable.id));

    // 2. TUMSDA Digest Monthly Publication
    const digestRows = await db
      .select()
      .from(tumsdaDigestTable)
      .where(eq(tumsdaDigestTable.isActive, 1))
      .orderBy(asc(tumsdaDigestTable.sortOrder), desc(tumsdaDigestTable.id))
      .limit(1);
    digest = digestRows[0] || null;

    // 3. Missions, Word of the Day, Announcements, Gallery
    const missionRows = await db
      .select()
      .from(missions)
      .where(eq(missions.isUpcoming, 1))
      .orderBy(asc(missions.sortOrder))
      .limit(1);
    upcomingMission = missionRows[0] || null;

    const wordRows = await db.select().from(wordTable).orderBy(desc(wordTable.id)).limit(1);
    wordOfTheDay = wordRows[0] || null;

    announcements = await db
      .select()
      .from(annTable)
      .orderBy(asc(annTable.sortOrder), desc(annTable.id));

    galleryPreview = await db
      .select()
      .from(galleryTable)
      .orderBy(asc(galleryTable.sortOrder), desc(galleryTable.dateTaken))
      .limit(4);
  } catch (err) {
    console.error('[HomePage DB error]', err);
  }

  const displaySlides = slides.length > 0 ? slides : DEFAULT_SLIDES;

  const formatDate = (d: string | null) => {
    if (!d) return '';
    const date = new Date(d);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      <Header />
      <main>
        {/* Dynamic Hero Section */}
        <section className="hero section py-0">
          <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="6000">
            <div className="carousel-indicators">
              {displaySlides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  data-bs-target="#heroCarousel"
                  data-bs-slide-to={idx}
                  className={idx === 0 ? 'active' : ''}
                  aria-current={idx === 0 ? 'true' : undefined}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
            <div className="carousel-inner">
              {displaySlides.map((slide, idx) => (
                <div key={slide.id || idx} className={`carousel-item ${idx === 0 ? 'active' : ''}`}>
                  <img src={slide.imageUrl || slide.image_url} className="d-block w-100" alt={slide.title} />
                  <div className="carousel-caption hero-caption hero-caption--top text-center">
                    <h1 className="hero-title">{slide.title}</h1>
                    {slide.subtitle && <p className="hero-subtitle">{slide.subtitle}</p>}
                    {slide.buttonText &&
                      (slide.buttonLink && slide.buttonLink.startsWith('http') ? (
                        <a
                          href={slide.buttonLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hero-btn"
                        >
                          {slide.buttonText}
                        </a>
                      ) : slide.buttonLink && slide.buttonLink !== '#' ? (
                        <Link href={slide.buttonLink} className="hero-btn">
                          {slide.buttonText}
                        </Link>
                      ) : (
                        <button className="hero-btn hero-btn-welcome">{slide.buttonText}</button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
            {displaySlides.length > 1 && (
              <>
                <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </>
            )}
          </div>
        </section>

        {/* About Section */}
        <section className="section py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <h2 className="fw-bold mb-3" style={{ color: '#0f2942' }}>About TUMSDA</h2>
                <p className="text-muted mb-3" style={{ lineHeight: 1.7 }}>
                  TUMSDA Church is a Seventh-day Adventist Sabbath school in Ziwani District located at the Technical University of Mombasa (TUM) in Tudor. We nurture a deep love for the Bible and the Spirit of Prophecy (Isaiah 8:20) through study, prayer, and sacred music.
                </p>
                <Link href="/about" className="btn btn-outline-primary px-4 py-2 rounded-pill fw-medium">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="row g-4 mt-3">
              <div className="col-md-6">
                <div className="card elevated-card h-100 border-0 shadow-sm rounded-4 p-3 bg-white">
                  <div className="card-body text-center">
                    <h5 className="card-title fw-bold text-primary mb-3">Our Mission</h5>
                    <p className="text-secondary mb-0 small" style={{ lineHeight: 1.7 }}>
                      To make disciples of all people, communicating the everlasting gospel in the context of the three angels' messages of Revelation 14:6-12, leading them to accept Jesus as personal Saviour and unite with His remnant Church, discipling them to serve Him as Lord and preparing them for His soon return.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card elevated-card h-100 border-0 shadow-sm rounded-4 p-3 bg-white">
                  <div className="card-body text-center">
                    <h5 className="card-title fw-bold text-primary mb-3">Our Vision</h5>
                    <p className="text-secondary mb-0 small" style={{ lineHeight: 1.7 }}>
                      To uphold the distinctive message of the Seventh-day Adventist Church; to aspire to excellence in all aspects of their lives - academic, social and spiritual; to embrace the call to radical discipleship, including a life of missionary service; and to be supportive and respectful to the denomination's leadership while remaining a youth-led Church.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Monthly Publication Spotlight: TUMSDA Digest (Conditional) */}
        {digest && (
          <section className="tumsda-digest-section py-4 my-2">
            <div className="container">
              <div
                className="card border-0 shadow-sm rounded-4 overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fbfd 100%)',
                  border: '1px solid #e3edf7',
                }}
              >
                <div className="row g-0 align-items-center">
                  {/* Left: Magazine / Digest Cover Thumbnail */}
                  <div className="col-lg-4 col-md-5 p-4 text-center d-flex align-items-center justify-content-center bg-light border-end">
                    {digest.coverImageUrl || digest.cover_image_url ? (
                      <div
                        className="shadow-sm rounded-3 overflow-hidden position-relative"
                        style={{ maxWidth: '210px', maxHeight: '270px' }}
                      >
                        <img
                          src={digest.coverImageUrl || digest.cover_image_url}
                          alt={digest.title || 'TUMSDA Digest'}
                          className="w-100 h-100 object-fit-cover rounded-3"
                          style={{ maxHeight: '270px' }}
                        />
                      </div>
                    ) : (
                      <div
                        className="rounded-4 p-4 d-flex flex-column align-items-center justify-content-center text-white shadow-sm"
                        style={{
                          width: '180px',
                          height: '240px',
                          background: 'linear-gradient(135deg, #0f2942 0%, #1e4a74 100%)',
                        }}
                      >
                        <FileText size={44} className="mb-3 text-warning" />
                        <div className="fw-bold text-center small text-uppercase" style={{ letterSpacing: '0.05em' }}>
                          {digest.title || 'TUMSDA Digest'}
                        </div>
                        {digest.edition && (
                          <div className="opacity-75 mt-1 text-center" style={{ fontSize: '0.75rem' }}>
                            {digest.edition}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right: Details & Download Button */}
                  <div className="col-lg-8 col-md-7 p-4 p-lg-5">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span
                        className="badge px-3 py-1.5 rounded-pill fw-semibold text-primary"
                        style={{ backgroundColor: '#e7f1ff', fontSize: '0.8rem' }}
                      >
                        Monthly Article
                      </span>
                      {digest.edition && (
                        <span className="text-muted small fw-medium">
                          • {digest.edition}
                        </span>
                      )}
                    </div>

                    <h3 className="fw-bold mb-3" style={{ color: '#0f2942', fontSize: '1.75rem' }}>
                      {digest.title || 'TUMSDA Digest'}
                    </h3>

                    <p className="text-secondary mb-4 small" style={{ lineHeight: 1.7, maxWidth: '640px' }}>
                      {digest.description ||
                        'Read our monthly spiritual articles, testimonies, department news, and inspirational messages from our worship family.'}
                    </p>

                    <div className="d-flex flex-wrap align-items-center gap-3">
                      <a
                        href={digest.fileUrl || digest.file_url}
                        download={digest.fileName || digest.file_name || 'TUMSDA_Digest.pdf'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-2.5 rounded-pill shadow-sm fw-semibold"
                        style={{ backgroundColor: '#0d6efd', borderColor: '#0d6efd' }}
                      >
                        <Download size={18} />
                        <span>Download Digest</span>
                      </a>

                      <a
                        href={digest.fileUrl || digest.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-secondary d-inline-flex align-items-center gap-2 px-4 py-2.5 rounded-pill fw-medium"
                      >
                        <ExternalLink size={16} />
                        <span>Preview Online</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Spiritual Life, Meetings & Announcements Section */}
        <section className="section py-5 bg-white">
          <div className="container">
            <div className="row g-4">
              {/* Left Column: Word of the Day & Announcements */}
              <div className="col-lg-6 d-flex flex-column gap-4">
                {/* Word of the Day */}
                {wordOfTheDay && (
                  <div
                    className="card border-0 rounded-4 shadow-sm p-4 text-white overflow-hidden position-relative"
                    style={{ background: 'linear-gradient(135deg, #0f2942 0%, #173b5e 100%)' }}
                  >
                    <div className="d-flex align-items-center gap-2 mb-3 text-warning opacity-75">
                      <Quote size={20} />
                      <span className="text-uppercase fw-semibold" style={{ fontSize: '0.8rem', letterSpacing: '0.05em' }}>
                        Word of the Day
                      </span>
                    </div>
                    <blockquote className="mb-3 fs-5 fw-light fst-italic" style={{ lineHeight: 1.6 }}>
                      "{wordOfTheDay.content}"
                    </blockquote>
                    <div className="small fw-semibold text-warning text-end">
                      — {wordOfTheDay.reference}
                    </div>
                  </div>
                )}

                {/* Church Notice Board & Announcements — Collapsible */}
                {announcements.length > 0 && (
                  <div className="card border-0 rounded-4 shadow-sm p-4 bg-light">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <Bell size={20} className="text-primary" />
                      <h4 className="fw-semibold mb-0" style={{ fontSize: '1.2rem', color: '#0f2942' }}>
                        Notice Board &amp; Announcements
                      </h4>
                    </div>
                    <div className="d-flex flex-column gap-2">
                      {announcements.map((ann) => (
                        <details
                          key={ann.id}
                          className="announcement-item bg-white rounded-3 shadow-sm border-start border-4 border-primary overflow-hidden"
                        >
                          <summary className="announcement-summary px-3 py-2 d-flex align-items-center justify-content-between gap-2 fw-semibold text-primary" style={{ cursor: 'pointer', listStyle: 'none', userSelect: 'none' }}>
                            <span>{ann.title}</span>
                            <span className="announcement-chevron ms-auto" aria-hidden="true">&#8964;</span>
                          </summary>
                          <div className="px-3 pb-3 pt-1 small text-muted" style={{ lineHeight: 1.6, borderTop: '1px solid #e9ecef' }}>
                            {ann.content}
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Events & Weekly Gatherings */}
              <div className="col-lg-6 d-flex flex-column gap-4">
                {/* Upcoming Events Box */}
                <div className="card border-0 rounded-4 shadow-sm p-4 bg-light">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <Calendar size={20} className="text-primary" />
                      <h4 className="fw-semibold mb-0" style={{ fontSize: '1.2rem', color: '#0f2942' }}>
                        Upcoming Events
                      </h4>
                    </div>
                    <Link href="/about#calendar" className="btn btn-outline-primary btn-sm rounded-pill px-3">
                      Full Calendar
                    </Link>
                  </div>
                  <p className="text-muted small mb-3">
                    Stay connected with our campus church activities, Sabbath celebrations, and special evangelism programmes.
                  </p>
                  <div className="p-3 bg-white rounded-3 shadow-sm d-flex align-items-center justify-content-between">
                    <div>
                      <div className="fw-semibold text-dark small">Church Calendar &amp; Schedule</div>
                      <div className="text-muted" style={{ fontSize: '0.8rem' }}>Check scheduled events and district programs</div>
                    </div>
                    <Link href="/about#calendar" className="btn btn-sm btn-light border text-primary">
                      View
                    </Link>
                  </div>
                </div>

                {/* Weekly Meetings */}
                <div className="card border-0 rounded-4 shadow-sm p-4 bg-light">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <Clock size={20} className="text-primary" />
                      <h4 className="fw-semibold mb-0" style={{ fontSize: '1.2rem', color: '#0f2942' }}>
                        Weekly Meetings
                      </h4>
                    </div>
                    <Link href="/about#weekly-meetings" className="btn btn-outline-primary btn-sm rounded-pill px-3">
                      View Schedules
                    </Link>
                  </div>
                  <p className="text-muted small mb-3">
                    Join us throughout the week for midweek prayer, vespers fellowship, and choir practice.
                  </p>
                  <div className="p-3 bg-white rounded-3 shadow-sm d-flex align-items-center justify-content-between">
                    <div>
                      <div className="fw-semibold text-dark small">Midweek &amp; Vespers Fellowship</div>
                      <div className="text-muted" style={{ fontSize: '0.8rem' }}>Wednesday prayer meetings &amp; Friday sundown</div>
                    </div>
                    <Link href="/about#weekly-meetings" className="btn btn-sm btn-light border text-primary">
                      Schedules
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sabbath Was Nice — Homepage Collection Cards */}
        <SabbathGallery photos={galleryPreview} previewMode />

        {/* Upcoming Mission Section */}
        <section className="homepage-mission-section">
          <div className="homepage-mission-container">
            <div className="homepage-mission-overlay">
              <div className="homepage-mission-content">
                <h2 className="homepage-mission-title">Upcoming Mission</h2>
                {upcomingMission ? (
                  <>
                    <h1 className="homepage-mission-event">{upcomingMission.title}</h1>
                    <p className="homepage-mission-description">
                      {upcomingMission.description}
                      {upcomingMission.startDate && upcomingMission.endDate && (
                        <>
                          <br />
                          From {formatDate(upcomingMission.startDate)} to {formatDate(upcomingMission.endDate)}
                        </>
                      )}
                    </p>
                  </>
                ) : (
                  <>
                    <h1 className="homepage-mission-event">Stay Tuned for Our Next Mission</h1>
                    <p className="homepage-mission-description">
                      Check back soon for details on our upcoming evangelistic mission.
                    </p>
                  </>
                )}
                <div className="homepage-mission-buttons">
                  <Link href="/evangelism#missionAccordion" className="homepage-mission-btn">
                    Find More
                  </Link>
                  <button className="homepage-mission-btn support-btn">Support</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
