import React from 'react';
import { useLanguage } from '../LanguageContext';
import { Globe } from 'lucide-react';
import { Logo } from './Logo';

const Footer: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="relative w-full overflow-hidden bg-white px-8 py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between text-sm text-slate-500 sm:flex-row md:px-8">
        
        {/* Left Side: Logo & Info */}
        <div>
          <div className="mr-0 mb-4 md:mr-4 md:flex">
            <a className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black" href="/">
              <Logo className="w-10 h-10" />
              <span className="font-bold text-lg text-slate-900">Qualy</span>
            </a>
          </div>
          <div className="mt-2 ml-2">
            © {new Date().getFullYear()} Qualy Inc. {t.footer.rights}
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
        <div className="mt-10 grid grid-cols-2 items-start gap-10 sm:mt-0 md:mt-0 lg:grid-cols-4">
          
          {/* Column 1: Product */}
          <div className="flex w-full flex-col justify-center space-y-4">
            <p className="font-bold text-slate-900 transition-colors">{t.footer.product}</p>
            <ul className="list-none space-y-4 text-slate-600 transition-colors">
              <li className="list-none"><a className="hover:text-slate-900 transition-colors" href="#features">{t.footer.features}</a></li>
              <li className="list-none"><a className="hover:text-slate-900 transition-colors" href="#pricing">{t.navbar.pricing}</a></li>
              <li className="list-none"><a className="hover:text-slate-900 transition-colors" href="#">{t.footer.leadScoring}</a></li>
              <li className="list-none"><a className="hover:text-slate-900 transition-colors" href="#">{t.footer.updates}</a></li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div className="flex flex-col justify-center space-y-4">
            <p className="font-bold text-slate-900 transition-colors">{t.footer.resources}</p>
            <ul className="list-none space-y-4 text-slate-600 transition-colors">
               <li className="list-none"><a className="hover:text-slate-900 transition-colors" href="#">{t.footer.docs}</a></li>
               <li className="list-none"><a className="hover:text-slate-900 transition-colors" href="#">{t.footer.api}</a></li>
               <li className="list-none"><a className="hover:text-slate-900 transition-colors" href="#">{t.footer.community}</a></li>
               <li className="list-none"><a className="hover:text-slate-900 transition-colors" href="#">{t.footer.help}</a></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="flex flex-col justify-center space-y-4">
            <p className="font-bold text-slate-900 transition-colors">{t.footer.company}</p>
            <ul className="list-none space-y-4 text-slate-600 transition-colors">
              <li className="list-none"><a className="hover:text-slate-900 transition-colors" href="#">{t.footer.about}</a></li>
              <li className="list-none"><a className="hover:text-slate-900 transition-colors" href="#">{t.footer.blog}</a></li>
              <li className="list-none"><a className="hover:text-slate-900 transition-colors" href="#">{t.footer.careers}</a></li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="flex flex-col justify-center space-y-4">
            <p className="font-bold text-slate-900 transition-colors">{t.footer.legal}</p>
            <ul className="list-none space-y-4 text-slate-600 transition-colors">
               <li className="list-none"><a className="hover:text-slate-900 transition-colors" href="#">{t.footer.privacy}</a></li>
               <li className="list-none"><a className="hover:text-slate-900 transition-colors" href="#">{t.footer.terms}</a></li>
            </ul>
          </div>

        </div>
      </div>
      
      {/* Big Text Background */}
      <p className="inset-x-0 mt-20 bg-gradient-to-b from-slate-50 to-slate-200 bg-clip-text text-center text-5xl font-bold text-transparent md:text-9xl lg:text-[12rem] xl:text-[13rem] select-none pointer-events-none pb-4 lg:pb-12">
        Qualy
      </p>
    </div>
  );
};

export default Footer;