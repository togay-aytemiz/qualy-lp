import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { Logo } from './Logo';

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

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
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
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Logo className="w-10 h-10" />
            <span className="text-lg font-bold tracking-tight text-slate-900">Qualy</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">{t.navbar.features}</a>
            <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">{t.navbar.howItWorks}</a>
            <a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">{t.navbar.pricing}</a>
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a href="#" className="text-sm font-semibold text-slate-900 hover:text-slate-700">{t.navbar.login}</a>
            <button className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-all flex items-center gap-2 group shadow-md hover:shadow-lg">
              {t.navbar.getStarted}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
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
            <a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} className="text-xl font-medium text-slate-900">{t.navbar.pricing}</a>
            <hr className="border-slate-100 w-1/2 mx-auto" />
            <a href="#" className="text-xl font-semibold text-slate-900">{t.navbar.login}</a>
            <button className="bg-slate-900 text-white w-full py-4 rounded-2xl text-lg font-medium shadow-xl">
              {t.navbar.getStarted}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;