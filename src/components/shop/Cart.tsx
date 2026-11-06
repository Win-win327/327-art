import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContext";
import { X, Minus, Plus, Trash2, Globe, Sparkles, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { SHIPPING_DESTINATIONS, getDestinationById } from "../../config/shipping";
import { getCartItemTitle, getCartSizeLabel } from "../../utils/cartHelpers";

export default function Cart() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
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

  const getLocalizedCarrier = () => {
    if (language === "en") return selectedDestination.carrierEn;
    if (language === "ja") return selectedDestination.carrierJa;
    return selectedDestination.carrier;
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] transition-opacity duration-300 ${
          isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Cart Drawer - iPad & Safari robust transition */}
      <div 
        className={`fixed top-0 bottom-0 right-0 w-full sm:w-[420px] max-w-full bg-[#0F172A]/95 backdrop-blur-xl shadow-2xl z-[101] flex flex-col border-l border-white/10 transition-transform duration-300 ease-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-white/20 flex justify-between items-center bg-black/40">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold tracking-widest text-gradient-gold">
              {t("cart.title", "購物車")}
            </h2>
            <Link
              to="/cart"
              onClick={() => setIsCartOpen(false)}
              className="text-xs text-gold-end/80 hover:text-gold-end flex items-center gap-1 ml-2 transition-colors"
              title={t("cart.view_full_page", "開啟完整購物車頁面")}
            >
              <ExternalLink size={12} />
              <span className="hidden sm:inline">{t("cart.view_full_page", "全頁面")}</span>
            </Link>
          </div>
          <button 
            type="button"
            onClick={() => setIsCartOpen(false)} 
            className="text-gray-300 hover:text-white transition-colors cursor-pointer p-1.5 rounded-full hover:bg-white/10"
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>

        {/* Drawer Body Items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-4 py-16">
              <span className="text-4xl text-white/20">🛒</span>
              <p className="tracking-widest text-sm">{t("cart.empty", "您的購物車是空的")}</p>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="mt-2 text-xs text-gold-end border border-gold-end/40 px-4 py-1.5 rounded hover:bg-gold-end hover:text-black transition-colors"
              >
                {t("cart.back_shop", "繼續選購")}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Apparel section */}
              {cart.filter(item => item.productId.includes('shirt')).length > 0 && (
                <div>
                  <h3 className="text-xs text-gold-end font-bold tracking-widest uppercase mb-3 border-b border-white/10 pb-1 flex items-center justify-between">
                    <span>{t("cart.apparel_section", "服飾區")}</span>
                    <span className="text-[10px] bg-gold-end/20 text-gold-end px-2 py-0.5 rounded border border-gold-end/30">
                      {t("cart.preorder_badge", "預購")}
                    </span>
                  </h3>
                  <div className="space-y-3">
                    {cart.filter(item => item.productId.includes('shirt')).map(item => (
                      <div key={item.id} className="flex gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                        <div className="w-[65px] h-[65px] rounded-lg overflow-hidden bg-black/50 shrink-0 border border-white/10">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm text-white font-semibold line-clamp-1">
                            {getCartItemTitle(item, language)}
                          </h4>
                          {item.size && (
                            <p className="text-xs text-gold-end mt-0.5 font-bold">
                              {getCartSizeLabel(language)}: {item.size}
                            </p>
                          )}
                          <div className="text-gold-end font-semibold text-xs sm:text-sm mt-1 font-mono">
                            NT$ {item.price * item.quantity}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center bg-black/40 rounded border border-white/10 w-max">
                              <button 
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-2 py-1 text-gray-300 hover:text-white cursor-pointer"
                              >
                                <Minus size={13} />
                              </button>
                              <span className="w-6 text-center text-xs text-white font-mono">{item.quantity}</span>
                              <button 
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-2 py-1 text-gray-300 hover:text-white cursor-pointer"
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                            <button 
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer p-1"
                              title="移除"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cards & Goods section */}
              {cart.filter(item => !item.productId.includes('shirt')).length > 0 && (
                <div>
                  <h3 className="text-xs text-gold-end font-bold tracking-widest uppercase mb-3 border-b border-white/10 pb-1">
                    {t("cart.cards_section", "牌卡區")}
                  </h3>
                  <div className="space-y-3">
                    {cart.filter(item => !item.productId.includes('shirt')).map(item => (
                      <div key={item.id} className="flex gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                        <div className="w-[65px] h-[65px] rounded-lg overflow-hidden bg-black/50 shrink-0 border border-white/10">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm text-white font-semibold line-clamp-1">
                            {getCartItemTitle(item, language)}
                          </h4>
                          <div className="text-gold-end font-semibold text-xs sm:text-sm mt-1 font-mono">
                            NT$ {item.price * item.quantity}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center bg-black/40 rounded border border-white/10 w-max">
                              <button 
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-2 py-1 text-gray-300 hover:text-white cursor-pointer"
                              >
                                <Minus size={13} />
                              </button>
                              <span className="w-6 text-center text-xs text-white font-mono">{item.quantity}</span>
                              <button 
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-2 py-1 text-gray-300 hover:text-white cursor-pointer"
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                            <button 
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer p-1"
                              title="移除"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Drawer Footer / Calculation (Pinkoi style clean destination & summary) */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:pb-5 border-t border-white/20 bg-black/50 shrink-0 space-y-3.5">
            
            {/* Clean Shipping Destination Dropdown without messy parentheses */}
            <div className="bg-white/5 border border-white/15 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-200 flex items-center gap-1.5">
                  <Globe size={14} className="text-gold-end" />
                  {t("cart.shipping_dest_label", "運送國家／地區")}
                </span>
                <span className="text-[11px] text-gray-400 truncate max-w-[170px]">
                  {getLocalizedCarrier()}
                </span>
              </div>
              
              {/* Option text has ZERO parentheses */}
              <select
                value={selectedDestination.id}
                onChange={(e) => setSelectedDestination(getDestinationById(e.target.value))}
                className="w-full bg-black/50 border border-white/20 text-white rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-gold-end cursor-pointer"
              >
                {SHIPPING_DESTINATIONS.map((dest) => {
                  let destName = dest.name;
                  if (language === "en") destName = dest.nameEn;
                  else if (language === "ja") destName = dest.nameJa;

                  const fee = dest.isInternational ? dest.baseFee - 100 : dest.baseFee;

                  return (
                    <option key={dest.id} value={dest.id} className="bg-[#0F172A] text-white py-1">
                      {dest.flag} {destName} ｜ NT$ {fee}
                    </option>
                  );
                })}
              </select>

              {/* Clean promotion message written only at the bottom confirmation area */}
              <div className="text-[11px] pt-1">
                {isInternationalShipping ? (
                  <div className="bg-gold-end/10 border border-gold-end/30 text-gold-end p-2 rounded-lg flex items-center justify-between">
                    <span className="flex items-center gap-1 font-medium">
                      <Sparkles size={12} className="shrink-0" />
                      {t("cart.intl_discount_applied", "國際運送每筆現折 NT$ 100 禮遇已套用")}
                    </span>
                    <span className="font-bold underline shrink-0 ml-1">
                      {t("cart.saved_amount", "已省 NT$ 100")}
                    </span>
                  </div>
                ) : (
                  <div className="text-gray-300">
                    {cartTotal >= 2000 ? (
                      <span className="text-green-400 font-semibold flex items-center gap-1">
                        ✓ {t("cart.domestic_free_notice", "台灣境內滿 NT$ 2,000 享免運費")}
                      </span>
                    ) : (
                      <span className="text-gray-400">
                        {t("cart.domestic_need_more", "台灣滿 NT$ 2,000 免運，尚差 NT$ {amt}").replace("{amt}", String(2000 - cartTotal))}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs sm:text-sm text-gray-300">
              <p className="flex justify-between">
                <span>{t("cart.subtotal", "商品小計")}</span>
                <span className="font-mono">NT$ {cartTotal}</span>
              </p>
              
              {/* Shipping Fee */}
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <span>{t("cart.shipping_label", "運費")}</span>
                  <span className="text-[11px] text-gray-400">
                    {selectedDestination.flag} {language === "en" ? selectedDestination.nameEn : language === "ja" ? selectedDestination.nameJa : selectedDestination.name}
                  </span>
                </span>
                <div className="text-right">
                  {isInternationalShipping ? (
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="line-through text-gray-500 text-xs">NT$ {cartShippingOriginal}</span>
                      <span className="text-gold-end font-bold">NT$ {cartShipping}</span>
                    </div>
                  ) : (
                    <span className={cartShipping === 0 ? "text-green-400 font-bold" : "font-mono"}>
                      {cartShipping === 0 ? t("cart.free", "免費") : `+ NT$ ${cartShipping}`}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-2.5 border-t border-white/10">
              <span className="text-gray-200 tracking-wider font-semibold flex flex-col">
                <span className="text-sm">{t("cart.total_miracle", "總計的奇蹟")}</span>
                {isInternationalShipping ? (
                  <span className="text-[11px] text-gold-end font-normal">
                    ✦ 已折抵 NT$ 100 國際運費
                  </span>
                ) : (
                  cartTotal >= 2000 ? (
                    <span className="text-[11px] text-green-400 font-normal">
                      ✓ 已享台灣免運優惠！
                    </span>
                  ) : (
                    <span className="text-[11px] text-gray-400 font-normal">
                      再買 NT$ {2000 - cartTotal} 即享台灣免運
                    </span>
                  )
                )}
              </span>
              <span className="text-2xl font-bold text-gold-end font-mono">NT$ {cartFinalTotal}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Link 
                to="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="flex-1 py-3.5 bg-gold-end text-black text-center font-bold tracking-[2px] rounded-xl flex justify-center items-center hover:bg-yellow-400 transition-colors shadow-lg cursor-pointer text-sm"
              >
                {t("cart.checkout", "前往結帳")}
              </Link>
            </div>

            {/* Return Policy Link */}
            <div className="pt-2 text-center">
              <Link 
                to="/cart"
                onClick={() => setIsCartOpen(false)}
                className="text-[11px] text-gray-400 hover:text-gold-end transition-colors inline-flex items-center gap-1"
              >
                <span>🛡️ {t("cart.return_policy_note", "享 7 日鑑賞期・查看退款換貨須知")}</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
