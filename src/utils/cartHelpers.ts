import { CartItem } from "../context/CartContext";
import { Language } from "../context/LanguageContext";

/**
 * Dynamically resolves localized product titles regardless of which language
 * was active when the item was added to the shopping cart.
 */
export function getCartItemTitle(item: CartItem, lang: Language): string {
  const pId = (item.productId || item.id || "").toLowerCase();
  const rawTitle = (item.title || "").trim();

  // 1. Aurora Animals Magic Cards
  if (
    pId === "magic-cards" || 
    pId.includes("magic-card") || 
    rawTitle.includes("魔法卡") || 
    rawTitle.toLowerCase().includes("magic card") ||
    rawTitle.includes("マジックカード")
  ) {
    if (lang === "en") return "Aurora Magical Animal Cards";
    if (lang === "ja") return "オーロラ・マジカル・アニマル・カード";
    return "極光動物魔法卡";
  }

  // 2. Soaring Unicorn T-Shirt
  if (
    pId.includes("shirt-unicorn") || 
    pId.includes("shirt") || 
    rawTitle.includes("獨角獸") || 
    rawTitle.toLowerCase().includes("unicorn") || 
    rawTitle.includes("ユニコーン")
  ) {
    if (lang === "en") return "Soaring Unicorn Art T-Shirt";
    if (lang === "ja") return "翔るユニコーン アートTシャツ";
    return "飛越獨角獸T恤";
  }

  // 3. Preorder Toucan T-Shirt
  if (pId === "po-1" || rawTitle.includes("大嘴鳥") || rawTitle.toLowerCase().includes("toucan")) {
    if (lang === "en") return "Splash Toucan Art T-Shirt";
    if (lang === "ja") return "スプラッシュ・オオハシ Tシャツ";
    return "潑彩大嘴鳥T恤";
  }

  // 4. Preorder Cat T-Shirt
  if (pId === "po-2" || rawTitle.includes("小貓") || rawTitle.toLowerCase().includes("cat")) {
    if (lang === "en") return "Splash Cat Art T-Shirt";
    if (lang === "ja") return "スプラッシュ・キャット Tシャツ";
    return "潑彩小貓T恤";
  }

  // 5. Fallbacks using stored multilingual attributes
  if (lang === "en" && item.titleEn) return item.titleEn;
  if (lang === "ja" && item.titleJa) return item.titleJa;

  return item.title;
}

export function getCartItemSubtitle(lang: Language): string {
  if (lang === "en") return "327 ART Original Artwork";
  if (lang === "ja") return "327 ART オリジナルアート作品";
  return "327 ART 專屬藝術作品";
}

export function getCartSizeLabel(lang: Language): string {
  if (lang === "en") return "Size";
  if (lang === "ja") return "サイズ";
  return "尺寸";
}
