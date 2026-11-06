import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingBag, Globe, BookOpen, Image as ImageIcon } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import OptimizedImage from "../components/OptimizedImage";
import ReturnPolicySection from "../components/common/ReturnPolicySection";

// 多語言說明書 GIF 動畫圖檔
const manualGifUrl = "https://i.ibb.co/qLV5w6bH/image.gif";

// 故事段落圖片（預留五張圖片位置，待使用者提供網址後填入即可即時顯示）
const storyImages: Record<string, string> = {
  img1: "https://i.ibb.co/gZwH7yJt/1-1-2.jpg", // 〔圖一〕
  img2: "https://i.ibb.co/6cbt9tF8/IMG-2385.jpg", // 〔圖二〕
  img3: "https://i.ibb.co/fGTbfKXC/IMG-8804-2.jpg", // 〔圖三〕 方案 B (IMG-8804)
  img4: "https://i.ibb.co/bRsLWpF3/D29-E5-CF0-9-A9-B-424-D-879-B-85-DF3234-CBC7.gif", // 〔圖四〕 (GIF 動態圖)
  img5: "https://i.ibb.co/nM0c81KZ/IMG-9044.jpg", // 〔圖五〕 方案 A (IMG-9044)
};

const images = [
  "https://i.ibb.co/MyKzGnTB/card-01.jpg",
  "https://i.ibb.co/tMwHqtdP/card-02.jpg",
  "https://i.ibb.co/wFbbYXNN/card-03.jpg",
  "https://i.ibb.co/ds4gm9V1/card-04.jpg",
  "https://i.ibb.co/k2N4XPQM/card-05.jpg",
  "https://i.ibb.co/qFr2Tdqr/card-06.jpg",
  "https://i.ibb.co/tTJPKvDB/card-07.jpg",
];

const productInfo = {
  id: "magic-cards",
  price: 1280,
  originalPrice: 1280,
};

