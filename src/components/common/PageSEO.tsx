import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { getStoredSEOConfig, DEFAULT_SEO_CONFIG, SiteSEOConfig } from "../../utils/seoConfig";

export default function PageSEO() {
  const location = useLocation();
  const { language } = useLanguage();
  const [config, setConfig] = useState<SiteSEOConfig>(() => getStoredSEOConfig());

  // Listen to admin SEO updates
  useEffect(() => {
    const handleUpdate = () => {
      setConfig(getStoredSEOConfig());
    };
    window.addEventListener("327art_seo_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("327art_seo_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  useEffect(() => {
    const path = location.pathname;
    const pageMeta = config.pages[path] || DEFAULT_SEO_CONFIG.pages[path] || {
      id: "unknown",
      name: "327 ART",
      path,
      title: "327 ART｜奇蹟之筆・靈性藝術創作",
      description: "327 ART 藝術工作室官方網站與極光動物魔法卡。",
      keywords: "327 ART, 奇蹟之筆, 極光動物魔法卡"
    };

    // Determine localized metadata
    let activeTitle = pageMeta.title;
    let activeDescription = pageMeta.description;
    let activeKeywords = pageMeta.keywords || "";

    if (language === "en" && pageMeta.translations?.en) {
      activeTitle = pageMeta.translations.en.title || activeTitle;
      activeDescription = pageMeta.translations.en.description || activeDescription;
      activeKeywords = pageMeta.translations.en.keywords || activeKeywords;
    } else if (language === "ja" && pageMeta.translations?.ja) {
      activeTitle = pageMeta.translations.ja.title || activeTitle;
      activeDescription = pageMeta.translations.ja.description || activeDescription;
      activeKeywords = pageMeta.translations.ja.keywords || activeKeywords;
    }

    // Set HTML lang attribute for search engine crawlers
    const langCode = language === "zh" ? "zh-TW" : language === "ja" ? "ja" : "en";
    document.documentElement.lang = langCode;

    // Set page title
    document.title = activeTitle;

    // Helper to set or create meta tag
    const setMetaTag = (attributeName: string, attributeValue: string, content: string) => {
      let tag = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attributeName, attributeValue);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    // Update Meta Description
    setMetaTag("name", "description", activeDescription);

    // Update Meta Keywords
    if (activeKeywords) {
      setMetaTag("name", "keywords", activeKeywords);
    }

    // Update Robots Meta Tag (exclude wish-pool, admin, and checkout from search indexing)
    const noIndexPaths = ["/wish-pool", "/admin", "/checkout", "/payment", "/order-success"];
    if (noIndexPaths.some((p) => path === p || path.startsWith(p + "/"))) {
      setMetaTag("name", "robots", "noindex, nofollow");
    } else {
      setMetaTag("name", "robots", "index, follow");
    }

    // Update OpenGraph & Twitter
    const localeMap = { zh: "zh_TW", en: "en_US", ja: "ja_JP" };
    setMetaTag("property", "og:locale", localeMap[language] || "zh_TW");
    setMetaTag("property", "og:title", activeTitle);
    setMetaTag("property", "og:description", activeDescription);
    setMetaTag("property", "og:url", `https://327-art.com${path === "/" ? "" : path}`);
    setMetaTag("name", "twitter:title", activeTitle);
    setMetaTag("name", "twitter:description", activeDescription);

    // Update Google Site Verification if present
    if (config.googleSiteVerification && config.googleSiteVerification.trim()) {
      let code = config.googleSiteVerification.trim();
      const match = code.match(/content=["']([^"']+)["']/);
      if (match) {
        code = match[1];
      }
      setMetaTag("name", "google-site-verification", code);
    }

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `https://327-art.com${path === "/" ? "" : path}`);
  }, [location.pathname, language, config]);

  return null;
}
