import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { Link, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  Minus, 
  Plus, 
  Trash2, 
  Globe, 
  Truck, 
  Sparkles, 
  ArrowRight, 
  ShoppingBag, 
  ShieldCheck, 
  Check, 
  Store,
  CreditCard
} from "lucide-react";
import { SHIPPING_DESTINATIONS, getDestinationById } from "../config/shipping";
import { getCartItemTitle, getCartItemSubtitle, getCartSizeLabel } from "../utils/cartHelpers";
import { useEffect } from "react";

export default function CartPage() {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    cartTotal, 
    cartFinalTotal, 
    cartDiscount, 
    cartShipping,
    cartShippingOriginal,
    selectedDestination,
    setSelectedDestination,
    isInternationalShipping,
  } = useCart();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getLocalizedCarrier = () => {
    if (language === "en") return selectedDestination.carrierEn;
    if (language === "ja") return selectedDestination.carrierJa;
    return selectedDestination.carrier;
  };

  const getLocalizedDays = () => {
    if (language === "en") return selectedDestination.estimatedDaysEn;
    if (language === "ja") return selectedDestination.estimatedDaysJa;
    return selectedDestination.estimatedDays;
  };

  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="relative z-10 max-w-6xl mx-auto pt-[120px] md:pt-[140px] pb-[90px] px-4 sm:px-6 lg:px-8 w-full">
      
      {/* ============================================================ */}
      {/* Top Header: Pinkoi-style Navigation & Checkout Step Progress */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-4 border-b border-white/10">
        <Link 
          to="/#shop" 
          className="inline-flex items-center text-gold-end hover:text-white transition-colors text-xs sm:text-sm tracking-widest group"
        >
          <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-0.5 transition-transform" />
          <span>{t("cart.back_shop", "繼續選購")}</span>
        </Link>

        {/* 3-Step Checkout Progress Bar (Pinkoi Model) */}
        <nav aria-label="Checkout Progress" className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
          {/* Step 1: Active */}
          <div className="flex items-center gap-1.5 text-gold-end font-semibold">
            <span className="w-5 h-5 rounded-full bg-gold-end text-black font-bold text-xs flex items-center justify-center shadow-sm">
              1
            </span>
            <span className="tracking-wider">{t("cart.step1", "1. 購物車")}</span>
          </div>

          <span className="text-white/20 select-none">―</span>

          {/* Step 2: Upcoming */}
          <div className="flex items-center gap-1.5 text-gray-500 font-normal">
            <span className="w-5 h-5 rounded-full bg-white/10 text-gray-400 text-xs flex items-center justify-center">
              2
            </span>
            <span className="tracking-wider">{t("cart.step2", "2. 填寫資料")}</span>
          </div>

          <span className="text-white/20 select-none">―</span>

          {/* Step 3: Upcoming */}
          <div className="flex items-center gap-1.5 text-gray-500 font-normal">
            <span className="w-5 h-5 rounded-full bg-white/10 text-gray-400 text-xs flex items-center justify-center">
              3
            </span>
            <span className="tracking-wider">{t("cart.step3", "3. 確認付款")}</span>
          </div>
        </nav>
      </div>

      {/* Cart Page Title */}
      <div className="flex items-baseline gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl text-gradient-white-gold drop-shadow-md tracking-widest font-bold">
          {t("cart.title", "購物車")}
        </h1>
        {cart.length > 0 && (
          <span className="text-xs sm:text-sm text-gray-400 font-normal">
            共 {totalItemCount} 件商品
          </span>
        )}
      </div>

      {/* ============================================================ */}
      {/* Empty State */}
      {/* ============================================================ */}
      {cart.length === 0 ? (
        <div className="text-center py-20 border border-white/15 rounded-2xl max-w-2xl mx-auto space-y-5">
          <div className="w-20 h-20 rounded-full border border-white/15 flex items-center justify-center mx-auto text-gray-400">
            <ShoppingBag size={36} className="text-gold-end/70" />
          </div>
          <div className="space-y-2">
            <h2 className="text-white font-bold text-lg sm:text-xl tracking-widest">
              {t("cart.empty", "您的購物車是空的")}
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm tracking-wider max-w-md mx-auto">
              探索 327 ART 限量原創畫作、極光動物魔法卡與專屬飛躍獨角獸服飾。
            </p>
          </div>
          <Link 
            to="/#shop" 
            className="inline-block bg-gold-end text-black px-8 py-3.5 tracking-widest hover:bg-yellow-400 transition-colors rounded-xl font-bold text-sm shadow-lg cursor-pointer"
          >
            {t("cart.continue", "前往商店探索作品")}
          </Link>
        </div>
      ) : (
        /* ============================================================ */
        /* Pinkoi-style Desktop & iPad 2-Column Balanced Architecture   */
        /* ============================================================ */
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 items-start">
          
          {/* ======================================================== */}
          {/* Left Column: Cart Items & Shipping Destination Selection */}
          {/* ======================================================== */}
          <div className="lg:col-span-8 space-y-6 w-full">
            
            {/* Store & Cart Items Card */}
            <div className="border border-white/15 rounded-2xl overflow-hidden">
              
              {/* Store Identity Bar (Pinkoi Model) */}
              <div className="px-5 sm:px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-bold tracking-wider text-sm sm:text-base">
                  <Store size={18} className="text-gold-end shrink-0" />
                  <span>{t("cart.shop_title", "327 ART 官方藝術選品")}</span>
                </div>
                <span className="text-xs text-gray-400">
                  全館原創直送
                </span>
              </div>

              {/* Promotion Achievement Banner (Quiet, Clean, No Pill Badges) */}
              <div className="px-5 sm:px-6 py-3 bg-gold-end/10 border-b border-gold-end/20 text-xs sm:text-sm text-gold-end flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={14} className="shrink-0 text-gold-end" />
                  {cartTotal >= 3000 ? (
                    <span className="font-semibold text-white">
                      {t("cart.discount_applied", "已享全館滿 $3,000 打 9 折優惠")}（省 NT$ {cartDiscount}）
                    </span>
                  ) : (
                    <span>
                      {t("cart.need_discount", "再買 $ {amt} 即享 9 折優惠").replace("{amt}", String(3000 - cartTotal))}
                    </span>
                  )}
                </div>

                <div className="text-xs text-gray-300">
                  {isInternationalShipping ? (
                    <span className="text-gold-end font-medium">
                      ✦ {t("cart.intl_privilege", "國際運費每筆現折 NT$ 100 禮遇")}
                    </span>
                  ) : (
                    cartTotal >= 2000 ? (
                      <span className="text-green-400 font-medium">
                        ✓ {t("cart.domestic_free_notice", "台灣境內滿 NT$ 2,000 享免運費")}
                      </span>
                    ) : (
                      <span className="text-gray-400">
                        {t("cart.domestic_need_more", "台灣滿 NT$ 2,000 免運，尚差 NT$ {amt}").replace("{amt}", String(2000 - cartTotal))}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Desktop & iPad Table Header (Pinkoi Model) */}
              <div className="hidden md:grid grid-cols-12 px-6 py-3 border-b border-white/10 text-xs text-gray-300 font-medium tracking-wider">
                <div className="col-span-6">{t("cart.th_item", "商品明細")}</div>
                <div className="col-span-2 text-center">{t("cart.th_price", "單價")}</div>
                <div className="col-span-2 text-center">{t("cart.th_qty", "數量")}</div>
                <div className="col-span-2 text-right pr-2">{t("cart.th_subtotal", "小計")}</div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-white/10">
                {cart.map((item) => (
                  <div key={item.id} className="p-4 sm:p-6 transition-colors hover:bg-white/[0.02]">
                    
                    {/* Desktop & iPad Row Layout */}
                    <div className="hidden md:grid grid-cols-12 items-center gap-4">
                      
                      {/* Product Details (Col 6) */}
                      <div className="col-span-6 flex items-center gap-4">
                        <div className="w-[80px] h-[80px] rounded-xl overflow-hidden shrink-0 border border-white/20">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="min-w-0 pr-2 space-y-1">
                          <h3 className="text-sm font-semibold text-white tracking-wide hover:text-gold-end transition-colors line-clamp-2">
                            {getCartItemTitle(item, language)}
                          </h3>
                          {item.size && (
                            <p className="text-xs text-gold-end font-medium">
                              {getCartSizeLabel(language)}: {item.size}
                            </p>
                          )}
                          <p className="text-[11px] text-gray-300">
                            {getCartItemSubtitle(language)}
                          </p>
                        </div>
                      </div>

                      {/* Unit Price (Col 2) */}
                      <div className="col-span-2 text-center font-mono text-sm text-gray-200">
                        NT$ {item.price}
                      </div>

                      {/* Quantity Stepper (Col 2) */}
                      <div className="col-span-2 flex justify-center">
                        <div className="inline-flex items-center rounded-lg border border-white/25 overflow-hidden">
                          <button 
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-9 text-center text-xs font-mono font-semibold text-white">
                            {item.quantity}
                          </span>
                          <button 
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal & Delete Action (Col 2) */}
                      <div className="col-span-2 flex items-center justify-end gap-3 pr-2">
                        <span className="text-gold-end font-mono font-bold text-sm sm:text-base">
                          NT$ {item.price * item.quantity}
                        </span>
                        <button 
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                          title={t("cart.remove_item", "移除商品")}
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                    </div>

                    {/* Mobile (<768px) Layout */}
                    <div className="md:hidden flex gap-3.5 items-start">
                      <div className="w-[76px] h-[76px] rounded-xl overflow-hidden shrink-0 border border-white/20">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-sm font-semibold text-white line-clamp-1">
                            {getCartItemTitle(item, language)}
                          </h3>
                          <button 
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-400 p-1 cursor-pointer"
                            aria-label="Remove item"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        {item.size && (
                          <p className="text-xs text-gold-end font-medium">
                            {getCartSizeLabel(language)}: {item.size}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-2">
                          <span className="text-gold-end font-mono font-bold text-sm">
                            NT$ {item.price * item.quantity}
                          </span>

                          <div className="flex items-center rounded-lg border border-white/25">
                            <button 
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-white"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-7 text-center text-xs font-mono text-white">{item.quantity}</span>
                            <button 
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-white"
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>

            {/* ======================================================== */}
            {/* Shipping & Delivery Settings Card (Pinkoi Model)        */}
            {/* ======================================================== */}
            <div className="border border-white/15 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-sm sm:text-base font-bold text-white flex items-center gap-2 tracking-wider">
                  <Globe size={18} className="text-gold-end" />
                  {t("cart.shipping_settings", "運送方式與目的地")}
                </span>
                <span className="text-xs text-gray-400">
                  {getLocalizedCarrier()}
                </span>
              </div>

              <div>
                <label className="block text-gray-300 text-xs font-semibold mb-2 tracking-wider">
                  {t("cart.select_dest_prompt", "選擇收件國家與地區")}
                </label>
                <div className="relative">
                  <select
                    value={selectedDestination.id}
                    onChange={(e) => setSelectedDestination(getDestinationById(e.target.value))}
                    className="w-full bg-[#0F172A]/80 border border-white/20 hover:border-gold-end focus:border-gold-end rounded-xl py-3.5 px-4 text-white font-medium text-sm sm:text-base focus:outline-none transition-colors cursor-pointer appearance-none"
                  >
                    {SHIPPING_DESTINATIONS.map((dest) => {
                      let destName = dest.name;
                      if (language === "en") destName = dest.nameEn;
                      else if (language === "ja") destName = dest.nameJa;

                      const fee = dest.isInternational ? dest.baseFee - 100 : dest.baseFee;

                      return (
                        <option key={dest.id} value={dest.id} className="bg-[#0F172A] text-white py-1.5">
                          {dest.flag} {destName} ｜ NT$ {fee}
                        </option>
                      );
                    })}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Selected Logistics Detail Card */}
              <div className="border border-white/15 p-4 sm:p-5 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm sm:text-base text-white">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <Truck size={20} className="text-gold-end shrink-0" />
                  <span className="font-medium text-white text-sm sm:text-base">
                    {getLocalizedCarrier()}
                  </span>
                  <span className="text-white/40">｜</span>
                  <span className="font-medium text-white text-sm sm:text-base">
                    {language === "en" ? "Estimated Delivery: " : language === "ja" ? "お届け目安：" : "預計運送："}
                    {getLocalizedDays()}
                  </span>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  {isInternationalShipping ? (
                    <div className="flex items-center sm:justify-end gap-2 font-mono">
                      <span className="line-through text-gray-400 text-xs sm:text-sm">NT$ {cartShippingOriginal}</span>
                      <span className="text-gold-end font-bold text-base sm:text-lg">NT$ {cartShipping}</span>
                    </div>
                  ) : (
                    <span className={cartShipping === 0 ? "text-green-400 font-bold text-sm sm:text-base" : "font-mono font-bold text-white text-sm sm:text-base"}>
                      {cartShipping === 0 ? t("cart.free", "免運費") : `NT$ ${cartShipping}`}
                    </span>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* ======================================================== */}
          {/* Right Column: Sticky Order Summary & Checkout Button     */}
          {/* ======================================================== */}
          <div className="lg:col-span-4 w-full">
            <div className="border border-white/15 p-6 sm:p-7 rounded-2xl sticky top-[110px] space-y-5">
              
              <h2 className="text-lg text-white font-bold tracking-widest border-b border-white/10 pb-3">
                {t("cart.order_summary", "訂單明細")}
              </h2>

              {/* Line Items */}
              <div className="space-y-3.5 text-sm text-gray-300">
                
                {/* Subtotal */}
                <div className="flex justify-between items-center">
                  <span>{t("cart.subtotal", "商品小計")}</span>
                  <span className="font-mono text-white font-semibold">NT$ {cartTotal}</span>
                </div>

                {/* Discount: 滿 $3000 打 9 折 */}
                <div className="flex justify-between items-center">
                  <span>{t("cart.discount_label", "滿 $3000 打 9 折")}</span>
                  <span className={cartDiscount > 0 ? "text-gold-end font-mono font-bold" : "text-gray-500 font-mono"}>
                    {cartDiscount > 0 ? `- NT$ ${cartDiscount}` : '-'}
                  </span>
                </div>

                {/* Shipping Fee */}
                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                  <div className="flex flex-col">
                    <span>{t("cart.shipping_label", "運費")}</span>
                    <span className="text-xs text-gray-400 font-normal">{selectedDestination.name}</span>
                  </div>
                  <div className="text-right">
                    {isInternationalShipping ? (
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="line-through text-gray-500 text-xs">NT$ {cartShippingOriginal}</span>
                        <span className="text-gold-end font-bold">NT$ {cartShipping}</span>
                      </div>
                    ) : (
                      <span className={cartShipping === 0 ? "text-green-400 font-bold" : "font-mono text-white font-semibold"}>
                        {cartShipping === 0 ? t("cart.free", "免運費") : `NT$ ${cartShipping}`}
                      </span>
                    )}
                  </div>
                </div>

                {/* International Discount Notice or Domestic Free Notice */}
                <div className="pt-1">
                  {isInternationalShipping ? (
                    <div className="bg-gold-end/10 border border-gold-end/30 text-gold-end p-2.5 rounded-lg text-xs flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Sparkles size={13} className="shrink-0" />
                        {t("cart.intl_privilege", "國際運費每筆現折 NT$ 100 禮遇")}
                      </span>
                      <span className="font-bold underline shrink-0 ml-1">
                        {t("cart.saved_amount", "已省 NT$ 100")}
                      </span>
                    </div>
                  ) : (
                    cartShipping === 0 ? (
                      <p className="text-xs text-green-400 font-medium">
                        ✓ {t("cart.domestic_free_notice", "台灣境內滿 NT$ 2,000 享免運費")}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400">
                        {t("cart.domestic_need_more", "台灣滿 NT$ 2,000 免運，尚差 NT$ {amt}").replace("{amt}", String(2000 - cartTotal))}
                      </p>
                    )
                  )}
                </div>

                {/* Final Total (Pinkoi Highlight) */}
                <div className="border-t border-white/10 pt-4 flex justify-between items-baseline">
                  <span className="text-white font-bold tracking-widest text-base">
                    {t("cart.total", "應付總計")}
                  </span>
                  <div className="text-right">
                    <span className="text-gold-end font-bold font-mono text-2xl sm:text-3xl drop-shadow-sm">
                      NT$ {cartFinalTotal}
                    </span>
                  </div>
                </div>

              </div>

              {/* Primary Call To Action (Pinkoi Model) */}
              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="w-full py-4 bg-gold-end text-black font-bold tracking-widest rounded-xl hover:bg-yellow-400 transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer text-base group"
              >
                <span>{t("cart.checkout", "前往結帳")}</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Pinkoi-style Trust & Assurance Markers (Themed to 327 ART) */}
              <div className="pt-3 border-t border-white/10 space-y-2 text-xs text-gray-400 tracking-wider">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-gold-end shrink-0" />
                  <span>{t("cart.trust_authentic", "327 ART 官方正品原創保證")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={14} className="text-gold-end shrink-0" />
                  <span>{t("cart.trust_tracking", "專人 Email / LINE 物流進度追蹤")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard size={14} className="text-gold-end shrink-0" />
                  <span>{t("cart.trust_secure", "支援信用卡 / 銀行 ATM 安全結帳")}</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
