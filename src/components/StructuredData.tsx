'use client';

// ---------------------------------------------------------------------------
// StructuredData — JSON-LD structured data component for TUMSDA Church
// ---------------------------------------------------------------------------
// This component renders Google-friendly JSON-LD markup that helps Search
// engines understand who TUMSDA is, where they are, and what they do.
// ---------------------------------------------------------------------------

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface StructuredDataProps {
  /** Page-level breadcrumb trail (omit on homepage) */
  breadcrumbs?: BreadcrumbItem[];
  /** Include the WebSite schema with SearchAction (homepage only) */
  includeWebSite?: boolean;
}

const BASE_URL = 'https://tumsda.org';

// Organisation & Place of Worship — rendered on every page via layout.tsx
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'PlaceOfWorship'],
  name: 'TUMSDA Church',
  alternateName: 'Technical University of Mombasa Seventh-day Adventist Church',
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${BASE_URL}/assets/img/icon.png`,
    width: 200,
    height: 200,
  },
  image: `${BASE_URL}/assets/og-image.png`,
  description:
    'TUMSDA Church is a Seventh-day Adventist Sabbath school in Ziwani District at the Technical University of Mombasa (TUM) in Tudor, Mombasa, Kenya. We nurture a deep love for the Bible through study, prayer, and sacred music.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Technical University of Mombasa, Tudor Campus',
    addressLocality: 'Mombasa',
    addressRegion: 'Coast Province',
    postalCode: '80100',
    addressCountry: 'KE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -4.0562,
    longitude: 39.6631,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '09:00',
      closes: '13:00',
      description: 'Sabbath School & Divine Service',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Wednesday',
      opens: '17:00',
      closes: '19:00',
      description: 'Midweek Prayer Meeting',
    },
  ],
  sameAs: [
    'https://www.youtube.com/@tumsdachurchchoir',
    'https://tumsda.org',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Support',
    availableLanguage: ['English', 'Swahili'],
  },
  foundingDate: '1982',
  areaServed: {
    '@type': 'City',
    name: 'Mombasa',
    '@id': 'https://www.wikidata.org/wiki/Q46020',
  },
  memberOf: {
    '@type': 'Organization',
    name: 'Seventh-day Adventist Church',
    url: 'https://www.adventist.org',
  },
};

// WebSite schema with SearchAction — homepage only
const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'TUMSDA Church',
  url: BASE_URL,
  description:
    'Official website of TUMSDA Church — Seventh-day Adventist Sabbath school at the Technical University of Mombasa, Kenya.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/sermons?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL,
      },
      ...items.map((crumb, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: crumb.name,
        item: crumb.url,
      })),
    ],
  };
}

export default function StructuredData({
  breadcrumbs,
  includeWebSite = false,
}: StructuredDataProps) {
  const schemas: object[] = [organizationSchema];

  if (includeWebSite) {
    schemas.push(webSiteSchema);
  }

  if (breadcrumbs && breadcrumbs.length > 0) {
    schemas.push(buildBreadcrumbSchema(breadcrumbs));
  }

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
