import React from 'react';
import { useLanguage } from '../LanguageContext';
import { Globe, Mail, Phone } from 'lucide-react';
import { Logo } from './Logo';
import {
  buildHomeSectionHref,
  getProductFooterSectionId,
  isHomePath,
  type ProductFooterSectionKey,
} from '../lib/footer-links';
import { focusHomeSectionById } from '../lib/home-section-focus';
import { writeStoredLanguagePreference } from '../lib/language-preference';
import { homePathByLanguage } from '../lib/region-language';

const Footer: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const homePath = homePathByLanguage(language);
  const pricingPath = language === 'en' ? '/en/pricing' : '/pricing';
  const legalPath = language === 'en' ? '/en/legal' : '/legal';
  const privacyPath = language === 'en' ? '/en/privacy' : '/privacy';
  const termsPath = language === 'en' ? '/en/terms' : '/terms';
  const llmResources = [
    { href: '/llms.txt', label: t.footer.readLlmsTxt },
    { href: '/llms-full.txt', label: t.footer.readLlmsFullTxt },
    { href: '/faqs.md', label: t.footer.readFaqsMarkdown },
    { href: '/faqs-directory', label: t.footer.faqsDirectory },
  ];

  const handleLanguageChange = (nextLanguage: 'en' | 'tr') => {
    if (typeof window !== 'undefined') {
      writeStoredLanguagePreference(nextLanguage, window.localStorage);
    }

    setLanguage(nextLanguage);

    if (typeof window === 'undefined') return;
    if (!isHomePath(window.location.pathname)) return;

    const targetHomePath = homePathByLanguage(nextLanguage);
    const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
    if (currentPath === targetHomePath) return;

    window.history.pushState(window.history.state, '', `${targetHomePath}${window.location.hash}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleLanguageLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    nextLanguage: 'en' | 'tr',
  ) => {
    event.preventDefault();
    handleLanguageChange(nextLanguage);
  };

  const scrollToHomeSection = (e: React.MouseEvent<HTMLAnchorElement>, key: ProductFooterSectionKey) => {
    if (typeof window === 'undefined') return;

    const sectionId = getProductFooterSectionId(key);
    const targetHref = buildHomeSectionHref(sectionId, homePath);

    e.preventDefault();

    if (!isHomePath(window.location.pathname)) {
      window.location.href = targetHref;
      return;
    }

    if (focusHomeSectionById(sectionId)) {
      return;
    }

    window.location.hash = sectionId;
  };

  const renderLlmResources = ({
    summaryId,
    contentId,
    className,
  }: {
    summaryId: string;
    contentId: string;
    className: string;
  }) => (
    <details className={className} role="group" aria-labelledby={summaryId}>
      <summary
        id={summaryId}
        className="list-none cursor-pointer select-none text-sm font-semibold text-slate-900 transition-colors"
        role="button"
        aria-controls={contentId}
      >
        {t.footer.llmResources}
        <span className="ml-1 inline-block transition-transform group-open:rotate-180" aria-hidden="true">
          ▼
        </span>
      </summary>
      <ul id={contentId} role="list" className="my-4 space-y-3" aria-labelledby={summaryId}>
        {llmResources.map((resource) => (
          <li key={`${summaryId}-${resource.href}`}>
            <a
              href={resource.href}
              className="block text-sm leading-6 text-slate-600 transition-colors hover:text-slate-900"
            >
              {resource.label}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );

  return (
    <div className="relative w-full overflow-hidden bg-white px-8 py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between text-sm text-slate-500 sm:flex-row md:px-8">
        
        {/* Left Side: Logo & Info */}
        <div>
          <div className="mr-0 mb-4 md:mr-4 md:flex">
            <a className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black" href={homePath}>
              <Logo className="h-7 w-auto" />
            </a>
          </div>
          <div className="mt-2 ml-2">
            © {new Date().getFullYear()} Qualy. {t.footer.rights}
          </div>

          <div className="mt-4 ml-2 flex items-center gap-2">
            <a
              href="mailto:askqualy@gmail.com"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
              aria-label="Email Qualy"
            >
              <Mail className="h-3.5 w-3.5 text-slate-500" />
              <span className="sr-only">E-posta gönder</span>
            </a>
            <a
              href="tel:+905074699692"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
              aria-label="Call Qualy"
            >
              <Phone className="h-3.5 w-3.5 text-slate-500" />
              <span className="sr-only">Telefonla ara</span>
            </a>
          </div>
          
          {/* Language Switcher */}
          <div className="mt-6 ml-2 inline-flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
            <Globe className="w-3 h-3 text-slate-400" />
            <div className="flex gap-2 font-semibold text-xs">
              <a
                href={homePathByLanguage('en')}
                onClick={(event) => handleLanguageLinkClick(event, 'en')}
                aria-current={language === 'en' ? 'page' : undefined}
                className={`transition-colors ${language === 'en' ? 'text-black' : 'text-slate-600 hover:text-slate-900'}`}
              >
                EN
              </a>
              <span className="text-slate-300">|</span>
              <a
                href={homePathByLanguage('tr')}
                onClick={(event) => handleLanguageLinkClick(event, 'tr')}
                aria-current={language === 'tr' ? 'page' : undefined}
                className={`transition-colors ${language === 'tr' ? 'text-black' : 'text-slate-600 hover:text-slate-900'}`}
              >
                TR
              </a>
            </div>
          </div>

          {renderLlmResources({
            summaryId: 'llm-resources-desktop-summary',
            contentId: 'llm-resources-desktop-content',
            className: 'group mt-6 ml-2 hidden md:block',
          })}
        </div>

        {/* Right Side: Grid of Links */}
        <div className="mt-10 grid grid-cols-1 items-start gap-10 sm:mt-0 sm:grid-cols-2 md:mt-0">
          
          {/* Column 1: Product */}
          <div className="flex w-full flex-col justify-center space-y-4">
            <p className="font-bold text-slate-900 transition-colors">{t.footer.product}</p>
            <ul className="list-none space-y-4 text-slate-600 transition-colors">
              <li className="list-none">
                <a className="hover:text-slate-900 transition-colors" href={buildHomeSectionHref('features', homePath)} onClick={(e) => scrollToHomeSection(e, 'features')}>
                  {t.footer.features}
                </a>
              </li>
              <li className="list-none">
                <a className="hover:text-slate-900 transition-colors" href={buildHomeSectionHref('faq', homePath)} onClick={(e) => scrollToHomeSection(e, 'faq')}>
                  {t.navbar.faq}
                </a>
              </li>
              <li className="list-none">
                <a className="hover:text-slate-900 transition-colors" href={pricingPath}>
                  {t.navbar.pricing}
                </a>
              </li>
              <li className="list-none">
                <a className="hover:text-slate-900 transition-colors" href={buildHomeSectionHref('testimonials', homePath)} onClick={(e) => scrollToHomeSection(e, 'leadScoring')}>
                  {t.footer.leadScoring}
                </a>
              </li>
              <li className="list-none">
                <a className="hover:text-slate-900 transition-colors" href={buildHomeSectionHref('how-it-works', homePath)} onClick={(e) => scrollToHomeSection(e, 'updates')}>
                  {t.footer.updates}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Legal */}
          <div className="flex flex-col justify-center space-y-4">
            <p className="font-bold text-slate-900 transition-colors">{t.footer.legal}</p>
            <ul className="list-none space-y-4 text-slate-600 transition-colors">
               <li className="list-none"><a className="hover:text-slate-900 transition-colors" href={legalPath}>{t.footer.legalCenter}</a></li>
               <li className="list-none"><a className="hover:text-slate-900 transition-colors" href={privacyPath}>{t.footer.privacy}</a></li>
               <li className="list-none"><a className="hover:text-slate-900 transition-colors" href={termsPath}>{t.footer.terms}</a></li>
            </ul>
          </div>

          {renderLlmResources({
            summaryId: 'llm-resources-mobile-summary',
            contentId: 'llm-resources-mobile-content',
            className: 'group md:hidden sm:col-span-2',
          })}

        </div>
      </div>
      
      {/* Big Text Background */}
      <div className="pointer-events-none mt-20 flex select-none justify-center pb-4 lg:pb-12">
        <img
          src="/text-black.svg"
          alt="Qualy text logo background"
          className="h-auto w-[96vw] opacity-[0.2] sm:w-[90vw] md:w-[72vw] lg:w-[62vw] xl:w-[56vw] 2xl:w-[52vw]"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 34%, black 100%)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 34%, black 100%)',
          }}
          loading="lazy"
          decoding="async"
        />
      </div>

    </div>
  );
};

export default Footer;
