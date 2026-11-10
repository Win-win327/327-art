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
  Layers,
  ArrowRight
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

// Web Audio API Synthesizer for realistic card shuffle swoosh / friction
function playShuffleSwoosh() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // 1. Noise buffer for card friction paper swoosh
    const bufferSize = Math.floor(ctx.sampleRate * 0.22);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1500, now);
    filter.frequency.exponentialRampToValueAtTime(650, now + 0.2);
    filter.Q.setValueAtTime(2.8, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 0.22);

    // 2. Subtle harmonic undertone (B5 chime)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(987.77, now);
    oscGain.gain.setValueAtTime(0.04, now);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
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

  // Hindu Shuffle Mini-Game State
  const [shuffleCount, setShuffleCount] = useState<number>(0);
  const [isShufflingAnim, setIsShufflingAnim] = useState<boolean>(false);

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

  // Start the Hindu shuffle mini-game
  const handleStartShuffle = () => {
    if (remainingFreeDraws <= 0) {
      setShowQuotaModal(true);
      return;
    }
    if (soundEnabled) playMysticChime();
    setShuffleCount(0);
    setIsShufflingAnim(false);
    setGameState("shuffling");
  };

  // Perform one Hindu shuffle slice
  const handlePerformShuffle = () => {
    if (isShufflingAnim) return;
    setIsShufflingAnim(true);
    if (soundEnabled) {
      playShuffleSwoosh();
    }
    setShuffleCount((prev) => prev + 1);
    setTimeout(() => {
      setIsShufflingAnim(false);
    }, 450);
  };

  // Finish shuffle and unfold the spread
  const handleFinishShuffle = () => {
    if (soundEnabled) playMysticChime();
    setGameState("spread");
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
    setShuffleCount(0);
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
      {/* STAGE 1: INTRO & TRANSLUCENT HANDS HOLDING CARD AT EDGES     */}
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

          {/* Original poetic description restored exactly as user requested */}
          <p className="text-sm sm:text-base text-gray-200 leading-relaxed max-w-xl mx-auto font-medium">
            {isEn 
              ? "Every living creature holds a unique frequency. Close your eyes, take a deep breath, and connect with your inner animal guardian."
              : isJa
              ? "万物には固有の波長が存在します。目を閉じ、深呼吸をし、今この瞬間にあなたを導く動物と繋がってください。"
              : "每一隻生靈，都是宇宙賜予的一面鏡子。閉上雙眼，深呼吸，在心中默念你近期的期盼、困惑或想探索的議題。"}
          </p>

          {/* ============================================================ */}
          {/* THE CARD BACK WITH TRANSLUCENT HANDS CRADLING THE EDGES      */}
          {/* ============================================================ */}
          <div className="py-2 flex flex-col items-center justify-center">
            
            {/* Outer Stage: Sized so hands cradle the sides without blocking lion */}
            <div 
              onMouseEnter={() => setIsHandHovered(true)}
              onMouseLeave={() => setIsHandHovered(false)}
              className="relative w-[240px] sm:w-[280px] aspect-[1/1.52] group cursor-pointer transition-transform duration-500 hover:scale-[1.02]"
              title="雙手捧持牌卡，向守護動物提問"
            >
              {/* Card Container with rounded corners and authentic physical photo */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.85),0_0_30px_rgba(250,204,21,0.25)] border-2 border-amber-300/80 bg-[#0A1128]">
                {/* Authentic Physical Card Back Photo (Win Lion Painting - 100% UNBLOCKED) */}
                <img 
                  src="/images/cards/card-back.png" 
                  alt="極光動物魔法卡牌背 - 張景雯 Win 原創繪製" 
                  className="w-full h-full object-cover select-none"
                />

                {/* Ambient Radiant Energy Halo */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Pulsing Concentric Aura Ripples under Card Edges */}
              <div className="absolute -inset-4 rounded-3xl border border-cyan-400/20 animate-ping pointer-events-none" style={{ animationDuration: "3.5s" }} />
              <div className="absolute -inset-2 rounded-2xl border border-amber-300/25 animate-pulse pointer-events-none" style={{ animationDuration: "2.2s" }} />

              {/* ======================================================= */}
              {/* TRANSLUCENT HANDS HOLDING THE SIDES (CENTER IS CLEAR!)  */}
              {/* ======================================================= */}
              <div className="absolute inset-0 pointer-events-none">
                <svg 
                  viewBox="0 0 320 486" 
                  className={`w-full h-full transition-all duration-500 drop-shadow-[0_0_18px_rgba(250,204,21,0.6)] ${
                    isHandHovered ? "opacity-95 scale-[1.01]" : "opacity-85 animate-[pulse_4s_ease-in-out_infinite]"
                  }`}
                >
                  <defs>
                    {/* Left Hand Translucent Gradient */}
                    <linearGradient id="handLeftGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                      <stop offset="50%" stopColor="#818cf8" stopOpacity="0.45" />
                      <stop offset="85%" stopColor="#fde047" stopOpacity="0.65" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0.85" />
                    </linearGradient>

                    {/* Right Hand Translucent Gradient */}
                    <linearGradient id="handRightGrad" x1="100%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                      <stop offset="50%" stopColor="#818cf8" stopOpacity="0.45" />
                      <stop offset="85%" stopColor="#fde047" stopOpacity="0.65" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0.85" />
                    </linearGradient>

                    {/* Luminous Contour Stroke */}
                    <linearGradient id="handBorderStroke" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
                      <stop offset="50%" stopColor="#67e8f9" stopOpacity="0.85" />
                      <stop offset="85%" stopColor="#fef08a" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
                    </linearGradient>

                    <filter id="cradleGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* LEFT HAND: Gently cupping the left edge of the card */}
                  <g className="transition-all duration-300">
                    <path
                      d="M -6 480 
                         C 8 430, 18 385, 22 340 
                         C 25 305, 26 270, 32 240 
                         C 35 226, 42 222, 45 228 
                         C 48 235, 45 248, 40 265 
                         C 36 278, 38 290, 44 295 
                         C 50 300, 52 292, 53 280 
                         C 55 264, 57 248, 59 242 
                         C 62 235, 68 235, 69 242 
                         C 70 250, 66 268, 62 290 
                         C 58 312, 59 332, 55 350 
                         C 47 385, 30 435, 14 485 
                         Z"
                      fill="url(#handLeftGrad)"
                      stroke="url(#handBorderStroke)"
                      strokeWidth="2.2"
                      filter="url(#cradleGlow)"
                      className="backdrop-blur-[1px]"
                    />
                    <circle cx="44" cy="230" r="3" fill="#fef08a" className="animate-pulse" />
                    <circle cx="68" cy="244" r="3" fill="#67e8f9" className="animate-pulse" />
                    <circle cx="42" cy="285" r="2.5" fill="#ffffff" className="animate-ping" style={{ animationDuration: "2.8s" }} />
                  </g>

                  {/* RIGHT HAND: Gently cupping the right edge of the card */}
                  <g className="transition-all duration-300">
                    <path
                      d="M 326 480 
                         C 312 430, 302 385, 298 340 
                         C 295 305, 294 270, 288 240 
                         C 285 226, 278 222, 275 228 
                         C 272 235, 275 248, 280 265 
                         C 284 278, 282 290, 276 295 
                         C 270 300, 268 292, 267 280 
                         C 265 264, 263 248, 261 242 
                         C 258 235, 252 235, 251 242 
                         C 250 250, 254 268, 258 290 
                         C 262 312, 261 332, 265 350 
                         C 273 385, 290 435, 306 485 
                         Z"
                      fill="url(#handRightGrad)"
                      stroke="url(#handBorderStroke)"
                      strokeWidth="2.2"
                      filter="url(#cradleGlow)"
                      className="backdrop-blur-[1px]"
                    />
                    <circle cx="276" cy="230" r="3" fill="#fef08a" className="animate-pulse" />
                    <circle cx="252" cy="244" r="3" fill="#67e8f9" className="animate-pulse" />
                    <circle cx="278" cy="285" r="2.5" fill="#ffffff" className="animate-ping" style={{ animationDuration: "2.8s" }} />
                  </g>

                  {/* Mystical Energy Arcs Wrapping Gently Around Bottom of Card */}
                  <path
                    d="M 30 400 Q 160 475 290 400"
                    fill="none"
                    stroke="#fde047"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    className="opacity-75 animate-pulse"
                  />
                  <path
                    d="M 45 425 Q 160 488 275 425"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.2"
                    strokeDasharray="6 6"
                    className="opacity-60"
                  />
                  <circle cx="160" cy="455" r="3" fill="#ffffff" className="animate-ping" style={{ animationDuration: "2.2s" }} />
                </svg>
              </div>

              {/* Inquiry Tag */}
              <div className="absolute bottom-3 inset-x-5 py-1 px-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-[11px] text-amber-200 tracking-wider text-center pointer-events-none">
                ✦ 雙手捧持牌卡・向神獸守護者提問 ✦
              </div>
            </div>

            {/* Subtle Hint */}
            <div className="text-xs text-amber-300/90 font-medium tracking-widest mt-3 flex items-center gap-1.5">
              <Sparkles size={13} className="text-gold-end" />
              <span>{isEn ? "Hold the card in your heart & ask your question" : "心念合一・專注感應當下的提問"}</span>
            </div>
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

          {/* Golden Start Button (Clean, without parenthetical quota count!) */}
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
                  ? (isEn ? "Begin Shuffling Cards" : isJa ? "カードをシャッフルする" : "開始感應洗牌") 
                  : (isEn ? "Daily Limit Reached" : "今日免費次數已用完")}
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
      {/* STAGE 2: HINDU SHUFFLE MINI-GAME (FIRST-PERSON PERSPECTIVE)   */}
      {/* ============================================================ */}
      {gameState === "shuffling" && (
        <div className="max-w-2xl w-full text-center space-y-6 animate-fadeIn">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-end/15 border border-gold-end/40 text-gold-end text-xs font-semibold tracking-widest shadow-md">
              <Layers size={13} />
              <span>第一人稱視角・印度洗牌調頻</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold tracking-widest text-gradient-gold font-serif">
              輕觸洗牌・注入心念
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto">
              按一下就洗一次牌。每一次切換牌疊，都在調和你的心念頻率（建議洗牌 3～5 次）。
            </p>
          </div>

          {/* Shuffle Energy Status Bar */}
          <div className="max-w-xs mx-auto flex flex-col items-center gap-1.5">
            <div className="flex items-center justify-between w-full text-xs font-semibold">
              <span className="text-gold-end">已洗牌次數：{shuffleCount} 次</span>
              <span className={shuffleCount >= 3 ? "text-emerald-300 font-bold" : "text-gray-400"}>
                {shuffleCount >= 3 ? "★ 能量調和完成" : "調頻中..."}
              </span>
            </div>

            {/* Progress Bars (1, 2, 3+) */}
            <div className="flex items-center gap-2 w-full h-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`flex-1 h-full rounded-full transition-all duration-500 ${
                    shuffleCount >= step 
                      ? "bg-gradient-to-r from-amber-400 to-yellow-300 shadow-[0_0_8px_rgba(250,204,21,0.7)]" 
                      : "bg-white/10"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ============================================================ */}
          {/* FIRST-PERSON HINDU SHUFFLE INTERACTIVE STAGE                 */}
          {/* ============================================================ */}
          <div 
            onClick={handlePerformShuffle}
            className="relative w-[340px] sm:w-[420px] h-[340px] sm:h-[380px] mx-auto my-2 select-none cursor-pointer group"
            title="輕觸牌面或按鈕進行洗牌"
          >
            {/* Ambient Cosmic Ring & Halo on Altar */}
            <div className="absolute inset-0 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-2xl transition-all duration-300 group-hover:border-gold-end/40" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gold-end/10 blur-3xl pointer-events-none" />

            {/* ---------------------------------------------------------- */}
            {/* 1. LEFT HAND & BASE STACK (RECEIVING DECK)                 */}
            {/* ---------------------------------------------------------- */}
            <div className="absolute left-6 sm:left-10 bottom-6 sm:bottom-8 w-[140px] sm:w-[160px] aspect-[1/1.52] transition-transform duration-300">
              {/* Stack depth under left deck */}
              <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-xl border border-amber-300/40 bg-[#070b1a] shadow-xl" />
              <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-xl border border-amber-300/30 bg-[#050814] shadow-2xl" />

              {/* Top card of the left stack */}
              <div className="relative w-full h-full rounded-xl overflow-hidden border-2 border-amber-300/70 shadow-2xl -rotate-6">
                <img 
                  src="/images/cards/card-back.png" 
                  alt="Left Stack Card" 
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Translucent Left Hand holding the base stack from below */}
              <div className="absolute -inset-6 pointer-events-none z-20">
                <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-[0_0_12px_rgba(250,204,21,0.5)]">
                  <defs>
                    <linearGradient id="hinduLeftHand" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
                      <stop offset="50%" stopColor="#818cf8" stopOpacity="0.4" />
                      <stop offset="85%" stopColor="#fde047" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>
                  {/* Left palm cupping bottom of stack */}
                  <path
                    d="M 10 240 C 20 190, 30 160, 45 140 C 55 125, 75 125, 85 138 C 95 150, 85 170, 75 190 C 65 210, 50 240, 40 240 Z"
                    fill="url(#hinduLeftHand)"
                    stroke="#67e8f9"
                    strokeWidth="1.8"
                    className="opacity-80"
                  />
                  {/* Left thumb resting on left edge */}
                  <path
                    d="M 35 150 C 42 120, 55 105, 68 110 C 78 115, 72 135, 60 155 Z"
                    fill="url(#hinduLeftHand)"
                    stroke="#fde047"
                    strokeWidth="1.8"
                    className="opacity-85"
                  />
                  <circle cx="68" cy="112" r="3" fill="#ffffff" className="animate-pulse" />
                </svg>
              </div>
            </div>

            {/* ---------------------------------------------------------- */}
            {/* 2. RIGHT HAND & SOURCE DECK (GRIPPING PACKET FROM ABOVE)   */}
            {/* ---------------------------------------------------------- */}
            <div className="absolute right-6 sm:right-10 top-6 sm:top-8 w-[140px] sm:w-[160px] aspect-[1/1.52] transition-transform duration-300">
              {/* Stack depth under right deck */}
              <div className="absolute inset-0 -translate-x-1.5 -translate-y-1.5 rounded-xl border border-amber-300/40 bg-[#070b1a] shadow-xl" />
              <div className="absolute inset-0 -translate-x-3 -translate-y-3 rounded-xl border border-amber-300/30 bg-[#050814] shadow-2xl" />

              {/* Main deck held in right hand */}
              <div className="relative w-full h-full rounded-xl overflow-hidden border-2 border-amber-300/70 shadow-2xl rotate-3">
                <img 
                  src="/images/cards/card-back.png" 
                  alt="Right Stack Card" 
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Translucent Right Hand gripping from above */}
              <div className="absolute -inset-6 pointer-events-none z-20">
                <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-[0_0_12px_rgba(250,204,21,0.5)]">
                  <defs>
                    <linearGradient id="hinduRightHand" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
                      <stop offset="50%" stopColor="#818cf8" stopOpacity="0.4" />
                      <stop offset="85%" stopColor="#fde047" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>
                  {/* Right fingers holding top edge */}
                  <path
                    d="M 190 0 C 175 40, 160 70, 145 90 C 135 105, 115 105, 105 92 C 95 80, 105 60, 115 40 C 125 20, 140 0, 150 0 Z"
                    fill="url(#hinduRightHand)"
                    stroke="#67e8f9"
                    strokeWidth="1.8"
                    className="opacity-80"
                  />
                  {/* Right thumb gripping bottom edge */}
                  <path
                    d="M 160 110 C 150 140, 138 155, 125 150 C 115 145, 120 125, 135 105 Z"
                    fill="url(#hinduRightHand)"
                    stroke="#fde047"
                    strokeWidth="1.8"
                    className="opacity-85"
                  />
                  <circle cx="125" cy="148" r="3" fill="#ffffff" className="animate-pulse" />
                </svg>
              </div>
            </div>

            {/* ---------------------------------------------------------- */}
            {/* 3. DYNAMIC SLIDING PACKET (HINDU SHUFFLE SLICE MOTION)     */}
            {/* ---------------------------------------------------------- */}
            <div 
              className={`absolute w-[136px] sm:w-[156px] aspect-[1/1.52] z-30 pointer-events-none transition-all duration-400 ease-out ${
                isShufflingAnim
                  ? "left-8 bottom-8 -rotate-6 scale-100 opacity-95 shadow-[0_0_25px_rgba(250,204,21,0.8)]"
                  : "right-8 top-8 rotate-3 scale-95 opacity-0"
              }`}
            >
              <div className="w-full h-full rounded-xl overflow-hidden border-2 border-gold-end shadow-2xl">
                <img 
                  src="/images/cards/card-back.png" 
                  alt="Sliding Card Packet" 
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Sparkle energy trails when sliding */}
              {isShufflingAnim && (
                <div className="absolute -inset-4 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-full rounded-2xl border-2 border-gold-end animate-ping opacity-60" />
                </div>
              )}
            </div>

            {/* Tap cue tag overlay */}
            <div className="absolute bottom-3 inset-x-8 py-1 px-3 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-[11px] text-amber-200 tracking-wider text-center pointer-events-none group-hover:border-gold-end/50">
              ✦ 輕觸畫面即可切牌洗牌 ✦
            </div>

          </div>

          {/* ============================================================ */}
          {/* CONTROLS: SHUFFLE BUTTON & FINISH / PROCEED BUTTON           */}
          {/* ============================================================ */}
          <div className="flex flex-col items-center gap-3 pt-2">
            
            {/* Primary Action: Tap to Shuffle Once */}
            <button
              type="button"
              onClick={handlePerformShuffle}
              disabled={isShufflingAnim}
              className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-gold-end/50 hover:border-gold-end text-gold-end hover:text-white font-bold text-sm sm:text-base tracking-widest transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2.5"
            >
              <Layers size={18} className={isShufflingAnim ? "animate-bounce" : ""} />
              <span>{isShufflingAnim ? "切牌調頻中..." : "輕觸洗一次牌 (Tap to Shuffle)"}</span>
            </button>

            {/* Secondary Action: Proceed to Fan Spread */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleFinishShuffle}
                className={`px-10 py-4 rounded-full font-bold tracking-[3px] text-base sm:text-lg transition-all shadow-2xl flex items-center justify-center gap-3 cursor-pointer ${
                  shuffleCount >= 1
                    ? "bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black hover:scale-105 active:scale-95 shadow-gold-end/30"
                    : "bg-white/10 text-gray-300 border border-white/20 hover:bg-white/15"
                }`}
              >
                <Sparkles size={18} className="animate-spin text-inherit" style={{ animationDuration: "6s" }} />
                <span>
                  {shuffleCount >= 3 
                    ? "✦ 能量已調和・攤開牌陣 ✦" 
                    : shuffleCount > 0 
                    ? "完成洗牌・展開牌陣" 
                    : "直接展開牌陣"}
                </span>
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="text-xs text-gray-400 tracking-widest pt-1">
              ✦ 感受心念沉澱後，隨時點擊「展開牌陣」進行直覺選牌 ✦
            </div>

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
                <span>{remainingFreeDraws > 0 ? "再抽一張" : "返回首頁"}</span>
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
