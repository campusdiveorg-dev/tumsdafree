import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { db } from '@/lib/db';
import { missions, wordOfTheDay as wordTable, announcements as annTable, sabbathGallery as galleryTable } from '@/lib/schema';
import { eq, asc, desc } from 'drizzle-orm';
import Link from 'next/link';
import SabbathGallery from '@/components/SabbathGallery';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  let upcomingMission = null;
  let wordOfTheDay = null;
  let announcements: any[] = [];
  let galleryPreview: any[] = [];

  try {
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


  const formatDate = (d: string | null) => {
    if (!d) return '';
    const date = new Date(d);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="hero section py-0">
          <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="6000">
            <div className="carousel-indicators">
              <button
                type="button"
                data-bs-target="#heroCarousel"
                data-bs-slide-to="0"
                className="active"
                aria-current="true"
                aria-label="Slide 1"
              ></button>
              <button
                type="button"
                data-bs-target="#heroCarousel"
                data-bs-slide-to="1"
                aria-label="Slide 2"
              ></button>
              <button
                type="button"
                data-bs-target="#heroCarousel"
                data-bs-slide-to="2"
                aria-label="Slide 3"
              ></button>
              <button
                type="button"
                data-bs-target="#heroCarousel"
                data-bs-slide-to="3"
                aria-label="Slide 4"
              ></button>
            </div>
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img src="/assets/img/Sabbath.png" className="d-block w-100" alt="Worship" />
                <div className="carousel-caption hero-caption hero-caption--top text-center">
                  <h1 className="hero-title">WELCOME TO TUMSDA</h1>
                  <p className="hero-subtitle holiday-tagline">The Church We Love The Most!</p>
                  <button className="hero-btn hero-btn-welcome">Welcome and Worship With Us</button>
                </div>
              </div>
              <div className="carousel-item">
                <img src="/assets/img/ChurchChoir.png" className="d-block w-100" alt="Church Choir" />
                <div className="carousel-caption hero-caption hero-caption--bottom-left text-start">
                  <h2 className="hero-title">Listen to the Heavenly Music</h2>
                  <p className="hero-subtitle">Experience sacred music with the TUMSDA Church Choir</p>
                  <a
                    href="https://www.youtube.com/@tumsdachurchchoir"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hero-btn"
                  >
                    Listen Now
                  </a>
                </div>
              </div>
              <div className="carousel-item">
                <img src="/assets/img/ALO.png" className="d-block w-100" alt="Adventist Ladies Organisation" />
                <div className="carousel-caption hero-caption hero-caption--bottom-left text-start">
                  <h2 className="hero-title">Strong to Serve</h2>
                  <p className="hero-subtitle">Fellowship and discipleship across all departments</p>
                  <Link href="/departments" className="hero-btn">
                    Explore Departments
                  </Link>
                </div>
              </div>
              <div className="carousel-item">
                <img src="/assets/img/jpg/church.jpeg" className="d-block w-100" alt="Bible and Bible Alone" />
                <div className="carousel-caption hero-caption hero-caption--bottom-left text-start">
                  <h2 className="hero-title">Rooted in the Word</h2>
                  <p className="hero-subtitle">Bible study and present truth for daily living.</p>
                  <Link href="/ministries" className="hero-btn">
                    Join a Ministry
                  </Link>
                </div>
              </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </section>

        {/* About Section */}
        <section className="section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <h2 className="fw-bold mb-3">About TUMSDA</h2>
                <p className="mb-3">
                  TUMSDA Church is a Seventh-day Adventist Sabbath school in Ziwani District located at the Technical University of Mombasa (TUM) in Tudor. We nurture a deep love for the Bible and the Spirit of Prophecy (Isaiah 8:20) through study, prayer, and sacred music.
                </p>
                <Link href="/about" className="btn btn-sm btn-outline-primary">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="row g-3 mt-4">
              <div className="col-md-6">
                <div className="card elevated-card h-100 border-0">
                  <div className="card-body text-center">
                    <h5 className="card-title fw-bold">Our Mission</h5>
                    <p className="mb-0">
                      To make disciples of all people, communicating the everlasting gospel in the context of the three
                      angels' messages of Revelation 14:6-12...
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card elevated-card h-100 border-0">
                  <div className="card-body text-center">
                    <h5 className="card-title fw-bold">Our Vision</h5>
                    <p className="mb-0">
                      To uphold the distinctive message of the Seventh-day Adventist Church; to aspire to excellence in
                      all aspects of their lives...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Events, Meetings, Word of the Day, Announcements */}
        <section className="section bg-white">
          <div className="container">
            <div className="row g-4">
              <div className="col-lg-6">
                {/* Upcoming Events */}
                <div className="mb-4">
                  <h3 className="fw-semibold mb-3">Upcoming Events</h3>
                  <div className="bg-light rounded-3 p-3">
                    <div className="mt-3">
                      <Link href="/about#calendar" className="btn btn-outline-primary btn-sm">
                        View Full Calendar
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Weekly Meetings */}
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <h4 className="fw-semibold mb-3">Weekly Meetings</h4>
                    <p className="mb-3 text-muted">
                      Find our Weekly Meetings schedules where we meet as a family to engage one another and grow in
                      different aspects...
                    </p>
                    <Link href="/about#weekly-meetings" className="btn btn-outline-primary btn-sm">
                      View our Weekly Meetings
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                {/* Word of the Day */}
                {wordOfTheDay && (
                  <div className="mb-4" id="wordOfTheDayBlock">
                    <h3 className="fw-semibold mb-3">Word of the Day</h3>
                    <div className="p-4 bg-dark text-light rounded-3 position-relative">
                      <blockquote className="mb-2 fs-5">"{wordOfTheDay.content}"</blockquote>
                      <div className="small opacity-75">{wordOfTheDay.reference}</div>
                    </div>
                  </div>
                )}

                {/* Church Notice Board & Announcements */}
                {announcements.length > 0 && (
                  <div>
                    <h3 className="fw-semibold mb-3">Church Notice Board &amp; Announcements</h3>
                    <div className="card border-0 shadow-sm">
                      <div className="card-body">
                        {announcements.map((ann, i) => (
                          <div
                            key={ann.id}
                            className={`announcement-item ${i < announcements.length - 1 ? 'mb-3 pb-3 border-bottom' : ''
                              }`}
                          >
                            <h6 className="fw-semibold text-primary mb-2">{ann.title}</h6>
                            <p className="mb-0 small text-muted">{ann.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Sabbath Was Nice — Preview Strip */}
        {galleryPreview.length > 0 && (
          <SabbathGallery photos={galleryPreview} previewMode />
        )}

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
