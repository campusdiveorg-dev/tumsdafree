import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { db } from '@/lib/db';
import { departmentsMinistries } from '@/lib/schema';
import { eq, asc } from 'drizzle-orm';
import { getImageUrl } from '@/lib/cloudinaryUrl';

export const metadata: Metadata = {
  title: 'Departments — Church Ministries & Service Units',
  description:
    'Explore the departments of TUMSDA Church — including the Adventist Ladies Organisation (ALO), Youth, Communication, and more. Each department serves a unique role in our community.',
  keywords: [
    'TUMSDA departments',
    'Adventist Ladies Organisation Mombasa',
    'ALO SDA',
    'church departments Kenya',
    'SDA youth department',
    'church service units Mombasa',
  ],
  alternates: {
    canonical: 'https://tumsda.org/departments',
  },
  openGraph: {
    title: 'TUMSDA Church Departments | Adventist Community Mombasa',
    description:
      'Discover the TUMSDA Church departments that keep our community thriving — from the Adventist Ladies Organisation to Youth and Communication.',
    url: 'https://tumsda.org/departments',
    images: [{ url: 'https://tumsda.org/assets/og-image.png', width: 1200, height: 630 }],
  },
};

export const revalidate = 60;

export default async function DepartmentsPage() {
  let departments: any[] = [];
  try {
    departments = await db
      .select()
      .from(departmentsMinistries)
      .where(eq(departmentsMinistries.type, 'department'))
      .orderBy(asc(departmentsMinistries.sortOrder));
  } catch (err) {
    console.error('[DepartmentsPage DB error]', err);
  }

  return (
    <>
      <Header />
      <main>
        <section className="section">
          <div className="container">
            <div className="page-hero-block">
              <div className="page-hero-content">
                <h1 className="page-hero-title">Departments</h1>
                <p className="page-hero-description">These ministries help our community function and flourish.</p>
              </div>
            </div>
            <div className="row g-4 mt-4">
              {departments.map((dept) => {
                const hasImg = Boolean(dept.cloudinarySecureUrl || dept.cloudinary_secure_url);
                const imgUrl = getImageUrl(dept, { width: 600 });
                return (
                  <div className="col-lg-6" key={dept.id}>
                    <div className="card department-card h-100 shadow-sm overflow-hidden">
                      {hasImg && (
                        <img src={imgUrl} alt={dept.name} className="card-img-top" style={{ maxHeight: 220, objectFit: 'cover' }} />
                      )}
                      <div className="card-body">
                        <h5 className="card-title mb-3">{dept.name}</h5>
                        <p className="card-text mb-3">{dept.description}</p>
                        {dept.scriptureQuote && (
                          <blockquote className="blockquote mb-3">
                            <footer className="blockquote-footer">
                              <cite title="Source Title">
                                "{dept.scriptureQuote}" {dept.scriptureReference}
                              </cite>
                            </footer>
                          </blockquote>
                        )}
                        {dept.externalLink && (
                          <p className="mb-0">
                            <a
                              href={dept.externalLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-outline-primary btn-sm"
                            >
                              Visit Site
                            </a>
                          </p>
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
