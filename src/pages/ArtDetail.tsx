import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { artworks } from "../data/artworks";
import { artworkTranslations } from "../data/artworkTranslations";
import { useLanguage } from "../context/LanguageContext";

export default function ArtDetail() {
  const { id } = useParams();
  const { language, t } = useLanguage();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const art = artworks.find((item) => item.id === id);

  if (!art) {
    return (
      <div className="relative z-10 min-h-screen pt-[150px] pb-[80px] px-5 text-center flex flex-col items-center justify-center">
        <h2 className="text-2xl text-white mb-6">{t("artdetail.not_found")}</h2>
        <Link to="/portfolio" className="text-gold-end underline tracking-[2px]">{t("artdetail.back_portfolio")}</Link>
      </div>
    );
  }

  const tr = language !== "zh" && id ? artworkTranslations[id]?.[language] : null;
  const displayTitle = tr?.title || art.title;
  const displayMedia = tr?.media || art.media;
  const displayDesc = tr?.desc || art.desc;

  return (
    <div className="relative z-10 min-h-screen pt-[120px] md:pt-[150px] pb-[80px] px-5 md:px-[40px] max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20">
      
      <div className="w-full lg:w-[55%] flex justify-center">
        {art.img ? (
          <img 
            src={art.img} 
            alt={displayTitle} 
            referrerPolicy="no-referrer"
            className="w-auto h-auto max-w-full max-h-[75vh] object-contain rounded-sm shadow-2xl border border-white/10" 
          />
        ) : (
          <div className="w-[450px] h-[450px] max-w-full aspect-square flex flex-col items-center justify-center p-8 bg-white/5 rounded-sm border border-white/10 text-center shadow-xl">
            <span className="text-gold-end font-serif font-bold text-3xl mb-4">{displayTitle}</span>
            <span className="text-sm text-gray-400 tracking-widest uppercase">{t("artdetail.preparing")}</span>
          </div>
        )}
      </div>

      <div className="w-full lg:w-[35%] flex flex-col justify-center text-center lg:text-left">
        <h1 className="text-gradient-white-gold text-4xl md:text-5xl font-bold tracking-[4px] mb-[25px] inline-block drop-shadow-md pb-2">
           <span className="font-serif">{displayTitle}</span>
        </h1>
        
        <div className="mb-6 space-y-2 border-y border-white/10 py-5">
          <p className="text-base text-gray-300 tracking-widest">
            {t("artdetail.year")} / <span className="font-en text-white">{art.year}</span>
          </p>
          {(!art.sold && art.size && art.size !== "未提尺寸規格") && (
            <p className="text-base text-gray-300 tracking-widest">
              {t("artdetail.size")} / <span className="font-en text-white">{art.size}</span>
            </p>
          )}
          <p className="text-base text-gray-300 tracking-widest">
            {t("artdetail.media")} / <span className="text-white">{displayMedia}</span>
          </p>
        </div>

        {displayDesc && (
          <div className="my-[30px] border-l-0 lg:border-l-[3px] border-t lg:border-t-0 border-gold-end pt-5 lg:pt-0 pl-0 lg:pl-[20px]">
            <p className="italic text-lg md:text-xl leading-relaxed text-[#eee] tracking-wider">
              {displayDesc}
            </p>
          </div>
        )}

        <div className="mt-[50px]">
          <Link 
            to="/#contact" 
            className="inline-block px-[35px] py-[12px] border border-gold-end text-gold-end tracking-[2px] font-semibold transition-colors duration-300 hover:bg-gold-end hover:text-black"
          >
            {t("artdetail.contact_btn")}
          </Link>
        </div>
      </div>

    </div>
  );
}
