import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import ClosingFAQ from './ClosingFAQ';
import Footer from './Footer';

export default function Layout() {
  return (
    <>
      <Navbar />
      <main>
        {/* keeps navbar/footer instant while a lazy page chunk loads */}
        <Suspense fallback={<div className="min-h-svh" style={{ background: 'var(--ink)' }} />}>
          <Outlet />
        </Suspense>
      </main>
      {/* SEO/GEO FAQ on every page, above the footer */}
      <ClosingFAQ />
      <Footer />
    </>
  );
}
