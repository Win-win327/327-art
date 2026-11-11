import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft, Minus, Plus, ShoppingBag, Clock, MessageCircle, CheckCircle, X, AlertCircle } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import OptimizedImage from "../components/OptimizedImage";
import ReturnPolicySection from "../components/common/ReturnPolicySection";

const productData = {
  id: "shirt-unicorn",
  price: 1280,
  originalPrice: 1680,
  sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  images: [
    "/images/IMG-0525.jpg",
    "/images/IMG-0524.jpg",
    "/images/IMG-0526.jpg"
  ]
};

const sizeChartData = [
  { size: "XS", length: 65, chest: 46, shoulder: 42, sleeve: 17, height: "155-160", weight: "40-50" },
  { size: "S", length: 67, chest: 48, shoulder: 43, sleeve: 19, height: "160-165", weight: "50-60" },
  { size: "M", length: 70, chest: 51, shoulder: 44, sleeve: 20, height: "165-170", weight: "60-70" },
  { size: "L", length: 72, chest: 53, shoulder: 46, sleeve: 21, height: "170-175", weight: "70-80" },
  { size: "XL", length: 74, chest: 56, shoulder: 48, sleeve: 22, height: "175-180", weight: "80-90" },
  { size: "XXL", length: 76, chest: 59, shoulder: 50, sleeve: 23, height: "180-185", weight: "90-100" },
];

