export interface ShippingDestination {
  id: string;
  name: string;
  nameEn: string;
  nameJa: string;
  flag: string;
  isInternational: boolean;
  baseFee: number; // 中華郵政原運費
  carrier: string;
  carrierEn: string;
  carrierJa: string;
  estimatedDays: string;
  estimatedDaysEn: string;
  estimatedDaysJa: string;
}

export const INTERNATIONAL_DISCOUNT = 100; // 每筆國際運費折扣 100 元
export const DOMESTIC_FREE_SHIPPING_THRESHOLD = 2000; // 台灣境內滿 2000 免運
export const CART_DISCOUNT_THRESHOLD = 3000; // 滿 3000 打 9 折
export const CART_DISCOUNT_RATE = 0.10; // 9 折 (省 10%)

// Clean destination names without messy parentheses
export const SHIPPING_DESTINATIONS: ShippingDestination[] = [
  {
    id: "TW",
    name: "台灣本島",
    nameEn: "Taiwan",
    nameJa: "台湾本島",
    flag: "🇹🇼",
    isInternational: false,
    baseFee: 60,
    carrier: "中華郵政 / 宅配包裹",
    carrierEn: "Chunghwa Post / Domestic Courier",
    carrierJa: "中華郵政／宅配便",
    estimatedDays: "約 2-6 個工作天",
    estimatedDaysEn: "2-6 business days",
    estimatedDaysJa: "約2-6営業日"
  },
  {
    id: "TW_ISLAND",
    name: "台灣離島",
    nameEn: "Taiwan Outlying Islands",
    nameJa: "台湾離島",
    flag: "🇹🇼",
    isInternational: false,
    baseFee: 100,
    carrier: "中華郵政 郵局包裹",
    carrierEn: "Chunghwa Post Island Parcel",
    carrierJa: "中華郵政 離島便",
    estimatedDays: "約 6-10 個工作天",
    estimatedDaysEn: "6-10 business days",
    estimatedDaysJa: "約6-10営業日"
  },
  {
    id: "HK_MO",
    name: "香港、澳門",
    nameEn: "Hong Kong & Macau",
    nameJa: "香港・マカオ",
    flag: "🇭🇰",
    isInternational: true,
    baseFee: 200,
    carrier: "中華郵政 航空包裹",
    carrierEn: "Chunghwa Post Air Parcel",
    carrierJa: "中華郵政 航空便",
    estimatedDays: "約 6-10 個工作天",
    estimatedDaysEn: "6-10 business days",
    estimatedDaysJa: "約6-10営業日"
  },
  {
    id: "JP",
    name: "日本",
    nameEn: "Japan",
    nameJa: "日本",
    flag: "🇯🇵",
    isInternational: true,
    baseFee: 300,
    carrier: "中華郵政 國際航空包裹 / EMS 快捷",
    carrierEn: "Chunghwa Post International Air Parcel / EMS",
    carrierJa: "中華郵政 国際航空小包／EMS",
    estimatedDays: "約 8-14 個工作天",
    estimatedDaysEn: "8-14 business days",
    estimatedDaysJa: "約8-14営業日"
  },
  {
    id: "KR",
    name: "韓國",
    nameEn: "South Korea",
    nameJa: "韓国",
    flag: "🇰🇷",
    isInternational: true,
    baseFee: 300,
    carrier: "中華郵政 國際航空包裹",
    carrierEn: "Chunghwa Post International Air Parcel",
    carrierJa: "中華郵政 国際航空小包",
    estimatedDays: "約 8-14 個工作天",
    estimatedDaysEn: "8-14 business days",
    estimatedDaysJa: "約8-14営業日"
  },
  {
    id: "SG_MY",
    name: "新加坡、馬來西亞",
    nameEn: "Singapore & Malaysia",
    nameJa: "シンガポール・マレーシア",
    flag: "🇸🇬",
    isInternational: true,
    baseFee: 320,
    carrier: "中華郵政 國際航空包裹",
    carrierEn: "Chunghwa Post International Air Parcel",
    carrierJa: "中華郵政 国際航空小包",
    estimatedDays: "約 10-16 個工作天",
    estimatedDaysEn: "10-16 business days",
    estimatedDaysJa: "約10-16営業日"
  },
  {
    id: "SEA",
    name: "東南亞其他地區",
    nameEn: "Southeast Asia",
    nameJa: "東南アジア",
    flag: "🌏",
    isInternational: true,
    baseFee: 350,
    carrier: "中華郵政 國際航空包裹",
    carrierEn: "Chunghwa Post International Air Parcel",
    carrierJa: "中華郵政 国際航空小包",
    estimatedDays: "約 12-20 個工作天",
    estimatedDaysEn: "12-20 business days",
    estimatedDaysJa: "約12-20営業日"
  },
  {
    id: "US_CA",
    name: "美國、加拿大",
    nameEn: "United States & Canada",
    nameJa: "アメリカ・カナダ",
    flag: "🇺🇸",
    isInternational: true,
    baseFee: 550,
    carrier: "中華郵政 國際航空包裹 / EMS",
    carrierEn: "Chunghwa Post Air Parcel / EMS",
    carrierJa: "中華郵政 国際航空小包／EMS",
    estimatedDays: "約 14-28 個工作天",
    estimatedDaysEn: "14-28 business days",
    estimatedDaysJa: "約14-28営業日"
  },
  {
    id: "EU_UK",
    name: "英國、歐洲地區",
    nameEn: "United Kingdom & Europe",
    nameJa: "イギリス・ヨーロッパ",
    flag: "🇪🇺",
    isInternational: true,
    baseFee: 550,
    carrier: "中華郵政 國際航空包裹",
    carrierEn: "Chunghwa Post Air Parcel",
    carrierJa: "中華郵政 国際航空小包",
    estimatedDays: "約 16-32 個工作天",
    estimatedDaysEn: "16-32 business days",
    estimatedDaysJa: "約16-32営業日"
  },
  {
    id: "AU_NZ",
    name: "澳洲、紐西蘭",
    nameEn: "Australia & New Zealand",
    nameJa: "オーストラリア・ニュージーランド",
    flag: "🇦🇺",
    isInternational: true,
    baseFee: 500,
    carrier: "中華郵政 國際航空包裹",
    carrierEn: "Chunghwa Post Air Parcel",
    carrierJa: "中華郵政 国際航空小包",
    estimatedDays: "約 14-28 個工作天",
    estimatedDaysEn: "14-28 business days",
    estimatedDaysJa: "約14-28営業日"
  },
  {
    id: "OTHER",
    name: "全球其他地區",
    nameEn: "Rest of the World",
    nameJa: "その他全世界の地域",
    flag: "🌐",
    isInternational: true,
    baseFee: 600,
    carrier: "中華郵政 國際航空小包 / 包裹",
    carrierEn: "Chunghwa Post International Parcel",
    carrierJa: "中華郵政 国際小包",
    estimatedDays: "約 20-40 個工作天",
    estimatedDaysEn: "20-40 business days",
    estimatedDaysJa: "約20-40営業日"
  }
];

export const DEFAULT_DESTINATION = SHIPPING_DESTINATIONS[0];

export function getDestinationById(id: string): ShippingDestination {
  return SHIPPING_DESTINATIONS.find((d) => d.id === id) || DEFAULT_DESTINATION;
}

export function calculateShipping(cartTotal: number, destination: ShippingDestination) {
  if (destination.isInternational) {
    const originalFee = destination.baseFee;
    const discount = INTERNATIONAL_DISCOUNT;
    const finalFee = Math.max(0, originalFee - discount);

    return {
      isInternational: true,
      originalFee,
      discount,
      finalFee,
      isFreeShipping: false,
    };
  }

  const isFree = cartTotal >= DOMESTIC_FREE_SHIPPING_THRESHOLD;
  return {
    isInternational: false,
    originalFee: destination.baseFee,
    discount: isFree ? destination.baseFee : 0,
    finalFee: isFree ? 0 : destination.baseFee,
    isFreeShipping: isFree,
  };
}