const getCatalogItems = (lang: string) => {
  if (lang === "en") {
    return [
      ["1. Beluga", "Enjoyment"], ["2. Phoenix", "Rebirth"], ["3. Dog", "The Present"], ["4. White Lion & Elf", "Serenity"],
      ["5. Black Panther", "Support"], ["6. Elephant", "Protection"], ["7. Aurora Whale", "Fortune"], ["8. Marten", "Abundance"],
      ["9. Blue-Pink Bird", "Love"], ["10. Lion King", "Power"], ["11. Earth", "Source"], ["12. Panda", "Dream Weaver"],
      ["13. Aurora Dolphin", "Transcendence"], ["14. Wild Horses", "Action"], ["15. Snow Sparrow", "Focus"], ["16. Pegasus", "Freedom"],
      ["17. Unicorn", "Confidence"], ["18. Whale & Eye", "Awareness"], ["19. Leaping Dolphin", "Intuition"], ["20. Twin Owls", "Oneness"],
      ["21. Deer", "Warrior"], ["22. Tiger & Cat", "Mirror"], ["23. Sea Dragon", "Manifestation"], ["24. Aurora White Lion", "Resolve"],
      ["25. Wolf Pack", "Awakening"], ["26. Aurora Deer & Elf", "Expansion"], ["27. Aurora Wolf", "Belief"], ["28. Aurora Stag", "Becoming"],
      ["29. Owl", "Wisdom"], ["30. Golden Hamster", "Infinity"]
    ];
  }
  if (lang === "ja") {
    return [
      ["1. 白鯨", "享受"], ["2. 鳳凰", "再生"], ["3. 愛犬", "今ここ"], ["4. 白獅子と精霊", "静寂"],
      ["5. 黒豹", "支え"], ["6. 象", "守護"], ["7. オーロラ鯨", "幸運"], ["8. テン", "豊かさ"],
      ["9. 青と桃の鳥", "愛"], ["10. 百獣の王", "力"], ["11. 地球", "源頭"], ["12. パンダ", "夢紡ぎ"],
      ["13. オーロラ海豚", "越境"], ["14. 野生馬", "行動"], ["15. 雪雀", "目標"], ["16. 天馬", "自由"],
      ["17. ユニコーン", "自信"], ["18. 鯨と瞳", "焦点"], ["19. 跳躍海豚", "直感"], ["20. 双子のフクロウ", "合一"],
      ["21. 鹿", "勇者"], ["22. 虎と猫", "鏡"], ["23. 海龍", "具現化"], ["24. オーロラ白獅子", "不動"],
      ["25. 狼の群れ", "覚醒"], ["26. オーロラ鹿と精霊", "拡張"], ["27. オーロラ狼", "確信"], ["28. オーロラ鹿", "昇華"],
      ["29. フクロウ", "英知"], ["30. ゴールデンハムスター", "無限"]
    ];
  }
  return [
    ["1. 白鯨", "享受"], ["2. 鳳凰", "重生"], ["3. 狗狗", "當下"], ["4. 白獅與人與精靈", "平靜"],
    ["5. 黑豹", "支持"], ["6. 大象", "守護"], ["7. 極光鯨魚", "幸運"], ["8. 貂", "豐盛"],
    ["9. 藍粉鳥", "愛"], ["10. 獅王", "力量"], ["11. 地球", "源頭"], ["12. 熊貓", "造夢者"],
    ["13. 極光海豚", "穿越"], ["14. 馬群", "行動"], ["15. 雪雀", "目標"], ["16. 天馬", "自由"],
    ["17. 獨角獸", "自信"], ["18. 鯨魚與眼", "焦點"], ["19. 跳躍海豚", "直覺"], ["20. 極光雙貓頭鷹", "合一"],
    ["21. 鹿", "勇士"], ["22. 老虎與貓", "鏡"], ["23. 海龍", "顯化"], ["24. 極光白獅", "堅定"],
    ["25. 狼族", "喚醒"], ["26. 極光鹿與精靈", "擴展"], ["27. 極光狼", "相信"], ["28. 極光鹿", "成為"],
    ["29. 貓頭鷹", "智慧"], ["30. 黃金鼠", "無限"]
  ];
};

