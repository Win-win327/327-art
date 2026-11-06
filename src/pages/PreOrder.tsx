import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import OptimizedImage from "../components/OptimizedImage";
import { useLanguage } from "../context/LanguageContext";
import ReturnPolicySection from "../components/common/ReturnPolicySection";

const PREORDER_ITEMS = [
  {
    id: "po-1",
    nameZh: "潑彩大嘴鳥T恤",
    image: "https://i.ibb.co/YBMhxtr4/IMG-0517.jpg",
    currentOrders: 0,
    targetOrders: 15
  },
  {
    id: "po-2",
    nameZh: "潑彩小貓T恤",
    image: "https://i.ibb.co/0jzqFCK4/IMG-0514.jpg",
    currentOrders: 0,
    targetOrders: 15
  }
];

export default function PreOrder() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<Record<string, number>>({
    "po-1": 0,
    "po-2": 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchAllStats = async () => {
      try {
        const statsMap: Record<string, number> = { "po-1": 0, "po-2": 0 };
        for (const item of PREORDER_ITEMS) {
          const statsRef = doc(db, "preOrderStats", item.id);
          const statsSnap = await getDoc(statsRef);
          if (statsSnap.exists()) {
            statsMap[item.id] = statsSnap.data().currentOrders || 0;
          }
        }
        setStats(statsMap);
      } catch (err) {
        console.error("Error fetching preOrderStats:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllStats();
  }, []);

  const getItemTitle = (id: string, defaultName: string) => {
    if (id === "po-1") return t("preorder_detail.toucan_title", defaultName);
    if (id === "po-2") return t("preorder_detail.cat_title", defaultName);
    return defaultName;
  };

  return (
    <div className="relative z-10 max-w-4xl justify-center mx-auto pt-[150px] pb-[100px] px-5 w-full flex flex-col items-center">
      <div className="w-full mb-8">
        <Link to="/" className="inline-flex items-center text-gold-end hover:text-white transition-colors text-sm tracking-widest">
          <ChevronLeft size={16} className="mr-1" /> {t("preorder.back_home")}
        </Link>
      </div>
      
      <h1 className="text-center text-4xl mb-[40px] tracking-widest font-bold text-gradient-gold drop-shadow-md">
        {t("preorder.title")}
      </h1>
      
      <div className="text-left leading-[2.5] tracking-[4px] mb-10 text-gray-100 max-w-2xl mx-auto">
        <p className="mb-6">{t("preorder.intro1")}</p>
        <p className="mb-6">{t("preorder.intro2")}</p>
        <p className="mb-6">{t("preorder.intro3")}</p>
        <p className="mb-6">{t("preorder.intro4")}</p>
      </div>

      <div className="w-full grid grid-cols-2 gap-4 md:gap-8 mt-4">
        {PREORDER_ITEMS.map((item) => {
          const itemTitle = getItemTitle(item.id, item.nameZh);
          return (
            <div key={item.id} className="bg-black/40 border border-white/20 rounded-lg overflow-hidden shadow-xl flex flex-col">
              <div className="aspect-square bg-white/5 relative">
                <OptimizedImage 
                  src={item.image} 
                  alt={itemTitle} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  wrapperClassName="w-full h-full"
                />
                <div className="absolute top-2 right-2 bg-black/80 text-gold-end text-xs tracking-widest px-2 py-1 rounded">
                  {t("preorder.badge_goal")}
                </div>
              </div>
              <div className="p-4 md:p-6 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-white font-bold tracking-widest mb-2 text-sm md:text-lg">{itemTitle}</h3>
                  <div className="mb-4 bg-white/5 p-3 rounded-lg border border-white/10 w-full mt-3">
                    <div className="flex justify-between items-end mb-2 text-xs font-semibold">
                      <span className="text-gray-300">
                        {t("preorder.current_prefix")} <span className="text-white font-bold text-sm md:text-base">{isLoading ? t("preorder.loading") : stats[item.id]}</span> {t("preorder.current_unit")}
                      </span>
                      <span className="text-gray-500">{t("preorder.target_prefix")} {item.targetOrders} {t("preorder.current_unit")}</span>
                    </div>
                    <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                      <div 
                        className="bg-gold-end h-full rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(100, (isLoading ? 0 : (stats[item.id] / item.targetOrders) * 100))}%` }}
                      />
                    </div>
                  </div>
                </div>
                <Link 
                  to={`/pre-order/${item.id}`}
                  className="w-full bg-transparent border border-gold-end px-4 py-2 block text-center text-gold-end hover:bg-gold-end hover:text-black transition-colors tracking-widest text-sm md:text-base font-bold rounded"
                >
                  {t("preorder.btn")}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* 退換貨須知 */}
      <ReturnPolicySection className="mt-16 w-full" />
    </div>
  );
}
