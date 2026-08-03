import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { db } from '@/lib/db';
import { resources as resourcesTable } from '@/lib/schema';
import { asc } from 'drizzle-orm';

export const revalidate = 60;

export default async function SermonsPage() {
  let dbResources: any[] = [];
  try {
    dbResources = await db.select().from(resourcesTable).orderBy(asc(resourcesTable.sortOrder));
  } catch (err) {
    console.error('[SermonsPage DB error]', err);
  }

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="sermons-hero">
          <div className="sermons-hero-container">
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

        {/* Resources Section */}
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
                    <div className="resource-item">
                      <div className="resource-icon">
                        <img src="/assets/SS.png" alt="Sabbath School" className="resource-icon-img" />
                      </div>
                      <div className="resource-content">
                        <h6 className="fw-semibold">Sabbath School Lessons</h6>
                        <p className="text-muted small mb-2">Weekly Bible study lessons and materials</p>
                        <a
                          href="https://absg.sspmadventist.org/en/2025-03/11/videos"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary btn-sm"
                        >
                          Access Lessons
                        </a>
                      </div>
                    </div>

                    <div className="resource-item">
                      <div className="resource-icon">
                        <img src="/assets/BS.jpeg" alt="Bible Study" className="resource-icon-img" />
                      </div>
                      <div className="resource-content">
                        <h6 className="fw-semibold">Bible Study Guides</h6>
                        <p className="text-muted small mb-2">Comprehensive Bible study resources</p>
                        <a
                          href="https://adventist.org/beliefs/bible/study"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary btn-sm"
                        >
                          Study Bible
                        </a>
                      </div>
                    </div>

                    <div className="resource-item">
                      <div className="resource-icon">
                        <img src="/assets/PY.jpg" alt="Prayer" className="resource-icon-img" />
                      </div>
                      <div className="resource-content">
                        <h6 className="fw-semibold">Bible Study &amp; Prayer</h6>
                        <p className="text-muted small mb-2">Interactive Bible study and prayer resources</p>
                        <a
                          href="https://sspmadventist.org/sabbathschool/alive/biblestudyandprayer"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary btn-sm"
                        >
                          Study &amp; Pray
                        </a>
                      </div>
                    </div>

                    <div className="resource-item">
                      <div className="resource-icon">
                        <img src="/assets/AB.png" alt="Adventist Beliefs" className="resource-icon-img" />
                      </div>
                      <div className="resource-content">
                        <h6 className="fw-semibold">Adventist Beliefs</h6>
                        <p className="text-muted small mb-2">Official Adventist beliefs and doctrines</p>
                        <a
                          href="https://adventist.org/beliefs"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary btn-sm"
                        >
                          Learn Beliefs
                        </a>
                      </div>
                    </div>

                    <div className="resource-item">
                      <div className="resource-icon">
                        <picture>
                          <source type="image/webp" srcSet="/assets/img/webp/MP.webp" />
                          <img
                            src="/assets/MP.png"
                            alt="Music Philosophy"
                            className="resource-icon-img"
                            loading="lazy"
                          />
                        </picture>
                      </div>
                      <div className="resource-content">
                        <h6 className="fw-semibold">Music Philosophy</h6>
                        <p className="text-muted small mb-2">
                          Seventh-day Adventist philosophy of music and worship
                        </p>
                        <a
                          href="https://gc.adventist.org/guidelines/a-seventh-day-adventist-philosophy-of-music/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary btn-sm"
                        >
                          Read Philosophy
                        </a>
                      </div>
                    </div>

                    <div className="resource-item">
                      <div className="resource-icon">
                        <picture>
                          <source type="image/webp" srcSet="/assets/img/webp/YA.webp" />
                          <source type="image/jpeg" srcSet="/assets/img/jpg/YA.jpg" />
                          <img
                            src="/assets/YA.jpg"
                            alt="Young Adults"
                            className="resource-icon-img"
                            loading="lazy"
                          />
                        </picture>
                      </div>
                      <div className="resource-content">
                        <h6 className="fw-semibold">Young Adults</h6>
                        <p className="text-muted small mb-2">Resources and studies for young adults</p>
                        <a
                          href="https://inverse.sspmadventist.org/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary btn-sm"
                        >
                          Join Young Adults
                        </a>
                      </div>
                    </div>

                    <div className="resource-item">
                      <div className="resource-icon">
                        <picture>
                          <source type="image/webp" srcSet="/assets/img/webp/AP.webp" />
                          <img
                            src="/assets/AP.png"
                            alt="Adventist Pioneer"
                            className="resource-icon-img"
                            loading="lazy"
                          />
                        </picture>
                      </div>
                      <div className="resource-content">
                        <h6 className="fw-semibold">Adventist Pioneer Library</h6>
                        <p className="text-muted small mb-2">Historical writings and pioneer literature</p>
                        <a
                          href="https://m.egwwritings.org/en/folders/15"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary btn-sm"
                        >
                          Explore Library
                        </a>
                      </div>
                    </div>

                    <div className="resource-item">
                      <div className="resource-icon">
                        <picture>
                          <source type="image/webp" srcSet="/assets/img/webp/EGW.webp" />
                          <img
                            src="/assets/EGW.png"
                            alt="EGW Writings"
                            className="resource-icon-img"
                            loading="lazy"
                          />
                        </picture>
                      </div>
                      <div className="resource-content">
                        <h6 className="fw-semibold">EGW Writings</h6>
                        <p className="text-muted small mb-2">Complete collection of Ellen G. White writings</p>
                        <a
                          href="https://m.egwwritings.org/en/folders/2"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary btn-sm"
                        >
                          Read Writings
                        </a>
                      </div>
                    </div>

                    <div className="resource-item">
                      <div className="resource-icon">
                        <img src="/assets/AA.jpeg" alt="Adventist Archives" className="resource-icon-img" />
                      </div>
                      <div className="resource-content">
                        <h6 className="fw-semibold">Adventist Archives</h6>
                        <p className="text-muted small mb-2">Historical documents and research materials</p>
                        <a
                          href="https://www.adventistarchives.org/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary btn-sm"
                        >
                          Browse Archives
                        </a>
                      </div>
                    </div>
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