export default function ShirtDetail() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveImg((prev) => (prev + 1) % productData.images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [activeImg]);

  const handlePrevImg = () => {
    setActiveImg((prev) => (prev === 0 ? productData.images.length - 1 : prev - 1));
  };

  const handleNextImg = () => {
    setActiveImg((prev) => (prev === productData.images.length - 1 ? 0 : prev + 1));
  };

  const productTitle = t("shirt.title", "飛越獨角獸T恤");

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart({
      id: `${productData.id}-${selectedSize}`,
      productId: productData.id,
      title: productTitle,
      titleEn: "Soaring Unicorn Art T-Shirt",
      titleJa: "翔るユニコーン アートTシャツ",
      price: productData.price,
      quantity,
      image: productData.images[0],
      size: selectedSize
    });
  };

  const handleBuyNow = () => {
    if (!selectedSize) return;
    handleAddToCart();
    navigate("/cart");
  };

  const features = [
    t("shirt.feat1"),
    t("shirt.feat2"),
    t("shirt.feat3"),
    t("shirt.feat4"),
  ];

  return (
    <div className="relative z-10 max-w-7xl mx-auto pt-[120px] md:pt-[150px] pb-[80px] px-5 w-full">
      <div className="flex flex-col md:flex-row gap-12 lg:gap-20 items-center mb-[100px]">
        {/* Left: Gallery */}
        <div className="flex-[1.2] w-full overflow-hidden">
          {/* Main Image */}
          <div className="w-full relative shadow-2xl overflow-hidden border border-white/10 aspect-square group rounded-md">
            <OptimizedImage 
              src={productData.images[activeImg]} 
              alt={`${productTitle} - Image ${activeImg + 1}`} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              wrapperClassName="w-full h-full"
            />
            {/* Mobile/Tablet Arrow Controls */}
            <div className="absolute inset-0 flex justify-between items-center px-4 opacity-0 group-hover:opacity-100 transition-opacity md:hidden">
              <button onClick={handlePrevImg} className="p-2 bg-black/50 text-gold-end rounded-full backdrop-blur-sm border border-gold-end/30 cursor-pointer">
                <ChevronLeft size={24} />
              </button>
              <button onClick={handleNextImg} className="p-2 bg-black/50 text-gold-end rounded-full backdrop-blur-sm border border-gold-end/30 cursor-pointer">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide w-full mt-5">
            {productData.images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImg(idx)}
                className={`flex-shrink-0 w-[80px] aspect-[3/4] rounded-md overflow-hidden border-2 transition-all duration-300 cursor-pointer ${activeImg === idx ? 'border-gold-end opacity-100' : 'border-transparent opacity-50 hover:opacity-80'}`}
              >
                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-6 border-b border-white/10 pb-6">
            <p className="text-gold-end tracking-[3px] text-sm font-semibold mb-2 uppercase">{t("shirt.limited_tag")}</p>
            <h1 className="text-3xl md:text-4xl font-bold text-gradient-white-gold drop-shadow-md mb-4 break-keep">{productTitle}</h1>
            <div className="flex items-center gap-4">
              <span className="text-2xl md:text-3xl font-bold text-white">NT$ {productData.price}</span>
              <span className="text-lg text-gray-500 line-through">NT$ {productData.originalPrice}</span>
              <span className="px-2 py-1 bg-gold-end text-black text-xs font-bold rounded">{t("shirt.preorder_badge")}</span>
            </div>

            {/* 1 Month Lead Time Notice Card */}
            <div className="mt-5 p-4 rounded-xl bg-gold-end/10 border border-gold-end/30 flex items-start gap-3">
              <Clock className="w-5 h-5 text-gold-end shrink-0 mt-0.5" />
              <div>
                <h4 className="text-gold-end font-bold text-sm tracking-wider mb-1">
                  {t("shirt.lead_time_title", "✦ 預購訂製款・製作時間約需 1 個月")}
                </h4>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                  {t("shirt.lead_time_desc", "本件 T 恤為 327 ART 限量預購訂製品，每件皆需經過精細高解析度印花工藝獨立製作，製作週期約需 1 個月，完工後將立即依下單順序包裝出貨。感謝您的耐心等待與支持！")}
                </p>
              </div>
            </div>
          </div>

          {/* Size Selector */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-300 tracking-widest font-semibold text-sm">{t("shirt.size_label")}</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {productData.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 rounded border font-en text-lg transition-all duration-300 cursor-pointer 
                    ${selectedSize === size 
                      ? 'bg-gold-end text-black border-gold-end font-bold shadow-[0_0_15px_rgba(255,215,0,0.3)]' 
                      : 'bg-transparent text-white border-white/20 hover:border-gold-end/60'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {!selectedSize && (
              <p className="text-red-400 text-xs mt-2 opacity-80">{t("shirt.please_select_size")}</p>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="mb-8">
            <span className="text-gray-300 tracking-widest font-semibold text-sm block mb-3">{t("shirt.qty_label")}</span>
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
          <div className="flex flex-col gap-3 mb-10">
            <button 
              onClick={handleAddToCart}
              className={`w-full py-4 rounded font-bold tracking-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer
                ${selectedSize 
                  ? 'bg-gold-end text-black hover:bg-yellow-400 shadow-lg' 
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              disabled={!selectedSize}
            >
              <ShoppingBag size={20} />
              {selectedSize ? t("shirt.add_cart_btn") : t("shirt.select_size_first")}
            </button>
            <button 
              onClick={handleBuyNow}
              className={`w-full py-4 rounded border font-bold tracking-[2px] transition-all cursor-pointer
                ${selectedSize 
                  ? 'border-gold-end text-gold-end hover:bg-gold-end/10' 
                  : 'border-gray-600 text-gray-500 cursor-not-allowed'
                }`}
              disabled={!selectedSize}
            >
              {t("shirt.buy_now_btn")}
            </button>
          </div>
        </div>
      </div>

      {/* Content Blocks: Description Section */}
      <div className="max-w-5xl mx-auto mb-[100px] px-5">
        <div className="prose prose-invert max-w-none text-gray-300">
          <h3 className="text-white text-3xl mb-10 pb-4 border-b border-white/15 text-center text-gradient-white-gold drop-shadow-sm tracking-[4px]">
            {t("shirt.story_title")}
          </h3>
          <p className="leading-relaxed mb-12 text-center text-lg">
            {t("shirt.desc")}
          </p>
          
          <h3 className="text-white text-3xl mb-10 pb-4 border-b border-white/15 text-center text-gradient-white-gold drop-shadow-sm tracking-[4px]">
            {t("shirt.guide_title")}
          </h3>
          <div className="overflow-x-auto custom-scrollbar bg-black/20 rounded border border-white/10 mb-2">
            <table className="w-full text-center border-collapse text-xs sm:text-sm min-w-[500px]">
              <thead>
                <tr className="bg-gold-end/10 text-gold-end border-b border-gold-end/30">
                  <th className="py-3 px-2 font-semibold tracking-widest whitespace-nowrap">{t("size_chart.size")}</th>
                  <th className="py-3 px-2 font-semibold tracking-widest whitespace-nowrap">{t("size_chart.length")}</th>
                  <th className="py-3 px-2 font-semibold tracking-widest whitespace-nowrap">{t("size_chart.chest")}</th>
                  <th className="py-3 px-2 font-semibold tracking-widest whitespace-nowrap">{t("size_chart.shoulder")}</th>
                  <th className="py-3 px-2 font-semibold tracking-widest whitespace-nowrap">{t("size_chart.sleeve")}</th>
                  <th className="py-3 px-2 font-semibold tracking-widest whitespace-nowrap">{t("size_chart.height")}</th>
                  <th className="py-3 px-2 font-semibold tracking-widest whitespace-nowrap">{t("size_chart.weight")}</th>
                </tr>
              </thead>
              <tbody className="text-gray-200">
                {sizeChartData.map((row, idx) => (
                  <tr key={idx} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2 font-en font-bold text-white/90 text-sm sm:text-base">{row.size}</td>
                    <td className="py-3 px-2">{row.length}</td>
                    <td className="py-3 px-2">{row.chest}</td>
                    <td className="py-3 px-2">{row.shoulder}</td>
                    <td className="py-3 px-2">{row.sleeve}</td>
                    <td className="py-3 px-2 text-gray-400">{row.height}</td>
                    <td className="py-3 px-2 text-gray-400">{row.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mb-12 text-sm text-gray-400 space-y-1 text-center">
            <p className="tracking-widest">{t("shirt.guide_note1")}</p>
            <p className="tracking-widest">{t("shirt.guide_note2")}</p>
          </div>

          <h3 className="text-white text-3xl mb-10 pb-4 border-b border-white/15 text-center text-gradient-white-gold drop-shadow-sm tracking-[4px]">
            {t("shirt.features_title")}
          </h3>
          <div className="flex justify-center mb-12">
            <ul className="list-disc pl-5 space-y-3 text-lg">
              {features.map((feature, idx) => (
                <li key={idx} className="leading-relaxed">{feature}</li>
              ))}
            </ul>
          </div>

          {/* Shipping Notice Section (Matching Features section title & body text styling) */}
          <h3 className="text-white text-3xl mb-10 pb-4 border-b border-white/15 text-center text-gradient-white-gold drop-shadow-sm tracking-[4px]">
            {t("shirt.shipping_section_title", "出貨說明")}
          </h3>
          <p className="leading-relaxed mb-12 text-center text-lg text-gray-300 max-w-2xl mx-auto">
            {t("shirt.shipping_note_desc", "本商品為預購訂製款，製作時間約需 1 個月。下單確認後即安排專屬印製與細緻裁製，製作完成後將立即依訂單順序為您寄出。")}
          </p>

          <div className="bg-white/5 p-6 rounded-md border border-white/10 text-sm leading-relaxed text-gray-400 mt-6 max-w-3xl mx-auto">
            <p><span className="text-gray-200 font-semibold mb-1 block">{t("shirt.wash_note_title")}</span>{t("shirt.wash_note_desc")}</p>
          </div>
        </div>
      </div>

      {/* Add-on product */}
      <div className="max-w-4xl mx-auto px-5 mb-[100px]">
        <div className="border-t border-white/20 pt-16">
          <h3 className="text-2xl text-white font-bold tracking-widest mb-8 text-center text-gradient-gold">
            {t("shirt.addon_title")}
          </h3>
          <Link to="/shop/magic-cards" className="group flex flex-col sm:flex-row bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-gold-end/40 hover:bg-white/10 transition-all shadow-xl max-w-2xl mx-auto items-center">
            <div className="w-full sm:w-[200px] aspect-square shrink-0 bg-black/20 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-black/60 to-transparent z-10 pointer-events-none" />
              <img src="/images/card-01.jpg" alt="極光動物魔法卡" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6 flex-1 text-center sm:text-left flex flex-col justify-center w-full">
              <h4 className="text-xl text-white font-bold mb-2 tracking-widest font-en">
                {t("shirt.addon_cards_title")}<br/><span className="text-sm font-normal text-gray-300">{t("shirt.addon_cards_badge")}</span>
              </h4>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-2">
                {t("shirt.addon_cards_desc")}
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-4 mb-4">
                <span className="text-gold-end font-bold text-xl">NT$ 1280</span>
              </div>
              <span className="inline-block border border-gold-end text-gold-end px-6 py-2 tracking-widest rounded-md text-sm group-hover:bg-gold-end group-hover:text-black transition-colors w-max mx-auto sm:mx-0">
                {t("shirt.view_item")}
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
