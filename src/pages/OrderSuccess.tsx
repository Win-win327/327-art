import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { 
  CheckCircle2, 
  Clock, 
  MessageCircle, 
  AlertCircle, 
  Mail, 
  Copy, 
  Check, 
  Globe, 
  Instagram, 
  Printer, 
  X, 
  ShieldCheck, 
  ChevronRight, 
  ExternalLink,
  Building2,
  CreditCard,
  Sparkles
} from "lucide-react";
import { getCartItemTitle } from "../utils/cartHelpers";

interface CompletedOrder {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  destinationName?: string;
  carrier?: string;
  isInternational?: boolean;
  shippingFee?: number;
  discount?: number;
  orderTotal: number;
  hasUnicornShirt: boolean;
  hasPreOrderShirt: boolean;
  items: Array<{
    title: string;
    size?: string;
    quantity: number;
    price?: number;
    image?: string;
    productId?: string;
  }>;
  createdAt: string;
}

export default function OrderSuccess() {
  const { clearCart } = useCart();
  const { t, language } = useLanguage();

  const [order, setOrder] = useState<CompletedOrder | null>(null);
  const [hasPreorderItems, setHasPreorderItems] = useState(false);
  const [showPreorderModal, setShowPreorderModal] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Retrieve order data from sessionStorage
    try {
      const savedCompleted = sessionStorage.getItem("lastCompletedOrder");
      const savedPreorder = sessionStorage.getItem("lastOrderPreorderShirt");

      let currentOrder: CompletedOrder | null = null;
      let isPreorder = false;

      if (savedCompleted) {
        currentOrder = JSON.parse(savedCompleted);
        setOrder(currentOrder);
        if (currentOrder?.hasUnicornShirt || currentOrder?.hasPreOrderShirt) {
          isPreorder = true;
        }
      }

      if (savedPreorder) {
        const parsedPreorder = JSON.parse(savedPreorder);
        if (parsedPreorder.hasUnicorn || (parsedPreorder.items && parsedPreorder.items.length > 0)) {
          isPreorder = true;
        }
      }

      setHasPreorderItems(isPreorder);
      // Auto open confirmation modal if customer purchased preorder items
      if (isPreorder) {
        setShowPreorderModal(true);
      }
    } catch (e) {
      console.error(e);
    }

    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2500);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-[75vh] pt-[120px] md:pt-[140px] pb-[90px] px-4 sm:px-6 w-full">
      
      {/* ======================================================== */}
      {/* 預購服飾 專屬訂購完成確認彈出視窗 (Modal) */}
      {/* ======================================================== */}
      {showPreorderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0b1320] border-2 border-gold-end/60 rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 text-white relative max-h-[92vh] overflow-y-auto custom-scrollbar">
            {/* Close Button */}
            <button 
              onClick={() => setShowPreorderModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={22} />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-6">
              <span className="inline-block px-3 py-1 bg-gold-end/20 text-gold-end text-xs font-bold rounded-full border border-gold-end/40 tracking-widest mb-3">
                ✦ 訂單成立 ｜ 顧客訂購確認
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gradient-gold tracking-wider mb-2">
                預購衣服製作注意事項與時程確認
              </h2>
              <p className="text-gray-300 text-xs sm:text-sm tracking-wide">
                感謝您的訂購！由於您訂購了專屬預購款式，請確認以下製作說明與聯絡方式：
              </p>
            </div>

            {/* Lead Time Card */}
            <div className="mb-5 p-4 sm:p-5 rounded-xl bg-gold-end/10 border border-gold-end/40 text-left space-y-2">
              <div className="flex items-center gap-2 text-gold-end font-bold text-base sm:text-lg">
                <Clock className="w-5 h-5 shrink-0" />
                <span>製作時間：約需 1 個月</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed pl-7">
                本系列（包含飛越獨角獸 T 恤）為 327 ART 限量專屬獨立製作，每件皆依訂單順序進行專屬高解析度數位印染與細緻手工裁製，<strong>製作時間約需 1 個月</strong>。完工品檢合格後將立即為您依序包裝寄出，若提早完工將優先出貨！
              </p>
            </div>

            {/* Notes Section */}
            <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 text-left space-y-2 text-xs sm:text-sm text-gray-300 leading-relaxed">
              <p className="text-white font-semibold flex items-center gap-2">
                <ShieldCheck size={16} className="text-gold-end" />
                衣服製作預購注意事項：
              </p>
              <ul className="pl-6 space-y-1 list-disc text-gray-300">
                <li>本品為專屬訂製品，訂單成立並付款後即進入正式排單印製程序。</li>
                <li>請再次核對您填寫的收件人姓名、電話及收件地址；若有更動請於 24 小時內與我們聯絡更新。</li>
                <li>洗滌建議：翻面冷水手洗或放入細網洗衣袋柔洗，避免烘乾以維持印花鮮豔持久。</li>
              </ul>
            </div>

            {/* Contact Channels: LINE + Foreign Customers (Email/IG) */}
            <div className="space-y-4 mb-6">
              {/* Option A: LINE (Taiwan / Domestic) */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#06C755]/10 border border-[#06C755]/40 text-left space-y-3">
                <div className="flex items-center gap-2 text-[#06C755] font-bold text-sm sm:text-base">
                  <MessageCircle size={20} />
                  <span>【台灣/在地顧客推薦】加入 327 ART 官方 LINE（方便日後聯絡）</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                  為方便日後主動向您聯絡「衣服製作排程、出貨時間與物流單號」，請立即點擊下方按鈕加入官方 LINE。加入後可傳送訊息告知您的訂單姓名：
                </p>
                <a
                  href="https://lin.ee/o8qHjzS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#06C755] hover:bg-[#05b34c] text-white font-bold rounded-lg transition-transform hover:scale-[1.01] active:scale-[0.99] text-sm sm:text-base tracking-widest shadow-lg cursor-pointer"
                >
                  <MessageCircle size={20} />
                  點此加入 327 ART 官方 LINE（方便日後聯絡）
                </a>
              </div>

              {/* Option B: Foreign Customers / No LINE (Overseas Support) */}
              <div className="p-4 sm:p-5 rounded-xl bg-blue-500/10 border border-blue-400/30 text-left space-y-3">
                <div className="flex items-center gap-2 text-blue-300 font-bold text-sm sm:text-base">
                  <Globe size={20} />
                  <span>【外國顧客 / 沒有 LINE 怎麼辦？】海外專屬聯繫管道</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                  親愛的海外顧客請放心！若您沒有 LINE，我們為您提供全球通用的專人聯繫與包裹進度服務：
                </p>
                <div className="space-y-2 text-xs sm:text-sm text-gray-300 pl-2">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-300 font-bold">1.</span>
                    <span>
                      <strong className="text-white">Email 主動通報保證：</strong>
                      我們已在系統建檔您結帳時填寫的 Email，當衣服製作完成、包裝並寄出國際包裹時，系統會直接將「國際物流追蹤號碼（Tracking Number）」寄至您的信箱，隨時掌握包裹位置！
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-300 font-bold">2.</span>
                    <span>
                      <strong className="text-white">官方客服信箱：</strong>
                      若有任何問題，可直接來信至 
                      <span className="text-gold-end font-mono mx-1">poweranimal2212@gmail.com</span>
                      （註明您的訂單姓名），客服團隊將於 24 小時內回覆。
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                  <a
                    href="mailto:poweranimal2212@gmail.com?subject=327 ART 預購訂單諮詢"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                  >
                    <Mail size={16} />
                    發送 Email 給我們
                  </a>
                  <button
                    onClick={() => handleCopy("poweranimal2212@gmail.com", "modalEmail")}
                    className="inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-white/5 hover:bg-white/15 text-gold-end rounded-lg border border-gold-end/30 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                  >
                    {copiedField === "modalEmail" ? <Check size={16} /> : <Copy size={16} />}
                    {copiedField === "modalEmail" ? "已複製信箱！" : "複製客服信箱"}
                  </button>
                  <a
                    href="https://www.instagram.com/win_power2000/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-purple-600/30 to-pink-600/30 hover:from-purple-600/50 hover:to-pink-600/50 text-white rounded-lg border border-pink-500/30 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                  >
                    <Instagram size={16} />
                    IG 私訊 @win_power2000
                  </a>
                </div>
              </div>
            </div>

            {/* Confirmation Button */}
            <button
              onClick={() => setShowPreorderModal(false)}
              className="w-full py-4 rounded-xl bg-gold-end text-black font-bold tracking-widest text-base hover:bg-yellow-400 transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>我已確認預購注意事項・查看完整訂單明細</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 顧客訂購確認頁面主體 (Order Confirmation Page) */}
      {/* ======================================================== */}
      <div className="bg-black/40 border border-white/10 p-6 sm:p-10 md:p-12 rounded-2xl max-w-3xl w-full text-center shadow-2xl backdrop-blur-md">
        
        {/* Header Icon & Title */}
        <div className="mb-8">
          <div className="w-20 h-20 rounded-full bg-gold-end/10 border-2 border-gold-end/40 flex items-center justify-center mx-auto mb-5 shadow-lg">
            <CheckCircle2 className="w-12 h-12 text-gold-end" />
          </div>
          <span className="inline-block px-4 py-1 rounded-full bg-gold-end/20 text-gold-end text-xs font-bold tracking-widest uppercase border border-gold-end/40 mb-3">
            Order Confirmation
          </span>
          <h1 className="text-3xl md:text-4xl text-gradient-white-gold drop-shadow-md mb-3 tracking-[0.15em] font-bold">
            {t("success.title", "顧客訂購確認完成！")}
          </h1>
          <p className="text-gray-300 text-sm sm:text-base tracking-widest max-w-lg mx-auto">
            {t("success.subtitle", "感謝您的購買，我們已收到您的訂單資料與購買清單。")}
          </p>
        </div>

        {/* 訂單編號與日期摘要 */}
        {order && (
          <div className="bg-white/5 border border-white/15 rounded-xl p-4 sm:p-5 mb-8 text-left grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-gray-400 block tracking-wider mb-1">訂單編號 / Order ID</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-mono font-bold text-lg">{order.orderNumber}</span>
                <button
                  onClick={() => handleCopy(order.orderNumber, "orderId")}
                  className="p-1.5 hover:bg-white/10 rounded text-gold-end transition-colors cursor-pointer"
                  title="複製訂單編號"
                >
                  {copiedField === "orderId" ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-400 block tracking-wider mb-1">訂購日期 / Date</span>
              <span className="text-gray-200 font-mono text-sm">{order.createdAt}</span>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 預購衣服特別注意事項與製作時間醒目專區 */}
        {/* ======================================================== */}
        {hasPreorderItems && (
          <div className="mb-8 p-5 sm:p-7 rounded-2xl bg-gradient-to-b from-gold-end/20 via-gold-end/10 to-transparent border-2 border-gold-end/50 text-left space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gold-end/30 pb-3">
              <div className="flex items-center gap-2 text-gold-end font-bold text-lg sm:text-xl">
                <Clock className="w-6 h-6 shrink-0" />
                <span>✦ 預購衣服製作注意事項與時程確認</span>
              </div>
              <button
                onClick={() => setShowPreorderModal(true)}
                className="text-xs text-gold-end underline hover:text-white transition-colors cursor-pointer"
              >
                重開提醒視窗
              </button>
            </div>

            {/* Item list */}
            {order?.items && order.items.length > 0 && (
              <div className="bg-black/50 rounded-xl p-4 border border-white/10 text-sm text-gray-200">
                <p className="text-xs text-gold-end font-semibold mb-2 tracking-wider">預購商品清單：</p>
                <div className="space-y-2">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs sm:text-sm">
                      <span className="font-mono text-white">
                        • {getCartItemTitle(it as any, language)} {it.size ? `【${language === "en" ? "Size" : language === "ja" ? "サイズ" : "尺寸"}：${it.size}】` : ""} × {it.quantity}
                      </span>
                      {it.price && (
                        <span className="text-gold-end font-mono">NT$ {it.price * it.quantity}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Production Lead Time */}
            <div className="space-y-2 text-sm text-gray-200 leading-relaxed bg-black/30 p-4 rounded-xl border border-gold-end/20">
              <p className="text-white font-bold flex items-center gap-2 text-base">
                ⏳ 衣服製作時間：約需 1 個月
              </p>
              <p className="text-gray-300 text-xs sm:text-sm pl-4">
                本商品（如飛越獨角獸 T 恤）為 327 ART 限量專屬訂製品，每件皆需經過精細高解析度數位印染與手工裁製，<strong>製作時間約需 1 個月</strong>。製作完成後將第一時間依下單順序為您寄送。若提早完工將優先出貨！
              </p>
            </div>

            {/* Domestic LINE Button */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-[#06C755] font-bold text-sm sm:text-base">
                <MessageCircle size={20} />
                <span>請務必加入張景雯 327 ART 官方 LINE（方便後續聯繫）</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                為方便日後主動向您聯絡「衣服製作排程、出貨時間與物流單號」，請立即點擊下方按鈕加入官方 LINE，加入後傳送訊息告知您的訂單姓名：
              </p>
              <a
                href="https://lin.ee/o8qHjzS"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#06C755] hover:bg-[#05b34c] text-white font-bold rounded-lg transition-transform hover:scale-[1.01] active:scale-[0.99] text-base tracking-widest shadow-lg cursor-pointer"
              >
                <MessageCircle size={20} />
                點此加入 327 ART 官方 LINE（方便日後聯絡）
              </a>
            </div>

            {/* Foreign Customers Channel */}
            <div className="pt-3 border-t border-white/10 space-y-2.5 bg-blue-500/10 p-4 rounded-xl border border-blue-400/20">
              <div className="flex items-center gap-2 text-blue-300 font-bold text-sm sm:text-base">
                <Globe size={18} />
                <span>外國顧客若沒有 LINE，請透過以下管道聯繫：</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                海外顧客無須擔心！系統已記錄您填寫的 Email，製作完成寄出包裹時，我們會主動透過 Email 寄送國際物流追蹤號碼；您亦可隨時透過 Email 或 Instagram 與我們聯繫：
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href="mailto:poweranimal2212@gmail.com?subject=327 ART 預購訂單進度查詢"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-semibold transition-colors"
                >
                  <Mail size={14} />
                  Email: poweranimal2212@gmail.com
                </a>
                <button
                  onClick={() => handleCopy("poweranimal2212@gmail.com", "bodyEmail")}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/15 text-gold-end rounded text-xs font-semibold transition-colors cursor-pointer"
                >
                  {copiedField === "bodyEmail" ? <Check size={14} /> : <Copy size={14} />}
                  {copiedField === "bodyEmail" ? "已複製信箱" : "複製信箱"}
                </button>
                <a
                  href="https://www.instagram.com/win_power2000/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-pink-600/20 hover:bg-pink-600/30 text-pink-300 rounded text-xs font-semibold transition-colors"
                >
                  <Instagram size={14} />
                  IG 私訊 @win_power2000
                </a>
              </div>
            </div>
          </div>
        )}

        {/* 顧客資料與收件地址明細 */}
        {order && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-8 text-left space-y-2.5 text-sm text-gray-300">
            <h3 className="text-white font-bold text-base mb-3 border-b border-white/10 pb-2 flex items-center justify-between">
              <span>收件人與配送資訊確認</span>
              <span className="text-xs text-green-400 font-normal">已完成確認</span>
            </h3>
            <p><strong className="text-gray-400">收件人姓名：</strong> {order.customerName}</p>
            <p><strong className="text-gray-400">聯絡電話：</strong> {order.customerPhone}</p>
            {order.customerEmail && (
              <p><strong className="text-gray-400">電子信箱：</strong> {order.customerEmail}</p>
            )}
            {order.destinationName && (
              <p>
                <strong className="text-gray-400">寄送國家／地區：</strong> {order.destinationName}
                {order.carrier && <span className="text-xs text-gold-end ml-2">({order.carrier})</span>}
              </p>
            )}
            <p><strong className="text-gray-400">收件地址：</strong> {order.customerAddress}</p>
            {order.shippingFee !== undefined && (
              <p>
                <strong className="text-gray-400">{t("cart.shipping_label", "物流運費")}：</strong> 
                <span className="font-mono text-white">NT$ {order.shippingFee}</span>
                {order.isInternational && (
                  <span className="text-xs text-gold-end ml-2">✦ {t("cart.intl_discount_applied", "國際運送每筆現折 NT$ 100 禮遇已套用")}</span>
                )}
              </p>
            )}
            {order.discount ? (
              <p>
                <strong className="text-gray-400">{t("cart.discount", "優惠折抵")}：</strong> 
                <span className="text-green-400 font-mono font-bold">- NT$ {order.discount}</span>
                <span className="text-xs text-green-400 ml-2">{t("cart.discount_label", "滿 $3000 享 9 折")}</span>
              </p>
            ) : null}
            {order.orderTotal > 0 && (
              <p className="pt-2 text-white font-bold text-base border-t border-white/10 flex justify-between items-center">
                <span>應付訂單總金額：</span>
                <span className="text-gold-end text-2xl font-mono">NT$ {order.orderTotal}</span>
              </p>
            )}
          </div>
        )}

        {/* 匯款帳戶資訊與後續步驟說明 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-7 mb-8 text-left space-y-5 text-gray-300 tracking-wider leading-relaxed text-sm">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-white font-bold text-base sm:text-lg flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gold-end" />
              <span>訂單付款方式：ATM 銀行轉帳 / 網路銀行匯款</span>
            </h3>
            <span className="text-xs bg-gold-end/20 text-gold-end px-2.5 py-1 rounded-full font-bold">
              待匯款確認
            </span>
          </div>

          {/* 銀行帳戶詳情卡片 */}
          <div className="bg-black/50 p-5 rounded-xl border border-gold-end/30 space-y-4">
            <p className="text-xs text-gold-end font-semibold tracking-wider">
              ✦ 請將本次訂單總金額匯入以下專屬帳戶：
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 銀行名稱與代碼 */}
              <div className="bg-black/70 p-3.5 rounded-lg border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 block mb-0.5">收款銀行 / 銀行代碼</span>
                  <span className="text-white font-bold text-sm sm:text-base">國泰世華商業銀行 <span className="text-gold-end font-mono">（013）</span></span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy("013", "successBankCode")}
                  className="px-2.5 py-1.5 rounded-md bg-white/10 hover:bg-gold-end hover:text-black text-gold-end text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedField === "successBankCode" ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedField === "successBankCode" ? "已複製" : "複製代碼"}</span>
                </button>
              </div>

              {/* 戶名 */}
              <div className="bg-black/70 p-3.5 rounded-lg border border-white/10">
                <span className="text-xs text-gray-400 block mb-0.5">戶名 / Account Name</span>
                <span className="text-white font-bold text-sm sm:text-base">張景雯</span>
              </div>
            </div>

            {/* 帳號與一鍵複製 */}
            <div className="bg-black/80 p-4 rounded-xl border border-gold-end/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs text-gray-400 block mb-1">銀行帳號 / Account Number</span>
                <span className="text-gold-end font-mono font-bold text-xl sm:text-2xl tracking-wider select-all">
                  069700023796
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy("069700023796", "successAccountNum")}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-gold-end text-black font-bold text-xs sm:text-sm hover:bg-yellow-400 transition-all shadow-md cursor-pointer shrink-0"
              >
                {copiedField === "successAccountNum" ? <Check size={16} /> : <Copy size={16} />}
                <span>{copiedField === "successAccountNum" ? "已複製帳號！" : "一鍵複製帳號"}</span>
              </button>
            </div>

            {/* 匯款後回報提醒 */}
            <div className="pt-2 text-xs text-gray-300 leading-relaxed border-t border-white/10 space-y-1">
              <p className="text-white font-semibold">
                ※ 匯款後回報方式：
              </p>
              <p>
                完成轉帳後，請點選下方綠色按鈕加入官方 LINE（或來信），提供您的【訂單編號：<span className="text-gold-end font-mono font-bold">{order?.orderNumber || "請見上方"}</span>】與【轉帳帳號末五碼】，我們核對款項後將即刻為您排單製作／寄送！
              </p>
            </div>
          </div>

          {/* 官方 LINE 回報按鈕 */}
          <div className="bg-black/30 p-4 rounded-xl border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <MessageCircle size={18} className="text-[#06C755]" />
              <span>加入官方 LINE 回報帳號末五碼</span>
            </div>
            <p className="text-xs text-gray-400">
              點擊下方按鈕加入官方 LINE，傳送您的「姓名、訂單編號與帳號末五碼」，我們將由專人竭誠為您服務。
            </p>
            <div className="pt-1">
              <a
                href="https://lin.ee/o8qHjzS"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#06C755] hover:bg-[#05b34c] text-white font-bold px-4 py-2.5 rounded-lg text-xs sm:text-sm tracking-wider transition-all shadow"
              >
                <MessageCircle size={16} />
                <span>加入官方 LINE 聯繫 (@327art)</span>
              </a>
            </div>
          </div>

          {/* 敬請期待：即將上線刷卡支付說明卡片 */}
          <div className="bg-gradient-to-r from-purple-950/40 via-blue-950/40 to-black/60 p-4 sm:p-5 rounded-xl border border-purple-400/30 space-y-2">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                <Sparkles size={13} className="text-yellow-300" />
                <span>敬請期待・即將上線</span>
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-400" />
              <span>線上刷卡支付即將上線！</span>
            </h4>
          </div>

          <p className="text-xs text-gray-500 pt-1 text-center">
            {t("success.fraud_warning", "（防詐騙提醒：我們不會主動要求您操作 ATM 或解除分期設定）")}
          </p>
        </div>

        {/* 底部按鈕操作列 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/20 text-gray-300 px-6 py-3 tracking-widest hover:bg-white/10 hover:text-white transition-colors font-semibold rounded cursor-pointer"
          >
            <Printer size={18} />
            列印 / 保存訂單確認
          </button>
          <Link 
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gold-end text-gold-end px-8 py-3 tracking-[0.2em] hover:bg-gold-end hover:text-black transition-colors font-semibold rounded cursor-pointer"
          >
            {t("success.btn_home", "返回首頁")}
          </Link>
        </div>

      </div>
    </div>
  );
}
