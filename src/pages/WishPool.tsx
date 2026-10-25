import { useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function WishPool() {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative z-10 max-w-4xl justify-center mx-auto pt-[140px] md:pt-[150px] pb-[100px] px-5 w-full flex flex-col items-center">
      <h1 className="text-center text-4xl mb-[50px] tracking-widest font-bold italic text-white drop-shadow-md">
        {t("wishpool.title")}
      </h1>
      
      <div className="text-center md:text-left leading-loose tracking-widest mb-10 text-gray-100 max-w-3xl">
        <p className="text-2xl font-bold text-gold-end mb-6">{t("wishpool.header")}</p>
        <p className="mb-4">{t("wishpool.sub1")}</p>
        
        <div className="mt-6 mb-8 text-lg text-gray-300">
          <p>{t("wishpool.desc1")}</p>
          <p>{t("wishpool.desc2")}</p>
          <p className="mt-4 font-semibold text-white">{t("wishpool.desc3")}</p>
          <p>{t("wishpool.desc4")}</p>
          <p className="mt-2 text-gold-end/80 text-sm">{t("wishpool.note")}</p>
        </div>
      </div>

      <section className="w-full max-w-3xl my-10">
        <div className="bg-white/5 rounded-2xl p-5 border border-gold-end/20 shadow-[0_10px_30px_rgba(0,0,0,0.3)] min-h-[400px] flex items-center justify-center relative overflow-hidden">
           <iframe 
             src="https://docs.google.com/forms/d/e/1FAIpQLSfiiH85E_a1Eimhob3ocw5zntw5vM9mhuSRPiovdRBTK5M-jA/viewform?embedded=true" 
             className="w-full h-[800px] border-0"
             title="Wish Pool Form"
           >
             Loading…
           </iframe>
        </div>
      </section>
      
      <div className="mt-[50px] border-t border-white/10 pt-8 text-center text-gray-300 leading-loose tracking-widest font-semibold max-w-2xl">
          <p>{t("wishpool.footer1")}</p>
          <p>{t("wishpool.footer2")}</p>
          <p className="mt-4 text-gold-end text-xl drop-shadow">{t("wishpool.footer3")}</p>
      </div>
    </div>
  );
}
