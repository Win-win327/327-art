import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Loader2, Globe, Truck, Sparkles, CreditCard, Building2, MessageCircle, Copy, Check, Clock } from "lucide-react";
import { submitOrder } from "../lib/firebase";

export default function Payment() {
  const { 
    cart, 
    cartTotal, 
    cartFinalTotal, 
    cartDiscount, 
    cartShipping, 
    cartShippingOriginal,
    cartShippingDiscount,
    selectedDestination,
    isInternationalShipping,
    customerInfo, 
    clearCart 
  } = useCart();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2500);
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleNext = async () => {
    if (!customerInfo) {
      setErrorMsg(t("payment.err_no_customer", "請先填寫顧客資料！"));
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      await submitOrder({
        customerName: customerInfo.name,
        customerEmail: customerInfo.email || "",
        customerPhone: customerInfo.phone,
        customerAddress: customerInfo.address,
        items: cart,
        orderTotal: cartFinalTotal,
        status: "pending"
      });

      const hasUnicornShirt = cart.some(
        item => item.productId === "shirt-unicorn" || item.id.includes("shirt-unicorn") || item.title?.includes("獨角獸")
      );
      const hasPreOrderShirt = cart.some(
        item => item.productId?.startsWith("shirt-") || item.productId?.startsWith("po-") || item.id?.startsWith("po-") || item.id?.startsWith("shirt-")
      );

      const orderNumber = `327-${Date.now().toString().slice(-6)}`;
      const completedOrderData = {
        orderNumber,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email || "",
        customerPhone: customerInfo.phone,
        customerAddress: customerInfo.address,
        destinationName: selectedDestination.name,
        carrier: selectedDestination.carrier,
        isInternational: isInternationalShipping,
        shippingFee: cartShipping,
        discount: cartDiscount,
        orderTotal: cartFinalTotal,
        hasUnicornShirt,
        hasPreOrderShirt,
        items: cart.map(i => ({
          title: i.title,
          size: i.size,
          quantity: i.quantity,
          price: i.price,
          image: i.image,
          productId: i.productId
        })),
        createdAt: new Date().toLocaleDateString("zh-TW", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
        })
      };
      sessionStorage.setItem("lastCompletedOrder", JSON.stringify(completedOrderData));

      if (hasUnicornShirt || hasPreOrderShirt) {
        sessionStorage.setItem("lastOrderPreorderShirt", JSON.stringify({
          hasUnicorn: hasUnicornShirt,
          items: cart.map(i => ({ title: i.title, size: i.size, quantity: i.quantity }))
        }));
      } else {
        sessionStorage.removeItem("lastOrderPreorderShirt");
      }

      clearCart();
      navigate("/order-success");
    } catch (error) {
      console.error("Checkout error:", error);
      setErrorMsg(t("payment.err_failed", "送出訂單失敗，請稍後再試。"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative z-10 max-w-5xl mx-auto pt-[120px] md:pt-[150px] pb-[80px] px-4 sm:px-6 w-full">
      {/* Top Header: Pinkoi-style Navigation & Checkout Step Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-4 border-b border-white/10">
        <Link 
          to="/checkout" 
          className="inline-flex items-center text-gold-end hover:text-white transition-colors text-xs sm:text-sm tracking-widest group"
        >
          <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-0.5 transition-transform" />
          <span>{t("payment.back_checkout", "返回修改收件資料")}</span>
        </Link>

        {/* 3-Step Checkout Progress Bar */}
        <nav aria-label="Checkout Progress" className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
          <Link to="/cart" className="flex items-center gap-1.5 text-gray-400 hover:text-gold-end font-normal transition-colors">
            <span className="w-5 h-5 rounded-full bg-white/10 text-gray-300 text-xs flex items-center justify-center">1</span>
            <span className="tracking-wider">{t("cart.step1", "1. 購物車")}</span>
          </Link>

          <span className="text-white/20 select-none">―</span>

          <Link to="/checkout" className="flex items-center gap-1.5 text-gray-400 hover:text-gold-end font-normal transition-colors">
            <span className="w-5 h-5 rounded-full bg-white/10 text-gray-300 text-xs flex items-center justify-center">2</span>
            <span className="tracking-wider">{t("cart.step2", "2. 填寫資料")}</span>
          </Link>

          <span className="text-white/20 select-none">―</span>

          <div className="flex items-center gap-1.5 text-gold-end font-semibold">
            <span className="w-5 h-5 rounded-full bg-gold-end text-black font-bold text-xs flex items-center justify-center shadow-sm">3</span>
            <span className="tracking-wider">{t("cart.step3", "3. 確認付款")}</span>
          </div>
        </nav>
      </div>
      
      <h1 className="text-2xl sm:text-3xl md:text-4xl text-gradient-white-gold drop-shadow-md mb-8 tracking-widest font-bold">
        {t("payment.title", "付款資訊與訂單確認")}
      </h1>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-black/30 rounded-2xl border border-white/10">
          <p className="text-gray-400 mb-5 tracking-widest">{t("payment.empty_cart")}</p>
          <Link to="/#shop" className="inline-block border border-gold-end text-gold-end px-6 py-2 tracking-widest hover:bg-gold-end hover:text-black transition-colors rounded">
            {t("payment.go_shop")}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Payment instructions and Bank details */}
          <div className="flex-1 space-y-6">
            
            {/* Delivery & Destination confirmation */}
            <div className="bg-black/40 border border-white/10 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm text-gray-300">
                <span className="flex items-center gap-1.5 text-gold-end font-semibold">
                  <Globe size={16} /> {t("cart.shipping_dest_label", "寄送目的地")}：
                </span>
                <span className="font-bold text-white">
                  {selectedDestination.flag} {language === "en" ? selectedDestination.nameEn : language === "ja" ? selectedDestination.nameJa : selectedDestination.name}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm text-gray-300">
                <span className="flex items-center gap-1.5 text-gold-end font-semibold">
                  <Truck size={16} /> {t("cart.carrier_label", "物流承運")}：
                </span>
                <span className="text-gray-200">
                  {language === "en" ? selectedDestination.carrierEn : language === "ja" ? selectedDestination.carrierJa : selectedDestination.carrier}（{language === "en" ? selectedDestination.estimatedDaysEn : language === "ja" ? selectedDestination.estimatedDaysJa : selectedDestination.estimatedDays}）
                </span>
              </div>
              {customerInfo && (
                <div className="pt-2 border-t border-white/10 text-xs text-gray-400">
                  <p><span className="text-gray-300 font-semibold">收件人：</span>{customerInfo.name} ｜ {customerInfo.phone}</p>
                  <p className="mt-0.5"><span className="text-gray-300 font-semibold">地址：</span>{customerInfo.address}</p>
                </div>
              )}
            </div>

            {/* Bank Transfer Information Card */}
            <div className="bg-black/40 border border-gold-end/40 p-6 rounded-2xl text-gray-300 tracking-wider leading-relaxed shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h2 className="text-lg sm:text-xl text-white font-bold flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-gold-end" />
                  <span>付款方式：ATM 銀行轉帳／網路銀行匯款</span>
                </h2>
                <span className="text-xs bg-gold-end/20 text-gold-end px-2.5 py-1 rounded-full font-bold">
                  目前收款方式
                </span>
              </div>

              {/* Bank Account Details Box */}
              <div className="bg-gradient-to-br from-gold-end/10 via-black/50 to-black/70 p-5 rounded-xl border border-gold-end/30 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gold-end font-semibold uppercase tracking-widest">Bank Transfer Details</span>
                  <span className="text-xs text-gray-400">請匯入以下專屬帳戶</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {/* Bank Name & Code */}
                  <div className="bg-black/60 p-3.5 rounded-lg border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400 block mb-0.5">收款銀行 / 銀行代碼</span>
                      <span className="text-white font-bold text-base">國泰世華商業銀行 <span className="text-gold-end font-mono">（013）</span></span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy("013", "bankCode")}
                      className="px-2.5 py-1.5 rounded-md bg-white/10 hover:bg-gold-end hover:text-black text-gold-end text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      title="複製代碼"
                    >
                      {copiedField === "bankCode" ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedField === "bankCode" ? "已複製" : "複製代碼"}</span>
                    </button>
                  </div>

                  {/* Account Name */}
                  <div className="bg-black/60 p-3.5 rounded-lg border border-white/10">
                    <span className="text-xs text-gray-400 block mb-0.5">戶名 / Account Name</span>
                    <span className="text-white font-bold text-base">張景雯</span>
                  </div>
                </div>

                {/* Account Number with large display & copy button */}
                <div className="bg-black/70 p-4 rounded-xl border border-gold-end/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-gray-400 block mb-1">銀行帳號 / Account Number</span>
                    <span className="text-gold-end font-mono font-bold text-xl sm:text-2xl tracking-wider select-all">
                      069700023796
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy("069700023796", "accountNum")}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-gold-end text-black font-bold text-xs sm:text-sm hover:bg-yellow-400 transition-all shadow-md cursor-pointer shrink-0"
                  >
                    {copiedField === "accountNum" ? <Check size={16} /> : <Copy size={16} />}
                    <span>{copiedField === "accountNum" ? "已複製帳號！" : "一鍵複製帳號"}</span>
                  </button>
                </div>

                {/* Transfer Instructions */}
                <div className="pt-2 text-xs sm:text-sm text-gray-300 space-y-1.5 leading-relaxed border-t border-white/10">
                  <p className="text-white font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-end"></span>
                    <span>匯款步驟說明：</span>
                  </p>
                  <ol className="list-decimal list-inside pl-1 space-y-1 text-gray-300">
                    <li>請將應付總額匯款至上述國泰世華銀行帳戶。</li>
                    <li>匯款完成後，請點擊下方按鈕送出訂單，系統將產生您的「訂單編號」。</li>
                    <li>請加入官方 LINE（@327art）或來信告知您的「訂單姓名」與「帳號末五碼」，我們將即刻對帳並安排出貨！</li>
                  </ol>
                </div>
              </div>

              {/* Official LINE & Email Contact Box */}
              <div className="bg-black/50 p-4 sm:p-5 rounded-xl border border-white/10 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                    <MessageCircle size={22} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-white font-semibold text-sm sm:text-base">
                      官方 LINE 客服（匯款回報與訂單確認）
                    </p>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      送出訂單或完成匯款後，歡迎隨時加入官方 LINE 聯繫我們，專人將迅速為您核對訂單與款項。
                    </p>
                  </div>
                </div>

                <div className="pt-1 flex flex-col sm:flex-row gap-2.5">
                  <a
                    href="https://lin.ee/o8qHjzS"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-[#06C755] hover:bg-[#05b34c] text-white font-bold px-4 py-2.5 rounded-xl transition-all shadow-md text-xs sm:text-sm tracking-wider"
                  >
                    <MessageCircle size={16} />
                    <span>加入官方 LINE (@327art) 回報末五碼</span>
                  </a>
                  <a
                    href="mailto:poweranimal2212@gmail.com"
                    className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 px-3.5 py-2.5 rounded-xl transition-all text-xs tracking-wider"
                  >
                    客服信箱：poweranimal2212@gmail.com
                  </a>
                </div>
              </div>

              {/* Coming Soon: Credit Card Announcement Card */}
              <div className="bg-gradient-to-r from-purple-950/40 via-blue-950/40 to-black/60 p-4 sm:p-5 rounded-xl border border-purple-400/30 space-y-2">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    <Sparkles size={13} className="text-yellow-300" />
                    <span>敬請期待・即將上線</span>
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-purple-400" />
                  <span>線上刷卡支付即將上線！</span>
                </h3>
              </div>
            </div>

            {/* Total Payment Notice */}
            <div className="bg-white/5 border border-gold-end/30 p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-base text-gray-200 font-semibold">{t("payment.order_amount", "應付訂單總金額")}</span>
                <span className="text-gold-end text-3xl font-bold font-mono">NT$ {cartFinalTotal}</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                點擊下方按鈕即可完成送出訂單。如需信用卡之外的付款方式或訂單確認，歡迎隨時加入官方 LINE 與我們聯繫。
              </p>
            </div>
            
            {errorMsg && (
              <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-400 text-sm tracking-wider text-center">
                {errorMsg}
              </div>
            )}

            <button 
              onClick={handleNext}
              disabled={isSubmitting}
              className="w-full flex justify-center items-center gap-2 bg-gold-end text-black font-bold tracking-widest py-4 rounded-xl hover:bg-yellow-400 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-base"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  {t("payment.submitting", "正在確認送出訂單...")}
                </>
              ) : (
                "確認已填寫完畢・完成送出訂單"
              )}
            </button>
          </div>

          {/* Right Column: Order Summary with 9折 and Shipping */}
          <div className="lg:w-[380px] shrink-0">
            <div className="bg-black/40 border border-white/10 p-6 rounded-2xl sticky top-[100px] shadow-2xl">
              <h2 className="text-xl text-white font-semibold mb-6 tracking-widest border-b border-white/10 pb-3">
                {t("checkout.summary_heading", "訂單摘要")}
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-sm text-gray-300">
                  <span>{t("cart.subtotal", "商品小計")}</span>
                  <span className="font-mono">NT$ {cartTotal}</span>
                </div>

                {/* 折扣（若有才顯示） */}
                {cartDiscount > 0 && (
                  <div className="flex justify-between items-center text-sm text-gray-300">
                    <span>{t("cart.discount_label", "滿 $3000 打 9 折")}</span>
                    <span className="text-green-400 font-mono font-bold">
                      - NT$ {cartDiscount}
                    </span>
                  </div>
                )}

                {/* 運費 */}
                <div className="flex justify-between items-center text-sm text-gray-300 pt-1 border-t border-white/5">
                  <div className="flex flex-col">
                    <span>{t("cart.shipping_label", "運費")}</span>
                    <span className="text-[11px] text-gray-400">
                      {language === "en" ? selectedDestination.nameEn : language === "ja" ? selectedDestination.nameJa : selectedDestination.name}
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

                {isInternationalShipping && (
                  <p className="text-[11px] text-gold-end bg-gold-end/10 p-2 rounded border border-gold-end/30">
                    <Sparkles size={12} className="inline mr-1" />
                    {t("cart.intl_discount_applied", "已折抵 NT$ 100 國際運費禮遇")}
                  </p>
                )}

                <div className="border-t border-white/10 pt-4 text-lg flex justify-between items-center">
                  <span className="text-white font-bold tracking-widest">{t("cart.total", "應付總計")}</span>
                  <span className="text-gold-end font-bold font-mono text-2xl">NT$ {cartFinalTotal}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
