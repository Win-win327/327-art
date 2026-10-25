export interface PageSEOMetaLocale {
  title: string;
  description: string;
  keywords: string;
}

export interface PageSEOMeta {
  id: string;
  name: string;
  path: string;
  title: string;
  description: string;
  keywords?: string;
  translations?: {
    en?: PageSEOMetaLocale;
    ja?: PageSEOMetaLocale;
  };
}

export interface SiteSEOConfig {
  googleSiteVerification: string;
  pages: Record<string, PageSEOMeta>;
}

export const DEFAULT_SEO_CONFIG: SiteSEOConfig = {
  googleSiteVerification: "",
  pages: {
    "/": {
      id: "home",
      name: "首頁",
      path: "/",
      title: "327 ART｜奇蹟之筆・極光動物魔法卡官方網站",
      description: "探索台灣當代藝術家張景雯 Win 創立之 327 ART 充滿魔法與奇蹟的藝術世界。提供極光動物魔法卡、原創周邊與藝術作品集。",
      keywords: "327 ART, 奇蹟之筆, 極光動物魔法卡, 力量動物, 神諭卡, 動物牌卡, 靈性牌卡, 現代藝術, 油畫, 壓克力, 極光畫, 潑彩藝術, 原創周邊, T-shirt, 預購商品, 張景雯, 張景雯 Win, Win, Aurora Magical Animal Cards",
      translations: {
        en: {
          title: "327 ART | Miracle Brush & Aurora Magical Animal Cards Official Website",
          description: "Explore the art world of 327 ART, founded by Taiwanese contemporary artist Chang Ching-Wen (Win), full of magic and miracles. Featuring Aurora Magical Animal Cards (Oracle Cards), Power Animals, original merchandise, and portfolio.",
          keywords: "327 ART, Miracle Brush, Aurora Magical Animal Cards, Power Animals, Power Animal, 力量動物, Oracle Cards, animal cards, spiritual cards, contemporary art, oil painting, acrylic, aurora painting, splash color art, original merchandise, T-shirt, pre-order items, Chang Ching-Wen, Win, 張景雯 Win"
        },
        ja: {
          title: "327 ART｜奇跡の筆・オーロラ・マジカル・アニマル・カード 公式サイト",
          description: "台湾の現代アーティスト張景雯（Win）が創設した 327 ART の、魔法と奇跡に満ちたアートの世界へ。オーロラ・マジカル・アニマル・カード（オラクルカード）、パワーアニマル、オリジナルグッズ、作品集をお届けします。",
          keywords: "327 ART, 奇跡の筆, Aurora Magical Animal Cards, オーロラ・マジカル・アニマル・カード, パワーアニマル, 力量動物, オラクルカード, 動物カード, スピリチュアルカード, 現代アート, 油彩, アクリル, オーロラ画, スプラッシュカラー, オリジナルグッズ, Tシャツ, 予約商品, 張景雯, Win, 張景雯 Win"
        }
      }
    },
    "/shop/magic-cards": {
      id: "magic-cards",
      name: "極光動物魔法卡",
      path: "/shop/magic-cards",
      title: "極光動物魔法卡｜台灣藝術家張景雯 Win 原創心靈神諭卡 - 327 ART",
      description: "台灣藝術家張景雯 Win 專為自我探索與心靈指引設計的「極光動物魔法卡（神諭卡）」，內附中文、英文、日文多語言說明書，引領你連結純淨的自然動物能量。",
      keywords: "張景雯, 張景雯 Win, Win, 極光動物魔法卡, 力量動物, 神諭卡, 魔法卡說明書, 多語言說明書, 動物心靈指引, 靈性牌卡, 327 ART, Aurora Magical Animal Cards, Oracle Cards, Power Animals, オラクルカード, パワーアニマル",
      translations: {
        en: {
          title: "Aurora Magical Animal Cards | Oracle Cards by Artist Chang Ching-Wen (Win) - 327 ART",
          description: "Created by Taiwanese contemporary artist Chang Ching-Wen (Win), the \"Aurora Magical Animal Cards\" (Oracle Cards & Power Animals) include multilingual guidebooks in Traditional Chinese, English, and Japanese.",
          keywords: "Chang Ching-Wen, Win, 張景雯, 張景雯 Win, Aurora Magical Animal Cards, Power Animals, Power Animal, 力量動物, Oracle Cards, animal oracle deck, spiritual oracle cards, divination cards, multilingual guidebook, 327 ART"
        },
        ja: {
          title: "オーロラ・マジカル・アニマル・オラクルカード｜台湾アーティスト張景雯（Win）原画オラクルデッキ - 327 ART",
          description: "台湾の現代アーティスト張景雯（Win）が手掛けた「オーロラ・マジカル・アニマル・オラクルカード（極光動物魔法カード / パワーアニマル / オラクルカード）」。日本語・英語・中国語の3言語解説書付き。",
          keywords: "張景雯, Win, 張景雯 Win, Aurora Magical Animal Cards, パワーアニマル, 力量動物, オラクルカード, 神諭カード, 極光動物魔法カード, 動物オラクルカード, 3言語解説書, 327 ART"
        }
      }
    },
    "/about": {
      id: "about",
      name: "關於我們",
      path: "/about",
      title: "關於 327 ART｜台灣當代藝術家張景雯 Win 的創作理念與故事",
      description: "認識 327 ART 創辦人兼台灣當代藝術家張景雯 Win 的創作歷程。透過色彩與筆觸傳遞溫暖、療癒與希望，讓每件作品成為陪伴心靈的純淨光芒。",
      keywords: "張景雯, 張景雯 Win, Win, 327 ART, 關於我們, 奇蹟之筆, 藝術家理念, 創作故事, 心靈療癒藝術, 極光動物魔法卡, 力量動物, 神諭卡, Aurora Magical Animal Cards",
      translations: {
        en: {
          title: "About 327 ART | Taiwanese Artist Chang Ching-Wen (Win) Philosophy & Story",
          description: "Discover the creative journey of Taiwanese contemporary artist Chang Ching-Wen (Win). Creator of Aurora Magical Animal Cards (Oracle Cards & Power Animals), bringing warmth, healing, and hope through vibrant colors and brushstrokes.",
          keywords: "Chang Ching-Wen, Win, 張景雯, 張景雯 Win, Taiwanese contemporary artist, 327 ART, Miracle Brush, Aurora Magical Animal Cards, Power Animals, Power Animal, 力量動物, Oracle Cards, spiritual art"
        },
        ja: {
          title: "327 ART について｜台湾の現代アーティスト張景雯（Win）の理念と創作の物語",
          description: "台湾の現代アーティスト張景雯（Win）による 327 ART の創作ストーリー。「オーロラ・マジカル・アニマル・オラクルカード」の生みの親として、色彩と筆触を通じて温もりと癒し、希望を届けます。",
          keywords: "張景雯, Win, 張景雯 Win, 327 ART について, 台湾現代アート, 奇跡の筆, Aurora Magical Animal Cards, パワーアニマル, 力量動物, オラクルカード, 癒しのアート"
        }
      }
    },
    "/portfolio": {
      id: "portfolio",
      name: "藝術作品集",
      path: "/portfolio",
      title: "327 ART・作品集｜藝術家張景雯 Win・極光油畫與壓克力",
      description: "327 ART 藝術家張景雯 Win 的原創作品集。收錄極光系列、潑彩系列以及台灣特有種系列！原創作品，每一筆都是與生命對齊的奇蹟。",
      keywords: "張景雯, 張景雯 Win, Win, 327 ART 作品集, 藝術, 原創藝術, 現代藝術, 極光系列, 潑彩系列, 極光畫, 潑彩畫, 油畫, 壓克力, 奇蹟之筆, 台灣當代藝術, Oilpainting",
      translations: {
        en: {
          title: "327 ART ・ Portfolio | Artist Chang Ching-Wen (Win) ・ Aurora Oil & Acrylic Paintings",
          description: "Original art portfolio of 327 ART artist Chang Ching-Wen (Win). Featuring the Aurora Series, Splash Color Series, and Taiwan Endemic Species Series! Original creations where every stroke aligns with the miracles of life.",
          keywords: "Chang Ching-Wen, Chang Ching-Wen Win, Win, 327 ART Portfolio, art, original art, contemporary art, Aurora Series, Splash Color Series, aurora painting, splash color painting, oil painting, acrylic, Miracle Brush, Taiwanese contemporary art, Oilpainting"
        },
        ja: {
          title: "327 ART・作品集｜アーティスト張景雯（Win）・オーロラ油彩＆アクリル",
          description: "327 ART アーティスト張景雯（Win）の原画作品集。オーロラシリーズ、スプラッシュカラーシリーズ、そして台湾固有種シリーズを収録！すべての筆跡が命と響き合う奇跡。",
          keywords: "張景雯, 張景雯 Win, Win, 327 ART 作品集, アート, 原画アート, 現代アート, オーロラシリーズ, スプラッシュカラーシリーズ, オーロラ画, スプラッシュ画, 油彩, アクリル, 奇跡の筆, 台湾現代アート, Oilpainting"
        }
      }
    },
    "/shop/t-shirt": {
      id: "t-shirt",
      name: "極光原創 T-shirt",
      path: "/shop/t-shirt",
      title: "327 ART ・原創 T-shirt｜藝術純棉服飾",
      description: "台灣藝術家張景雯 Win 原創純棉短袖 T-shirt，舒適耐穿，將奇蹟帶回家，穿在身上吧！",
      keywords: "張景雯, 張景雯 Win, Win, 原創 T-shirt, 服飾,  T-shirt, 純棉短T, 預購, 327 ART 周邊, 藝術, 原創藝術, 藝術周邊, 動物服飾, Aurora Magical Animal Cards",
      translations: {
        en: {
          title: "327 ART ・ Original T-Shirt | Art Pure Cotton Apparel",
          description: "Original 100% pure cotton short-sleeve T-shirt by Taiwanese artist Chang Ching-Wen (Win). Comfortable, durable—bring the miracle home and wear it every day!",
          keywords: "Chang Ching-Wen, Chang Ching-Wen Win, Win, Original T-shirt, apparel, T-shirt, pure cotton tee, pre-order, 327 ART merchandise, art, original art, art merchandise, animal apparel, Aurora Magical Animal Cards"
        },
        ja: {
          title: "327 ART ・ オリジナルTシャツ｜アート上質コットンアパレル",
          description: "台湾のアーティスト張景雯（Win）によるオリジナル純綿半袖Tシャツ。着心地よく丈夫で長持ち。奇跡をお家に連れて帰り、身に纏いましょう！",
          keywords: "張景雯, 張景雯 Win, Win, オリジナルTシャツ, アパレル, Tシャツ, 純綿Tシャツ, 予約, 327 ART グッズ, アート, 原画アート, アートグッズ, 動物アパレル, Aurora Magical Animal Cards"
        }
      }
    },
    "/pre-order": {
      id: "pre-order",
      name: "限量預購專區",
      path: "/pre-order",
      title: "327 ART・限量預購專區｜藝術周邊・藝術家張景雯 Win",
      description: "327 ART 台灣藝術家張景雯 Win 限量預購藝術商品，精選原創周邊Ｔ-shirt。",
      keywords: "張景雯, 張景雯 Win, Win, 327 ART , 預購, 限量藝術周邊, 周邊, 藝術周邊, T-shirt, 原創T-shirt, Aurora Magical Animal Cards",
      translations: {
        en: {
          title: "327 ART ・ Limited Pre-Order | Art Merchandise ・ Artist Chang Ching-Wen (Win)",
          description: "Limited pre-order art merchandise by 327 ART Taiwanese artist Chang Ching-Wen (Win), featuring selected original merchandise T-shirts.",
          keywords: "Chang Ching-Wen, Chang Ching-Wen Win, Win, 327 ART, pre-order, limited art merchandise, merchandise, art merchandise, T-shirt, original T-shirt, Aurora Magical Animal Cards"
        },
        ja: {
          title: "327 ART・限定プレオーダー｜アートグッズ・アーティスト張景雯 Win",
          description: "327 ART 台湾のアーティスト張景雯（Win）による数量限定予約アート商品。厳選されたオリジナルグッズTシャツをお届けします。",
          keywords: "張景雯, 張景雯 Win, Win, 327 ART, 予約, 限定アートグッズ, グッズ, アートグッズ, Tシャツ, オリジナルTシャツ, Aurora Magical Animal Cards"
        }
      }
    }
  }
};

