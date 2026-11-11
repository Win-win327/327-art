import { Link } from "react-router-dom";
import { Instagram, MessageCircle, Sparkles } from "lucide-react";
import OptimizedImage from "../components/OptimizedImage";
import { useLanguage } from "../context/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="relative z-10 w-full">
      {/* Hero Section */}
      <section id="home" className="scroll-mt-24 min-h-screen flex flex-col justify-center items-center text-center pt-[180px] md:pt-[200px] px-4">
        <div className="animate-in fade-in duration-1000 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-[5px] mb-[30px] text-gradient-gold drop-shadow-lg">
            {t("home.hero.title")}
          </h1>
          <div className="text-lg md:text-xl tracking-widest opacity-90 space-y-2 leading-relaxed">
            <p>{t("home.hero.p1")}</p>
            <p>{t("home.hero.p2")}</p>
            <p>{t("home.hero.p3")}</p>
            <br />
            <p>{t("home.hero.p4")}</p>
            <p>{t("home.hero.p5")}</p>
            <br />
            <p className="text-gold-end font-semibold mt-5">{t("home.hero.p6")}</p>
            <p className="text-gold-end font-semibold">{t("home.hero.p7")}</p>
            <p className="text-gold-end font-semibold">{t("home.hero.p8")}</p>
          </div>
        </div>

        {/* Marquee */}
        <div className="w-full overflow-hidden mt-[60px] py-5 bg-white/5">
          <div className="flex gap-5 animate-scroll w-max hover:play-state-paused">
            {[1, 2, 3, 4, 5, 1, 2, 3, 4, 5].map((num, i) => (
              <Link to="/portfolio" key={i} className="flex-shrink-0">
                <OptimizedImage 
                  src={`/images/home-art${num}.jpg`}
                  alt={`Artwork ${num}`} 
                  className="h-[250px] w-auto object-contain opacity-90 hover:opacity-100 transition-opacity rounded-md" 
                  wrapperClassName="rounded-md h-[250px] min-w-[150px] bg-white/5 shadow-md hover:shadow-xl transition-shadow"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Short Section */}
      <section id="portfolio" className="scroll-mt-24 py-[80px] px-5 max-w-7xl mx-auto">
        <div className="text-center mb-[60px]">
          <h2 className="font-en text-4xl md:text-5xl mb-3">{t("home.portfolio.title")}</h2>
          <p className="tracking-[3px] opacity-70">{t("home.portfolio.subtitle")}</p>
        </div>

        {/* Series 1 */}
        <div className="bg-white/5 p-6 md:p-10 rounded-lg mb-[50px] border border-white/10">
          <h3 className="text-2xl mb-[30px] border-b border-white/20 pb-3">
            {t("home.portfolio.series1")} <span className="font-en opacity-80 text-sm ml-2">{t("home.portfolio.series1_en")}</span>
          </h3>
          <Link to="/portfolio" className="block group">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="mb-5">
                <OptimizedImage 
                  src="/images/hero-aurora-01.jpg" 
                  alt={t("home.portfolio.calm_title")} 
                  className="w-full h-auto transition-transform duration-300 group-hover:scale-[1.02]" 
                  wrapperClassName="mb-4 shadow-lg rounded min-h-[220px] bg-white/5"
                />
                <div>
                  <h4 className="text-xl mb-1 text-white group-hover:text-gold-end transition-colors">
                    {t("home.portfolio.calm_title")}
                  </h4>
                  <p className="font-en text-sm opacity-70 mb-2">{t("home.portfolio.calm_spec")}</p>
                  <p className="italic text-sm border-l-2 border-gold-end pl-3 mt-3 text-white/90">
                    {t("home.portfolio.calm_quote")}
                  </p>
                  <p className="text-gold-end mt-3 text-sm font-semibold">{t("home.portfolio.view_more")}</p>
                </div>
              </div>
              <div className="mb-5">
                <OptimizedImage 
                  src="/images/hero-aurora-02.jpg" 
                  alt={t("home.portfolio.chief_phoenix")} 
                  className="w-full h-auto transition-transform duration-300 group-hover:scale-[1.02]" 
                  wrapperClassName="mb-4 shadow-lg rounded"
                />
                <div>
                  <h4 className="text-xl mb-1 text-white group-hover:text-gold-end transition-colors">
                    {t("home.portfolio.chief_phoenix")}
                  </h4>
                  <p className="font-en text-sm opacity-70 mb-2">{t("home.portfolio.chief_spec")}</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Series 2 */}
        <div className="bg-bg-splash text-gray-800 p-6 md:p-10 rounded-lg mb-[50px]">
          <h3 className="text-2xl mb-[30px] border-b border-black/10 pb-3">
            {t("home.portfolio.series2")} <span className="font-en opacity-80 text-sm ml-2">{t("home.portfolio.series2_en")}</span>
          </h3>
          <Link to="/portfolio#splash-group" className="block group">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="mb-5">
                <OptimizedImage src="/images/hero-splash-01.jpg" alt={t("home.portfolio.unicorn_title")} className="w-full h-auto transition-transform duration-300 group-hover:scale-[1.02]" wrapperClassName="mb-4 shadow-lg rounded" />
                <div>
                  <h4 className="text-xl mb-1 text-gray-900">{t("home.portfolio.unicorn_title")}</h4>
                  <p className="font-en text-sm text-gray-600 mb-2">{t("home.portfolio.unicorn_spec")}</p>
                  <p className="italic text-sm border-l-2 border-gold-end pl-3 mt-3">{t("home.portfolio.unicorn_quote")}</p>
                  <p className="text-[#B8860B] mt-3 text-sm font-semibold">{t("home.portfolio.view_splash")}</p>
                </div>
              </div>
              <div className="mb-5">
                <OptimizedImage src="/images/hero-splash-02.jpg" alt={t("home.portfolio.dragon_title")} className="w-full h-auto transition-transform duration-300 group-hover:scale-[1.02]" wrapperClassName="mb-4 shadow-lg rounded" />
                <div>
                  <h4 className="text-xl mb-1 text-gray-900">{t("home.portfolio.dragon_title")}</h4>
                  <p className="font-en text-sm text-gray-600 mb-2">{t("home.portfolio.dragon_spec")}</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="py-[60px] text-center">
          <p className="text-2xl md:text-3xl font-bold tracking-[3px] text-gradient-white-gold leading-relaxed mb-4">
            {t("home.portfolio.quote1")}
          </p>
          <p className="text-2xl md:text-3xl font-bold tracking-[3px] text-gradient-white-gold leading-relaxed">
            {t("home.portfolio.quote2")}
          </p>
        </div>
      </section>

      {/* Shop / Wish Pool Section */}
      <section id="shop" className="scroll-mt-24 py-[80px] px-5 max-w-5xl mx-auto">
        <div className="text-center mb-[60px]">
          <h2 className="font-en text-4xl mb-3">{t("home.shop.title")}</h2>
          <p className="tracking-[3px] opacity-70">{t("home.shop.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-center">
          {/* Product 1 */}
          <div className="bg-white/5 p-5 rounded-lg border border-white/10">
            <div className="relative mb-4">
              <OptimizedImage src="/images/card-01.jpg" alt={t("home.shop.magic_cards")} className="w-full object-cover aspect-square" wrapperClassName="w-full max-w-[300px] aspect-square mx-auto rounded bg-white/5" />
              <span className="absolute top-2 right-2 bg-white text-black px-3 py-1 text-sm font-bold shadow">{t("home.shop.stock")}</span>
            </div>
            <h3 className="text-xl mb-2 font-bold text-white">{t("home.shop.magic_cards")}</h3>
            <p className="opacity-80 text-sm mb-4">{t("home.shop.magic_cards_sub")}</p>
            <Link to="/shop/magic-cards" className="inline-block mt-2 px-6 py-2 border border-gold-end text-gold-end hover:bg-gold-end hover:text-black transition-colors tracking-widest">
              {t("home.shop.buy_now")}
            </Link>
          </div>

          {/* Product 2 */}
          <div className="bg-white/5 p-5 rounded-lg border border-white/10">
            <div className="relative mb-4">
              <OptimizedImage src="/images/IMG-0525.jpg" alt={t("home.shop.unicorn_shirt")} className="w-full object-cover aspect-square" wrapperClassName="w-full max-w-[300px] aspect-square mx-auto rounded bg-white/5" />
              <span className="absolute top-2 right-2 bg-gold-end text-black px-3 py-1 text-sm font-bold shadow">{t("home.shop.preorder")}</span>
            </div>
            <h3 className="text-xl mb-2 font-bold text-white">{t("home.shop.unicorn_shirt")}</h3>
            <p className="opacity-80 text-sm mb-4">{t("home.shop.unicorn_shirt_sub")}</p>
            <Link to="/shop/t-shirt" className="inline-block mt-2 px-6 py-2 border border-gold-end text-gold-end hover:bg-gold-end hover:text-black transition-colors tracking-widest">
              {t("home.shop.preorder_now")}
            </Link>
          </div>
        </div>

        <div className="mt-20 p-10 bg-white/5 rounded-xl border border-white/10 text-center">
          <p className="mb-6 opacity-95 text-xl font-semibold tracking-[3px]">{t("home.shop.preorder_banner_title")}</p>
          <Link to="/pre-order" className="inline-block px-8 py-3 text-lg border border-gold-end bg-gold-end/10 text-gold-end hover:bg-gold-end hover:text-black transition-colors tracking-widest">
            {t("home.shop.preorder_banner_btn")}
          </Link>
        </div>

        <div className="mt-10 p-10 bg-white/5 rounded-xl border border-white/10 text-center">
          <p className="mb-6 opacity-95 text-xl font-semibold tracking-[3px]">{t("home.shop.wish_banner_title")}</p>
          <Link to="/wish-pool" className="inline-block px-8 py-3 text-lg border border-gold-end bg-gold-end/10 text-gold-end hover:bg-gold-end hover:text-black transition-colors tracking-widest">
            {t("home.shop.wish_banner_btn")}
          </Link>
        </div>
      </section>

      {/* Brand Concept / Artist Statement Section */}
      <section className="py-20 md:py-28 px-5 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-end/10 border border-gold-end/30 text-gold-end text-xs tracking-[4px] uppercase mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t("home.brand.tag")}</span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-serif text-white tracking-[4px] mb-8 leading-snug">
            {t("home.brand.title")}
          </h2>

          <div className="relative p-8 md:p-12 rounded-2xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 backdrop-blur-md shadow-2xl">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 bg-[#0f172a] border border-gold-end/40 rounded-full text-[11px] text-gold-end tracking-widest">
              327 ART
            </div>
            <p className="text-base md:text-xl text-slate-200 font-serif leading-loose tracking-[2px] opacity-95 text-justify md:text-center">
              {t("home.brand.desc")}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="scroll-mt-24 py-[120px] px-5 text-center bg-black/30 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-en text-5xl mb-6 text-gradient-gold">{t("home.contact.title")}</h2>
          <p className="tracking-widest opacity-80 mb-8 text-lg">{t("home.contact.subtitle")}</p>
          <div className="flex flex-col items-center gap-6">
            <a href="mailto:poweranimal2212@gmail.com" className="font-en text-2xl md:text-3xl border-b border-white hover:border-gold-end hover:text-gold-end transition-colors pb-2">
              poweranimal2212@gmail.com
            </a>
            <a href="https://lin.ee/o8qHjzS" target="_blank" rel="noopener noreferrer" className="font-en text-2xl md:text-3xl border-b border-white hover:border-gold-end hover:text-gold-end transition-colors pb-2 flex items-center gap-3">
              <MessageCircle className="w-6 h-6 md:w-8 md:h-8" /> {t("home.contact.line")}
            </a>
            <a href="https://www.instagram.com/win_power2000/" target="_blank" rel="noopener noreferrer" className="font-en text-2xl md:text-3xl border-b border-white hover:border-gold-end hover:text-gold-end transition-colors pb-2 flex items-center gap-3">
              <Instagram className="w-6 h-6 md:w-8 md:h-8" /> win_power2000
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
