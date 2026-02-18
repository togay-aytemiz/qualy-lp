import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { Logo } from './Logo';
import { AUTH_URLS } from '../lib/auth-links';
import { focusHomeSectionById } from '../lib/home-section-focus';
import { isHomePath } from '../lib/footer-links';
import { homePathByLanguage } from '../lib/region-language';

type DemoFormData = {
  fullName: string;
  email: string;
  phone: string;
  note: string;
};

const initialDemoFormData: DemoFormData = {
  fullName: '',
  email: '',
  phone: '',
  note: '',
};

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoFormData, setDemoFormData] = useState<DemoFormData>(initialDemoFormData);
  const [demoFormError, setDemoFormError] = useState<string | null>(null);
  const { t, language } = useLanguage();
  const homePath = homePathByLanguage(language);
  const pricingPath = language === 'en' ? '/en/pricing' : '/pricing';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isDemoModalOpen || typeof window === 'undefined') return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDemoModalOpen(false);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isDemoModalOpen]);

  const isHomeRoute = () => isHomePath(window.location.pathname);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (typeof window === 'undefined') return;
    e.preventDefault();

    if (!isHomeRoute()) {
      setIsMobileMenuOpen(false);
      window.location.href = `${homePath}#${id}`;
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

  const openDemoModalFromMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setDemoFormData(initialDemoFormData);
    setDemoFormError(null);
    setIsDemoModalOpen(true);
  };

  const closeDemoModal = () => {
    setDemoFormError(null);
    setIsDemoModalOpen(false);
  };

  const updateDemoField = (field: keyof DemoFormData) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (demoFormError) {
      setDemoFormError(null);
    }
    setDemoFormData((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleDemoFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedFullName = demoFormData.fullName.trim();
    const trimmedEmail = demoFormData.email.trim();
    const trimmedPhone = demoFormData.phone.trim();
    const trimmedNote = demoFormData.note.trim();

    if (!trimmedFullName) {
      setDemoFormError(t.hero.demoModal.errors.fullNameRequired);
      return;
    }

    if (!trimmedEmail && !trimmedPhone) {
      setDemoFormError(t.hero.demoModal.errors.contactRequired);
      return;
    }

    const subject = `${t.hero.demoModal.mailSubject} - ${trimmedFullName}`;
    const body = [
      `${t.hero.demoModal.mailLabelName}: ${trimmedFullName}`,
      `${t.hero.demoModal.mailLabelEmail}: ${trimmedEmail || '-'}`,
      `${t.hero.demoModal.mailLabelPhone}: ${trimmedPhone || '-'}`,
      `${t.hero.demoModal.mailLabelNote}: ${trimmedNote || '-'}`,
    ].join('\n');
    const mailtoHref = `mailto:askqualy@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    if (typeof window !== 'undefined') {
      window.location.href = mailtoHref;
    }

    setIsDemoModalOpen(false);
  };

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
          <a href={homePath} className="flex items-center gap-2">
            <Logo className="h-7 w-auto" />
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">{t.navbar.features}</a>
            <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">{t.navbar.howItWorks}</a>
            <a href="#faq" onClick={(e) => scrollToSection(e, 'faq')} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">{t.navbar.faq}</a>
            <a href={pricingPath} onClick={handlePricingClick} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">{t.navbar.pricing}</a>
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
          <div className="mx-auto flex h-full w-full max-w-md flex-col pb-10 text-center">
            <div className="flex flex-col gap-6">
              <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="text-xl font-medium text-slate-900">{t.navbar.features}</a>
              <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="text-xl font-medium text-slate-900">{t.navbar.howItWorks}</a>
              <a href="#faq" onClick={(e) => scrollToSection(e, 'faq')} className="text-xl font-medium text-slate-900">{t.navbar.faq}</a>
              <a href={pricingPath} onClick={handlePricingClick} className="text-xl font-medium text-slate-900">{t.navbar.pricing}</a>
              <hr className="border-slate-100 w-1/2 mx-auto" />
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <a
                href={AUTH_URLS.register}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full rounded-full bg-slate-900 py-4 text-lg font-medium text-white shadow-xl"
              >
                {t.navbar.getStarted}
              </a>
              <button
                type="button"
                onClick={openDemoModalFromMobileMenu}
                className="w-full rounded-full border border-slate-300 bg-white py-4 text-lg font-medium text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-colors hover:bg-slate-50"
              >
                {t.hero.ctaSecondary}
              </button>
            </div>

            <a
              href={AUTH_URLS.login}
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-auto pt-8 text-xl font-semibold text-slate-900"
            >
              {t.navbar.login}
            </a>
          </div>
        </div>
      )}

      {isDemoModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/55 px-4 py-6" onClick={closeDemoModal}>
          <div
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="navbar-demo-modal-title"
            className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_64px_rgba(15,23,42,0.35)] sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="navbar-demo-modal-title" className="text-2xl font-semibold text-slate-900">
                  {t.hero.demoModal.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{t.hero.demoModal.subtitle}</p>
              </div>
              <button
                type="button"
                aria-label={t.hero.demoModal.closeLabel}
                onClick={closeDemoModal}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleDemoFormSubmit}>
              <div className="space-y-1.5">
                <label htmlFor="navbar-demo-full-name" className="text-sm font-medium text-slate-800">
                  {t.hero.demoModal.fullNameLabel}
                </label>
                <input
                  id="navbar-demo-full-name"
                  type="text"
                  value={demoFormData.fullName}
                  onChange={updateDemoField('fullName')}
                  placeholder={t.hero.demoModal.fullNamePlaceholder}
                  className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="navbar-demo-email" className="text-sm font-medium text-slate-800">
                    {t.hero.demoModal.emailLabel}
                  </label>
                  <input
                    id="navbar-demo-email"
                    type="email"
                    value={demoFormData.email}
                    onChange={updateDemoField('email')}
                    placeholder={t.hero.demoModal.emailPlaceholder}
                    className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="navbar-demo-phone" className="text-sm font-medium text-slate-800">
                    {t.hero.demoModal.phoneLabel}
                  </label>
                  <input
                    id="navbar-demo-phone"
                    type="tel"
                    value={demoFormData.phone}
                    onChange={updateDemoField('phone')}
                    placeholder={t.hero.demoModal.phonePlaceholder}
                    className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                </div>
              </div>

              <p className="text-xs text-slate-500">{t.hero.demoModal.contactHint}</p>

              <div className="space-y-1.5">
                <label htmlFor="navbar-demo-note" className="text-sm font-medium text-slate-800">
                  {t.hero.demoModal.noteLabel}
                </label>
                <textarea
                  id="navbar-demo-note"
                  value={demoFormData.note}
                  onChange={updateDemoField('note')}
                  placeholder={t.hero.demoModal.notePlaceholder}
                  rows={4}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>

              {demoFormError && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{demoFormError}</p>
              )}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeDemoModal}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-slate-300 px-6 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                >
                  {t.hero.demoModal.cancel}
                </button>
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-slate-900 px-6 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                >
                  {t.hero.demoModal.submit}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
