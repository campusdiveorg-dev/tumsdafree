import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { db } from '@/lib/db';
import { missions } from '@/lib/schema';
import { asc } from 'drizzle-orm';
import MissionAccordion from '@/components/MissionAccordion';

export const revalidate = 60;

export default async function EvangelismPage() {
  let missionList: any[] = [];
  try {
    missionList = await db.select().from(missions).orderBy(asc(missions.sortOrder));
  } catch (err) {
    console.error('[EvangelismPage DB error]', err);
  }

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="evangelism-hero section py-0">
          <div className="evangelism-hero-container">
            <div className="evangelism-hero-overlay">
              <div className="evangelism-hero-content">
                <h1 className="evangelism-hero-title">Evangelism &amp; Missions</h1>
                <p className="evangelism-hero-subtitle">
                  Spreading the Gospel through dedicated missionary work and community outreach
                </p>
                <blockquote className="evangelism-verse">
                  <p>
                    "And this gospel of the kingdom will be preached in all the world as a witness to all the nations,
                    and then the end will come."
                  </p>
                  <footer className="verse-reference">— Matthew 24:14</footer>
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Overview Section */}
        <section className="section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10 text-center">
                <h2 className="fw-bold mb-3 title-with-underline">Our Missionary Journey</h2>
                <p className="mb-4">
                  At TUMSDA, we believe in the power of evangelism to transform lives and communities. Our missionary
                  work extends beyond our campus walls, reaching out to neighboring communities through service,
                  teaching, and compassionate outreach.
                </p>
                <p className="mb-0">
                  Through our annual missions, we engage in community service, Bible studies, health education, and
                  spiritual outreach, making a lasting impact in the lives of those we serve.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Activities Section */}
        <section className="section bg-light">
          <div className="container">
            <div className="row g-4 mb-5">
              <div className="col-lg-12">
                <h3 className="activities-main-title text-center mb-4">Mission Activities</h3>
                <div className="activities-detailed-grid">
                  <div className="activity-detailed-item">
                    <div className="activity-content">
                      <h4>Community Outreach</h4>
                      <p>Door-to-door witnessing, Bible studies, and public evangelistic meetings.</p>
                    </div>
                  </div>
                  <div className="activity-detailed-item">
                    <div className="activity-content">
                      <h4>Medical Missionary</h4>
                      <p>
                        Offering free medical check-ups, treatments, and health education to serve the physical needs
                        of the community.
                      </p>
                    </div>
                  </div>
                  <div className="activity-detailed-item">
                    <div className="activity-content">
                      <h4>Health Ministry</h4>
                      <p>
                        Practical training in lifestyle health, wellness, and preventive care for stronger, healthier
                        families.
                      </p>
                    </div>
                  </div>
                  <div className="activity-detailed-item">
                    <div className="activity-content">
                      <h4>Children's Ministry</h4>
                      <p>
                        Engaging programs designed to nurture young hearts in the love of Jesus through songs, Bible
                        stories, and activities.
                      </p>
                    </div>
                  </div>
                  <div className="activity-detailed-item">
                    <div className="activity-content">
                      <h4>Family Life Ministry</h4>
                      <p>Strengthening homes through Christ-centered seminars and counseling.</p>
                    </div>
                  </div>
                  <div className="activity-detailed-item">
                    <div className="activity-content">
                      <h4>Community Transformation</h4>
                      <p>
                        Practical acts of service such as clean-up exercises, helping vulnerable families, and creating
                        sustainable impact.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission History Accordion Section */}
        <section className="section mission-history-section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <h2 className="mission-history-title">Our Mission History</h2>
                <p className="mission-history-subtitle">
                  Discover the impact of our evangelistic missions through the years
                </p>

                <MissionAccordion missions={missionList} />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
