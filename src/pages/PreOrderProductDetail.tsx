import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight, ChevronLeft, Minus, Plus, Loader2, MessageCircle, CheckCircle2, Clock, Globe, Mail } from "lucide-react";
import { submitPreOrder, db } from "../lib/firebase";
import { doc, getDoc, setDoc, increment } from "firebase/firestore";
import OptimizedImage from "../components/OptimizedImage";
import { useLanguage } from "../context/LanguageContext";
import ReturnPolicySection from "../components/common/ReturnPolicySection";

interface PreOrderProduct {
  id: string;
  titleKey: string;
  defaultTitle: string;
  price: number;
  originalPrice: number;
  descKey: string;
  defaultDesc: string;
  sizes: string[];
  targetOrders: number;
  images: string[];
}

const PREORDER_DATA: Record<string, PreOrderProduct> = {
  "po-1": {
    id: "po-1",
    titleKey: "preorder_detail.toucan_title",
    defaultTitle: "潑彩大嘴鳥T恤",
    price: 1280,
    originalPrice: 1680,
    descKey: "preorder_detail.toucan_desc",
    defaultDesc: "將奇蹟穿在身上。這款藝術聯名衫選用頂級純棉材質，透氣舒適，印有 327 的經典畫作，將藝術的能量與你的日常生活完美結合。無論是日常穿搭或是休閒運動，都能展現你不凡的品味。",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    targetOrders: 15,
    images: [
      "/images/IMG-0517.jpg",
      "/images/IMG-0518.jpg",
      "/images/IMG-0520.jpg",
      "/images/toucan-art-cutout.jpg",
      "/images/IMG-0521.jpg"
    ]
  },
  "po-2": {
    id: "po-2",
    titleKey: "preorder_detail.cat_title",
    defaultTitle: "潑彩小貓T恤",
    price: 1280,
    originalPrice: 1680,
    descKey: "preorder_detail.cat_desc",
    defaultDesc: "舒適保暖的長袖衛衣，星空圖案陪伴你度過每一個特別的夜晚。",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    targetOrders: 15,
    images: [
      "/images/IMG-0514.jpg",
      "/images/IMG-0516.jpg",
      "/images/IMG-0515.jpg"
    ]
  }
};

const sizeChartData = [
  { size: "XS", length: 65, chest: 46, shoulder: 42, sleeve: 17, height: "155-160", weight: "40-50" },
  { size: "S", length: 67, chest: 48, shoulder: 43, sleeve: 19, height: "160-165", weight: "50-60" },
  { size: "M", length: 70, chest: 51, shoulder: 44, sleeve: 20, height: "165-170", weight: "60-70" },
  { size: "L", length: 72, chest: 53, shoulder: 46, sleeve: 21, height: "170-175", weight: "70-80" },
  { size: "XL", length: 74, chest: 56, shoulder: 48, sleeve: 22, height: "175-180", weight: "80-90" },
  { size: "XXL", length: 76, chest: 59, shoulder: 50, sleeve: 23, height: "180-185", weight: "90-100" },
];