export default function ShopDetail() {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [slideIndex, setSlideIndex] = useState(0);
  const [activeImg, setActiveImg] = useState(images[0]);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const visibleCount = 6;
  const totalImages = images.length;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const currentIndex = images.indexOf(activeImg);
      const nextIndex = (currentIndex + 1) % images.length;
      setActiveImg(images[nextIndex]);
      
      const maxIndex = images.length - visibleCount;
      if (nextIndex < slideIndex) {
        setSlideIndex(nextIndex);
      } else if (nextIndex >= slideIndex + visibleCount) {
        setSlideIndex(Math.min(nextIndex - visibleCount + 1, maxIndex));
      } else if (nextIndex === 0) {
        setSlideIndex(0);
      }
    }, 3000);
    return () => clearInterval(timer);
  }, [activeImg, slideIndex]);

  const moveSlider = (direction: number) => {
    const maxIndex = totalImages - visibleCount;
    let newIndex = slideIndex + direction;
    if (newIndex < 0) newIndex = 0;
    if (newIndex > maxIndex) newIndex = maxIndex;
    setSlideIndex(newIndex);
  };

  const handleThumbClick = (img: string) => {
    setActiveImg(img);
  };

  const cardTitle = t("shopdetail.title", "極光動物魔法卡");

  const handleAddToCart = () => {
    addToCart({
      id: productInfo.id,
      productId: productInfo.id,
      title: cardTitle,
      titleEn: "Aurora Magical Animal Cards",
      titleJa: "オーロラ・マジカル・アニマル・カード",
      price: productInfo.price,
      quantity,
      image: images[0],
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  const catalogItems = getCatalogItems(language);

  const renderStoryImage = (imgKey: "img1" | "img2" | "img3" | "img4" | "img5", label: string) => {
    const src = storyImages[imgKey];
    if (src && src.trim()) {
      return (
        <img
          src={src}
          alt={label}
          className="w-full rounded shadow-lg my-8"
        />
      );
    }
    return (
      <div className="w-full my-8 p-8 rounded border border-dashed border-white/20 flex flex-col items-center justify-center text-center">
        <span className="text-gradient-white-gold font-medium tracking-widest text-base">
          {label}
        </span>
        <span className="text-xs text-gray-400 mt-1 tracking-wider">
          （圖片預留位置・待提供圖片網址）
        </span>
      </div>
    );
  };

  return (
    <div className="relative z-10 max-w-7xl mx-auto pt-[150px] pb-[80px] px-5 w-full">
      <div className="flex flex-col lg:flex-row gap-[60px] mb-[100px]">
        {/* Gallery */}
        <div className="flex-[1.2] overflow-hidden">
          <div className="w-full aspect-square overflow-hidden rounded-md shadow-2xl">
            <OptimizedImage src={activeImg} alt="主圖" className="w-full h-full object-cover transition-opacity duration-300" wrapperClassName="w-full h-full" />
          </div>
          
          <div className="flex items-center mt-5 gap-3">
            <button onClick={() => moveSlider(-1)} className="bg-black/50 border border-gold-end text-gold-end p-2 cursor-pointer rounded">
              <ChevronLeft size={20} />
            </button>
            <div className="flex-1 overflow-hidden">
              <div 
                className="flex gap-2 transition-transform duration-300 w-max"
                style={{ transform: `translateX(-${slideIndex * 100}px)` }}
              >
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    onClick={() => handleThumbClick(img)}
                    alt={`Thumbnail ${idx}`}
                    className={`w-[90px] h-[90px] object-cover cursor-pointer border-2 transition-all duration-300 rounded shrink-0 ${activeImg === img ? 'border-gold-end opacity-100' : 'border-transparent opacity-50'}`}
                  />
                ))}
              </div>
            </div>
            <button onClick={() => moveSlider(1)} className="bg-black/50 border border-gold-end text-gold-end p-2 cursor-pointer rounded">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="font-en text-4xl md:text-5xl font-bold leading-tight mb-5 text-gradient-white-gold drop-shadow-md">
            {cardTitle}
          </h1>
          <p className="text-gold-end text-lg mb-8 tracking-widest">{t("shopdetail.sub")}</p>
          
          <div className="my-8 p-6 bg-black/30 border-l-[3px] border-gold-end">
            {productInfo.originalPrice > productInfo.price && (
              <span className="text-[#999] line-through mr-4 text-xl">NT$ {productInfo.originalPrice}</span>
            )}
            <span className="text-4xl text-gold-end font-bold">NT$ {productInfo.price}</span>
          </div>
          
          <p className="text-gray-300 mb-8 leading-relaxed tracking-wide">
            {t("shopdetail.tagline")}
          </p>

          {/* Quantity Selector */}
          <div className="mb-8">
            <span className="text-gray-300 tracking-widest font-semibold text-sm block mb-3">
              {t("shopdetail.qty_label")}
            </span>
            <div className="flex items-center border border-white/20 w-max rounded-md bg-white/5">
              <button 
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="p-3 text-gray-400 hover:text-white transition-colors cursor-pointer"
                disabled={quantity <= 1}
              >
                <Minus size={18} />
              </button>
              <div className="w-[50px] text-center font-semibold text-lg">{quantity}</div>
              <button 
                onClick={() => setQuantity(prev => prev + 1)}
                className="p-3 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col gap-3 mt-4">
            <button 
              onClick={handleAddToCart}
              className="w-full py-4 rounded font-bold tracking-[2px] transition-all flex items-center justify-center gap-2 bg-gold-end text-black hover:bg-yellow-400 shadow-lg cursor-pointer"
            >
              <ShoppingBag size={20} />
              {t("shopdetail.add_cart")}
            </button>
            <button 
              onClick={handleBuyNow}
              className="w-full py-4 rounded border font-bold tracking-[2px] transition-all border-gold-end text-gold-end hover:bg-gold-end/10 cursor-pointer"
            >
              {t("shopdetail.buy_now")}
            </button>
          </div>
        </div>
      </div>

      {/* Content Blocks */}
      <div className="max-w-4xl mx-auto mb-[80px] px-5">
        <h2 className="font-en text-3xl mb-10 pb-4 border-b border-white/15 text-center text-gradient-white-gold drop-shadow-sm">
          {t("shopdetail.intro_title")}
        </h2>
        <div className="text-center leading-relaxed text-lg text-gray-200 space-y-4">
          <p>{t("shopdetail.intro_p1")}</p>
          <p>{t("shopdetail.intro_p2")}</p>
          <p className="mt-4">{t("shopdetail.intro_p3")}</p>
        </div>
      </div>

      {/* Artist Origin & Miracle Story: 張景雯 Win 與極光動物魔法卡的創作奇蹟 */}
      <div className="max-w-4xl mx-auto mb-[100px] px-5 space-y-16">
        {/* Section 1: 力量動物的共鳴 */}
        <div className="text-center space-y-6">
          {renderStoryImage("img1", t("shopdetail.story.img1_label", "〔圖一〕 力量動物的共鳴"))}
          
          <div className="leading-relaxed text-lg md:text-xl text-white space-y-3 font-serif">
            <p className="text-gradient-white-gold font-medium text-xl md:text-2xl mb-4">
              {t("shopdetail.story.p1_1", "在每個人的心裡，都住著一隻屬於自己的力量動物。")}
            </p>
            <p>{t("shopdetail.story.p1_2", "也許是一頭獅子，提醒你永遠有那份力量；")}</p>
            <p>{t("shopdetail.story.p1_3", "也許是一隻鯨魚，帶給你無限的幸運；")}</p>
            <p>{t("shopdetail.story.p1_4", "也許是一尊鳳凰，陪你走過一次又一次的重生。")}</p>
            <div className="pt-4 space-y-2">
              <p className="text-gradient-white-gold font-medium tracking-widest text-lg md:text-xl">
                {t("shopdetail.story.p1_5", "你有沒有想過——")}
              </p>
              <p className="text-white text-xl md:text-2xl font-bold tracking-wider">
                {t("shopdetail.story.p1_6", "如果你的內在，也有一隻動物一直陪著你，那麼，牠會是誰？")}
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: 這不是一副普通的牌卡 & 15歲的考驗 */}
        <div className="text-center space-y-6">
          {renderStoryImage("img2", t("shopdetail.story.img2_label", "〔圖二〕 重症肌無力與夢想的抉擇"))}

          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-gradient-white-gold tracking-wide pb-4 mb-8 border-b border-white/15 text-center drop-shadow-sm">
              {t("shopdetail.story.p2_tag", "◆ 這不是一副普通的牌卡")}
            </h3>
            <div className="space-y-3 mb-6">
              <p className="text-lg md:text-xl text-white tracking-wide leading-relaxed font-normal">
                {t("shopdetail.story.p2_title", "「極光動物魔法卡」是一套由台灣藝術家 張景雯 Win 親自創作的原創油畫牌卡。")}
              </p>
              <p className="text-gradient-white-gold text-lg md:text-xl font-medium tracking-wider">
                {t("shopdetail.story.p2_lead", "這是一份夢想與奇蹟創造出的牌卡——")}
              </p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto text-center text-white text-lg leading-relaxed space-y-4">
            <p>{t("shopdetail.story.p2_dream", "小時候，我一直有一個夢想：想要親眼去看一次極光！")}</p>
            <p>{t("shopdetail.story.p2_diagnosis", "隨著我越來越大，一步一步靠近夢想時，老天爺卻開了一個大玩笑，15歲那年，人生驟變.....我被診斷出罹患重症肌無力。")}</p>
            <p>{t("shopdetail.story.p2_struggle", "病如其名，讓原本可以自由奔跑、活動的身體，開始變得越來越困難，肌肉越來越不聽使喚。眼看著，只剩下一條路——放棄夢想。")}</p>
            <p className="text-gray-300 italic pt-2">{t("shopdetail.story.p2_question", "我問自己：難道就要這樣放棄了嗎？")}</p>
            <p className="text-2xl md:text-3xl font-bold text-gradient-white-gold tracking-wide">
              {t("shopdetail.story.p2_refuse", "可是……可是！我並不想放棄我的夢想！")}
            </p>
            <p className="text-white text-lg md:text-xl font-medium">
              {t("shopdetail.story.p2_longing", "那份遙遠的極光，仍是我心之所向。")}
            </p>
          </div>
        </div>

        {/* Section 3: 把極光畫回來 */}
        <div className="text-center space-y-6">
          {renderStoryImage("img3", t("shopdetail.story.img3_label", "〔圖三〕 把極光畫回來"))}

          <div className="max-w-3xl mx-auto space-y-3 py-2">
            <p className="text-white text-lg md:text-xl leading-relaxed">
              {t("shopdetail.story.p3_1", "如果目前我無法去到極光所在的地方，那麼——")}
            </p>
            <h4 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gradient-white-gold tracking-wider drop-shadow-md py-2">
              {t("shopdetail.story.p3_2", "我就把極光畫回來。")}
            </h4>
          </div>
        </div>

        {/* Section 4: 筆如啞鈴，靈魂輕盈，祂們就是我的奇蹟 */}
        <div className="text-center space-y-6">
          {renderStoryImage("img4", t("shopdetail.story.img4_label", "〔圖四〕 畫布上的奇蹟與誕生"))}

          <div className="max-w-3xl mx-auto text-white text-lg leading-relaxed space-y-4">
            <p>{t("shopdetail.story.p4_1", "於是，我開始提筆畫畫。那支幾公克的筆，在我手中好似舉啞鈴，但那一筆又一筆，勾勒出的極光，卻讓我在這副沈重的身軀，感受到靈魂的輕盈，")}</p>
            <p className="text-2xl md:text-3xl font-bold text-gradient-white-gold py-2">
              {t("shopdetail.story.p4_2", "在畫布上，我讓極光自由地流動，讓動物展現，「祂們」就是我的奇蹟！")}
            </p>
            <p className="text-white text-xl font-medium tracking-widest">
              {t("shopdetail.story.p4_3", "這副牌卡，因此誕生。")}
            </p>
          </div>
        </div>

        {/* Section 5: 把這份奇蹟分享給各位，9大力量守護 */}
        <div className="text-center space-y-6">
          {renderStoryImage("img5", t("shopdetail.story.img5_label", "〔圖五〕 力量與守護的分享"))}

          <div className="space-y-4 max-w-3xl mx-auto">
            <p className="text-white text-lg md:text-xl leading-relaxed font-serif">
              {t("shopdetail.story.p5_1", "現在我想把這份「奇蹟」，分享給各位。讓每一張牌都像是一幅可以被收藏的小奇蹟，以及藝術收藏品。")}
            </p>
            <p className="text-gradient-white-gold text-xl md:text-2xl font-bold tracking-wide">
              {t("shopdetail.story.p5_2", "而這些動物，也會陪伴者你，給予大家，不同的力量——")}
            </p>
          </div>

          {/* 9 大力量標籤 */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 max-w-3xl mx-auto pt-2">
            {[
              "勇氣", "自由", "愛", "直覺", "守護", "重生", "豐盛", "行動", "平靜"
            ].map((power, idx) => {
              const powerLabels: Record<string, { en: string; ja: string }> = {
                "勇氣": { en: "Courage", ja: "勇気" },
                "自由": { en: "Freedom", ja: "自由" },
                "愛": { en: "Love", ja: "愛" },
                "直覺": { en: "Intuition", ja: "直感" },
                "守護": { en: "Protection", ja: "守護" },
                "重生": { en: "Rebirth", ja: "再生" },
                "豐盛": { en: "Abundance", ja: "豊かさ" },
                "行動": { en: "Action", ja: "行動" },
                "平靜": { en: "Peace", ja: "静寂" },
              };
              const displayLabel = language === "en" ? powerLabels[power]?.en || power : language === "ja" ? powerLabels[power]?.ja || power : power;

              return (
                <span
                  key={idx}
                  className="px-4 py-2 rounded-full border border-gold-end/40 text-white font-medium text-base tracking-widest hover:border-gold-end transition-all"
                >
                  ✦ <span className="text-gradient-white-gold font-bold">{displayLabel}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-[100px] px-5">
        <h2 className="font-en text-3xl mb-10 pb-4 border-b border-white/15 text-center text-gradient-white-gold drop-shadow-sm">
          {t("shopdetail.how_title")}
        </h2>
        <img src="https://i.ibb.co/MxZQj9zm/how-to-use.jpg" alt={t("shopdetail.how_title")} className="w-full rounded shadow-lg" />
      </div>

      <div className="max-w-4xl mx-auto mb-[100px] px-5">
        <h2 className="font-en text-3xl mb-10 pb-4 border-b border-white/15 text-center text-gradient-white-gold drop-shadow-sm">
          {t("shopdetail.contents_title")}
        </h2>
        <div className="bg-white/5 p-6 md:p-10 rounded-lg shadow-xl">
          <img src="https://i.ibb.co/gLtZBjpy/catalog-img.jpg" alt="目錄意境圖" className="w-full rounded mb-8 shadow" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[60px] gap-y-[15px]">
          {catalogItems.map(([title, keyword], idx) => (
            <div key={idx} className="flex justify-between border-b border-dashed border-white/15 pb-2 text-gray-300">
              <span>{title}</span>
              <span className="font-bold text-white">{keyword}</span>
            </div>
          ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-[100px] px-5">
        <h2 className="font-en text-3xl mb-10 pb-4 border-b border-white/15 text-center text-gradient-white-gold drop-shadow-sm">
          {t("shopdetail.spec_title")}
        </h2>
        <img src="https://i.ibb.co/q3mvMjMm/spec-img.jpg" alt="規格尺寸說明" className="w-full rounded mb-8 shadow-lg" />
        <div className="text-lg leading-loose text-center text-gray-200">
          <p>
            {t("shopdetail.spec_p1")}<br />
            {t("shopdetail.spec_p2")}<br />
            {t("shopdetail.spec_p3")}<br />
            {t("shopdetail.spec_p4")}<br />
            <strong className="text-gold-end font-bold tracking-widest mt-4 block">{t("shopdetail.spec_made")}</strong>
          </p>
        </div>
      </div>

      {/* Multilingual Manual Section */}
      <div className="max-w-4xl mx-auto mb-[100px] px-5">
        <h2 className="font-en text-3xl mb-10 pb-4 border-b border-white/15 text-center text-gradient-white-gold drop-shadow-sm flex items-center justify-center gap-3">
          <Globe className="text-gold-end shrink-0" size={28} />
          <span>{t("shopdetail.manual_title")}</span>
        </h2>

        {/* GIF 說明書展示區塊 */}
        <div className="mb-10 rounded-2xl overflow-hidden border border-gold-end/30 bg-gradient-to-b from-white/10 via-black/40 to-black/60 shadow-2xl p-4 sm:p-6 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl mx-auto overflow-hidden rounded-xl bg-black/60 shadow-2xl border border-white/10 group">
            <video
              className="w-full h-auto object-cover rounded-xl"
              autoPlay
              loop
              muted
              playsInline
              webkit-playsinline="true"
              poster="https://i.ibb.co/qLV5w6bH/image.gif"
            >
              <source src="/images/card-manual.mp4" type="video/mp4" />
              <img
                src={manualGifUrl}
                alt={t("shopdetail.manual_title")}
                className="w-full h-auto object-cover rounded-xl"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes("/images/card-manual.gif")) {
                    target.src = "/images/card-manual.gif";
                  }
                }}
              />
            </video>
          </div>

          {/* 語言支援標籤 */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mt-6">
            <span className="px-4 py-1.5 rounded-full bg-gold-end/10 border border-gold-end/30 text-gold-end text-xs sm:text-sm font-medium tracking-wider flex items-center gap-1.5">
              <BookOpen size={14} /> 繁體中文
            </span>
            <span className="px-4 py-1.5 rounded-full bg-gold-end/10 border border-gold-end/30 text-gold-end text-xs sm:text-sm font-medium tracking-wider flex items-center gap-1.5">
              <BookOpen size={14} /> English
            </span>
            <span className="px-4 py-1.5 rounded-full bg-gold-end/10 border border-gold-end/30 text-gold-end text-xs sm:text-sm font-medium tracking-wider flex items-center gap-1.5">
              <BookOpen size={14} /> 日本語
            </span>
          </div>
        </div>

        {/* 說明書介紹內文 */}
        <div className="text-center leading-relaxed text-gray-200 space-y-4 max-w-3xl mx-auto bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
          <p className="font-bold text-gold-end text-xl sm:text-2xl tracking-wide">
            {t("shopdetail.manual_p1")}
          </p>
          <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
            {t("shopdetail.manual_p2")}
          </p>
          <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
            {t("shopdetail.manual_p3")}
          </p>
          <p className="pt-3 text-white font-medium text-lg sm:text-xl tracking-wide text-gradient-white-gold">
            {t("shopdetail.manual_p4")}
          </p>
        </div>
      </div>

      {/* Add-on product */}
      <div className="max-w-4xl mx-auto px-5 mb-16">
        <div className="border-t border-white/20 pt-16">
          <h3 className="text-2xl text-white font-bold tracking-widest mb-8 text-center text-gradient-gold">
            {t("shopdetail.addon_title")}
          </h3>
          <Link to="/shop/t-shirt" className="group flex flex-col sm:flex-row bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-gold-end/40 hover:bg-white/10 transition-all shadow-xl max-w-2xl mx-auto items-center">
            <div className="w-full sm:w-[200px] aspect-square shrink-0 bg-black/20 overflow-hidden relative">
              <img src="https://i.ibb.co/Q3g3HyLQ/IMG-0525.jpg" alt="飛越獨角獸T恤" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6 flex-1 text-center sm:text-left flex flex-col justify-center w-full">
              <h4 className="text-xl text-white font-bold mb-2 tracking-widest font-en">
                {t("shopdetail.addon_shirt_title")}
              </h4>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-2">
                {t("shopdetail.addon_shirt_desc")}
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-4 mb-4">
                <span className="text-gold-end font-bold text-xl">NT$ 1280</span>
                <span className="text-gray-500 line-through text-sm">NT$ 1680</span>
                <span className="px-2 py-0.5 bg-gold-end text-black text-xs font-bold rounded">
                  {t("shopdetail.addon_shirt_badge")}
                </span>
              </div>
              <span className="inline-block border border-gold-end text-gold-end px-6 py-2 tracking-widest rounded-md text-sm group-hover:bg-gold-end group-hover:text-black transition-colors w-max mx-auto sm:mx-0">
                {t("shopdetail.addon_shirt_btn")}
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* 退換貨須知 */}
      <ReturnPolicySection className="pb-16" />
    </div>
  );
}
