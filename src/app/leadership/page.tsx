import type { Metadata } from 'next';
import { getImageUrl } from '@/lib/cloudinaryUrl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { db } from '@/lib/db';
import { leadership as leadershipTable, sabbathGallery as galleryTable } from '@/lib/schema';
import { asc, desc } from 'drizzle-orm';
import SabbathGallery from '@/components/SabbathGallery';

export const metadata: Metadata = {
  title: 'Leadership — Church Officers & Pastoral Team',
  description:
    'Meet the leadership team of TUMSDA Church — our church officers, elders, and ministry leaders who guide our Seventh-day Adventist community in Mombasa, Kenya. Get in touch with us.',
  keywords: [
    'TUMSDA leadership',
    'church officers Mombasa',
    'SDA church elders Kenya',
    'TUMSDA contact',
    'church leadership Kenya',
    'Adventist church officers Mombasa',
    'TUMSDA pastoral team',
  ],
  alternates: {
    canonical: 'https://tumsdachurch.org/leadership',
  },
  openGraph: {
    title: 'TUMSDA Church Leadership | Officers & Pastoral Team Mombasa',
    description:
      'Meet the dedicated leadership of TUMSDA Church. Connect with our church officers and ministry leaders in Mombasa, Kenya.',
    url: 'https://tumsdachurch.org/leadership',
    images: [{ url: 'https://tumsdachurch.org/assets/og-image.png', width: 1200, height: 630 }],
  },
};

export const revalidate = 60;



export default async function LeadershipPage() {
  let leaders: any[] = [];
  let galleryPhotos: any[] = [];
  try {
    leaders = await db.select().from(leadershipTable).orderBy(asc(leadershipTable.sortOrder));
    galleryPhotos = await db
      .select()
      .from(galleryTable)
      .orderBy(asc(galleryTable.sortOrder), desc(galleryTable.dateTaken));
  } catch (err) {
    console.error('[LeadershipPage DB error]', err);
  }


  const web3Key = process.env.WEB3FORMS_ACCESS_KEY || 'f0ddf1cb-9e8c-494f-a7a1-262385c5a479';

  return (
    <>
      <Header />
      <main>
        {/* Leadership Section */}
        <section className="section leadership-section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="leadership-header-card">
                  <div className="leadership-header-content text-center">
                    <h1 className="fw-bold mb-3">Church Leadership</h1>
                    <p className="mb-0">
                      Meet our dedicated church leaders who guide and serve our congregation with love and commitment.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-4 justify-content-center">
              {leaders.map((leader) => {
                const nameParts = leader.name ? leader.name.split(' ') : [];
                const signatureName = nameParts[1] || leader.name;
                const photoSrc = getImageUrl(leader, { width: 600, fallbackPath: leader.photoPath || leader.photo_path || '/assets/img/icon2.png' });
                const hasImage = Boolean(leader.cloudinarySecureUrl || leader.cloudinary_secure_url || leader.photoPath || leader.photo_path);

                return (
                  <div className="col-lg-4" key={leader.id}>
                    <div className="leadership-card">
                      {hasImage && (
                        <div className="leadership-image">
                          <img src={photoSrc} alt={leader.name} className="leadership-photo" />
                        </div>
                      )}
                      <div className="leadership-content">
                        <h4 className="leadership-name">{leader.name}</h4>
                        <p className="leadership-position">{leader.position}</p>
                        {leader.statement && (
                          <>
                            <blockquote className="leadership-statement">{leader.statement}</blockquote>
                            <p className="leadership-signature">- {signatureName}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Sabbath Was Nice Gallery */}
        <SabbathGallery photos={galleryPhotos} />

        {/* Contact Us Section */}
        <section className="section contact-section bg-light" id="contact">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h2 className="fw-bold mb-4 text-center">Contact Us</h2>
                <p className="lead text-center mb-5">
                  Get in touch with us for any questions, prayer requests, or to learn more about our church
                </p>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-lg-7">
                <form method="POST" action="https://api.web3forms.com/submit" className="card shadow-sm">
                  <input type="hidden" name="access_key" value={web3Key} />
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input type="text" name="name" className="form-control-custom" required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input type="email" name="email" className="form-control-custom" required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Message</label>
                      <textarea name="message" className="form-control-custom" rows={5} required></textarea>
                    </div>
                    <button type="submit" className="td-btn-primary">
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
              <div className="col-lg-5">
                <div className="contact-info-card card shadow-sm">
                  <div className="card-body">
                    <h5 className="mb-3">Contact Information</h5>
                    <p>
                      <strong>Location:</strong>
                      <br />
                      Tom Mboya Street Tudor, Msa
                      <br />
                      P.O Box 90420-80100 MSA Kenya
                    </p>
                    <p>
                      <strong>Phone:</strong> <a href="tel:+254712345678">+254712345678</a>
                    </p>
                    <p>
                      <strong>Email:</strong> <a href="mailto:sdachurchtumsda@gmail.com">sdachurchtumsda@gmail.com</a>
                    </p>
                    <p>
                      <strong>Service Times:</strong>
                      <br />
                      Sabbath School: 9:00 AM
                      <br />
                      Divine Service: 11:00 AM
                    </p>
                    <div className="mt-3">
                      <a
                        href="https://wa.me/254712345678"
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
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
