import { useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function About() {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative z-10 min-h-screen pt-[150px] pb-[100px] px-5 max-w-6xl mx-auto w-full">
      <h2 className="text-center text-4xl md:text-5xl mb-[50px] font-bold tracking-widest text-gradient-gold">
        {t("about.title")}
      </h2>
      <div className="flex flex-col items-center max-w-4xl mx-auto">
        <p className="text-2xl md:text-3xl text-center mb-[60px] text-gold-end italic tracking-wide leading-relaxed">
          {t("about.quote")}
        </p>

        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-[40px] md:gap-[60px] w-full mb-[50px]">
          <div className="flex-1 text-lg text-justify leading-relaxed text-gray-200 order-2 md:order-1">
            <p className="mb-5">{t("about.bio1")}</p>
            <p className="mb-5">{t("about.bio2")}</p>
            <p className="mb-5 font-bold text-white">{t("about.bio3")}</p>
            <p className="mb-5">{t("about.bio4")}</p>
            <p className="mb-5">{t("about.bio5")}</p>
          </div>
          <div className="flex-shrink-0 order-1 md:order-2">
            <div className="w-[200px] h-[200px] md:w-[280px] md:h-[280px] rounded-full overflow-hidden border-4 border-gold-end shadow-2xl">
              <img
                src="/images/avatar.png"
                alt={t("about.avatar_alt")}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="text-lg text-justify leading-relaxed text-gray-200 space-y-6">
          <p>{t("about.story1")}</p>
          <p>{t("about.story2")}</p>
          <p>{t("about.story3")}</p>
          <p>{t("about.story4")}</p>
          <p>
            {t("about.story5_prefix")}
            <span className="text-white font-bold tracking-wide">
              {t("about.story5_highlight")}
            </span>
            {t("about.story5_suffix")}
          </p>
          <p>{t("about.story6")}</p>
          <p>{t("about.story7")}</p>
          <p>{t("about.story8")}</p>
          <p>{t("about.story9")}</p>
          <p>{t("about.story10")}</p>
          <p>{t("about.story11")}</p>

          <div className="my-8 flex flex-col items-center justify-center w-full max-w-2xl mx-auto">
            <video
              className="w-full rounded-xl shadow-2xl border border-gray-800"
              src="https://www.image2url.com/r2/default/videos/1782632333794-483fb7e9-f407-4a02-a36c-5c4d153d7796.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
            <p className="mt-3 text-sm text-gray-400 font-light tracking-widest text-center">
              {t("about.video1_caption")}
            </p>
          </div>

          <p className="text-gold-end font-semibold text-xl md:text-2xl text-center my-8">
            {t("about.quote_aurora")}
          </p>
          <p>{t("about.story12")}</p>
          <p>{t("about.story13")}</p>
          <p>{t("about.story14")}</p>
          <p>{t("about.story15")}</p>
          <p>{t("about.story16")}</p>
          <p>{t("about.story17")}</p>
          <p>{t("about.story18")}</p>
          <p>{t("about.story19")}</p>
          <p>{t("about.story20")}</p>
          <p>{t("about.story21")}</p>
          <p>{t("about.story22")}</p>
          <p>{t("about.story23")}</p>
          <p>{t("about.story24")}</p>
          <p>{t("about.story25")}</p>
          <p>{t("about.story26")}</p>
          <p>{t("about.story27")}</p>
          <p>{t("about.story28")}</p>
          <p>{t("about.story29")}</p>
          <p className="text-white font-bold text-center text-xl my-6">
            {t("about.story30")}
          </p>
          <p>{t("about.story31")}</p>
          <p>{t("about.story32")}</p>
          <p>{t("about.story33")}</p>

          <p className="text-2xl text-center mt-[60px] font-bold text-gold-end leading-relaxed tracking-wide">
            {t("about.final_quote1")}
            <br />
            {t("about.final_quote2")}
          </p>

          <div className="my-8 flex flex-col items-center justify-center w-full max-w-2xl mx-auto">
            <video
              className="w-full rounded-xl shadow-2xl border border-gray-800"
              src="https://www.image2url.com/r2/default/videos/1782632507053-f0be8263-0f4f-4659-9b28-8e61c9d7326d.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
            <p className="mt-3 text-sm text-gray-400 font-light tracking-widest text-center">
              {t("about.video2_caption")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
