import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { db } from '@/lib/db';
import { departmentsMinistries } from '@/lib/schema';
import { eq, asc } from 'drizzle-orm';
import { getImageUrl } from '@/lib/cloudinaryUrl';

export const revalidate = 60;

export default async function MinistriesPage() {
  let ministries: any[] = [];
  try {
    ministries = await db
      .select()
      .from(departmentsMinistries)
      .where(eq(departmentsMinistries.type, 'ministry'))
      .orderBy(asc(departmentsMinistries.sortOrder));
  } catch (err) {
    console.error('[MinistriesPage DB error]', err);
  }

  return (
    <>
      <Header />
      <main>
        <section className="section">
          <div className="container">
            <div className="page-hero-block">
              <div className="page-hero-content">
                <h1 className="page-hero-title">Ministries</h1>
                <p className="page-hero-description">Join a ministry and grow in fellowship and service.</p>
              </div>
            </div>
            <div className="row g-4 mt-4">
              {ministries.map((min) => {
                const hasImg = Boolean(min.cloudinarySecureUrl || min.cloudinary_secure_url);
                const imgUrl = getImageUrl(min, { width: 600 });
                return (
                  <div className="col-lg-4" key={min.id}>
                    <div className="card ministry-card h-100 shadow-sm overflow-hidden">
                      {hasImg && (
                        <img src={imgUrl} alt={min.name} className="card-img-top" style={{ maxHeight: 200, objectFit: 'cover' }} />
                      )}
                      <div className="card-body">
                        <h5 className="card-title mb-3">{min.name}</h5>
                        <p className="card-text mb-3">{min.description}</p>
                        {min.scriptureQuote && (
                          <blockquote className="blockquote mb-3">
                            <footer className="blockquote-footer">
                              <cite title="Source Title">
                                "{min.scriptureQuote}" {min.scriptureReference}
                              </cite>
                            </footer>
                          </blockquote>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
