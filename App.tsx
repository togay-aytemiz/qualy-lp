import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SuccessStories from './components/SuccessStories';
import Challenges from './components/Challenges';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import CTA from './components/CTA';
import Footer from './components/Footer';
import Loader from './components/Loader';
import { LanguageProvider } from './LanguageContext';
import { AnimatePresence, motion } from 'framer-motion';
import LegalPage from './pages/LegalPage';
import LegalIndexPage from './pages/LegalIndexPage';
import { legalDocSlugs } from './lib/legal';

const getNormalizedPath = () => {
  if (typeof window === 'undefined') return '/';
  const cleanedPath = window.location.pathname.replace(/\/+$/, '');
  return cleanedPath === '' ? '/' : cleanedPath;
};

const App: React.FC = () => {
  const [path, setPath] = useState(getNormalizedPath);
  const [loading, setLoading] = useState(path === '/');

  const isHomeRoute = path === '/';
  const legalSlug = path.startsWith('/') ? path.slice(1) : path;
  const isLegalIndexRoute = path === '/legal';
  const isLegalRoute = legalDocSlugs.has(legalSlug);

  useEffect(() => {
    const handleRouteChange = () => setPath(getNormalizedPath());
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  useEffect(() => {
    if (!isHomeRoute) {
      setLoading(false);
      return;
    }

    setLoading(true);
    // Wait for 2.5 seconds to simulate loading and ensure CSS is ready
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [isHomeRoute]);

  if (isLegalIndexRoute) {
    return (
      <LanguageProvider>
        <div className="min-h-screen bg-white selection:bg-black selection:text-white">
          <LegalIndexPage />
        </div>
      </LanguageProvider>
    );
  }

  if (isLegalRoute) {
    return (
      <LanguageProvider>
        <div className="min-h-screen bg-white selection:bg-black selection:text-white">
          <LegalPage slug={legalSlug} />
        </div>
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-white selection:bg-black selection:text-white">
        <AnimatePresence mode="wait">
          {loading ? (
            <Loader key="loader" />
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Navbar />
              <main>
                <Hero />
                <SuccessStories />
                <Challenges />
                <Features />
                <HowItWorks />
                <Pricing />
                <CTA />
              </main>
              <Footer />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LanguageProvider>
  );
};

export default App;
