import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isOwnerDevice, setIsOwnerDevice] = useState(false);
  const clickCountRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if current device is owner's device
    const checkOwner = () => {
      const isOwner = localStorage.getItem("327art_admin_device") === "true";
      setIsOwnerDevice(isOwner);
    };
    checkOwner();

    // Listen to storage changes in case of login in another tab
    window.addEventListener("storage", checkOwner);
    return () => window.removeEventListener("storage", checkOwner);
  }, []);

  // Secret shortcut: Triple-clicking the copyright text takes you directly to /admin
  const handleSecretTrigger = () => {
    clickCountRef.current += 1;
    if (timerRef.current) clearTimeout(timerRef.current);

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      navigate("/admin");
    } else {
      timerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 1500);
    }
  };

  return (
    <footer className="p-[60px] md:p-[80px] text-center relative z-10 text-sm tracking-widest select-none">
      <p 
        onClick={handleSecretTrigger} 
        className="opacity-50 text-slate-400 cursor-default transition-opacity hover:opacity-75"
        title=""
      >
        {t("footer.rights")}
      </p>

      {/* Only visible on the owner's authenticated device; completely hidden from public visitors */}
      {isOwnerDevice && (
        <div className="mt-4 flex justify-center">
          <Link 
            to="/admin" 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] bg-slate-900/90 border border-amber-500/30 text-amber-300/80 hover:text-amber-300 hover:border-amber-400/60 transition-all shadow-sm"
            title="327 ART 管理員後台（僅在此裝置顯示）"
          >
            <span>⚙️</span>
            <span>後台管理 (僅您可見)</span>
          </Link>
        </div>
      )}
    </footer>
  );
}
