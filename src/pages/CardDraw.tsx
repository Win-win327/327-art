import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  RotateCcw, 
  ChevronLeft, 
  ShoppingBag, 
  BookOpen, 
  Share2, 
  Volume2, 
  VolumeX, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Compass, 
  Flame, 
  Heart,
  ArrowRight
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import { MAGIC_CARDS, MagicCard } from "../data/magicCardsData";

// Simple Web Audio API Synthesizer for mystical crystal chime (royalty-free)
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

export default function CardDraw() {
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const isEn = language === "en";
  const isJa = language === "ja";

  // Game States: "intro" | "shuffling" | "spread" | "flipping" | "result"
  const [gameState, setGameState] = useState<"intro" | "shuffling" | "spread" | "flipping" | "result">("intro");
  const [drawMode, setDrawMode] = useState<"single" | "trinity">("single");
  const [selectedCards, setSelectedCards] = useState<MagicCard[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showManualModal, setShowManualModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  // Deck of 18 interactive spread card representations
  const SPREAD_COUNT = 15;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Start the shuffle animation
  const handleStartShuffle = () => {
    if (soundEnabled) playMysticChime();
    setGameState("shuffling");
    setTimeout(() => {
      setGameState("spread");
    }, 1500);
  };

  // User selects a card from the fan spread
  const handleSelectCard = (index: number) => {
    if (soundEnabled) playMysticChime();

    // Randomly pick a card from dataset (Card 1 is prioritized for testing the user's authentic photo!)
    // If first pick, guarantee Card 1 (Beluga Enjoyment) so user immediately sees their photo, or random
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
    setIsFlipped(false);
    setSelectedCards([]);
    setGameState("intro");
  };

  // Add the physical card deck to cart
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
      {/* STAGE 1: INTRO & MEDITATION INTENTION                         */}
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

          <p className="text-sm sm:text-base text-gray-200 leading-relaxed max-w-xl mx-auto font-medium">
            {isEn 
              ? "Every living creature holds a unique frequency. Close your eyes, take a deep breath, and connect with your inner animal guardian."
              : isJa
              ? "万物には固有の波長が存在します。目を閉じ、深呼吸をし、今この瞬間にあなたを導く動物と繋がってください。"
              : "每一隻生靈，都是宇宙賜予的一面鏡子。閉上雙眼，深呼吸，在心中默念你近期的期盼、困惑或想探索的議題。"}
          </p>

          {/* Mode Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            <button
              type="button"
              onClick={() => setDrawMode("single")}
              className={`p-5 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
                drawMode === "single"
                  ? "bg-gold-end/20 border-gold-end text-white shadow-xl shadow-gold-end/10 ring-2 ring-gold-end/40"
                  : "bg-white/5 border-white/15 text-gray-300 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gold-end uppercase tracking-wider">
                  {isEn ? "Recommended" : "推薦玩法"}
                </span>
                <Compass size={18} className="text-gold-end" />
              </div>
              <div className="font-bold text-base text-white">{isEn ? "Daily Guidance (Single)" : "單張今日神諭指引"}</div>
              <div className="text-xs text-gray-200 mt-1">{isEn ? "Focus on current energy & animal spirit" : "專注於當下最核心的能量與守護動物"}</div>
            </button>

            <button
              type="button"
              onClick={() => setDrawMode("trinity")}
              className={`p-5 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
                drawMode === "trinity"
                  ? "bg-gold-end/20 border-gold-end text-white shadow-xl shadow-gold-end/10 ring-2 ring-gold-end/40"
                  : "bg-white/5 border-white/15 text-gray-300 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gold-end uppercase tracking-wider">
                  {isEn ? "Full Spectrum" : "全方位牌陣"}
                </span>
                <Flame size={18} className="text-gold-end" />
              </div>
              <div className="font-bold text-base text-white">{isEn ? "Trinity (Body/Mind/Soul)" : "三張身心靈神聖牌陣"}</div>
              <div className="text-xs text-gray-200 mt-1">{isEn ? "Past, Present & Evolutionary Future" : "探索過去、現在與即將展開的未來奇蹟"}</div>
            </button>
          </div>

          {/* Golden Start Button */}
          <div className="pt-4">
            <button
              type="button"
              onClick={handleStartShuffle}
              className="px-10 py-4 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-bold tracking-[3px] text-base sm:text-lg transition-all shadow-2xl hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-3 mx-auto"
            >
              <Sparkles size={20} className="animate-spin text-black" style={{ animationDuration: "6s" }} />
              <span>{isEn ? "Begin Shuffling Cards" : isJa ? "カードをシャッフルする" : "開始感應洗牌"}</span>
            </button>
          </div>

          <div className="text-xs text-gray-400 tracking-widest pt-2">
            ✦ 327 ART 官方正品燙金原創牌卡數據庫授權 ✦
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STAGE 2: SHUFFLING CINEMATIC ANIMATION                        */}
      {/* ============================================================ */}
      {gameState === "shuffling" && (
        <div className="max-w-md w-full text-center space-y-8 animate-fadeIn">
          <div className="relative w-48 h-72 mx-auto">
            {/* Shuffling overlapping deck layers */}
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
              {isEn ? "Hold your breath and focus your intention." : "請保持呼吸，心中專注於此刻的感受。"}
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
            ✦ 滑動即可預覽每一張牌的浮動能量 ✦
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
              {isEn ? "TODAY'S SACRED ORACLE" : isJa ? "本日あなたに届いた守護神託" : "今日來到你身邊的守護動物"}
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
                ✦ 今日力量肯定語：<span className="text-gray-100">{isEn ? activeCard.affirmationEn : isJa ? activeCard.affirmationJa : activeCard.affirmationZh}</span>
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
                <span>再抽一張</span>
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
