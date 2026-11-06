import { useState } from "react";
import { 
  RotateCcw, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MessageCircle, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Mail,
  Video,
  FileText,
  HelpCircle
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

interface ReturnPolicySectionProps {
  variant?: "full" | "cart" | "compact";
  className?: string;
  defaultExpanded?: boolean;
}

export default function ReturnPolicySection({
  variant = "full",
  className = "",
  defaultExpanded = true,
}: ReturnPolicySectionProps) {
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const isEn = language === "en";
  const isJa = language === "ja";

  // Multi-language text bundle
  const content = {
    title: isEn ? "Return & Exchange Policy" : isJa ? "返品・交換について" : "退款換貨須知",
    subtitle: isEn 
      ? "Clear and honest communication ensures the best collecting experience" 
      : isJa 
      ? "ご購入前の十分なコミュニケーションが、安心で快適なお買い物を実現します" 
      : "若對商品有疑問，請在購買前向我們提出。充分溝通能省下退款/換貨的心力、金錢與時間。",
    
    tag: isEn ? "7-Day Inspection Period" : isJa ? "7日間クーリングオフ" : "安心購物・7日鑑賞期",

    preNoticeTitle: isEn ? "Pre-Purchase & Application Notice" : isJa ? "購入前の注意事項と申請条件" : "申請須知與規範",
    preNoticeP1: isEn
      ? "Return/exchange requests must be submitted within 7 days starting from the day after delivery."
      : isJa
      ? "商品到着の翌日から起算して7日以内に返品・交換のお申し込みを行ってください。"
      : "退換貨申請須於收到商品後隔日起算 7 日內提出（含例假日）。",
    preNoticeP2: isEn
      ? "Under consumer protection regulations, the 7-day period is for inspection, not trial. Items must remain brand new, sealed, and unused with all original accessories and packaging intact."
      : isJa
      ? "クーリングオフ（検品）期間はお試し期間ではありません。商品は完全未開封・未使用で、元の包装・付属品が揃っている必要があります。"
      : "依消費者保護法規定，7 日鑑賞期「非試用期」。退回商品須保持全新、封膜完好、包裝完整（含所有配件、說明書與贈品）。",
    preNoticeP3: isEn
      ? "If an application is overdue or does not meet the return criteria, the store reserves the right to decline. Please contact us before submitting."
      : isJa
      ? "期限を過ぎた場合、または条件を満たさない場合、返品をお受けできない場合があります。必ず事前にご連絡ください。"
      : "若申請逾時或不符合退換貨條件範圍，本商店有權拒絕退貨，請在寄出前先與官方客服聯絡。",

    workflowTitle: isEn ? "Return & Refund Process" : isJa ? "返品・交換の流れ" : "退款退換貨標準流程",
    steps: [
      {
        step: "01",
        title: isEn ? "Submit Request" : isJa ? "申請の連絡" : "提出申請",
        desc: isEn 
          ? "Contact customer support via LINE or Email within 7 days, providing your order number and unboxing photos/video."
          : isJa
          ? "商品到着後7日以内にLINEまたはメールでご注文番号と開封動画/写真を添えてご連絡ください。"
          : "收到商品 7 日內，透過官方 LINE 或信箱提出，並檢附訂單編號與開箱照片/影片。",
        time: isEn ? "Within 7 days" : isJa ? "7日以内" : "7日內提出"
      },
      {
        step: "02",
        title: isEn ? "Store Review" : isJa ? "ショップ対応" : "客服聯繫確認",
        desc: isEn
          ? "Our store will review your request and contact you within 3 business days with return instructions."
          : isJa
          ? "申請確認後、3営業日以内にショップよりご案内と返送手順をご連絡いたします。"
          : "本商店會在收到申請後的 3 個工作天內聯繫客人，確認商品狀況與寄回方式。",
        time: isEn ? "Within 3 business days" : isJa ? "3営業日以内" : "3個工作天內"
      },
      {
        step: "03",
        title: isEn ? "Return Shipment" : isJa ? "商品の返送" : "妥善包裝寄回",
        desc: isEn
          ? "Once agreed, please ship back the complete item within 3 business days and provide tracking details."
          : isJa
          ? "返送合意後、3営業日以内に商品一式を梱包して発送し、追跡番号をお知らせください。"
          : "本商店同意寄回後，請在 3 個工作天內，將完整的商品妥善寄出，並將寄出訊息與單號告知本商店。",
        time: isEn ? "Within 3 business days" : isJa ? "3営業日以内" : "3個工作天內"
      },
      {
        step: "04",
        title: isEn ? "Inspect & Refund" : isJa ? "検品と返金" : "驗收與完成退款",
        desc: isEn
          ? "Upon receiving the return, we will verify its condition and process your refund or replacement within 3 business days."
          : isJa
          ? "商品到着後、3営業日以内に状態を確認し、速やかに交換品発送または返金処理を完了いたします。"
          : "本商店在收到退回商品後的 3 個工作天內，會確認商品狀態完好並完成退款或新品換貨程序。",
        time: isEn ? "Within 3 business days" : isJa ? "3営業日以内" : "3個工作天內"
      }
    ],

    eligibleTitle: isEn ? "We Gladly Provide Return/Exchange For:" : isJa ? "返品・交換の対象となる場合" : "本商店提供退換貨服務如下",
    eligibleItems: [
      isEn ? "Items damaged or defective upon initial delivery" : isJa ? "お届け時に既に商品外装または本体に破損があった場合" : "一收到商品就有毀損（外盒/包裹嚴重受損影響商品）",
      isEn ? "Internal defects or damaged components upon first opening" : isJa ? "開封時に内部の部品やカードに破損・落丁があった場合" : "一收到商品內部有毀損（牌卡印刷瑕疵、破損缺張）",
      isEn ? "Missing items or incomplete package contents" : isJa ? "内容品に不足・欠品があった場合" : "缺失商品（零件、配件或附屬贈品缺漏）",
      isEn ? "Incorrect items or wrong order shipped" : isJa ? "注文内容と異なる商品・仕様が届いた場合" : "包裹內容物不同、品項或規格錯誤"
    ],

    nonEligibleTitle: isEn ? "Return/Exchange is NOT Accepted For:" : isJa ? "返品・交換をお受けできない場合" : "本商店不提供退換貨服務如下",
    nonEligibleItems: [
      isEn ? "Items damaged or broken by personal usage or improper handling" : isJa ? "お客様ご自身の過失による破損・汚れ・紛失" : "自行損毀商品（人為碰撞、掉落、液體潑灑或保管不當）",
      isEn ? "Customized or personalized commissioned artworks" : isJa ? "オーダーメイド・個別受注生産の作品" : "客製化商品（依客製要求繪製或特別訂製之商品）",
      isEn ? "Unsealed personal apparel or products with removed tags / washed" : isJa ? "タグを取り外した服、着用・洗濯済みの衣服" : "已拆封個人商品 / 服飾已拆標、穿著使用、下水洗滌或有氣味殘留",
      isEn ? "Unsealed magic cards (seal broken) for non-defective reasons" : isJa ? "保護フィルムを開封したオラクルカード（初期不良を除く）" : "極光動物魔法卡已拆開封膜（為維護牌卡純淨與完整，拆封後非瑕疵恕無法退換）",
      isEn ? "Requests submitted beyond the 7-day inspection window" : isJa ? "商品到着後7日を過ぎてからのお申し出" : "超過 7 日鑑賞期之申請"
    ],

    tipsTitle: isEn ? "Friendly Reminders" : isJa ? "安心のためのお願い" : "貼心叮嚀與提醒",
    tips: [
      {
        icon: Video,
        title: isEn ? "Record Unboxing Video" : isJa ? "開封時の動画撮影" : "開箱請全程錄影",
        desc: isEn
          ? "To protect both parties, please record a video while unboxing. If damage or missing parts occur, this helps expedite your claim."
          : isJa
          ? "万が一の破損や欠品に備え、梱包を開封する際はノーカットでの動画撮影をおすすめします。"
          : "為保障買賣雙方權益，拆封開箱時建議全程錄影。若遇瑕疵、毀損或品項缺漏，請憑影片照片於 7 日內聯繫客服快速處理。"
      },
      {
        icon: ShieldCheck,
        title: isEn ? "Full Shipping Coverage for Defects" : isJa ? "不良品は送料当店負担" : "瑕疵更換運費本店負擔",
        desc: isEn
          ? "For items with manufacturer defects or damaged on arrival, 327 ART covers all round-trip shipping fees."
          : isJa
          ? "初期不良や品違いによる交換・返品の往復送料は、すべて327 ARTが負担いたします。"
          : "若經確認為收到即有毀損或寄送錯誤之瑕疵品，來回運費皆由 327 ART 全額負擔，請安心選購。"
      },
      {
        icon: MessageCircle,
        title: isEn ? "Official Customer Support" : isJa ? "公式カスタマーサポート" : "官方客服諮詢管道",
        desc: isEn
          ? "Have questions before or after buying? Reach us via official LINE or email service@327-art.com."
          : isJa
          ? "ご購入前のご相談やご質問は、公式LINEまたはメール（service@327-art.com）でお気軽にお問い合わせください。"
          : "退換貨前請先與官方客服聯絡，我們將竭誠為您協助（官方 LINE 或客服信箱 service@327-art.com）。"
      }
    ]
  };

  // If rendered as a Cart-specific expandable card
  if (variant === "cart") {
    return (
      <div className={`bg-slate-900/60 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-xl ${className}`}>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-left group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold-end/10 border border-gold-end/30 flex items-center justify-center text-gold-end">
              <RotateCcw size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-bold tracking-wider text-base sm:text-lg group-hover:text-gold-end transition-colors">
                  {content.title}
                </h3>
                <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-gold-end/15 text-gold-end border border-gold-end/30 font-medium">
                  {content.tag}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 mt-0.5 line-clamp-1">
                {content.subtitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-gold-end/80 font-medium shrink-0 ml-2">
            <span>{isExpanded ? (isEn ? "Collapse" : "收合") : (isEn ? "View Details" : "查看須知細則")}</span>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>

        {isExpanded && (
          <div className="mt-5 pt-5 border-t border-white/10 space-y-6 text-sm text-gray-200">
            {/* Quick Summary Pill Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-start gap-2.5">
                <Clock size={16} className="text-gold-end shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-semibold text-xs">{isEn ? "7-Day Notice" : "7日鑑賞期"}</div>
                  <div className="text-gray-400 text-[11px] mt-0.5">{isEn ? "Apply within 7 days of receiving" : "收到次日起算 7 日內提出申請"}</div>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-gold-end shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-semibold text-xs">{isEn ? "Defects Covered" : "瑕疵損毀 100% 換貨"}</div>
                  <div className="text-gray-400 text-[11px] mt-0.5">{isEn ? "Full round-trip shipping covered" : "一收到毀損或缺漏，運費本店負擔"}</div>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-start gap-2.5">
                <Video size={16} className="text-gold-end shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-semibold text-xs">{isEn ? "Unboxing Video" : "拆封全程錄影"}</div>
                  <div className="text-gray-400 text-[11px] mt-0.5">{isEn ? "Safeguards both buyer & artist" : "保障雙方權益，迅速為您審核換新"}</div>
                </div>
              </div>
            </div>

            {/* Eligible vs Non-Eligible */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Eligible */}
              <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2.5 text-xs sm:text-sm">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>{content.eligibleTitle}</span>
                </div>
                <ul className="space-y-1.5 text-xs text-gray-300">
                  {content.eligibleItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Non-Eligible */}
              <div className="bg-rose-950/20 border border-rose-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 text-rose-400 font-bold mb-2.5 text-xs sm:text-sm">
                  <XCircle size={16} className="shrink-0" />
                  <span>{content.nonEligibleTitle}</span>
                </div>
                <ul className="space-y-1.5 text-xs text-gray-300">
                  {content.nonEligibleItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-rose-400 shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 4-Step Process Bar */}
            <div>
              <h4 className="text-xs font-bold text-gold-end tracking-wider mb-3 flex items-center gap-1.5">
                <RotateCcw size={14} />
                <span>{content.workflowTitle}</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {content.steps.map((s, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gold-end/20 text-gold-end font-mono">
                      Step {s.step}
                    </span>
                    <div className="text-white font-bold text-xs mt-1.5">{s.title}</div>
                    <div className="text-gold-end/80 text-[10px] font-medium mt-0.5">{s.time}</div>
                    <div className="text-[11px] text-gray-400 mt-1 leading-tight line-clamp-3">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <HelpCircle size={14} className="text-gold-end shrink-0" />
                <span>{isEn ? "Questions? Contact 327 ART Support:" : "若對退換貨流程有任何疑問，歡迎隨時聯繫客服："}</span>
              </div>
              <div className="flex items-center gap-3">
                <a 
                  href="https://line.me/R/ti/p/@327art" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#06C755] hover:underline font-semibold"
                >
                  <MessageCircle size={13} /> LINE: @327art
                </a>
                <span className="text-white/20">|</span>
                <a 
                  href="mailto:service@327-art.com"
                  className="inline-flex items-center gap-1 text-gold-end hover:underline"
                >
                  <Mail size={13} /> service@327-art.com
                </a>
              </div>
            </div>

          </div>
        )}
      </div>
    );
  }

  // Default: Full detailed presentation for Product Pages and PreOrder pages
  return (
    <section className={`w-full max-w-5xl mx-auto px-4 sm:px-6 my-16 ${className}`} aria-label="Return Policy">
      <div className="bg-slate-900/70 border border-white/15 rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        
        {/* Glow ambient decoration */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-gold-end/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-end/10 border border-gold-end/30 text-gold-end text-xs sm:text-sm font-medium tracking-widest mb-4">
            <RotateCcw size={14} />
            <span>{content.tag}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-widest text-gradient-gold mb-3">
            {content.title}
          </h2>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        {/* Section 1: Pre-Purchase & Application Notice */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 sm:p-7 mb-8 relative z-10">
          <div className="flex items-center gap-2.5 text-gold-end font-bold text-base sm:text-lg mb-3">
            <AlertCircle size={20} className="shrink-0" />
            <h3>{content.preNoticeTitle}</h3>
          </div>
          <div className="space-y-2.5 text-sm sm:text-base text-gray-200 leading-relaxed">
            <p className="flex items-start gap-2">
              <span className="text-gold-end font-bold shrink-0">▸</span>
              <span>{content.preNoticeP1}</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-gold-end font-bold shrink-0">▸</span>
              <span>{content.preNoticeP2}</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-gold-end font-bold shrink-0">▸</span>
              <span>{content.preNoticeP3}</span>
            </p>
          </div>
        </div>

        {/* Section 2: Eligible vs Non-Eligible Services (Comparison Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 relative z-10">
          
          {/* Eligible */}
          <div className="bg-emerald-950/20 border border-emerald-500/25 rounded-2xl p-6 sm:p-7 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-lg mb-4">
                <CheckCircle2 size={22} className="shrink-0" />
                <h3>{content.eligibleTitle}</h3>
              </div>
              <ul className="space-y-3 text-sm sm:text-base text-gray-200">
                {content.eligibleItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-5 pt-4 border-t border-emerald-500/20 text-xs text-emerald-300/90 flex items-center gap-1.5">
              <ShieldCheck size={14} className="shrink-0" />
              <span>{isEn ? "All return shipping fees for defects are covered by 327 ART." : "若為瑕疵或寄錯，來回運費均由本商店全額負擔。"}</span>
            </div>
          </div>

          {/* Non-Eligible */}
          <div className="bg-rose-950/20 border border-rose-500/25 rounded-2xl p-6 sm:p-7 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 text-rose-400 font-bold text-lg mb-4">
                <XCircle size={22} className="shrink-0" />
                <h3>{content.nonEligibleTitle}</h3>
              </div>
              <ul className="space-y-3 text-sm sm:text-base text-gray-200">
                {content.nonEligibleItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 text-xs flex items-center justify-center shrink-0 mt-0.5">
                      ✕
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-5 pt-4 border-t border-rose-500/20 text-xs text-rose-300/90 flex items-center gap-1.5">
              <AlertCircle size={14} className="shrink-0" />
              <span>{isEn ? "Personal reasons on custom or unsealed goods cannot be refunded." : "客製化、已拆封商品因個人因素恕無法申請退款。"}</span>
            </div>
          </div>

        </div>

        {/* Section 3: 4-Step Standard Workflow */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8 mb-8 relative z-10">
          <div className="text-center mb-6">
            <h3 className="text-xl sm:text-2xl font-bold tracking-widest text-gold-end flex items-center justify-center gap-2">
              <RotateCcw size={20} />
              <span>{content.workflowTitle}</span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              {isEn ? "Clear 4-step process with 3-business-day response guarantee" : "每階段承諾 3 個工作天內專人處理，公開透明安心無虞"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {content.steps.map((step, idx) => (
              <div 
                key={idx} 
                className="bg-black/40 border border-white/10 rounded-xl p-4 sm:p-5 flex flex-col justify-between hover:border-gold-end/40 transition-colors shadow-inner"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold font-mono text-gold-end opacity-80">
                      {step.step}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-gold-end/15 text-gold-end font-medium border border-gold-end/30">
                      {step.time}
                    </span>
                  </div>
                  <h4 className="text-white font-bold text-base mb-2">
                    {step.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Friendly Reminders & Customer Service */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          {content.tips.map((tip, idx) => {
            const Icon = tip.icon;
            return (
              <div key={idx} className="bg-white/[0.04] border border-white/10 rounded-xl p-5 flex flex-col">
                <div className="flex items-center gap-2 text-gold-end font-bold text-sm sm:text-base mb-2">
                  <Icon size={18} className="shrink-0" />
                  <h4>{tip.title}</h4>
                </div>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {tip.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer Support Banner */}
        <div className="mt-8 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left relative z-10">
          <div>
            <div className="text-white font-bold text-sm tracking-wider">
              {isEn ? "Have questions before placing an order?" : "購買前有任何疑慮或特殊需求？"}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              {isEn ? "Feel free to message our official team anytime." : "歡迎於下單前聯繫 327 ART 客服，我們將竭誠為您解答。"}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a 
              href="https://line.me/R/ti/p/@327art" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#06C755]/15 border border-[#06C755]/40 text-[#06C755] hover:bg-[#06C755] hover:text-white transition-all text-xs sm:text-sm font-bold shadow-md"
            >
              <MessageCircle size={16} />
              <span>官方 LINE: @327art</span>
            </a>
            <a 
              href="mailto:service@327-art.com"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-end/15 border border-gold-end/40 text-gold-end hover:bg-gold-end hover:text-black transition-all text-xs sm:text-sm font-bold shadow-md"
            >
              <Mail size={16} />
              <span>service@327-art.com</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
