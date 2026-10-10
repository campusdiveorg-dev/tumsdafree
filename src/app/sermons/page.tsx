import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { db } from '@/lib/db';
import { resources as resourcesTable, heroSlides as heroSlidesTable } from '@/lib/schema';
import { asc, eq, and } from 'drizzle-orm';

// Static fallback resources shown when the DB table is empty
const STATIC_RESOURCES = [
  {
    id: 's1',
    title: 'Sabbath School Lessons',
    description: 'Weekly Bible study lessons and materials',
    iconPath: '/assets/SS.png',
    cloudinarySecureUrl: null,
    linkUrl: 'https://absg.sspmadventist.org/en/2025-03/11/videos',
    linkLabel: 'Access Lessons',
  },
  {
    id: 's2',
    title: 'Bible Study Guides',
    description: 'Comprehensive Bible study resources',
    iconPath: '/assets/BS.jpeg',
    cloudinarySecureUrl: null,
    linkUrl: 'https://adventist.org/beliefs/bible/study',
    linkLabel: 'Study Bible',
  },
  {
    id: 's3',
    title: 'Bible Study & Prayer',
    description: 'Interactive Bible study and prayer resources',
    iconPath: '/assets/PY.jpg',
    cloudinarySecureUrl: null,
    linkUrl: 'https://sspmadventist.org/sabbathschool/alive/biblestudyandprayer',
    linkLabel: 'Study & Pray',
  },
  {
    id: 's4',
    title: 'Adventist Beliefs',
    description: 'Official Adventist beliefs and doctrines',
    iconPath: '/assets/AB.png',
    cloudinarySecureUrl: null,
    linkUrl: 'https://adventist.org/beliefs',
    linkLabel: 'Learn Beliefs',
  },
  {
    id: 's5',
    title: 'Music Philosophy',
    description: 'Seventh-day Adventist philosophy of music and worship',
    iconPath: '/assets/MP.png',
    cloudinarySecureUrl: null,
    linkUrl: 'https://gc.adventist.org/guidelines/a-seventh-day-adventist-philosophy-of-music/',
    linkLabel: 'Read Philosophy',
  },
  {
    id: 's6',
    title: 'Young Adults',
    description: 'Resources and studies for young adults',
    iconPath: '/assets/YA.jpg',
    cloudinarySecureUrl: null,
    linkUrl: 'https://inverse.sspmadventist.org/',
    linkLabel: 'Join Young Adults',
  },
  {
    id: 's7',
    title: 'Adventist Pioneer Library',
    description: 'Historical writings and pioneer literature',
    iconPath: '/assets/AP.png',
    cloudinarySecureUrl: null,
    linkUrl: 'https://m.egwwritings.org/en/folders/15',
    linkLabel: 'Explore Library',
  },
  {
    id: 's8',
    title: 'EGW Writings',
    description: 'Complete collection of Ellen G. White writings',
    iconPath: '/assets/EGW.png',
    cloudinarySecureUrl: null,
    linkUrl: 'https://m.egwwritings.org/en/folders/2',
    linkLabel: 'Read Writings',
  },
  {
    id: 's9',
    title: 'Adventist Archives',
    description: 'Historical documents and research materials',
    iconPath: '/assets/AA.jpeg',
    cloudinarySecureUrl: null,
    linkUrl: 'https://www.adventistarchives.org/',
    linkLabel: 'Browse Archives',
  },
];

export const metadata: Metadata = {
  title: 'Sermons & Resources — Bible Messages & Study Materials',
  description:
    'Access TUMSDA Church sermons, Bible study guides, and spiritual resources. Watch past messages on YouTube and download study materials to deepen your faith journey.',
  keywords: [
    'TUMSDA sermons',
    'SDA sermons Kenya',
    'Seventh-day Adventist sermons Mombasa',
    'Bible study resources',
    'TUMSDA YouTube',
    'church sermons online Kenya',
    'Adventist Bible study materials',
    'spiritual resources Kenya',
  ],
  alternates: {
    canonical: 'https://tumsdachurch.org/sermons',
  },
  openGraph: {
    title: 'TUMSDA Sermons & Resources | Bible Messages from Mombasa SDA',
    description:
      'Watch TUMSDA Church sermons on YouTube and access Bible study guides. Inspiring messages rooted in Scripture from our Mombasa community.',
    url: 'https://tumsdachurch.org/sermons',
    images: [{ url: 'https://tumsdachurch.org/assets/og-image.png', width: 1200, height: 630 }],
  },
};

