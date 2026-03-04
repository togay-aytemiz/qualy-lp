import React from 'react';
import { useLanguage } from '../LanguageContext';
import { Globe, Mail, Phone } from 'lucide-react';
import { RiMetaFill } from 'react-icons/ri';
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
  const aboutPath = language === 'en' ? '/en/about' : '/about';
  const legalPath = language === 'en' ? '/en/legal' : '/legal';
  const privacyPath = language === 'en' ? '/en/privacy' : '/privacy';
  const termsPath = language === 'en' ? '/en/terms' : '/terms';
  const cancellationRefundPath = language === 'en' ? '/en/cancellation-refund' : '/cancellation-refund';
  const distanceSalesAgreementPath = language === 'en'
    ? '/en/distance-sales-agreement'
    : '/distance-sales-agreement';
  const iyzicoFooterBandPath = '/payment-logos/iyzico/footer/iyzico-payment-band-colored.svg';
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
      <div className="mx-auto max-w-7xl text-sm text-slate-500 md:px-8">
        {/* Top Row: Brand + Payment Band */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="mr-0 flex flex-wrap items-center gap-2 md:mr-4">
            <a className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black" href={homePath}>
              <Logo className="h-7 w-auto" />
            </a>
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white py-1.5 pl-2.5 pr-3 shadow-[0_1px_1px_rgba(15,23,42,0.04)]">
              <RiMetaFill className="h-5 w-5 text-[#0866FF]" aria-hidden="true" />
              <span className="ml-1.5 flex flex-col leading-none">
                <span className="text-[15px] font-semibold tracking-[-0.01em] text-slate-800">Meta</span>
                <span className="text-[10px] font-semibold tracking-[0.08em] text-slate-500">Tech Provider</span>
              </span>
            </span>
          </div>

          <img
            data-payment-band="iyzico"
            src={iyzicoFooterBandPath}
            alt={
              language === 'en'
                ? 'Secure payments via iyzico, Visa, Mastercard, American Express, and Troy'
                : 'iyzico, Visa, Mastercard, American Express ve Troy ile guvenli odeme'
            }
            className="h-7 w-auto"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="mt-4 ml-2">
          © {new Date().getFullYear()} Qualy. {t.footer.rights}
        </div>

        {/* Bottom Row: Links + Utilities */}
        <div className="mt-10 flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          {/* Left Side: Grid of Links */}
          <div className="grid grid-cols-1 items-start gap-10 sm:flex-1 sm:grid-cols-3 sm:gap-x-12">
            {/* Column 1: Product */}
            <div className="flex w-full flex-col items-start space-y-4">
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
            <div className="flex w-full flex-col items-start space-y-4">
              <p className="font-bold text-slate-900 transition-colors">{t.footer.legal}</p>
              <ul className="list-none space-y-4 text-slate-600 transition-colors">
                 <li className="list-none"><a className="hover:text-slate-900 transition-colors" href={legalPath}>{t.footer.legalCenter}</a></li>
                 <li className="list-none"><a className="hover:text-slate-900 transition-colors" href={privacyPath}>{t.footer.privacy}</a></li>
                 <li className="list-none"><a className="hover:text-slate-900 transition-colors" href={termsPath}>{t.footer.terms}</a></li>
                 <li className="list-none"><a className="hover:text-slate-900 transition-colors" href={cancellationRefundPath}>{t.footer.cancellationRefund}</a></li>
                 <li className="list-none"><a className="hover:text-slate-900 transition-colors" href={distanceSalesAgreementPath}>{t.footer.distanceSalesAgreement}</a></li>
              </ul>
            </div>

            {/* Column 3: Contact */}
            <div className="flex w-full flex-col items-start space-y-4">
              <p className="font-bold text-slate-900 transition-colors">{t.footer.contact}</p>
              <ul className="list-none space-y-4 text-slate-600 transition-colors">
                <li className="list-none">
                  <a className="hover:text-slate-900 transition-colors" href={aboutPath}>{t.footer.about}</a>
                </li>
                <li className="list-none">
                  <a
                    href="mailto:askqualy@gmail.com"
                    className="flex items-center gap-2 transition-colors hover:text-slate-900"
                  >
                    <Mail className="h-4 w-4 text-slate-500" />
                    <span>askqualy@gmail.com</span>
                  </a>
                </li>
                <li className="list-none">
                  <a
                    href="tel:+905074699692"
                    className="flex items-center gap-2 transition-colors hover:text-slate-900"
                  >
                    <Phone className="h-4 w-4 text-slate-500" />
                    <span>+90 507 469 9692</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Utilities */}
          <div className="flex flex-col items-start gap-6 sm:ml-8 sm:items-end">
            {/* Language Switcher */}
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
              <Globe className="h-3 w-3 text-slate-400" />
              <div className="flex gap-2 text-xs font-semibold">
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
              className: 'group w-full sm:w-auto',
            })}
          </div>
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
