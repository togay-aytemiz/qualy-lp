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
import { focusHomeSectionByHashWithRetry } from './lib/home-section-focus';
import { isHomePath } from './lib/footer-links';
import { readStoredLanguagePreference, resolvePreferredHomePath } from './lib/language-preference';

const SuccessStories = lazy(() => import('./components/SuccessStories'));
const Challenges = lazy(() => import('./components/Challenges'));
const ImpactMetrics = lazy(() => import('./components/ImpactMetrics'));
const Features = lazy(() => import('./components/Features'));
const HowItWorks = lazy(() => import('./components/HowItWorks'));
const FAQ = lazy(() => import('./components/FAQ'));
const CTA = lazy(() => import('./components/CTA'));
const PricingPage = lazy(() => import('./pages/PricingPage'));

const getNormalizedPath = () => {
  if (typeof window === 'undefined') return '/';
  const cleanedPath = window.location.pathname.replace(/\/+$/, '');
  return cleanedPath === '' ? '/' : cleanedPath;
};

const AppContent: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [path, setPath] = useState(getNormalizedPath);

  const legalSlug = path.startsWith('/') ? path.slice(1) : path;
  const isLegalIndexRoute = path === '/legal';
  const isLegalRoute = legalDocSlugs.has(legalSlug);
  const isPricingRoute = path === '/pricing';

  useEffect(() => {
    const handleRouteChange = () => setPath(getNormalizedPath());
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  useEffect(() => {
    if (!isHomePath(path) || typeof window === 'undefined') return;

    const locales =
      navigator.languages && navigator.languages.length > 0
        ? navigator.languages
        : [navigator.language];
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const storedLanguage = readStoredLanguagePreference(window.localStorage);
    const preferredHomePath = resolvePreferredHomePath({
      currentPath: path === '/en' ? '/en' : '/',
      storedLanguage,
      locales,
      timeZone,
    });

    if (!preferredHomePath || path === preferredHomePath) return;

    const nextUrl = `${preferredHomePath}${window.location.hash}`;
    window.history.replaceState(window.history.state, '', nextUrl);
    setPath(getNormalizedPath());
  }, [path]);

  useEffect(() => {
    if (!isHomePath(path)) return;

    const routeLanguage = path === '/en' ? 'en' : 'tr';
    if (language !== routeLanguage) {
      setLanguage(routeLanguage);
    }
  }, [language, path, setLanguage]);

  useEffect(() => {
    const seoRoute = getSeoRouteKeyByPath(path);
    const seoLanguage = isHomePath(path) ? (path === '/en' ? 'en' : 'tr') : language;
    document.documentElement.setAttribute('lang', seoLanguage);
    applySeoToDocument(document, getSeoByRoute(seoRoute, seoLanguage));
  }, [language, path]);

  useEffect(() => {
    if (!isHomePath(path)) return;

    let stopFocusRetry = focusHomeSectionByHashWithRetry(window.location.hash);

    const handleHashChange = () => {
      stopFocusRetry();
      stopFocusRetry = focusHomeSectionByHashWithRetry(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      stopFocusRetry();
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [path]);

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

  if (isPricingRoute) {
    return (
      <div className="min-h-screen bg-white selection:bg-black selection:text-white">
        <motion.div
          key="pricing-page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Navbar />
          <main>
            <Suspense fallback={<SectionSkeleton />}>
              <PricingPage />
            </Suspense>
          </main>
          <Footer />
        </motion.div>
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
            <FAQ />
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
