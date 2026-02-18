import React, { Suspense, lazy, useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import SectionSkeleton from './components/SectionSkeleton';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { motion } from 'framer-motion';
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
const DataDeletionPage = lazy(() => import('./pages/DataDeletionPage'));
const LegalPage = lazy(() => import('./pages/LegalPage'));
const LegalIndexPage = lazy(() => import('./pages/LegalIndexPage'));
const LlmFaqDirectoryPage = lazy(() => import('./pages/LlmFaqDirectoryPage'));

const getNormalizedPath = () => {
  if (typeof window === 'undefined') return '/';
  const cleanedPath = window.location.pathname.replace(/\/+$/, '');
  return cleanedPath === '' ? '/' : cleanedPath;
};

const isEnglishRoutePath = (path: string) => path === '/en' || path.startsWith('/en/');

const stripEnglishRoutePrefix = (path: string) => {
  if (path === '/en') return '/';
  if (path.startsWith('/en/')) {
    const strippedPath = path.slice(3);
    return strippedPath === '' ? '/' : strippedPath;
  }
  return path;
};

const LOCALIZED_CONTENT_PATHS = new Set([
  '/',
  '/pricing',
  '/data-deletion',
  '/legal',
  '/terms',
  '/privacy',
]);

const AppContent: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [path, setPath] = useState(getNormalizedPath);

  const normalizedPath = stripEnglishRoutePrefix(path);
  const isEnglishPath = isEnglishRoutePath(path);
  const legalSlug = normalizedPath.startsWith('/') ? normalizedPath.slice(1) : normalizedPath;
  const isLegalIndexRoute = normalizedPath === '/legal';
  const isLegalRoute = legalDocSlugs.has(legalSlug);
  const isLlmFaqDirectoryRoute = normalizedPath === '/faqs-directory';
  const isPricingRoute = path === '/pricing' || path === '/en/pricing';
  const isDataDeletionRoute = path === '/data-deletion' || path === '/en/data-deletion';
  const isLocalizedContentRoute = LOCALIZED_CONTENT_PATHS.has(normalizedPath);

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
    if (!isLocalizedContentRoute) return;

    const routeLanguage = isEnglishPath ? 'en' : 'tr';
    if (language !== routeLanguage) {
      setLanguage(routeLanguage);
    }
  }, [isEnglishPath, isLocalizedContentRoute, language, setLanguage]);

  useEffect(() => {
    const seoRoute = getSeoRouteKeyByPath(path);
    const seoLanguage = isLocalizedContentRoute ? (isEnglishPath ? 'en' : 'tr') : language;
    document.documentElement.setAttribute('lang', seoLanguage);
    applySeoToDocument(document, getSeoByRoute(seoRoute, seoLanguage));
  }, [isEnglishPath, isLocalizedContentRoute, language, path]);

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
        <Suspense fallback={<SectionSkeleton />}>
          <LegalIndexPage />
        </Suspense>
      </div>
    );
  }

  if (isLegalRoute) {
    return (
      <div className="min-h-screen bg-white selection:bg-black selection:text-white">
        <Suspense fallback={<SectionSkeleton />}>
          <LegalPage slug={legalSlug} />
        </Suspense>
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

  if (isDataDeletionRoute) {
    return (
      <div className="min-h-screen bg-white selection:bg-black selection:text-white">
        <motion.div
          key="data-deletion-page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Navbar />
          <main>
            <Suspense fallback={<SectionSkeleton />}>
              <DataDeletionPage />
            </Suspense>
          </main>
          <Footer />
        </motion.div>
      </div>
    );
  }

  if (isLlmFaqDirectoryRoute) {
    return (
      <div className="min-h-screen bg-black selection:bg-white selection:text-black">
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
          <LlmFaqDirectoryPage />
        </Suspense>
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
