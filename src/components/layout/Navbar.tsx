import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart, Globe } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useLanguage, Language } from "../../context/LanguageContext";
import { scrollToHash } from "../common/ScrollManager";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const location = useLocation();
  const { cartCount } = useCart();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    setIsOpen(false);
    setIsLangMenuOpen(false);
  }, [location.pathname, location.hash]);

  const navLinks = [
    { name: t("nav.home"), path: "/#home" },
    { name: t("nav.portfolio"), path: "/portfolio" },
    { name: t("nav.shop"), path: "/#shop" },
    { name: t("nav.about"), path: "/about" },
    { name: t("nav.contact"), path: "/#contact" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    setIsOpen(false);
    setIsLangMenuOpen(false);

    const [targetPath, targetHash] = path.split("#");
    const isTargetHome = targetPath === "" || targetPath === "/";
    const isCurrentHome = location.pathname === "/";

    if (targetHash) {
      if ((isTargetHome && isCurrentHome) || targetPath === location.pathname) {
        e.preventDefault();
        if (window.location.hash !== `#${targetHash}`) {
          window.history.pushState(null, "", `#${targetHash}`);
        }
        scrollToHash(targetHash, true);
      }
    } else {
      if (path === location.pathname) {
        e.preventDefault();
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }
    }
  };

  const languages: { code: Language; label: string; short: string }[] = [
    { code: "zh", label: "繁體中文", short: "繁中" },
    { code: "en", label: "English", short: "EN" },
    { code: "ja", label: "日本語", short: "日文" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0f172ad9] backdrop-blur-md px-4 sm:px-6 md:px-[50px] py-3 md:py-4 border-b border-white/10 flex justify-between items-center">
      <Link 
        to="/" 
        onClick={(e) => {
          setIsOpen(false);
          setIsLangMenuOpen(false);
          if (location.pathname === "/") {
            e.preventDefault();
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          }
        }}
        className="flex items-center gap-2 sm:gap-3 md:gap-4 group"
      >
        <img 
          src="/images/logo.png" 
          alt="327 Logo" 
          className="h-[46px] sm:h-[56px] md:h-[76px] w-auto object-contain" 
        />
        <img 
          src="/images/brand-text.jpg" 
          alt="327 ART" 
          className="h-[40px] sm:h-[50px] md:h-[68px] w-auto mix-blend-screen brightness-125 contrast-110 object-contain" 
        />
      </Link>

      <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
        <ul className="hidden lg:flex gap-[28px] list-none m-0 p-0 items-center">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                onClick={(e) => handleNavClick(e, link.path)}
                className="text-white text-[0.95rem] tracking-[1.5px] font-semibold whitespace-nowrap transition-colors duration-300 hover:text-gold-end cursor-pointer"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Language Selector Dropdown (Desktop & Tablet) */}
        <div className="relative">
          <button
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-white/20 hover:border-gold-end/60 bg-white/5 hover:bg-white/10 text-xs sm:text-sm font-medium text-white transition-all duration-200"
            title="選擇語言 / Select Language"
          >
            <Globe size={15} className="text-gold-end" />
            <span className="tracking-wider">{languages.find(l => l.code === language)?.short}</span>
          </button>

          {isLangMenuOpen && (
            <div 
              className="absolute right-0 mt-2 w-32 bg-[#142036] border border-white/15 rounded-lg shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md"
              onMouseLeave={() => setIsLangMenuOpen(false)}
            >
              {languages.map((item) => (
                <button
                  key={item.code}
                  onClick={() => {
                    setLanguage(item.code);
                    setIsLangMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm transition-colors flex items-center justify-between ${
                    language === item.code
                      ? "text-gold-end font-bold bg-white/10"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{item.label}</span>
                  {language === item.code && <span className="text-xs">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Shopping Cart Link - Navigates directly to /cart on all devices */}
        <Link 
          to="/cart"
          className="relative text-white hover:text-gold-end transition-colors duration-300 p-2 cursor-pointer touch-manipulation flex items-center justify-center"
          aria-label="Cart"
        >
          <ShoppingCart size={22} className="sm:w-6 sm:h-6" />
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-gold-end text-black text-[10px] font-bold flex items-center justify-center transform translate-x-1/4 -translate-y-1/4 shadow-md pointer-events-none">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Mobile Hamburger Menu Button */}
        <button 
          type="button"
          className="lg:hidden text-white p-1 cursor-pointer touch-manipulation" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-[#0f172ae6] backdrop-blur-md flex flex-col items-center py-6 gap-5 border-b border-white/10 lg:hidden shadow-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={(e) => handleNavClick(e, link.path)}
              className="text-white text-base tracking-widest font-semibold hover:text-gold-end transition-colors cursor-pointer"
            >
              {link.name}
            </Link>
          ))}

          {/* Cart link in mobile / iPad menu */}
          <Link
            to="/cart"
            onClick={() => setIsOpen(false)}
            className="text-gold-end text-base tracking-widest font-semibold hover:underline flex items-center gap-2 cursor-pointer"
          >
            <ShoppingCart size={18} />
            <span>{t("cart.title", "購物車")} ({cartCount})</span>
          </Link>

          {/* Language Switcher inside Mobile Menu */}
          <div className="pt-4 border-t border-white/10 flex items-center gap-2">
            <span className="text-xs text-gray-400 mr-1 flex items-center gap-1">
              <Globe size={13} /> 語言:
            </span>
            {languages.map((item) => (
              <button
                key={item.code}
                onClick={() => setLanguage(item.code)}
                className={`px-3 py-1 rounded text-xs font-semibold tracking-wider transition-all ${
                  language === item.code
                    ? "bg-gold-end text-black"
                    : "bg-white/10 text-gray-300 hover:text-white"
                }`}
              >
                {item.short}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
