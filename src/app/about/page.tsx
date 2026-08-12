import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { db } from '@/lib/db';
import { weeklyMeetings as meetingsTable, events as eventsTable } from '@/lib/schema';
import { asc } from 'drizzle-orm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About TUMSDA — History, Mission & Beliefs',
  description:
    'Learn about TUMSDA Church — founded in 1982 at the Technical University of Mombasa. Discover our history, Seventh-day Adventist beliefs, mission, vision, weekly meetings schedule, and church calendar.',
  keywords: [
    'about TUMSDA Church',
    'TUMSDA history',
    'Seventh-day Adventist beliefs Kenya',
    'SDA 28 fundamental beliefs',
    'Sabbath school meetings Mombasa',
    'TUM church history',
    'church calendar Mombasa',
  ],
  alternates: {
    canonical: 'https://tumsdachurch.org/about',
  },
  openGraph: {
    title: 'About TUMSDA — History, Mission & Beliefs | Mombasa SDA Church',
    description:
      'Founded in 1982, TUMSDA Church at the Technical University of Mombasa upholds Seventh-day Adventist beliefs. Explore our history, mission, vision, and weekly worship schedule.',
    url: 'https://tumsdachurch.org/about',
    images: [{ url: 'https://tumsdachurch.org/assets/og-image.png', width: 1200, height: 630 }],
  },
};

export const revalidate = 60;


export default async function AboutPage() {
  let weeklyMeetings: any[] = [];
  let meetingsByDay: Record<string, any[]> = {};
  let events: any[] = [];

  try {
    weeklyMeetings = await db.select().from(meetingsTable).orderBy(asc(meetingsTable.sortOrder));
    for (const meeting of weeklyMeetings) {
      if (!meetingsByDay[meeting.dayOfWeek]) {
        meetingsByDay[meeting.dayOfWeek] = [];
      }
      meetingsByDay[meeting.dayOfWeek].push(meeting);
    }

    events = await db.select().from(eventsTable).orderBy(asc(eventsTable.eventDate));
  } catch (err) {
    console.error('[AboutPage DB error]', err);
  }

  const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <>
      <Header />
      <main>
        <section className="section py-0">
          <img src="/assets/img/TUMSDA.png" className="img-fluid w-100 rounded-3" alt="TUMSDA" />
        </section>
        <section className="section">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="about-content">
                  <h2 className="about-title">About TUMSDA</h2>
                  <div className="about-subtitle">
                    <i className="fas fa-church me-2"></i>
                    <span>Seventh-day Adventist Sabbath School</span>
                  </div>
                  <div className="about-location">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    <span>Technical University of Mombasa (TUM), Tudor</span>
                  </div>
                  <div className="about-tagline">
                    <p className="holiday-tagline">The Church We Love The Most!</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="about-image-container">
                  <img src="/assets/img/icon2.png" className="about-image" alt="TUMSDA Church" />
                </div>
              </div>
            </div>

            <div className="row mt-5">
              <div className="col-12">
                <div className="about-description-card">
                  <div className="about-description-content text-center">
                    <p>
                      TUMSDA Church is a Seventh-day Adventist Sabbath school in Ziwani District and it is a beacon of
                      hope, a sanctuary of spiritual growth, where young hearts beat in unison...
                    </p>
                    <p>The Church is located within the Technical University of Mombasa (TUM) in Tudor, Mombasa.</p>
                    <p>
                      With fervent passion and unwavering devotion, we gather to nurture our faith, cultivating a
                      profound relationship with the Creator...
                    </p>
                    <p>
                      In this sacred space, we as young people are transformed by the power of Bible study, prayer and
                      sacred music...
                    </p>
                    <p>
                      As a haven of spiritual nourishment, TUMSDA embodies the essence of a community blessed by the
                      divine presence.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section bg-white">
          <div className="container">
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="mission-vision-card mission-card">
                  <h3 className="mission-vision-title title-with-underline blue-title">Our Mission</h3>
                  <div className="mission-vision-content">
                    <p>
                      To make disciples of all people by communicating the everlasting gospel in the context of the
                      three angels' messages of Revelation 14:6–12, leading them to accept Jesus as personal Savior...
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="mission-vision-card vision-card">
                  <h3 className="mission-vision-title title-with-underline blue-title">Our Vision</h3>
                  <div className="mission-vision-content">
                    <p>
                      To uphold the distinctive message of the Seventh-day Adventist Church; to aspire to excellence in
                      all aspects of life—academic, social, and spiritual; to embrace radical discipleship...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="text-center">
              <h3 className="fw-semibold">History</h3>
              <p className="mx-auto" style={{ maxWidth: 800 }}>
                In 1982, a small group of college students began a movement—born from a hunger for the Word of God, a
                deeper relationship with Christ, and an act of faith...
              </p>
            </div>
          </div>
        </section>

        <section className="section bg-white">
          <div className="container">
            <div className="text-center">
              <h3 className="fw-semibold">Beliefs</h3>
              <p className="mb-2 mx-auto" style={{ maxWidth: 800 }}>
                We cherish the fundamental beliefs of the Seventh-day Adventist Church.
              </p>
              <p className="mb-2 mx-auto" style={{ maxWidth: 800 }}>
                Upholding the Protestant conviction of Sola Scriptura (“Bible only”), these 28 Fundamental Beliefs
                describe how Seventh-day Adventists interpret Scripture...
              </p>
              <p>
                <a
                  href="https://www.adventist.org/beliefs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary"
                >
                  Fundamental Beliefs
                </a>
              </p>
            </div>
          </div>
        </section>

        <section id="weekly-meetings" className="section">
          <div className="container">
            <div className="weekly-meetings-card">
              <h3 className="fw-semibold mb-3">Weekly Meetings</h3>
              <p className="mb-4">
                Find our Weekly Meetings schedules where we meet as a family to engage one another and grow in
                different aspects...
              </p>
              <div className="table-responsive">
                <table className="table weekly-meetings-table align-middle">
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>Time</th>
                      <th>Program</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dayOrder.map((day) => {
                      if (!meetingsByDay[day]) return null;
                      const meetings = meetingsByDay[day];
                      return meetings.map((meeting: any, idx: number) => (
                        <tr key={meeting.id}>
                          {idx === 0 && <td rowSpan={meetings.length}>{day}</td>}
                          <td>{meeting.timeRange}</td>
                          <td>{meeting.programName}</td>
                        </tr>
                      ));
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section id="calendar" className="section bg-white">
          <div className="container">
            <h3 className="fw-semibold">Church Calendar</h3>
            <div className="table-responsive">
              <table className="table church-calendar-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Event</th>
                    <th>Facilitator</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id}>
                      <td>{event.eventDate}</td>
                      <td>{event.title}</td>
                      <td>{event.facilitator || ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