export const revalidate = 60;


export default async function SermonsPage() {
  let dbResources: any[] = [];
  let heroBanner: string | null = null;
  try {
    dbResources = await db.select().from(resourcesTable).orderBy(asc(resourcesTable.sortOrder));
    const bannerRows = await db
      .select()
      .from(heroSlidesTable)
      .where(and(eq(heroSlidesTable.page, 'sermons'), eq(heroSlidesTable.isActive, 1)))
      .limit(1);
    heroBanner = bannerRows[0]?.imageUrl || null;
  } catch (err) {
    console.error('[SermonsPage DB error]', err);
  }

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="sermons-hero">
          <div
            className="sermons-hero-container"
            style={heroBanner ? { backgroundImage: `url(${heroBanner})` } : undefined}
          >
            <div className="sermons-hero-overlay">
              <div className="sermons-hero-content">
                <h1 className="sermons-hero-title">Sermons &amp; Resources</h1>
                <p className="sermons-hero-description">
                  A collection of sermons and study materials to inspire, guide, and equip you in your spiritual
                  journey. Access past messages, Bible study guides, and helpful resources.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sermons Section */}
        <section className="section sermons-section">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h1 className="fw-bold mb-4 text-center">Sermons</h1>
                <p className="text-center mb-5">
                  Watch our latest sermons and spiritual messages from TUMSDA Church YouTube Channel.
                </p>
              </div>
            </div>

            <div className="row g-4">
              {/* Featured Sermon Video */}
              <div className="col-lg-8">
                <div className="sermon-featured">
                  <h3 className="fw-semibold mb-3">Featured Sermon</h3>
                  <div className="ratio ratio-16x9 rounded overflow-hidden shadow-lg">
                    <iframe
                      src="https://www.youtube.com/embed/c3Nxku50sZE?si=RGAvfrRAU-m7VXSq"
                      title="Featured TUMSDA Sermon"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="sermon-info mt-3">
                    <h5 className="fw-semibold">Recent Videos</h5>
                    <p className="text-muted small">Watch this inspiring message from our church service</p>
                  </div>
                </div>
              </div>

              {/* Additional Sermon Videos */}
              <div className="col-lg-4">
                <h4 className="fw-semibold mb-3">More Sermons</h4>
                <div className="sermon-thumbnails">
                  <div className="sermon-thumbnail mb-3">
                    <div className="ratio ratio-16x9 rounded overflow-hidden shadow-sm">
                      <iframe
                        src="https://www.youtube.com/embed/n81AX4AcJD4?si=V_IyggW3VTplW3Gn"
                        title="TUMSDA Sermon 2"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="sermon-thumbnail-info mt-2">
                      <h6 className="fw-semibold small">Spiritual Growth</h6>
                      <p className="text-muted small mb-0">Growing in faith as a Christian</p>
                    </div>
                  </div>

                  <div className="sermon-thumbnail">
                    <div className="ratio ratio-16x9 rounded overflow-hidden shadow-sm">
                      <iframe
                        src="https://www.youtube.com/embed/X78SzybLPwI?si=8DlOT_jl5cG4YGom"
                        title="TUMSDA Sermon 3"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="sermon-thumbnail-info mt-2">
                      <h6 className="fw-semibold small">Hope &amp; Faith</h6>
                      <p className="text-muted small mb-0">Finding hope in challenging times</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Music Section */}
        <section className="section music-section">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="music-header text-center mb-5">
                  <h2 className="fw-bold mb-3">Heavenly Music</h2>
                  <p className="lead mb-4">
                    Listen to our latest heavenly music recordings that uplift the soul and bring us closer to God
                  </p>
                  <div className="music-subtitle">
                    <i className="fas fa-music me-2"></i>
                    <span>Experience the divine harmony of worship through our beautiful choir performances</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-4">
              {/* Featured Music Video */}
              <div className="col-lg-8">
                <div className="music-featured">
                  <div className="music-badge">
                    <i className="fas fa-star me-1"></i>
                    Featured Video
                  </div>
                  <div className="ratio ratio-16x9 rounded overflow-hidden shadow-lg">
                    <iframe
                      src="https://www.youtube.com/embed/qW0lqJQgHo8?si=GSKHQOGZ0lrRXahm"
                      title="Featured TUMSDA Music"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="music-info mt-3">
                    <h5 className="fw-semibold">Divine Harmony</h5>
                    <p className="text-muted small">
                      A beautiful musical offering that touches the heart and inspires worship
                    </p>
                    <div className="music-meta">
                      <span className="badge bg-primary me-2">
                        <i className="fas fa-music me-1"></i>Church Choir
                      </span>
                      <span className="badge bg-secondary">
                        <i className="fas fa-heart me-1"></i>Inspirational
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Music Videos */}
              <div className="col-lg-4">
                <h4 className="fw-semibold mb-3">More Music</h4>
                <div className="music-thumbnails">
                  <div className="music-thumbnail mb-3">
                    <div className="ratio ratio-16x9 rounded overflow-hidden shadow-sm">
                      <iframe
                        src="https://www.youtube.com/embed/jCpzyesDoI0?si=5KFxA81PcDsIlF50"
                        title="TUMSDA Music 2"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="music-thumbnail-info mt-2">
                      <h6 className="fw-semibold small">Worship &amp; Praise</h6>
                      <p className="text-muted small mb-0">Uplifting melodies that celebrate God's goodness</p>
                    </div>
                  </div>

                  <div className="music-thumbnail">
                    <div className="ratio ratio-16x9 rounded overflow-hidden shadow-sm">
                      <iframe
                        src="https://www.youtube.com/embed/US0xwYnXwII?si=w5HX4Cc01L_kzVkM"
                        title="TUMSDA Music 3"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="music-thumbnail-info mt-2">
                      <h6 className="fw-semibold small">Spiritual Journey</h6>
                      <p className="text-muted small mb-0">Soul-stirring hymns that guide our spiritual path</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stay Connected Section */}
        <section className="section stay-connected-section">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="stay-connected-cta text-center">
                  <h4 className="fw-semibold mb-3">Stay Connected</h4>
                  <p className="text-muted mb-4">Subscribe to our channels and never miss a sermon or update</p>
                  <div className="cta-buttons">
                    <a
                      href="https://youtube.com/@tumsda_church"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary me-3"
                    >
                      <i className="fab fa-youtube me-2"></i>Subscribe to Church Channel
                    </a>
                    <a
                      href="https://youtube.com/@tumsdachurchchoir"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary"
                    >
                      <i className="fas fa-music me-2"></i>Subscribe to Choir Channel
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Resources Section — data driven from DB, static fallback when empty */}
        <section className="section resources-section bg-light">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h2 className="fw-bold mb-4 text-center">Resources</h2>
                <p className="lead text-center mb-5">Access spiritual resources and study materials</p>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <div className="resource-category">
                  <h4 className="fw-semibold mb-4 text-center">Study Resources</h4>
                  <div className="resource-list">
                    {(dbResources.length > 0 ? dbResources : STATIC_RESOURCES).map((resource: any) => {
                      const iconSrc = resource.cloudinarySecureUrl || resource.cloudinary_secure_url || resource.iconPath || resource.icon_path;
                      const url = resource.linkUrl || resource.link_url || '#';
                      // Detect PDF: Cloudinary raw URLs contain "/raw/upload/" or end with .pdf
                      const isPdf = url.includes('/raw/upload/') || url.toLowerCase().endsWith('.pdf');
                      return (
                        <div className="resource-item" key={resource.id}>
                          <div className="resource-icon">
                            {iconSrc ? (
                              <img src={iconSrc} alt={resource.title} className="resource-icon-img" loading="lazy" />
                            ) : (
                              <div className="resource-icon-placeholder">
                                <i className={isPdf ? 'fas fa-file-pdf' : 'fas fa-book-open'}></i>
                              </div>
                            )}
                          </div>
                          <div className="resource-content">
                            <h6 className="fw-semibold">{resource.title}</h6>
                            {resource.description && (
                              <p className="text-muted small mb-2">{resource.description}</p>
                            )}
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-outline-primary btn-sm"
                            >
                              {isPdf ? (
                                <><i className="fas fa-download me-1"></i>Download PDF</>
                              ) : (
                                resource.linkLabel || 'Open Resource'
                              )}
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
