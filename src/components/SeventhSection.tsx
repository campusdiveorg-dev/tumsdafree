'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function SeventhSection() {
  const pathname = usePathname();
  const sectionRef = useRef<HTMLDivElement>(null);
  const logoWhiteRef = useRef<HTMLImageElement>(null);
  const logoBlackRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (pathname?.startsWith('/admin')) return;

    const updateColor = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const windowHeight = window.innerHeight;
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );

      const totalScrollable = docHeight - windowHeight;
      const scrollProgress = totalScrollable > 0 ? Math.min(Math.max(scrollY / totalScrollable, 0), 1) : 0;

      const r = Math.round(0 + (255 - 0) * scrollProgress);
      const g = Math.round(102 + (255 - 102) * scrollProgress);
      const b = Math.round(204 + (255 - 204) * scrollProgress);

      if (sectionRef.current) {
        sectionRef.current.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
      }
      if (logoWhiteRef.current && logoBlackRef.current) {
        logoWhiteRef.current.style.opacity = String(1 - scrollProgress);
        logoBlackRef.current.style.opacity = String(scrollProgress);
      }
    };

    updateColor();

    window.addEventListener('scroll', updateColor, { passive: true });
    window.addEventListener('resize', updateColor);
    return () => {
      window.removeEventListener('scroll', updateColor);
      window.removeEventListener('resize', updateColor);
    };
  }, [pathname]);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="seventh-section" ref={sectionRef}>
      <div className="seventh-section-content">
        <picture>
          <source type="image/webp" srcSet="/assets/img/webp/icon.webp" />
          <img
            src="/assets/img/icon.png"
            alt="TUMSDA Logo"
            className="seventh-section-logo logo-white"
            ref={logoWhiteRef}
          />
        </picture>
        <picture>
          <source type="image/webp" srcSet="/assets/img/webp/icon2.webp" />
          <img
            src="/assets/img/icon2.png"
            alt="TUMSDA Logo"
            className="seventh-section-logo logo-black"
            ref={logoBlackRef}
          />
        </picture>
      </div>
    </div>
  );
}
