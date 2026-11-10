import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  RotateCcw, 
  ChevronLeft, 
  ShoppingBag, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  ChevronDown, 
  ChevronUp, 
  Compass, 
  Heart,
  AlertCircle,
  HelpCircle,
  Flame
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import { MAGIC_CARDS, MagicCard } from "../data/magicCardsData";

// Simple Web Audio API Synthesizer for mystical crystal chime
function playMysticChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Pentatonic frequencies: E5, G#5, B5, E6
    const freqs = [659.25, 830.61, 987.77, 1318.51];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(f, now + i * 0.08);

      gain.gain.setValueAtTime(0, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.12, now + i * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 2.0);
    });
  } catch (e) {
    // Audio context may be restricted by autoplay policy
  }
}

const MAX_FREE_DRAWS = 3;

export default function CardDraw() {
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const isEn = language === "en";
  const isJa = language === "ja";

  // Game States: "intro" | "shuffling" | "spread" | "flipping" | "result"
  const [gameState, setGameState] = useState<"intro" | "shuffling" | "spread" | "flipping" | "result">("intro");
  const [selectedCards, setSelectedCards] = useState<MagicCard[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showManualModal, setShowManualModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHandHovered, setIsHandHovered] = useState(false);
  const [showQuotaModal, setShowQuotaModal] = useState(false);

  // Daily Free Quota Management
  const [remainingFreeDraws, setRemainingFreeDraws] = useState<number>(MAX_FREE_DRAWS);

  const getTodayKey = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const today = getTodayKey();
    const savedDate = localStorage.getItem("327_card_draw_date");
    const savedCount = parseInt(localStorage.getItem("327_card_draw_count") || "0", 10);

    if (savedDate !== today) {
      localStorage.setItem("327_card_draw_date", today);
      localStorage.setItem("327_card_draw_count", "0");
      setRemainingFreeDraws(MAX_FREE_DRAWS);
    } else {
      setRemainingFreeDraws(Math.max(0, MAX_FREE_DRAWS - savedCount));
    }
  }, []);

  const deductDrawCount = () => {
    const today = getTodayKey();
    const currentCount = parseInt(localStorage.getItem("327_card_draw_count") || "0", 10);
    const newCount = currentCount + 1;
    localStorage.setItem("327_card_draw_date", today);
    localStorage.setItem("327_card_draw_count", String(newCount));
    setRemainingFreeDraws(Math.max(0, MAX_FREE_DRAWS - newCount));
  };

  const handleResetQuotaForTest = () => {
    const today = getTodayKey();
    localStorage.setItem("327_card_draw_date", today);
    localStorage.setItem("327_card_draw_count", "0");
    setRemainingFreeDraws(MAX_FREE_DRAWS);
    setShowQuotaModal(false);
  };

  // Deck spread cards count
  const SPREAD_COUNT = 15;

  // Start the shuffle animation
  const handleStartShuffle = () => {
    if (remainingFreeDraws <= 0) {
      setShowQuotaModal(true);
      return;
    }
    if (soundEnabled) playMysticChime();
    setGameState("shuffling");
    setTimeout(() => {
      setGameState("spread");
    }, 1500);
  };

  // User selects a card from the fan spread
  const handleSelectCard = (index: number) => {
    if (soundEnabled) playMysticChime();

    // Deduct one draw from daily quota
    deductDrawCount();

    // Pick a card from dataset
    const pool = [...MAGIC_CARDS];
    const picked = pool[Math.floor(Math.random() * pool.length)];

    setSelectedCards([picked]);
    setGameState("flipping");

    // 3D Flip after a short cinematic pause
    setTimeout(() => {
      setIsFlipped(true);
      if (soundEnabled) playMysticChime();
      setTimeout(() => {
        setGameState("result");
      }, 1000);
    }, 800);
  };

  // Reset to draw again
  const handleResetDraw = () => {
    if (remainingFreeDraws <= 0) {
      setShowQuotaModal(true);
      return;
    }
    setIsFlipped(false);
    setSelectedCards([]);
    setGameState("intro");
  };

  // Add physical card deck to cart
  const handleBuyPhysicalDeck = () => {
    addToCart({
      id: "magic-cards",
      productId: "magic-cards",
      title: isEn ? "Aurora Magical Animal Cards" : isJa ? "極光動物魔法カード" : "極光動物魔法卡",
      titleEn: "Aurora Magical Animal Cards",
      titleJa: "オーロラ・マジカル・アニマル・カード",
      price: 1280,
      quantity: 1,
      image: "https://i.ibb.co/MyKzGnTB/card-01.jpg"
    });
    navigate("/cart");
  };

  const activeCard = selectedCards[0] || MAGIC_CARDS[0];

  return (
    <div className="relative min-h-screen z-10 pt-[120px] pb-[100px] px-4 flex flex-col items-center justify-center overflow-hidden">
      
      {/* Sound Toggle Floating Button */}
      <div className="absolute top-28 right-6 z-30">
        <button
          type="button"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-gold-end backdrop-blur-md transition-all shadow-lg cursor-pointer"
          title={soundEnabled ? "關閉音效" : "開啟音效"}
        >
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </div>

      {/* Breadcrumb back to Magic Cards */}
      <div className="w-full max-w-5xl mb-6">
        <Link 
          to="/shop/magic-cards"
          className="inline-flex items-center text-gold-end hover:text-white transition-colors text-xs sm:text-sm tracking-widest group"
        >
          <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
          <span>{isEn ? "Back to Magic Cards Product Page" : isJa ? "魔法カード商品ページへ戻る" : "返回極光動物魔法卡"}</span>
        </Link>
      </div>

      {/* ============================================================ */}
      {/* STAGE 1: INTRO & TRANSLUCENT HAND INQUIRY OVER CARD BACK     */}
      {/* ============================================================ */}
      {gameState === "intro" && (
        <div className="max-w-2xl w-full text-center space-y-8 animate-fadeIn">
          
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gold-end/15 border border-gold-end/40 text-gold-end text-xs sm:text-sm font-semibold tracking-widest shadow-lg">
            <Sparkles size={14} />
            <span>{isEn ? "Online Oracle Sanctuary" : isJa ? "オンライン神託体験" : "線上神諭聖殿・免費體驗"}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-widest text-gradient-gold drop-shadow-lg font-serif">
            {isEn ? "Aurora Oracle Sanctuary" : isJa ? "極光の聖域・オンライン抽牌" : "極光動物魔法卡・線上抽牌"}
          </h1>

          {/* ============================================================ */}
          {/* THE CARD BACK WITH TRANSLUCENT GAMING HAND OVERLAY           */}
          {/* ============================================================ */}
          <div className="py-2 flex flex-col items-center justify-center">
            
            <div 
              onMouseEnter={() => setIsHandHovered(true)}
              onMouseLeave={() => setIsHandHovered(false)}
              className="relative w-[210px] sm:w-[250px] aspect-[1/1.52] rounded-2xl overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_25px_rgba(250,204,21,0.25)] border-2 border-amber-300/80 group cursor-pointer transition-transform duration-500 hover:scale-[1.02]"
              title="將心念放在牌卡上，向守護動物提問"
            >
              {/* Authentic Physical Card Back Photo (Win Lion Painting) */}
              <img 
                src="/images/cards/card-back.png" 
                alt="極光動物魔法卡牌背 - 張景雯 Win 原創繪製" 
                className="w-full h-full object-cover select-none"
              />

              {/* Ambient Radiant Energy Halo */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

              {/* Pulsing Concentric Aura Ripples under Palm */}
              <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border border-cyan-400/30 animate-ping pointer-events-none" style={{ animationDuration: "3s" }} />
              <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border border-amber-300/20 animate-pulse pointer-events-none" style={{ animationDuration: "2s" }} />

              {/* TRANSLUCENT GAMING HAND OVERLAY (Attuning to the Oracle Card) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-500">
                <svg 
                  viewBox="0 0 300 420" 
                  className={`w-full h-full transition-opacity duration-500 drop-shadow-[0_0_20px_rgba(250,204,21,0.65)] ${
                    isHandHovered ? "opacity-95 scale-[1.03]" : "opacity-80 scale-100 animate-[pulse_4s_ease-in-out_infinite]"
                  }`}
                >
                  <defs>
                    {/* Ethereal Translucent Hand Gradient Fill */}
                    <linearGradient id="etherealHandFill" x1="20%" y1="100%" x2="50%" y2="0%">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                      <stop offset="45%" stopColor="#818cf8" stopOpacity="0.4" />
                      <stop offset="75%" stopColor="#fde047" stopOpacity="0.55" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0.8" />
                    </linearGradient>

                    {/* Glowing Contour Stroke */}
                    <linearGradient id="etherealHandStroke" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
                      <stop offset="50%" stopColor="#67e8f9" stopOpacity="0.85" />
                      <stop offset="85%" stopColor="#fef08a" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
                    </linearGradient>

                    {/* Palm Energy Core */}
                    <radialGradient id="energyCore" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                      <stop offset="35%" stopColor="#fde047" stopOpacity="0.8" />
                      <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                    </radialGradient>

                    <filter id="etherealGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3.5" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Concentric mystical rings at palm contact point (150, 240) */}
                  <circle cx="150" cy="240" r="26" fill="none" stroke="#fde047" strokeWidth="1.5" strokeDasharray="4 3" className="origin-[150px_240px] animate-[spin_12s_linear_infinite] opacity-70" />
                  <circle cx="150" cy="240" r="44" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="6 4" className="origin-[150px_240px] animate-[spin_20s_linear_infinite_reverse] opacity-50" />
                  <circle cx="150" cy="240" r="14" fill="url(#energyCore)" className="animate-pulse" />

                  {/* Sacred Geom Rune on Palm */}
                  <polygon points="150,222 165,248 135,248" fill="none" stroke="#fef08a" strokeWidth="1.2" className="opacity-80" />
                  <polygon points="150,256 165,230 135,230" fill="none" stroke="#67e8f9" strokeWidth="1.2" className="opacity-80" />
                  <circle cx="150" cy="239" r="4" fill="#ffffff" />

                  {/* Elegant Stylized Translucent Hand (Fingers resting forward over card) */}
                  <path
                    d="M 120 410 
                       C 114 365, 106 325, 100 285
                       C 88 268, 72 250, 60 228
                       C 50 210, 48 185, 56 178
                       C 64 170, 78 182, 90 205
                       C 98 220, 105 235, 112 242
                       C 111 210, 108 145, 110 105
                       C 112 92, 122 88, 128 90
                       C 134 92, 137 102, 136 122
                       C 135 152, 134 208, 136 224
                       C 140 192, 145 125, 149 80
                       C 151 68, 161 65, 167 67
                       C 173 69, 176 80, 174 100
                       C 172 136, 169 192, 171 226
                       C 177 202, 185 150, 191 110
                       C 193 98, 203 95, 209 98
                       C 215 101, 216 112, 213 128
                       C 209 164, 202 215, 203 242
                       C 212 228, 224 186, 234 160
                       C 238 150, 248 148, 253 153
                       C 257 158, 255 170, 247 186
                       C 235 214, 221 254, 212 282
                       C 204 312, 196 360, 192 410
                       Z"
                    fill="url(#etherealHandFill)"
                    stroke="url(#etherealHandStroke)"
                    strokeWidth="2.2"
                    filter="url(#etherealGlow)"
                  />

                  {/* Ethereal Palm Energy Lines */}
                  <path d="M 106 242 Q 148 256 182 272" fill="none" stroke="#fde047" strokeWidth="1.5" strokeDasharray="2 3" className="opacity-70" />
                  <path d="M 116 264 Q 152 278 178 308" fill="none" stroke="#67e8f9" strokeWidth="1.2" className="opacity-60" />
                  <path d="M 130 224 Q 148 248 154 298" fill="none" stroke="#fde047" strokeWidth="1.2" className="opacity-60" />

                  {/* Luminous Light Nodes on Fingertips */}
                  <circle cx="58" cy="180" r="3.5" fill="#fef08a" className="animate-pulse" />
                  <circle cx="120" cy="94" r="3.5" fill="#fef08a" className="animate-pulse" />
                  <circle cx="158" cy="70" r="4.5" fill="#ffffff" className="animate-ping" style={{ animationDuration: "2s" }} />
                  <circle cx="202" cy="100" r="3.5" fill="#fef08a" className="animate-pulse" />
                  <circle cx="246" cy="158" r="3" fill="#67e8f9" className="animate-pulse" />
                </svg>
              </div>

              {/* Inquiry Prompt Tag on Hover */}
              <div className="absolute bottom-3 inset-x-3 py-1 px-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-[11px] text-amber-200 tracking-wider text-center pointer-events-none">
                ✦ 向神獸守護者提問 ✦
              </div>
            </div>

            {/* Instruction under the card */}
            <p className="text-xs sm:text-sm text-gray-300 mt-3 font-medium tracking-wide">
              {isEn 
                ? "Close your eyes, place your hand over the card, and hold your question in your heart."
                : isJa
                ? "目を閉じ、カードに手をかざすように心を静め、あなたの問いを念じてください。"
                : "閉上雙眼，如撫摸牌面般調和呼吸，在心中默念你所面臨的提問或期盼"}
            </p>
          </div>

          {/* ============================================================ */}
          {/* SINGLE DRAW MODE ONLY & DAILY FREE 3 DRAWS SECTION           */}
          {/* ============================================================ */}
          <div className="max-w-md mx-auto space-y-4">
            
            {/* Mode Card: Only 單張神諭指引 (Without "今日") */}
            <div className="p-5 rounded-2xl border bg-gold-end/15 border-gold-end text-white shadow-xl shadow-gold-end/10 ring-2 ring-gold-end/40 text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gold-end uppercase tracking-wider flex items-center gap-1.5">
                  <Compass size={14} />
                  <span>神諭指引模式</span>
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-gold-end/20 text-gold-end border border-gold-end/40 font-bold">
                  官方核心推薦
                </span>
              </div>
              <div className="font-bold text-lg text-white font-serif">單張神諭指引</div>
              <div className="text-xs text-gray-200 mt-1">專注於當下最核心的能量共振與守護動物訊息</div>
            </div>

            {/* Daily 3 Free Draws Counter & Status Box */}
            <div className="p-5 rounded-2xl bg-white/[0.05] border border-white/15 backdrop-blur-md text-left space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white tracking-wider flex items-center gap-2">
                  <Sparkles size={16} className="text-gold-end" />
                  <span>每日免費 3 次抽牌</span>
                </span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                  remainingFreeDraws > 0
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                }`}>
                  今日剩餘：{remainingFreeDraws} / {MAX_FREE_DRAWS} 次
                </span>
              </div>

              {/* 3 Visual Quota Crystals */}
              <div className="flex items-center gap-2 pt-1">
                {Array.from({ length: MAX_FREE_DRAWS }).map((_, i) => {
                  const isAvailable = i < remainingFreeDraws;
                  return (
                    <div 
                      key={i} 
                      className={`flex-1 h-2 rounded-full transition-all duration-500 ${
                        isAvailable 
                          ? "bg-gradient-to-r from-amber-400 to-yellow-300 shadow-[0_0_10px_rgba(250,204,21,0.6)]" 
                          : "bg-white/10"
                      }`}
                      title={isAvailable ? `第 ${i + 1} 次免費抽牌可用` : `已使用`}
                    />
                  );
                })}
              </div>

              {/* Additional Paid Draws Notice */}
              <div className="text-xs text-gray-300 leading-relaxed border-t border-white/10 pt-3 space-y-1">
                <p>✦ 每日提供 3 次免費神諭抽牌體驗。</p>
                <p className="text-amber-300/90">
                  ✦ 若需進行更多次深度探索與問題指引，付費加購解鎖功能（例如 10 次 NT$ 100）即將上線，敬請期待！
                </p>
              </div>
            </div>

          </div>

          {/* Golden Start Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleStartShuffle}
              className={`px-10 py-4 rounded-full font-bold tracking-[3px] text-base sm:text-lg transition-all shadow-2xl flex items-center justify-center gap-3 mx-auto cursor-pointer ${
                remainingFreeDraws > 0
                  ? "bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black hover:scale-105 active:scale-95"
                  : "bg-gradient-to-r from-amber-600/50 to-yellow-600/50 text-white/80 border border-amber-400/30 hover:scale-105"
              }`}
            >
              <Sparkles size={20} className="animate-spin text-inherit" style={{ animationDuration: "6s" }} />
              <span>
                {remainingFreeDraws > 0 
                  ? `開始感應洗牌 (剩餘 ${remainingFreeDraws} 次)` 
                  : "今日免費次數已用完"}
              </span>
            </button>
          </div>

          <div className="text-xs text-gray-400 tracking-widest pt-1">
            ✦ 327 ART 官方正品燙金原創牌卡數據庫授權 ✦
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* QUOTA LIMIT MODAL (When Free Draws Reached)                   */}
      {/* ============================================================ */}
      {showQuotaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0b1026] border border-amber-400/40 rounded-3xl max-w-md w-full p-6 sm:p-8 text-center space-y-6 shadow-2xl relative">
            
            <div className="w-16 h-16 rounded-full bg-gold-end/15 border border-gold-end/40 flex items-center justify-center mx-auto text-gold-end">
              <Sparkles size={32} />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white tracking-wider font-serif">
                今日免費抽牌次數已達上限
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                您今天已經完成了 3 次神諭感應抽牌。宇宙的能量需要時間沉澱與消化，每日凌晨將會自動重置 3 次免費次數！
              </p>
            </div>

            <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-4 text-xs text-amber-200 text-left space-y-2">
              <div className="font-bold text-sm text-gold-end flex items-center gap-1.5">
                <AlertCircle size={15} />
                <span>付費加購解鎖功能即將上線</span>
              </div>
              <p className="text-gray-200">
                為了讓熱愛動物魔法卡的靈修探索者能不限次數提問，我們正緊鑼密鼓準備「加購抽牌額度方案」（例如：10 次 NT$ 100），敬請期待！
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => setShowQuotaModal(false)}
                className="w-full py-3.5 rounded-xl bg-gold-end hover:bg-yellow-400 text-black font-bold text-sm tracking-wider transition-all cursor-pointer shadow-lg"
              >
                我知道了・靜候明日重置
              </button>

              {/* Developer / Tester Quota Reset Option for seamless testing */}
              <button
                type="button"
                onClick={handleResetQuotaForTest}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-xs text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                ✦ 重置今日免費次數（測試體驗專用）
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STAGE 2: SHUFFLING CINEMATIC ANIMATION                        */}
      {/* ============================================================ */}
      {gameState === "shuffling" && (
        <div className="max-w-md w-full text-center space-y-8 animate-fadeIn">
          <div className="relative w-48 h-72 mx-auto">
            {/* Shuffling overlapping deck layers with the real card back */}
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="absolute inset-0 rounded-2xl border-2 border-gold-end/40 shadow-2xl overflow-hidden transition-all duration-700"
                style={{
                  transform: `translateY(${i * -4}px) rotate(${(i - 2) * 5}deg) scale(${1 - i * 0.02})`,
                  animation: `pulse 1.2s ease-in-out infinite alternate ${i * 0.15}s`
                }}
              >
                <img 
                  src="/images/cards/card-back.png" 
                  alt="327 ART Card Back" 
                  className="w-full h-full object-cover" 
                />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold tracking-widest text-gradient-gold">
              {isEn ? "Harmonizing Cosmic Frequencies..." : isJa ? "波動を調律しています..." : "能量調頻洗牌中..."}
            </h3>
            <p className="text-sm text-gray-300 tracking-wider">
              {isEn ? "Hold your breath and focus your intention." : "請保持平穩呼吸，心中專注於此刻的提問。"}
            </p>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STAGE 3: INTERACTIVE 3D FAN SPREAD (PICK A CARD)              */}
      {/* ============================================================ */}
      {gameState === "spread" && (
        <div className="w-full max-w-6xl text-center space-y-8 animate-fadeIn">
          
          <div className="space-y-2">
            <span className="text-xs px-3 py-1 rounded-full bg-gold-end/20 text-gold-end font-bold border border-gold-end/40 tracking-widest">
              PICK YOUR CARD
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-widest text-white drop-shadow-md">
              {isEn ? "Choose The Card That Calls To You" : isJa ? "直感で惹かれる1枚を選んでください" : "請憑直覺，點選深深吸引你的那張牌"}
            </h2>
            <p className="text-xs sm:text-sm text-gray-300">
              {isEn ? "Hover across the spread and tap when you feel resonance." : "手指或滑鼠輕觸牌面，感應彼此的頻率共振後點擊確認。"}
            </p>
          </div>

          {/* 3D Arc Spread Container */}
          <div className="relative h-[320px] sm:h-[380px] w-full flex items-center justify-center overflow-x-auto py-6">
            <div className="relative flex items-center justify-center w-[900px] h-full">
              {Array.from({ length: SPREAD_COUNT }).map((_, idx) => {
                const offset = idx - Math.floor(SPREAD_COUNT / 2);
                const rotateDeg = offset * 4.5;
                const translateY = Math.abs(offset) * 6;
                const isHovered = hoveredIndex === idx;

                return (
                  <button
                    key={idx}
                    type="button"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => handleSelectCard(idx)}
                    className="absolute w-[120px] sm:w-[150px] aspect-[1/1.52] rounded-xl sm:rounded-2xl transition-all duration-300 cursor-pointer shadow-xl group"
                    style={{
                      transform: `translateX(${offset * 44}px) translateY(${isHovered ? -40 : translateY}px) rotate(${isHovered ? 0 : rotateDeg}deg) scale(${isHovered ? 1.15 : 1})`,
                      zIndex: isHovered ? 50 : 20 + idx,
                    }}
                  >
                    <div className="w-full h-full rounded-xl sm:rounded-2xl overflow-hidden border border-amber-300/60 shadow-2xl bg-[#0A1128] group-hover:border-gold-end group-hover:ring-4 group-hover:ring-amber-400/40 transition-all">
                      <img 
                        src="/images/cards/card-back.png" 
                        alt="327 Card Back" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-xs text-gray-400 tracking-widest">
            ✦ 滑動即可感應每一張牌的浮動能量 ✦
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STAGE 4: FLIPPING REVEAL ANIMATION                           */}
      {/* ============================================================ */}
      {gameState === "flipping" && (
        <div className="max-w-md w-full text-center space-y-6 flex flex-col items-center">
          
          <div className="relative w-[240px] sm:w-[280px] aspect-[1/1.52] perspective-[1000px]">
            <div 
              className={`w-full h-full relative transition-transform duration-1000 ease-out transform-style-3d ${
                isFlipped ? "rotate-y-180" : ""
              }`}
            >
              {/* Back Face */}
              <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden border-2 border-amber-400 shadow-2xl">
                <img src="/images/cards/card-back.png" alt="Card Back" className="w-full h-full object-cover" />
              </div>

              {/* Front Face (Flipped) */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl overflow-hidden border-2 border-gold-end shadow-2xl shadow-gold-end/40">
                <img src={activeCard.image} alt={activeCard.nameZh} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold tracking-widest text-gradient-gold animate-pulse">
            {isEn ? "The Oracle is Unfolding..." : isJa ? "神託が開かれます..." : "奇蹟正在顯化..."}
          </h3>
        </div>
      )}

      {/* ============================================================ */}
      {/* STAGE 5: RESULT VIEW (HERO CARD + LAYERED WISDOM)            */}
      {/* ============================================================ */}
      {gameState === "result" && (
        <div className="w-full max-w-4xl mx-auto space-y-10 animate-fadeIn">
          
          {/* Top Banner Tag */}
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gold-end/20 text-gold-end text-xs font-bold border border-gold-end/40 tracking-widest">
              <Sparkles size={14} />
              {isEn ? "SACRED ORACLE GUIDANCE" : isJa ? "あなたに届いた守護神託" : "來到你身邊的守護動物神諭"}
            </span>
          </div>

          {/* Main Card Spotlight & Tier 1 Quote */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 bg-white/[0.06] backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            
            {/* Glow Aura */}
            <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gold-end/15 rounded-full blur-3xl pointer-events-none" />

            {/* Left: The Glorious Foiled Card with Holographic Shine */}
            <div className="w-[240px] sm:w-[280px] shrink-0 aspect-[1/1.52] relative rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-300/70 group">
              <img 
                src={activeCard.image} 
                alt={activeCard.nameZh} 
                className="w-full h-full object-cover" 
              />
              {/* Subtle Holo Rainbow Sheen overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity" />
            </div>

            {/* Right: Tier 1 Essential Message */}
            <div className="flex-1 text-center md:text-left space-y-5">
              <div>
                <div className="text-gold-end text-sm font-bold tracking-widest mb-1">
                  NO. 0{activeCard.id} ✦ {isEn ? activeCard.keywordEn : isJa ? activeCard.keywordJa : activeCard.keywordZh}
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-widest text-white drop-shadow-md font-serif">
                  {isEn ? activeCard.nameEn : isJa ? activeCard.nameJa : activeCard.nameZh}
                </h2>
              </div>

              {/* Tier 1 Quote (Impactful 1-2 Sentences) */}
              <div className="bg-white/10 border-l-4 border-gold-end p-4 sm:p-5 rounded-r-xl shadow-inner">
                <p className="text-base sm:text-lg text-white font-medium leading-relaxed italic">
                  “{isEn ? activeCard.quoteEn : isJa ? activeCard.quoteJa : activeCard.quoteZh}”
                </p>
              </div>

              {/* Affirmation */}
              <div className="text-xs sm:text-sm text-gold-end font-semibold tracking-wide">
                ✦ 力量肯定語：<span className="text-gray-100">{isEn ? activeCard.affirmationEn : isJa ? activeCard.affirmationJa : activeCard.affirmationZh}</span>
              </div>

              {/* Tier 2: Expand Full Manual Deep Dive */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(!showManualModal)}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-300 hover:text-white border border-amber-400/40 hover:border-amber-400 px-4 py-2 rounded-xl bg-amber-400/10 transition-all cursor-pointer shadow-sm"
                >
                  <BookOpen size={16} />
                  <span>
                    {showManualModal 
                      ? (isEn ? "Collapse In-Depth Story" : "收合手冊深度故事") 
                      : (isEn ? "Read Full Manual Interpretation" : "✦ 閱讀手冊深度故事與指引")}
                  </span>
                  {showManualModal ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {/* Expanded Manual Text */}
              {showManualModal && (
                <div className="bg-white/10 border border-white/20 rounded-2xl p-5 text-sm text-gray-100 leading-relaxed space-y-3 animate-fadeIn shadow-inner">
                  <h4 className="text-gold-end font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={14} />
                    <span>手冊完整解說・張景雯 Win 原創故事</span>
                  </h4>
                  <p>{isEn ? activeCard.descEn : isJa ? activeCard.descJa : activeCard.descZh}</p>
                </div>
              )}

            </div>
          </div>

          {/* Tier 3: Conversion & Actions Callout */}
          <div className="bg-white/[0.05] border border-white/15 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-wider flex items-center justify-center md:justify-start gap-2">
                <Heart size={18} className="text-gold-end shrink-0" />
                <span>喜歡這份能量嗎？帶一套實體魔法卡回家</span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
                隨盒附贈中英日三國語言精裝實體解說手冊，收錄 30 隻動物手繪油畫奇蹟全篇故事與專屬牌陣指南。
              </p>
              <div className="text-xs text-amber-300 font-semibold pt-1">
                今日剩餘免費抽牌次數：{remainingFreeDraws} / {MAX_FREE_DRAWS} 次
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleBuyPhysicalDeck}
                className="px-6 py-3.5 rounded-xl bg-gold-end hover:bg-yellow-400 text-black font-bold text-sm tracking-wider transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <ShoppingBag size={16} />
                <span>立即收藏實體牌卡 (NT$ 1280)</span>
              </button>

              <button
                type="button"
                onClick={handleResetDraw}
                className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm tracking-wider transition-all cursor-pointer flex items-center gap-2"
              >
                <RotateCcw size={16} />
                <span>{remainingFreeDraws > 0 ? `再抽一張 (${remainingFreeDraws})` : "返回首頁"}</span>
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
