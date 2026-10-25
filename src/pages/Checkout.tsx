import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Globe, Truck, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { SHIPPING_DESTINATIONS, getDestinationById } from "../config/shipping";
import { getCartItemTitle, getCartSizeLabel } from "../utils/cartHelpers";

export default function Checkout() {
  const { 
    cart, 
    cartTotal, 
    cartFinalTotal, 
    cartDiscount, 
    cartShipping, 
    cartShippingOriginal,
    cartShippingDiscount,
    selectedDestination,
    setSelectedDestination,
    isInternationalShipping,
    customerInfo, 
    setCustomerInfo 
  } = useCart();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: customerInfo?.name || "",
    email: customerInfo?.email || "",
    phone: customerInfo?.phone || "",
    city: customerInfo?.city || "",
    postalCode: customerInfo?.postalCode || "",
    address: customerInfo?.address || "",
    notes: customerInfo?.notes || "",
  });

  const [addressError, setAddressError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const containsCJK = (text: string) => /[\u4e00-\u9fa5\u3040-\u30ff\uac00-\ud7af]/.test(text);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    // Check English address requirement for international shipping (Taiwan & Outlying Islands exempt)
    if (isInternationalShipping) {
      if (containsCJK(formData.address)) {
        setAddressError(
          language === "en"
            ? "For destinations outside Taiwan, please enter your address in English."
            : language === "ja"
            ? "台湾および離島以外の国への配送は、英語（アルファベット）で住所を入力してください。"
            : "如果是台灣及台灣離島以外的國家，請一律填寫英文地址以方便寄送。"
        );
        window.scrollTo({ top: 350, behavior: "smooth" });
        return;
      }
      if (containsCJK(formData.name)) {
        setAddressError(
          language === "en"
            ? "For international shipping, please enter the recipient's name in English."
            : language === "ja"
            ? "国際配送のため、受取人のお名前は英語（アルファベット）でご入力ください。"
            : "如果是台灣及離島以外的國家，收件人姓名亦請填寫英文。"
        );
        window.scrollTo({ top: 350, behavior: "smooth" });
        return;
      }
    }

    const fullAddress = [
      selectedDestination.name,
      formData.postalCode ? `[${formData.postalCode}]` : "",
      formData.city,
      formData.address
    ].filter(Boolean).join(" ");

    setCustomerInfo({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      countryId: selectedDestination.id,
      city: formData.city,
      postalCode: formData.postalCode,
      address: fullAddress,
      notes: formData.notes
    });
    navigate("/payment");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (addressError && (name === "address" || name === "name")) {
      if (!isInternationalShipping || !containsCJK(value)) {
        setAddressError(null);
      }
    }
  };

  return (
    <div className="relative z-10 max-w-5xl mx-auto pt-[120px] md:pt-[150px] pb-[80px] px-4 sm:px-6 w-full">
      {/* Top Header: Pinkoi-style Navigation & Checkout Step Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-4 border-b border-white/10">
        <Link 
          to="/cart" 
          className="inline-flex items-center text-gold-end hover:text-white transition-colors text-xs sm:text-sm tracking-widest group"
        >
          <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-0.5 transition-transform" />
          <span>{t("cart.title", "返回購物車")}</span>
        </Link>

        {/* 3-Step Checkout Progress Bar */}
        <nav aria-label="Checkout Progress" className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
          <Link to="/cart" className="flex items-center gap-1.5 text-gray-400 hover:text-gold-end font-normal transition-colors">
            <span className="w-5 h-5 rounded-full bg-white/10 text-gray-300 text-xs flex items-center justify-center">1</span>
            <span className="tracking-wider">{t("cart.step1", "1. 購物車")}</span>
          </Link>

          <span className="text-white/20 select-none">―</span>

          <div className="flex items-center gap-1.5 text-gold-end font-semibold">
            <span className="w-5 h-5 rounded-full bg-gold-end text-black font-bold text-xs flex items-center justify-center shadow-sm">2</span>
            <span className="tracking-wider">{t("cart.step2", "2. 填寫資料")}</span>
          </div>

          <span className="text-white/20 select-none">―</span>

          <div className="flex items-center gap-1.5 text-gray-500 font-normal">
            <span className="w-5 h-5 rounded-full bg-white/10 text-gray-400 text-xs flex items-center justify-center">3</span>
            <span className="tracking-wider">{t("cart.step3", "3. 確認付款")}</span>
          </div>
        </nav>
      </div>
      
      <h1 className="text-2xl sm:text-3xl md:text-4xl text-gradient-white-gold drop-shadow-md mb-8 tracking-widest font-bold">
        {t("checkout.title", "結帳資料填寫")}
      </h1>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-black/30 rounded-2xl border border-white/10">
          <p className="text-gray-400 mb-5 tracking-widest">{t("checkout.empty_cart")}</p>
          <Link to="/#shop" className="inline-block border border-gold-end text-gold-end px-6 py-2 tracking-widest hover:bg-gold-end hover:text-black transition-colors rounded">
            {t("checkout.go_shop")}
          </Link>
        </div>
      ) : (
        <form onSubmit={handleCheckout} className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Customer and Shipping Address Form */}
          <div className="flex-1 space-y-6">
            
            {/* 1. 寄送國家與地區選擇 (Pinkoi style destination selector) */}
            <div className="bg-black/40 border border-gold-end/30 p-5 sm:p-6 rounded-2xl shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-gold-end font-bold text-base sm:text-lg border-b border-white/10 pb-3">
                <Globe className="w-5 h-5 shrink-0" />
                <span>{t("checkout.country_label", "寄送國家／地區 (Country / Region)")}</span>
              </div>

              <div>
                <label className="block text-gray-300 text-xs sm:text-sm font-semibold mb-2">
                  選擇寄送目的地 <span className="text-gold-end">*</span>
                </label>
                <select
                  value={selectedDestination.id}
                  onChange={(e) => setSelectedDestination(getDestinationById(e.target.value))}
                  className="w-full bg-[#0a121e] border-2 border-gold-end/50 rounded-xl p-3.5 text-white font-semibold text-sm focus:outline-none focus:border-gold-end transition-colors cursor-pointer"
                >
                  {SHIPPING_DESTINATIONS.map((dest) => {
                    let displayName = dest.name;
                    if (language === "en") displayName = `${dest.flag} ${dest.nameEn}`;
                    else if (language === "ja") displayName = `${dest.flag} ${dest.nameJa}`;
                    else displayName = `${dest.flag} ${dest.name}`;

                    const fee = dest.isInternational ? dest.baseFee - 100 : dest.baseFee;

                    return (
                      <option key={dest.id} value={dest.id} className="bg-[#0a121e] text-white py-1">
                        {displayName} ｜ NT$ {fee}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Shipping Logistics Carrier Badge */}
              <div className="bg-white/5 border border-white/10 p-3.5 sm:p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-sm sm:text-base text-white">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <Truck size={20} className="text-gold-end shrink-0" />
                  <span className="font-medium text-white text-sm sm:text-base">
                    {language === "en" ? selectedDestination.carrierEn : language === "ja" ? selectedDestination.carrierJa : selectedDestination.carrier}
                  </span>
                  <span className="text-white/40">｜</span>
                  <span className="font-medium text-white text-sm sm:text-base">
                    {language === "en" ? "Estimated Delivery: " : language === "ja" ? "お届け目安：" : "預計運送："}
                    {language === "en" ? selectedDestination.estimatedDaysEn : language === "ja" ? selectedDestination.estimatedDaysJa : selectedDestination.estimatedDays}
                  </span>
                </div>
                <div>
                  {isInternationalShipping ? (
                    <span className="inline-flex items-center gap-1 text-gold-end font-bold text-xs bg-gold-end/10 px-2.5 py-1 rounded-full border border-gold-end/30">
                      <Sparkles size={12} />
                      {t("cart.intl_discount_tag", "國際運費現折 $100")}
                    </span>
                  ) : (
                    <span className="text-green-400 font-semibold text-xs">
                      {cartTotal >= 2000 ? t("cart.domestic_free_notice", "滿 NT$ 2,000 免運費") : "滿 NT$ 2,000 享免運"}
                    </span>
                  )}
                </div>
              </div>

              {isInternationalShipping && (
                <div className="p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg text-xs text-blue-200 leading-relaxed">
                  ✦ {language === "en" ? (
                    <><strong>International Shipping:</strong> Orders to overseas destinations include a special <strong>NT$ 100 shipping discount</strong> per order. We will send the international tracking number directly to your Email upon dispatch.</>
                  ) : language === "ja" ? (
                    <><strong>国際配送について：</strong> 海外配送につきましては、1回のご注文につき<strong>国際送料NT$ 100割引</strong>が適用されます。発送時に追跡番号をメールでお知らせいたします。</>
                  ) : (
                    <><strong>國際包裹配送須知：</strong> 跨境寄送不適用台灣滿 NT$ 2,000 免運，已為您自動折抵每筆 <strong>NT$ 100 國際運費</strong>。出貨時將透過您的 Email 寄送國際包裹追蹤號碼。</>
                  )}
                </div>
              )}
            </div>

            {/* 2. 收件人個人資料與詳細地址 */}
            <div className="bg-black/30 border border-white/10 p-5 sm:p-6 rounded-2xl shadow-xl space-y-4">
              <h2 className="text-xl text-white font-semibold mb-4 tracking-widest border-b border-white/10 pb-3">
                {t("checkout.form_heading", "收件人資訊")}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-xs sm:text-sm tracking-wider mb-2">
                    {t("checkout.name_label", "收件人姓名")} <span className="text-gold-end">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                    className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-gold-end transition-colors" 
                    placeholder={t("checkout.name_ph", "請輸入姓名")} 
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-xs sm:text-sm tracking-wider mb-2">
                    {t("checkout.phone_label", "聯絡電話")} <span className="text-gold-end">*</span>
                  </label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    required 
                    className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-gold-end transition-colors" 
                    placeholder={isInternationalShipping ? "+國家代碼 及電話 (例: +81 90...)" : t("checkout.phone_ph", "請輸入電話")} 
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-xs sm:text-sm tracking-wider mb-2">
                  {t("checkout.email_label", "電子信箱 (Email)")} <span className="text-gold-end">*</span>
                </label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required
                  className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-gold-end transition-colors" 
                  placeholder={t("checkout.email_ph", "example@email.com")} 
                />
                <p className="text-xs text-gray-400 mt-1.5 tracking-wider">
                  {isInternationalShipping 
                    ? "※ 國際包裹之運送排程與中華郵政物流追蹤單號將以此 Email 主動寄送給您。"
                    : t("checkout.email_hint", "（我們將發送訂單確認與出貨相關資訊至此信箱）")}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-xs sm:text-sm tracking-wider mb-2">
                    {t("checkout.city_label", "城市／省州 (City / State)")}
                  </label>
                  <input 
                    type="text" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleChange} 
                    className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-gold-end transition-colors" 
                    placeholder="例如：台北市 / Tokyo / New York" 
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-xs sm:text-sm tracking-wider mb-2">
                    {t("checkout.postal_label", "郵遞區號 (Postal / ZIP Code)")}
                  </label>
                  <input 
                    type="text" 
                    name="postalCode" 
                    value={formData.postalCode} 
                    onChange={handleChange} 
                    className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-gold-end transition-colors" 
                    placeholder="例如：100 / 100-0001 / 10001" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-xs sm:text-sm tracking-wider mb-2">
                  {t("checkout.address_label", "詳細收件地址")} <span className="text-gold-end">*</span>
                  {isInternationalShipping && (
                    <span className="text-amber-300 text-xs ml-2 font-normal">
                      ({language === "en" ? "English address required" : language === "ja" ? "英語住所必須" : "請一律填寫英文地址"})
                    </span>
                  )}
                </label>
                <input 
                  type="text" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  required 
                  className={`w-full bg-black/40 border rounded-lg p-3 text-white text-sm focus:outline-none transition-colors ${
                    addressError || (isInternationalShipping && containsCJK(formData.address))
                      ? "border-red-500 focus:border-red-500 bg-red-950/20"
                      : "border-white/20 focus:border-gold-end"
                  }`} 
                  placeholder={
                    isInternationalShipping
                      ? "Please enter address in English (e.g. 123 Main St, Apt 4B)"
                      : t("checkout.address_ph", "請輸入街道、門牌、樓層等詳細收件地址")
                  } 
                />
                {(addressError || (isInternationalShipping && containsCJK(formData.address))) && (
                  <p className="text-red-400 text-xs mt-2 flex items-center gap-1.5 font-medium">
                    <AlertCircle size={15} className="shrink-0 text-red-400" />
                    <span>
                      {addressError || (
                        language === "en"
                          ? "Please enter your address in English (Non-English characters are not accepted for international shipping)."
                          : language === "ja"
                          ? "台湾および離島以外の国は、英語（アルファベット）で住所を入力してください。"
                          : "如果是台灣及台灣離島以外的國家，請一律填寫英文地址以方便寄送。"
                      )}
                    </span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-400 text-xs sm:text-sm tracking-wider mb-2">
                  訂單備註（選填）
                </label>
                <textarea 
                  name="notes" 
                  value={formData.notes} 
                  onChange={handleChange} 
                  rows={2}
                  className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-gold-end transition-colors resize-none" 
                  placeholder="如有特殊需求或指定配達備註可填寫於此" 
                />
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary with Shipping and 9折 breakdown */}
          <div className="lg:w-[380px] shrink-0">
            <div className="bg-black/40 border border-white/10 p-6 rounded-2xl sticky top-[100px] shadow-2xl">
              <h2 className="text-xl text-white font-semibold mb-6 tracking-widest border-b border-white/10 pb-3">
                {t("checkout.summary_heading", "訂單摘要")}
              </h2>

              {/* Items List */}
              <div className="space-y-4 mb-6 max-h-[280px] overflow-y-auto custom-scrollbar pr-1">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-3 bg-white/5 p-2.5 rounded-lg border border-white/5">
                    <div className="w-[50px] h-[50px] rounded overflow-hidden bg-black/50 shrink-0 border border-white/10">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs text-white font-semibold line-clamp-1">
                        {getCartItemTitle(item, language)}
                      </h4>
                      {item.size && (
                        <p className="text-[11px] text-gold-end">
                          {getCartSizeLabel(language)}: {item.size}
                        </p>
                      )}
                      <p className="text-[11px] text-gray-400">
                        {t("cart.qty", "數量")}: {item.quantity}
                      </p>
                    </div>
                    <div className="text-gold-end text-xs font-mono font-semibold self-center">
                      NT$ {item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              {/* Fees Calculation */}
              <div className="border-t border-white/10 pt-4 mb-6 space-y-2 text-sm text-gray-300">
                <div className="flex justify-between items-center">
                  <span>{t("cart.subtotal", "商品小計")}</span>
                  <span className="font-mono">NT$ {cartTotal}</span>
                </div>

                {/* 滿 $3000 打 9 折 */}
                <div className="flex justify-between items-center">
                  <span>{t("cart.discount_label", "滿 $3000 打 9 折")}</span>
                  <span className={cartDiscount > 0 ? "text-green-400 font-mono font-bold" : "text-gray-500 font-mono"}>
                    {cartDiscount > 0 ? `- NT$ ${cartDiscount}` : '-'}
                  </span>
                </div>

                {/* Shipping Fee */}
                <div className="flex justify-between items-center pt-1 border-t border-white/5">
                  <div className="flex flex-col">
                    <span>{t("cart.shipping_label", "運費")}</span>
                    <span className="text-[11px] text-gray-400">
                      {selectedDestination.flag} {language === "en" ? selectedDestination.nameEn : language === "ja" ? selectedDestination.nameJa : selectedDestination.name}
                    </span>
                  </div>
                  <div className="text-right">
                    {isInternationalShipping ? (
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="line-through text-gray-500 text-xs">NT$ {cartShippingOriginal}</span>
                        <span className="text-gold-end font-bold">NT$ {cartShipping}</span>
                      </div>
                    ) : (
                      <span className={cartShipping === 0 ? "text-green-400 font-bold" : "font-mono"}>
                        {cartShipping === 0 ? t("cart.free", "免運費") : `NT$ ${cartShipping}`}
                      </span>
                    )}
                  </div>
                </div>

                {/* Shipping promo note */}
                {isInternationalShipping ? (
                  <p className="text-[11px] text-gold-end pt-1 bg-gold-end/10 p-2 rounded border border-gold-end/30">
                    {t("checkout.intl_shipping_notice", "✦ 國際運送：已為您折抵 NT$ 100 運費禮遇")}
                  </p>
                ) : (
                  cartShipping === 0 && (
                    <p className="text-[11px] text-green-400 pt-1">
                      ✓ {t("checkout.free_shipping_notice", "台灣本島/離島滿 $2000 免運已套用！")}
                    </p>
                  )
                )}

                {cartDiscount > 0 && (
                  <p className="text-[11px] text-green-400">
                    ✓ {t("checkout.discount_notice", "已享滿 $3000 打 9 折優惠！")}
                  </p>
                )}
              </div>

              {/* Total */}
              <div className="border-t border-white/10 pt-4 mb-6">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-white font-bold tracking-widest">{t("cart.total", "應付總額")}</span>
                  <span className="text-gold-end font-bold font-mono text-2xl">NT$ {cartFinalTotal}</span>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-gold-end text-black font-bold tracking-widest py-4 rounded-xl hover:bg-yellow-400 transition-all shadow-xl cursor-pointer text-base"
              >
                {t("checkout.btn_next", "前往確認付款")}
              </button>
            </div>
          </div>

        </form>
      )}
    </div>
  );
}
