import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { artworks, Artwork } from "../data/artworks";
import { artworkTranslations } from "../data/artworkTranslations";
import { useLanguage } from "../context/LanguageContext";
import { motion } from "motion/react";

interface ArtworkCardProps {
  art: Artwork;
  detailsString: string;
  displayTitle: string;
  isHovered: boolean;
  hasActiveHover: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  soldOutLabel: string;
  loadingLabel: string;
}

function ArtworkCard({ 
  art, 
  detailsString, 
  displayTitle,
  isHovered, 
  hasActiveHover, 
  onMouseEnter, 
  onMouseLeave,
  soldOutLabel,
  loadingLabel
}: ArtworkCardProps) {
  let cardClass = "transition-all duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ";
  let zIndexVal = 10;

  if (isHovered) {
    cardClass += "scale-[1.05] opacity-100";
    zIndexVal = 30;
  } else if (hasActiveHover) {
    cardClass += "scale-[0.95] opacity-30";
    zIndexVal = 0;
  } else {
    cardClass += "scale-100 opacity-100";
    zIndexVal = 10;
  }

  return (
    <Link 
      to={`/portfolio/${art.id}`} 
      className={`group relative block ${cardClass}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        zIndex: zIndexVal,
      }}
    >
      <motion.div 
        layout
        className={`relative w-full overflow-hidden rounded-md transition-shadow duration-500 ${
          isHovered ? "shadow-2xl" : "shadow-md"
        }`}
        style={{
          aspectRatio: isHovered ? "auto" : "3/4",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {art.sold && (
          <div className="sold-badge group-hover:opacity-0 z-10 transition-opacity duration-300">
            {soldOutLabel}
          </div>
        )}
        {art.img ? (
          <motion.img 
            layout
            src={art.img} 
            alt={displayTitle} 
            className={`w-full rounded-md ${
              isHovered ? "h-auto object-contain relative" : "h-full object-cover absolute inset-0"
            }`}
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />
        ) : (
          <div className="w-full aspect-[3/4] flex flex-col items-center justify-center p-4 bg-gradient-to-br from-white/5 to-white/10 text-center relative group-hover:from-white/10 group-hover:to-gold-end/10 transition-all duration-300 rounded-md">
            <span className="text-gold-end font-serif font-semibold text-lg sm:text-2xl mb-2 group-hover:scale-105 transition-transform">{displayTitle}</span>
            <span className="text-[10px] sm:text-xs text-gray-400 tracking-wider">{loadingLabel}</span>
          </div>
        )}
      </motion.div>

      <motion.div layout className="mt-3 sm:mt-4 text-center px-1">
        <h5 className="text-sm sm:text-lg font-semibold mb-1 text-white group-hover:text-gold-end transition-colors">{displayTitle}</h5>
        <p className="text-[10px] sm:text-sm text-gray-400 font-en opacity-80">{detailsString}</p>
        {art.sold && (
          <span className="inline-block mt-2 sm:mt-3 bg-[#cd0000a7] text-white px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-black uppercase opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
            {soldOutLabel}
          </span>
        )}
      </motion.div>
    </Link>
  );
}

export default function Portfolio() {
  const location = useLocation();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const { language, t } = useLanguage();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      if (id === "taiwan-endemic-group") {
        setSelectedGroup("taiwan-endemic");
      } else if (id === "aurora-group") {
        setSelectedGroup("aurora");
      } else if (id === "splash-group") {
        setSelectedGroup("splash");
      }
    }
  }, [location.hash]);

  const auroraArtworks = artworks.filter((art) => art.group === "aurora");
  const splashArtworks = artworks.filter((art) => art.group === "splash");
  const taiwanEndemicArtworks = artworks.filter((art) => art.group === "taiwan-endemic");

  const getTranslatedArt = (art: Artwork) => {
    if (language === "zh") return { title: art.title, media: art.media, desc: art.desc };
    const tr = artworkTranslations[art.id]?.[language];
    return {
      title: tr?.title || art.title,
      media: tr?.media || art.media,
      desc: tr?.desc || art.desc,
    };
  };

  const renderGrid = (items: typeof artworks) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {items.map((art) => {
        const { title: displayTitle, media: displayMedia } = getTranslatedArt(art);

        const shortMedia = displayMedia.split(" ")[0] || displayMedia;
        const detailsString = [
          art.year,
          art.size && art.size !== "未提尺寸規格" ? art.size : "",
          shortMedia
        ]
          .filter(Boolean)
          .join(" | ");

        return (
          <ArtworkCard 
            key={art.id} 
            art={art} 
            displayTitle={displayTitle}
            detailsString={detailsString}
            isHovered={hoveredId === art.id}
            hasActiveHover={hoveredId !== null}
            onMouseEnter={() => setHoveredId(art.id)}
            onMouseLeave={() => setHoveredId(null)}
            soldOutLabel={t("portfolio.sold_out")}
            loadingLabel={t("portfolio.image_loading")}
          />
        );
      })}
    </div>
  );

  return (
    <div className="pt-[140px] md:pt-[150px] pb-[100px] px-5 max-w-[1400px] mx-auto min-h-screen relative z-10 w-full">
      <h1 className="text-center text-4xl md:text-5xl mb-6 tracking-widest italic font-en">
        {t("portfolio.page_title")}
      </h1>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mb-14">
        <button
          onClick={() => { setSelectedGroup("all"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm tracking-widest transition-all duration-300 font-serif border cursor-pointer ${
            selectedGroup === "all"
              ? "bg-gradient-to-r from-gold-start to-gold-end text-black font-bold border-gold-end shadow-lg scale-105"
              : "border-white/20 text-gray-300 hover:text-white hover:border-white/50 bg-white/5"
          }`}
        >
          {t("portfolio.tab.all")} ({artworks.length})
        </button>
        <button
          onClick={() => { setSelectedGroup("aurora"); }}
          className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm tracking-widest transition-all duration-300 font-serif border cursor-pointer ${
            selectedGroup === "aurora"
              ? "bg-gradient-to-r from-gold-start to-gold-end text-black font-bold border-gold-end shadow-lg scale-105"
              : "border-white/20 text-gray-300 hover:text-white hover:border-white/50 bg-white/5"
          }`}
        >
          {t("portfolio.tab.aurora")} ({auroraArtworks.length})
        </button>
        <button
          onClick={() => { setSelectedGroup("splash"); }}
          className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm tracking-widest transition-all duration-300 font-serif border cursor-pointer ${
            selectedGroup === "splash"
              ? "bg-gradient-to-r from-gold-start to-gold-end text-black font-bold border-gold-end shadow-lg scale-105"
              : "border-white/20 text-gray-300 hover:text-white hover:border-white/50 bg-white/5"
          }`}
        >
          {t("portfolio.tab.splash")} ({splashArtworks.length})
        </button>
        <button
          onClick={() => { setSelectedGroup("taiwan-endemic"); }}
          className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm tracking-widest transition-all duration-300 font-serif border cursor-pointer ${
            selectedGroup === "taiwan-endemic"
              ? "bg-gradient-to-r from-gold-start to-gold-end text-black font-bold border-gold-end shadow-lg scale-105"
              : "border-emerald-500/40 text-emerald-300 hover:text-white hover:border-emerald-400 bg-emerald-950/30"
          }`}
        >
          {t("portfolio.tab.taiwan")} ({taiwanEndemicArtworks.length})
        </button>
      </div>

      {/* Aurora Group */}
      {(selectedGroup === "all" || selectedGroup === "aurora") && (
        <section id="aurora-group" className="scroll-mt-28 mb-[80px]">
          <div className="mb-[30px] text-left border-b-2 border-white/10 pb-4 block w-full">
            <h2 className="text-3xl font-bold tracking-[4px] text-gradient-white-gold drop-shadow-md">
              {t("portfolio.series.aurora")}
            </h2>
          </div>
          {renderGrid(auroraArtworks)}
        </section>
      )}

      {/* Splash Group */}
      {(selectedGroup === "all" || selectedGroup === "splash") && (
        <section id="splash-group" className="scroll-mt-28 mb-[80px]">
          <div className="mb-[30px] text-left border-b-2 border-black/10 pb-4 block w-full">
            <h2 className="text-3xl font-bold tracking-[4px] text-gradient-white-gold drop-shadow-md">
              {t("portfolio.series.splash")}
            </h2>
          </div>
          {renderGrid(splashArtworks)}
        </section>
      )}

      {/* Taiwan Endemic Group */}
      {(selectedGroup === "all" || selectedGroup === "taiwan-endemic") && (
        <section id="taiwan-endemic-group" className="scroll-mt-28 mb-[80px]">
          <div className="mb-[30px] text-left border-b-2 border-emerald-500/30 pb-4 block w-full flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-[4px] text-gradient-white-gold drop-shadow-md">
              {t("portfolio.series.taiwan")}
            </h2>
            <span className="text-xs tracking-widest text-emerald-400/80 uppercase font-en">Taiwan Endemic Species</span>
          </div>
          {renderGrid(taiwanEndemicArtworks)}
        </section>
      )}
    </div>
  );
}
