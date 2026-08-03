'use client';

import { usePathname } from 'next/navigation';
import SeventhSection from './SeventhSection';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  // Admin pages handle their own full-screen layout via admin-shell in AdminLayout.tsx
  // Just pass children through — no content-wrapper, no seventh-section
  if (isAdmin) {
    return <>{children}</>;
  }

  // Public pages: wrap in content-wrapper (6/7 width, float left)
  // and render SeventhSection as a sibling (position: fixed, 1/7 width, right edge)
  return (
    <>
      <div className="content-wrapper">
        {children}
      </div>
      <SeventhSection />
    </>
  );
}