const STORAGE_KEY = "327art_seo_settings_v12";
const PREV_STORAGE_KEYS = ["327art_seo_settings_v11", "327art_seo_settings_v10"];

export function getStoredSEOConfig(): SiteSEOConfig {
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      let verification = "";
      for (const prevKey of PREV_STORAGE_KEYS) {
        const prevRaw = localStorage.getItem(prevKey);
        if (prevRaw) {
          try {
            const prevParsed = JSON.parse(prevRaw);
            if (prevParsed.googleSiteVerification) {
              verification = prevParsed.googleSiteVerification;
              break;
            }
          } catch {}
        }
      }
      const initialConfig: SiteSEOConfig = {
        googleSiteVerification: verification,
        pages: { ...DEFAULT_SEO_CONFIG.pages }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialConfig));
      return initialConfig;
    }
    const parsed = JSON.parse(raw);
    
    // Deep merge with defaults to ensure all pages & translations are present (wish-pool is completely excluded)
    const mergedPages: Record<string, PageSEOMeta> = {};
    for (const [key, defaultPage] of Object.entries(DEFAULT_SEO_CONFIG.pages)) {
      const storedPage = parsed.pages?.[key];
      if (!storedPage) {
        mergedPages[key] = defaultPage;
      } else {
        mergedPages[key] = {
          ...defaultPage,
          ...storedPage,
          translations: {
            en: {
              ...defaultPage.translations?.en,
              ...(storedPage.translations?.en || {})
            },
            ja: {
              ...defaultPage.translations?.ja,
              ...(storedPage.translations?.ja || {})
            }
          }
        };
      }
    }

    return {
      googleSiteVerification: parsed.googleSiteVerification || "",
      pages: mergedPages
    };
  } catch (e) {
    return DEFAULT_SEO_CONFIG;
  }
}

export function saveSEOConfig(config: SiteSEOConfig): void {
  try {
    // Ensure /wish-pool is never saved in SEO config
    if (config.pages && config.pages["/wish-pool"]) {
      delete config.pages["/wish-pool"];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent("327art_seo_updated", { detail: config }));
  } catch (e) {
    console.error("Failed to save SEO config:", e);
  }
}

export function resetSEOConfigToDefault(): SiteSEOConfig {
  try {
    localStorage.removeItem(STORAGE_KEY);
    PREV_STORAGE_KEYS.forEach(k => localStorage.removeItem(k));
    window.dispatchEvent(new CustomEvent("327art_seo_updated", { detail: DEFAULT_SEO_CONFIG }));
  } catch (e) {
    console.error("Failed to reset SEO config:", e);
  }
  return DEFAULT_SEO_CONFIG;
}