export default function PreOrderProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = id ? PREORDER_DATA[id] : null;
  const { t } = useLanguage();

  const [activeImg, setActiveImg] = useState(0);
  const [selectedSizesAndQtys, setSelectedSizesAndQtys] = useState<Record<string, number>>({
    XS: 0,
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
    XXL: 0,
  });

  const [currentOrders, setCurrentOrders] = useState<number>(0);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  // Form states
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!product) return;
    
    const fetchCurrentOrders = async () => {
      try {
        const statsRef = doc(db, "preOrderStats", product.id);
        const statsSnap = await getDoc(statsRef);
        if (statsSnap.exists()) {
          setCurrentOrders(statsSnap.data().currentOrders || 0);
        } else {
          setCurrentOrders(0);
        }
      } catch (err) {
        console.error("Error fetching preOrderStats:", err);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    fetchCurrentOrders();
  }, [product]);

  useEffect(() => {
    if (!product || product.images.length <= 1) return;
    const timer = setInterval(() => {
      setActiveImg((prev) => (prev + 1) % product.images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [activeImg, product]);

  if (!product) {
    return (
      <div className="text-white text-center pt-32 min-h-[50vh] flex flex-col items-center justify-center">
        <p className="text-xl mb-4">{t("preorder_detail.not_found")}</p>
        <Link to="/pre-order" className="text-gold-end underline tracking-widest">{t("preorder_detail.back")}</Link>
      </div>
    );
  }

  const productTitle = t(product.titleKey, product.defaultTitle);

  const handlePrevImg = () => {
    setActiveImg((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleNextImg = () => {
    setActiveImg((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  const totalQuantity = (Object.values(selectedSizesAndQtys) as number[]).reduce((sum, qty) => sum + qty, 0);

  const handleUpdateQty = (size: string, diff: number) => {
    setSelectedSizesAndQtys((prev) => ({
      ...prev,
      [size]: Math.max(0, (prev[size] || 0) + diff),
    }));
  };

  const handlePreOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totalQuantity <= 0) {
      setErrorMsg(t("preorder_detail.err_select_item"));
      return;
    }
    
    setIsSubmitting(true);
    setErrorMsg("");
    
    try {
      const wantedSizesText = (Object.entries(selectedSizesAndQtys) as [string, number][])
        .filter(([_, qty]) => qty > 0)
        .map(([size, qty]) => `${size} x ${qty}`)
        .join(", ");

      const statsRef = doc(db, "preOrderStats", product.id);

      await submitPreOrder({
        customerName,
        customerEmail,
        itemType: product.defaultTitle,
        wantedSize: wantedSizesText,
        selections: selectedSizesAndQtys,
        totalQuantity: totalQuantity,
        message
      });

      // Atomic update
      await setDoc(statsRef, {
        currentOrders: increment(totalQuantity)
      }, { merge: true });

      // Live increment
      setCurrentOrders((prev) => prev + totalQuantity);

      setIsSuccess(true);
      setCustomerName("");
      setCustomerEmail("");
      setMessage("");
      setSelectedSizesAndQtys({
        XS: 0,
        S: 0,
        M: 0,
        L: 0,
        XL: 0,
        XXL: 0,
      });
    } catch (error) {
      console.error(error);
      setErrorMsg(t("preorder_detail.err_failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative z-10 max-w-7xl mx-auto pt-[120px] md:pt-[150px] pb-[80px] px-5 w-full">
      <div className="mb-6">
        <Link to="/pre-order" className="inline-flex items-center text-gold-end hover:text-white transition-colors text-lg md:text-xl tracking-widest font-bold">
          <ChevronLeft size={24} className="mr-1" /> {t("preorder_detail.back")}
        </Link>
      </div>
      <div className="flex flex-col lg:flex-row gap-[60px] mb-[100px]">
        {/* Left: Gallery */}
        <div className="flex-[1.2] overflow-hidden">
          {/* Main Image */}
          <div className="w-full relative shadow-2xl overflow-hidden border border-white/10 aspect-square group rounded-md">
            <OptimizedImage 
              src={product.images[activeImg]} 
              alt={`${productTitle} - Image ${activeImg + 1}`} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              wrapperClassName="w-full h-full"
            />
            {/* Mobile/Tablet Arrow Controls */}
            {product.images.length > 1 && (
              <div className="absolute inset-0 flex justify-between items-center px-4 opacity-0 group-hover:opacity-100 transition-opacity md:hidden">
                <button onClick={handlePrevImg} className="p-2 bg-black/50 text-gold-end rounded-full backdrop-blur-sm border border-gold-end/30">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={handleNextImg} className="p-2 bg-black/50 text-gold-end rounded-full backdrop-blur-sm border border-gold-end/30">
                  <ChevronRight size={24} />
                </button>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide w-full mt-5">
              {product.images.map((img: string, idx: number) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImg(idx)}
                  className={`flex-shrink-0 w-[80px] aspect-[3/4] rounded-md overflow-hidden border-2 transition-all duration-300 ${activeImg === idx ? 'border-gold-end opacity-100' : 'border-transparent opacity-50 hover:opacity-80'}`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info & PreOrder Form */}
        <div className="flex-1 flex flex-col justify-start">
          <div className="mb-8 border-b border-white/10 pb-6">
            <p className="text-gold-end tracking-[3px] text-lg md:text-xl font-semibold mb-2 uppercase">{t("preorder_detail.exclusive_badge")}</p>
            <h1 className="text-4xl md:text-5xl font-bold text-gradient-white-gold drop-shadow-md mb-4 break-keep">{productTitle}</h1>
            
            <div className="mb-6 bg-white/5 p-4 rounded-lg border border-white/10">
              <div className="flex justify-between items-end mb-2">
                <span className="text-gray-300 text-sm md:text-base">
                  {t("preorder.current_prefix")}：<span className="text-white font-bold text-xl">{isLoadingOrders ? t("preorder.loading") : currentOrders}</span> {t("preorder.current_unit")}
                </span>
                <span className="text-gray-500 text-xs md:text-sm">{t("preorder_detail.target_threshold")}{product.targetOrders} {t("preorder.current_unit")}</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gold-end h-full rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, (isLoadingOrders ? 0 : (currentOrders / product.targetOrders) * 100))}%` }}
                />
              </div>
              {!isLoadingOrders && currentOrders < product.targetOrders ? (
                <p className="text-gold-end/80 text-xs md:text-sm mt-3 tracking-wider text-right">
                  {t("preorder_detail.need_more_prefix")}{product.targetOrders - currentOrders}{t("preorder_detail.need_more_suffix")}
                </p>
              ) : !isLoadingOrders ? (
                <p className="text-green-400/80 text-xs md:text-sm mt-3 tracking-wider text-right">
                  {t("preorder_detail.reached_goal")}
                </p>
              ) : null}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl md:text-4xl font-bold text-white">NT$ {product.price}</span>
              <span className="text-xl md:text-2xl text-gray-400 line-through">NT$ {product.originalPrice}</span>
            </div>
          </div>

          {/* PreOrder Form wrapping Size Selector */}
          <div className="w-full bg-black/40 border border-white/20 p-6 md:p-8 rounded-lg shadow-xl mb-10">
            <h2 className="text-2xl text-white font-bold mb-6 tracking-widest border-b border-white/10 pb-4">
              {t("preorder_detail.form_heading")}
            </h2>
            
            {isSuccess ? (
              <div className="text-center py-8 px-2 space-y-6">
                <CheckCircle2 className="w-16 h-16 text-gold-end mx-auto" />
                <div>
                  <p className="text-green-400 text-2xl tracking-widest font-bold">{t("preorder_detail.success_heading")}</p>
                  <p className="text-white mt-2 tracking-widest text-base md:text-lg">{t("preorder_detail.success_sub")}</p>
                </div>

                {/* Pre-order timeline notice */}
                <div className="bg-white/5 border border-gold-end/30 rounded-xl p-5 text-left max-w-lg mx-auto space-y-3">
                  <div className="flex items-center gap-2 text-gold-end font-bold text-base">
                    <Clock size={18} />
                    <span>衣服製作時間約需 1 個月</span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    本商品為專屬限量預購訂製，每件皆依訂購名單細緻印花製作，製作時間約需 1 個月，完成後將依序為您包裝寄出。
                  </p>
                  <div className="border-t border-white/10 pt-3">
                    <p className="text-xs text-gold-end mb-2">
                      ✦ 請務必加入 327 ART 官方 LINE，方便日後通知您製作排程與寄送狀態：
                    </p>
                    <a 
                      href="https://lin.ee/o8qHjzS" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#06C755] hover:bg-[#05b34c] text-white font-bold rounded-lg transition-colors text-sm tracking-widest shadow-lg cursor-pointer mb-3"
                    >
                      <MessageCircle size={18} />
                      加入 327 ART 官方 LINE（方便日後聯絡）
                    </a>

                    <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-400/20 text-xs text-gray-300 space-y-1">
                      <p className="text-blue-300 font-bold flex items-center gap-1.5">
                        <Globe size={14} /> 外國顧客若無 LINE：
                      </p>
                      <p>
                        製作進度與國際包裹追蹤號碼將主動以 Email 發送；亦可來信至 <a href="mailto:poweranimal2212@gmail.com" className="text-gold-end underline font-mono">poweranimal2212@gmail.com</a> 或私訊 IG <a href="https://www.instagram.com/win_power2000/" target="_blank" rel="noopener noreferrer" className="text-pink-300 underline font-mono">@win_power2000</a> 聯繫我們。
                      </p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setIsSuccess(false)}
                  className="mt-4 px-6 py-2 border border-gold-end text-gold-end hover:bg-gold-end hover:text-black transition-colors tracking-widest rounded text-base cursor-pointer"
                >
                  {t("preorder_detail.fill_another")}
                </button>
              </div>
            ) : (
              <form onSubmit={handlePreOrderSubmit} className="space-y-6">
                
                {/* Size Selector & Guide */}
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-white tracking-widest font-semibold text-lg md:text-xl">
                      {t("preorder_detail.size_qty_label")} <span className="text-gold-end">*</span>
                    </span>
                    <button 
                      type="button" 
                      onClick={() => setShowSizeGuide(!showSizeGuide)}
                      className="text-gold-end hover:text-yellow-400 text-base md:text-lg tracking-widest border-b border-gold-end/50 pb-0.5 transition-colors cursor-pointer"
                    >
                      {showSizeGuide ? t("preorder_detail.toggle_guide_hide") : t("preorder_detail.toggle_guide_show")}
                    </button>
                  </div>

                  <p className="text-gray-400 text-xs sm:text-sm mb-4 leading-relaxed">
                    {t("preorder_detail.size_tip")}
                  </p>

                  <div className="space-y-3 mb-6">
                    {product.sizes.map((size: string) => {
                      const qty = selectedSizesAndQtys[size] || 0;
                      const guide = sizeChartData.find((s) => s.size === size);
                      return (
                        <div 
                          key={size} 
                          className={`flex items-center justify-between p-3.5 border rounded-lg transition-all duration-300 
                            ${qty > 0 
                              ? "bg-gold-end/15 border-gold-end shadow-[0_0_12px_rgba(255,215,0,0.15)]" 
                              : "bg-transparent border-white/15 hover:border-white/30"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-en text-lg sm:text-xl font-bold text-white w-10 sm:w-12">{size}</span>
                            {guide && (
                              <span className="text-xs text-gray-400">
                                ({t("preorder_detail.rec_label")}{guide.height}cm / {guide.weight}kg)
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(size, -1)}
                              disabled={qty === 0}
                              className="p-1.5 bg-white/5 border border-white/15 rounded hover:border-gold-end text-white disabled:opacity-20 disabled:hover:border-white/10 transition-colors flex items-center justify-center w-8 h-8 cursor-pointer disabled:cursor-not-allowed"
                            >
                              <Minus size={14} />
                            </button>
                            <span className={`font-mono text-lg font-bold w-10 text-center ${qty > 0 ? "text-gold-end font-black" : "text-white/40"}`}>{qty}</span>
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(size, 1)}
                              className="p-1.5 bg-white/5 border border-white/15 rounded hover:border-gold-end text-white transition-colors flex items-center justify-center w-8 h-8 cursor-pointer"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {totalQuantity > 0 && (
                    <div className="bg-gold-end/5 border border-gold-end/30 rounded-lg p-4 mb-6">
                      <h4 className="text-white text-sm font-semibold tracking-wider mb-2">
                        {t("preorder_detail.selected_summary")}
                      </h4>
                      <ul className="space-y-1">
                        {(Object.entries(selectedSizesAndQtys) as [string, number][])
                          .filter(([_, qty]) => qty > 0)
                          .map(([size, qty]) => (
                            <li key={size} className="text-gold-end text-sm tracking-wide flex justify-between">
                              <span>• {size} {t("preorder_detail.size_code")}</span>
                              <span className="font-bold font-mono">{qty} {t("preorder.current_unit")}</span>
                            </li>
                          ))}
                      </ul>
                      <div className="border-t border-white/10 mt-3 pt-2 flex justify-between items-center">
                        <span className="text-gray-300 text-sm">{t("preorder_detail.total_label")}</span>
                        <span className="text-white font-bold text-base font-mono">{totalQuantity} {t("preorder.current_unit")}</span>
                      </div>
                    </div>
                  )}

                  {showSizeGuide && (
                    <div className="overflow-x-auto custom-scrollbar bg-black/40 rounded border border-white/10 mb-6">
                      <table className="w-full text-center border-collapse text-sm sm:text-base min-w-[500px]">
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
                        <tbody className="text-white">
                          {sizeChartData.map((row, idx) => (
                            <tr key={idx} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                              <td className="py-3 px-2 font-en font-bold text-white text-base sm:text-lg">{row.size}</td>
                              <td className="py-3 px-2">{row.length}</td>
                              <td className="py-3 px-2">{row.chest}</td>
                              <td className="py-3 px-2">{row.shoulder}</td>
                              <td className="py-3 px-2">{row.sleeve}</td>
                              <td className="py-3 px-2 text-white/80">{row.height}</td>
                              <td className="py-3 px-2 text-white/80">{row.weight}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-white text-base md:text-lg tracking-widest mb-2 ml-1">
                    {t("preorder_detail.name_label")} <span className="text-gold-end">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={customerName} 
                    onChange={(e) => setCustomerName(e.target.value)} 
                    required 
                    className="w-full bg-black/40 border border-white/20 rounded-md p-4 text-white text-lg focus:outline-none focus:border-gold-end transition-colors" 
                    placeholder={t("preorder_detail.name_ph")} 
                  />
                </div>
                <div>
                  <label className="block text-white text-base md:text-lg tracking-widest mb-2 ml-1">
                    {t("preorder_detail.email_label")} <span className="text-gold-end">*</span>
                  </label>
                  <input 
                    type="email" 
                    value={customerEmail} 
                    onChange={(e) => setCustomerEmail(e.target.value)} 
                    required 
                    className="w-full bg-black/40 border border-white/20 rounded-md p-4 text-white text-lg focus:outline-none focus:border-gold-end transition-colors" 
                    placeholder={t("preorder_detail.email_ph")} 
                  />
                </div>
                <div>
                  <label className="block text-white text-base md:text-lg tracking-widest mb-2 ml-1">
                    {t("preorder_detail.msg_label")}
                  </label>
                  <textarea 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    rows={3} 
                    className="w-full bg-black/40 border border-white/20 rounded-md p-4 text-white text-lg focus:outline-none focus:border-gold-end transition-colors resize-none" 
                    placeholder={t("preorder_detail.msg_ph")} 
                  />
                </div>
                
                {errorMsg && (
                  <p className="text-red-500 text-base md:text-lg tracking-widest">{errorMsg}</p>
                )}

                <button 
                  type="submit" 
                  disabled={isSubmitting || totalQuantity === 0}
                  className="w-full bg-gold-end text-black font-bold tracking-[2px] py-4 md:py-5 text-lg md:text-xl rounded hover:bg-yellow-400 transition-colors mt-4 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? <><Loader2 size={24} className="animate-spin" /> {t("preorder_detail.submitting")}</> : t("preorder_detail.submit_btn")}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Info Section (Pre-Order Process, FAQ, Shipping) */}
      <div className="max-w-4xl mx-auto space-y-16 border-t border-white/20 pt-16">
        
        {/* Pre-Order Process */}
        <section>
          <h2 className="text-3xl text-center text-white tracking-[4px] font-bold mb-10 border-b border-white/10 pb-4">
            {t("preorder_proc.title")}
          </h2>
          
          <div className="space-y-8 text-center text-white">
            <div>
              <h3 className="text-gold-end font-bold text-xl mb-2 tracking-widest">{t("preorder_proc.s1_title")}</h3>
              <p className="leading-relaxed text-lg md:text-xl whitespace-pre-line">{t("preorder_proc.s1_desc")}</p>
            </div>
            <div className="text-white font-bold text-2xl">↓</div>
            <div>
              <h3 className="text-gold-end font-bold text-xl mb-2 tracking-widest">{t("preorder_proc.s2_title")}</h3>
              <p className="leading-relaxed text-lg md:text-xl whitespace-pre-line">{t("preorder_proc.s2_desc")}</p>
            </div>
            <div className="text-white font-bold text-2xl">↓</div>
            <div>
              <h3 className="text-gold-end font-bold text-xl mb-2 tracking-widest">{t("preorder_proc.s3_title")}</h3>
              <p className="leading-relaxed text-lg md:text-xl mb-2">{t("preorder_proc.s3_desc1")}</p>
              <p className="leading-relaxed text-lg md:text-xl">{t("preorder_proc.s3_desc2")}</p>
            </div>
            <div className="text-white font-bold text-2xl">↓</div>
            <div>
              <h3 className="text-gold-end font-bold text-xl mb-2 tracking-widest">{t("preorder_proc.s4_title")}</h3>
              <p className="leading-relaxed text-lg md:text-xl">{t("preorder_proc.s4_desc")}</p>
            </div>
            <div className="text-white font-bold text-2xl">↓</div>
            <div>
              <h3 className="text-gold-end font-bold text-xl mb-2 tracking-widest">{t("preorder_proc.s5_title")}</h3>
              <p className="leading-relaxed text-lg md:text-xl whitespace-pre-line">{t("preorder_proc.s5_desc")}</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-3xl text-center text-white tracking-[4px] font-bold mb-10 border-b border-white/10 pb-4">
            {t("preorder_faq.title")}
          </h2>
          
          <div className="space-y-8 text-center text-white">
            <div>
              <h4 className="text-gold-end font-bold mb-3 tracking-widest text-lg md:text-xl">{t("preorder_faq.q1")}</h4>
              <p className="leading-relaxed text-lg md:text-xl whitespace-pre-line">{t("preorder_faq.a1")}</p>
            </div>
            <div className="w-16 h-px bg-white/40 mx-auto" />
            <div>
              <h4 className="text-gold-end font-bold mb-3 tracking-widest text-lg md:text-xl">{t("preorder_faq.q2")}</h4>
              <p className="leading-relaxed text-lg md:text-xl mb-2 whitespace-pre-line">{t("preorder_faq.a2")}</p>
            </div>
            <div className="w-16 h-px bg-white/40 mx-auto" />
            <div>
              <h4 className="text-gold-end font-bold mb-3 tracking-widest text-lg md:text-xl">{t("preorder_faq.q3")}</h4>
              <p className="leading-relaxed text-lg md:text-xl mb-2 whitespace-pre-line">{t("preorder_faq.a3")}</p>
            </div>
            <div className="w-16 h-px bg-white/40 mx-auto" />
            <div>
              <h4 className="text-gold-end font-bold mb-3 tracking-widest text-lg md:text-xl">{t("preorder_faq.q4")}</h4>
              <p className="leading-relaxed text-lg md:text-xl mb-2 whitespace-pre-line">{t("preorder_faq.a4")}</p>
            </div>
            <div className="w-16 h-px bg-white/40 mx-auto" />
            <div>
              <h4 className="text-gold-end font-bold mb-3 tracking-widest text-lg md:text-xl">{t("preorder_faq.q5")}</h4>
              <p className="leading-relaxed text-lg md:text-xl whitespace-pre-line">{t("preorder_faq.a5")}</p>
            </div>
            <div className="w-16 h-px bg-white/40 mx-auto" />
            <div>
              <h4 className="text-gold-end font-bold mb-3 tracking-widest text-lg md:text-xl">{t("preorder_faq.q6")}</h4>
              <p className="leading-relaxed text-lg md:text-xl whitespace-pre-line">{t("preorder_faq.a6")}</p>
            </div>
            <div className="w-16 h-px bg-white/40 mx-auto" />
            <div>
              <h4 className="text-gold-end font-bold mb-3 tracking-widest text-lg md:text-xl">{t("preorder_faq.q7")}</h4>
              <p className="leading-relaxed text-lg md:text-xl whitespace-pre-line">{t("preorder_faq.a7")}</p>
            </div>
            <div className="w-16 h-px bg-white/40 mx-auto" />
            <div>
              <h4 className="text-gold-end font-bold mb-3 tracking-widest text-lg md:text-xl">{t("preorder_faq.q8")}</h4>
              <p className="leading-relaxed text-lg md:text-xl whitespace-pre-line">{t("preorder_faq.a8")}</p>
            </div>
          </div>
        </section>

        {/* Shipping */}
        <section>
          <h2 className="text-3xl text-center text-white tracking-[4px] font-bold mb-10 border-b border-white/10 pb-4">
            {t("preorder_ship.title")}
          </h2>
          
          <div className="space-y-6 text-center text-white bg-white/5 p-8 md:p-12 rounded-lg border border-white/10">
            <p className="leading-relaxed text-lg md:text-xl">{t("preorder_ship.intro1")}</p>
            <p className="leading-relaxed text-lg md:text-xl">{t("preorder_ship.intro2")}</p>
            
            <div className="py-6">
              <h4 className="text-gold-end font-bold mb-2 tracking-widest text-xl">{t("preorder_ship.est_title")}</h4>
              <p className="text-2xl font-bold text-white mb-2 tracking-widest">{t("preorder_ship.est_time")}</p>
              <p className="text-base md:text-lg">{t("preorder_ship.est_sub")}</p>
            </div>

            <div className="text-lg md:text-xl leading-relaxed mb-6">
              <p className="mb-2">{t("preorder_ship.reasons_title")}</p>
              <ul className="list-inside space-y-1 mb-2">
                <li>{t("preorder_ship.r1")}</li>
                <li>{t("preorder_ship.r2")}</li>
                <li>{t("preorder_ship.r3")}</li>
                <li>{t("preorder_ship.r4")}</li>
              </ul>
              {t("preorder_ship.reasons_end") && <p>{t("preorder_ship.reasons_end")}</p>}
            </div>

            <div className="pt-6 border-t border-white/20 mt-8">
              <p className="leading-relaxed text-lg md:text-xl font-bold mb-6 whitespace-pre-line">{t("preorder_ship.delay")}</p>
              <p className="text-gold-end tracking-widest font-bold text-lg md:text-xl whitespace-pre-line">{t("preorder_ship.thanks")}</p>
            </div>
          </div>
        </section>

        {/* 退換貨須知 */}
        <ReturnPolicySection className="mt-16 w-full" />
      </div>

    </div>
  );
}
