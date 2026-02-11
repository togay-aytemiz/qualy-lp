import React from 'react';
import { useLanguage } from '../LanguageContext';
import { Globe, Mail, Phone } from 'lucide-react';
import { Logo } from './Logo';
import {
  buildHomeSectionHref,
  getProductFooterSectionId,
  isHomePath,
  type ProductFooterLinkKey,
} from '../lib/footer-links';

const Footer: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();

  const scrollToHomeSection = (e: React.MouseEvent<HTMLAnchorElement>, key: ProductFooterLinkKey) => {
    if (typeof window === 'undefined') return;

    const sectionId = getProductFooterSectionId(key);
    const targetHref = buildHomeSectionHref(sectionId);

    e.preventDefault();

    if (!isHomePath(window.location.pathname)) {
      window.location.href = targetHref;
      return;
    }

    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    window.location.hash = sectionId;
  };

  return (
    <div className="relative w-full overflow-hidden bg-white px-8 py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between text-sm text-slate-500 sm:flex-row md:px-8">
        
        {/* Left Side: Logo & Info */}
        <div>
          <div className="mr-0 mb-4 md:mr-4 md:flex">
            <a className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black" href="/">
              <Logo className="h-7 w-auto" />
            </a>
          </div>
          <div className="mt-2 ml-2">
            © {new Date().getFullYear()} Qualy Inc. {t.footer.rights}
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
              <button 
                onClick={() => setLanguage('en')} 
                className={`transition-colors ${language === 'en' ? 'text-black' : 'text-slate-400 hover:text-slate-600'}`}
              >
                EN
              </button>
              <span className="text-slate-300">|</span>
              <button 
                onClick={() => setLanguage('tr')} 
                className={`transition-colors ${language === 'tr' ? 'text-black' : 'text-slate-400 hover:text-slate-600'}`}
              >
                TR
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Grid of Links */}
        <div className="mt-10 grid grid-cols-2 items-start gap-10 sm:mt-0 md:mt-0 lg:grid-cols-2">
          
          {/* Column 1: Product */}
          <div className="flex w-full flex-col justify-center space-y-4">
            <p className="font-bold text-slate-900 transition-colors">{t.footer.product}</p>
            <ul className="list-none space-y-4 text-slate-600 transition-colors">
              <li className="list-none">
                <a className="hover:text-slate-900 transition-colors" href={buildHomeSectionHref('features')} onClick={(e) => scrollToHomeSection(e, 'features')}>
                  {t.footer.features}
                </a>
              </li>
              <li className="list-none">
                <a className="hover:text-slate-900 transition-colors" href={buildHomeSectionHref('pricing')} onClick={(e) => scrollToHomeSection(e, 'pricing')}>
                  {t.navbar.pricing}
                </a>
              </li>
              <li className="list-none">
                <a className="hover:text-slate-900 transition-colors" href={buildHomeSectionHref('testimonials')} onClick={(e) => scrollToHomeSection(e, 'leadScoring')}>
                  {t.footer.leadScoring}
                </a>
              </li>
              <li className="list-none">
                <a className="hover:text-slate-900 transition-colors" href={buildHomeSectionHref('how-it-works')} onClick={(e) => scrollToHomeSection(e, 'updates')}>
                  {t.footer.updates}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Legal */}
          <div className="flex flex-col justify-center space-y-4">
            <p className="font-bold text-slate-900 transition-colors">{t.footer.legal}</p>
            <ul className="list-none space-y-4 text-slate-600 transition-colors">
               <li className="list-none"><a className="hover:text-slate-900 transition-colors" href="/legal">{t.footer.legalCenter}</a></li>
               <li className="list-none"><a className="hover:text-slate-900 transition-colors" href="/privacy">{t.footer.privacy}</a></li>
               <li className="list-none"><a className="hover:text-slate-900 transition-colors" href="/terms">{t.footer.terms}</a></li>
            </ul>
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
