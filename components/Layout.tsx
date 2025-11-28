import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, X, Globe, User, LogOut, LayoutDashboard,
  Briefcase, MessageSquare, Home as HomeIcon, Info, CreditCard
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext'; // ✅ Using Real Auth

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  // ✅ REPLACED: Mock user state with Real Auth Context
  const { user, signOut } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const { lang, toggleLang, t, isRTL } = useLanguage();

  // Scroll to top on route change (excluding hash changes handled manually)
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    // ✅ REPLACED: Mock sign out with Real sign out
    await signOut();
    navigate('/');
  };

  const navLinks = [
    { name: t('nav.home'), path: '/', icon: <HomeIcon size={18} /> },
    { name: t('nav.about'), path: '/#about', icon: <Info size={18} /> },
    { name: t('nav.services'), path: '/#services', icon: <Briefcase size={18} /> },
    { name: t('nav.contact'), path: '/contact', icon: <MessageSquare size={18} /> },
    { name: t('nav.pricing'), path: '/pricing', icon: <CreditCard size={18} /> },
  ];

  if (user?.role === 'admin') {
    navLinks.push({ name: t('nav.admin'), path: '/admin', icon: <LayoutDashboard size={18} /> });
  }

  const handleNavClick = (path: string) => {
    setIsOpen(false);

    // Case 1: Clicking Home explicitly when already on Home
    if (path === '/' && location.pathname === '/' && !location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Case 2: Hash Link (e.g. /#about or /#services)
    if (path.startsWith('/#')) {
      const id = path.replace('/#', '');

      if (location.pathname === '/') {
        // If on Home, scroll to element
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          // Update URL without causing a reload, to manage active state
          window.history.pushState(null, '', path);
          // Sync with router
          navigate(path, { replace: true });
        }
      } else {
        // If on another page, navigate to Home with hash
        // The Home component's useEffect will handle the scrolling
        navigate(path);
      }
    } else {
      // Case 3: Standard Page Link
      navigate(path);
      window.scrollTo(0, 0);
    }
  };

  // Helper to determine if a link is active
  const checkActive = (linkPath: string) => {
    const currentPath = location.pathname;
    const currentHash = location.hash;

    // 1. Exact Home Match (No Hash)
    if (linkPath === '/') {
      return currentPath === '/' && (!currentHash || currentHash === '');
    }

    // 2. Hash Match (e.g. /#about)
    if (linkPath.startsWith('/#')) {
      const targetHash = linkPath.replace('/', ''); // #about
      return currentPath === '/' && currentHash === targetHash;
    }

    // 3. Sub-route Match (e.g. /services -> /services/consultation)
    if (linkPath !== '/') {
      return currentPath === linkPath || currentPath.startsWith(linkPath + '/');
    }

    return false;
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans text-charcoal bg-background ${isRTL ? 'font-cairo' : 'font-poppins'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <nav className="bg-primary text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <div className="flex-shrink-0 cursor-pointer" onClick={() => handleNavClick('/')}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center shadow-lg">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-5 h-5">
                    <path d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
                </div>
                <span className="font-bold text-xl tracking-tight hover:text-gray-200 transition-colors">
                  {t('common.growthNexus')}
                </span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ms-10 flex items-baseline space-x-4 rtl:space-x-reverse">
                {navLinks.map((link) => {
                  const isActive = checkActive(link.path);
                  return (
                    <button
                      key={link.name}
                      onClick={() => handleNavClick(link.path)}
                      className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors duration-200
                        ${isActive
                          ? 'bg-secondary text-white shadow-sm'
                          : 'text-gray-300 hover:bg-blue-800 hover:text-white'}`}
                    >
                      {link.icon}
                      {link.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={toggleLang}
                className="p-2 rounded-full hover:bg-blue-800 transition-colors flex items-center gap-1 text-sm font-medium"
              >
                <Globe size={18} />
                <span>{t('nav.switchToAr')}</span>
              </button>

              {user ? (
                <div className="flex items-center gap-3 bg-blue-900/50 px-3 py-1 rounded-full border border-blue-700">
                  <User size={16} className="text-secondary" />
                  {/* ✅ UPDATED: Handle safe access to name */}
                  <span className="text-xs font-light tracking-wide">{user.full_name || user.email}</span>
                  <button onClick={handleLogout} className="text-gray-400 hover:text-white transition-colors" title={t('common.signOut')}>
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="bg-accent hover:bg-yellow-600 text-white px-5 py-1.5 rounded-full text-sm font-bold transition-transform hover:scale-105 shadow-md"
                >
                  {t('common.signIn')}
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="-me-2 flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-blue-800 inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-blue-700 focus:outline-none"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-primary border-t border-blue-800 shadow-xl">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => {
                const isActive = checkActive(link.path);
                return (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.path)}
                    className={`w-full text-start px-3 py-3 rounded-md text-base font-medium flex items-center gap-3
                      ${isActive ? 'bg-secondary text-white' : 'text-gray-300 hover:text-white hover:bg-blue-800'}`}
                  >
                    {link.icon} {link.name}
                  </button>
                );
              })}
              <button
                onClick={() => { toggleLang(); setIsOpen(false); }}
                className="w-full text-start px-3 py-3 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-blue-800 flex items-center gap-3 border-t border-blue-800 mt-2"
              >
                <Globe size={18} />
                {t('nav.switchToAr')}
              </button>
              {!user && (
                <button
                  onClick={() => { navigate('/login'); setIsOpen(false); }}
                  className="w-full text-start px-3 py-3 rounded-md text-base font-medium text-accent hover:text-white flex items-center gap-3"
                >
                  <User size={18} />
                  {t('common.signIn')}
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-gray-300 py-10 border-t border-blue-800">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-5 h-5">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </div>
              <span className="font-bold text-xl text-white">{t('common.growthNexus')}</span>
            </div>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              {t('home.aboutText1')}
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">{t('common.learnMore')}</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => handleNavClick('/')} className="hover:text-secondary transition-colors">{t('nav.home')}</button></li>
              <li><button onClick={() => handleNavClick('/#about')} className="hover:text-secondary transition-colors">{t('nav.about')}</button></li>
              <li><button onClick={() => handleNavClick('/#services')} className="hover:text-secondary transition-colors">{t('nav.services')}</button></li>
              <li><button onClick={() => handleNavClick('/contact')} className="hover:text-secondary transition-colors">{t('nav.contact')}</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li dir="ltr">info@growthnexus.com</li>
              <li dir="ltr">+971 4 123 4567</li>
              <li>Dubai Internet City, UAE</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-blue-800 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} {t('common.growthNexus')}. {t('common.allRightsReserved')}
        </div>
      </footer>
    </div>
  );
};