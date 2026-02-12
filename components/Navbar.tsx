import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { Logo } from './Logo';
import { AUTH_URLS } from '../lib/auth-links';
import { focusHomeSectionById } from '../lib/home-section-focus';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomeRoute = () => window.location.pathname === '/' || window.location.pathname === '';

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (typeof window === 'undefined') return;
    e.preventDefault();

    if (!isHomeRoute()) {
      setIsMobileMenuOpen(false);
      window.location.href = `/#${id}`;
      return;
    }

    if (focusHomeSectionById(id)) {
      setIsMobileMenuOpen(false);
      return;
    }

    window.location.hash = id;
    setIsMobileMenuOpen(false);
  };

  const handlePricingClick = () => setIsMobileMenuOpen(false);

  return (
    <>
      <nav
        className={`fixed top-4 left-0 right-0 z-50 transition-all duration-300 flex justify-center px-4 md:px-8`}
      >
        <div 
          className={`
            w-full max-w-7xl rounded-full transition-all duration-300 border
            flex items-center justify-between px-6 py-3 md:px-6
            ${isScrolled 
              ? 'bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-lg shadow-slate-200/20' 
              : 'bg-white/50 backdrop-blur-sm border-transparent'
            }
          `}
        >
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <Logo className="h-7 w-auto" />
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">{t.navbar.features}</a>
            <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">{t.navbar.howItWorks}</a>
            <a href="#faq" onClick={(e) => scrollToSection(e, 'faq')} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">{t.navbar.faq}</a>
            <a href="/pricing" onClick={handlePricingClick} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">{t.navbar.pricing}</a>
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a href={AUTH_URLS.login} className="text-sm font-semibold text-slate-900 hover:text-slate-700">{t.navbar.login}</a>
            <a href={AUTH_URLS.register} className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-all flex items-center gap-2 group shadow-md hover:shadow-lg">
              {t.navbar.getStarted}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-slate-900 p-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden animate-in fade-in slide-in-from-top-10 duration-200">
          <div className="flex flex-col gap-6 text-center">
            <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="text-xl font-medium text-slate-900">{t.navbar.features}</a>
            <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="text-xl font-medium text-slate-900">{t.navbar.howItWorks}</a>
            <a href="#faq" onClick={(e) => scrollToSection(e, 'faq')} className="text-xl font-medium text-slate-900">{t.navbar.faq}</a>
            <a href="/pricing" onClick={handlePricingClick} className="text-xl font-medium text-slate-900">{t.navbar.pricing}</a>
            <hr className="border-slate-100 w-1/2 mx-auto" />
            <a href={AUTH_URLS.login} className="text-xl font-semibold text-slate-900">{t.navbar.login}</a>
            <a href={AUTH_URLS.register} className="bg-slate-900 text-white w-full py-4 rounded-2xl text-lg font-medium shadow-xl block">
              {t.navbar.getStarted}
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
