import React, { Suspense, lazy, useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import SectionSkeleton from './components/SectionSkeleton';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { motion } from 'framer-motion';
import LegalPage from './pages/LegalPage';
import LegalIndexPage from './pages/LegalIndexPage';
import { legalDocSlugs } from './lib/legal';
import { applySeoToDocument } from './lib/seo-dom';
import { getSeoByRoute, getSeoRouteKeyByPath } from './lib/seo';

const SuccessStories = lazy(() => import('./components/SuccessStories'));
const Challenges = lazy(() => import('./components/Challenges'));
const ImpactMetrics = lazy(() => import('./components/ImpactMetrics'));
const Features = lazy(() => import('./components/Features'));
const HowItWorks = lazy(() => import('./components/HowItWorks'));
const Pricing = lazy(() => import('./components/Pricing'));
const CTA = lazy(() => import('./components/CTA'));

const getNormalizedPath = () => {
  if (typeof window === 'undefined') return '/';
  const cleanedPath = window.location.pathname.replace(/\/+$/, '');
  return cleanedPath === '' ? '/' : cleanedPath;
};

const AppContent: React.FC = () => {
  const { language } = useLanguage();
  const [path, setPath] = useState(getNormalizedPath);

  const legalSlug = path.startsWith('/') ? path.slice(1) : path;
  const isLegalIndexRoute = path === '/legal';
  const isLegalRoute = legalDocSlugs.has(legalSlug);

  useEffect(() => {
    const handleRouteChange = () => setPath(getNormalizedPath());
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  useEffect(() => {
    const seoRoute = getSeoRouteKeyByPath(path);
    document.documentElement.setAttribute('lang', language);
    applySeoToDocument(document, getSeoByRoute(seoRoute, language));
  }, [language, path]);

  if (isLegalIndexRoute) {
    return (
      <div className="min-h-screen bg-white selection:bg-black selection:text-white">
        <LegalIndexPage />
      </div>
    );
  }

  if (isLegalRoute) {
    return (
      <div className="min-h-screen bg-white selection:bg-black selection:text-white">
        <LegalPage slug={legalSlug} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white">
      <motion.div
        key="content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Navbar />
        <main>
          <Hero />
          <Suspense fallback={<SectionSkeleton className="border-b border-slate-100" />}>
            <SuccessStories />
          </Suspense>
          <Suspense fallback={<SectionSkeleton className="border-b border-slate-100" />}>
            <Challenges />
          </Suspense>
          <Suspense fallback={<SectionSkeleton className="border-b border-slate-100" />}>
            <ImpactMetrics />
          </Suspense>
          <Suspense fallback={<SectionSkeleton />}>
            <Features />
          </Suspense>
          <Suspense fallback={<SectionSkeleton />}>
            <HowItWorks />
          </Suspense>
          <Suspense fallback={<SectionSkeleton />}>
            <Pricing />
          </Suspense>
          <Suspense fallback={<SectionSkeleton />}>
            <CTA />
          </Suspense>
        </main>
        <Footer />
      </motion.div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
