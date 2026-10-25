import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  Settings, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  Save, 
  RotateCcw, 
  Copy, 
  ExternalLink, 
  Globe, 
  Eye, 
  Sparkles, 
  ArrowLeft,
  ShieldCheck,
  PackageCheck,
  HelpCircle,
  Languages
} from "lucide-react";
import { 
  getStoredSEOConfig, 
  saveSEOConfig, 
  resetSEOConfigToDefault, 
  SiteSEOConfig, 
  PageSEOMeta,
  DEFAULT_SEO_CONFIG
} from "../utils/seoConfig";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem("327art_admin_auth") === "true";
  });
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");
  
  const [activeTab, setActiveTab] = useState<"seo" | "preview" | "orders" | "help">("seo");
  const [editLang, setEditLang] = useState<"zh" | "en" | "ja">("zh");
  const [previewLang, setPreviewLang] = useState<"zh" | "en" | "ja">("zh");
  const [seoConfig, setSeoConfig] = useState<SiteSEOConfig>(() => getStoredSEOConfig());
  const [selectedPagePath, setSelectedPagePath] = useState<string>("/");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");
  const [copiedMsg, setCopiedMsg] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim().toLowerCase() === "327art" || passcode.trim() === "327" || passcode.trim() === "admin") {
      setIsAuthenticated(true);
      sessionStorage.setItem("327art_admin_auth", "true");
      localStorage.setItem("327art_admin_device", "true");
      setAuthError("");
    } else {
      setAuthError("密碼不正確，請輸入預設管理密碼：327art");
    }
  };

  const handleQuickUnlock = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem("327art_admin_auth", "true");
    localStorage.setItem("327art_admin_device", "true");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("327art_admin_auth");
  };

  const currentPage: PageSEOMeta = seoConfig.pages[selectedPagePath] || {
    id: "unknown",
    name: selectedPagePath,
    path: selectedPagePath,
    title: "",
    description: "",
    keywords: ""
  };

  const getActiveTitle = (lang = editLang) => {
    if (lang === "en") return currentPage.translations?.en?.title ?? currentPage.title;
    if (lang === "ja") return currentPage.translations?.ja?.title ?? currentPage.title;
    return currentPage.title;
  };

  const getActiveDescription = (lang = editLang) => {
    if (lang === "en") return currentPage.translations?.en?.description ?? currentPage.description;
    if (lang === "ja") return currentPage.translations?.ja?.description ?? currentPage.description;
    return currentPage.description;
  };

  const getActiveKeywords = (lang = editLang) => {
    if (lang === "en") return currentPage.translations?.en?.keywords ?? currentPage.keywords ?? "";
    if (lang === "ja") return currentPage.translations?.ja?.keywords ?? currentPage.keywords ?? "";
    return currentPage.keywords ?? "";
  };

  const handleLocalizedFieldChange = (field: "title" | "description" | "keywords", value: string) => {
    setSeoConfig((prev) => {
      const page = prev.pages[selectedPagePath];
      if (editLang === "zh") {
        return {
          ...prev,
          pages: {
            ...prev.pages,
            [selectedPagePath]: {
              ...page,
              [field]: value
            }
          }
        };
      }

      const translations = page.translations || {};
      const currentTarget = translations[editLang] || { title: "", description: "", keywords: "" };
      return {
        ...prev,
        pages: {
          ...prev.pages,
          [selectedPagePath]: {
            ...page,
            translations: {
              ...translations,
              [editLang]: {
                ...currentTarget,
                [field]: value
              }
            }
          }
        }
      };
    });
  };

  const handleVerificationChange = (val: string) => {
    setSeoConfig((prev) => ({
      ...prev,
      googleSiteVerification: val
    }));
  };

  const handleSave = () => {
    saveSEOConfig(seoConfig);
    setSaveSuccessMsg("SEO 設定已儲存成功！網站中、英、日三國語系的搜尋標籤已即時更新生效。");
    setTimeout(() => setSaveSuccessMsg(""), 4000);
  };

  const handleResetToGeminiDefaults = () => {
    if (window.confirm("確定要將所有頁面的中英日 SEO 設定恢復為最佳推薦預設值嗎？")) {
      const reset = resetSEOConfigToDefault();
      setSeoConfig(reset);
      setSaveSuccessMsg("已恢復為最佳推薦之中英日多語言 SEO 標題與描述！");
      setTimeout(() => setSaveSuccessMsg(""), 4000);
    }
  };

  const handleSyncChineseToForeign = () => {
    const defaultPage = DEFAULT_SEO_CONFIG.pages[selectedPagePath];
    if (defaultPage?.translations) {
      setSeoConfig((prev) => ({
        ...prev,
        pages: {
          ...prev.pages,
          [selectedPagePath]: {
            ...prev.pages[selectedPagePath],
            translations: {
              en: { ...defaultPage.translations?.en! },
              ja: { ...defaultPage.translations?.ja! }
            }
          }
        }
      }));
      setSaveSuccessMsg("已為此頁自動套用最佳英文與日文（包含「張景雯 Win」、「Aurora Magical Animal Cards」與「Oracle Cards / オラクルカード」）！");
      setTimeout(() => setSaveSuccessMsg(""), 4000);
    }
  };

  const handleCopyMetaTags = () => {
    const title = getActiveTitle();
    const desc = getActiveDescription();
    const kw = getActiveKeywords();
    const langLabel = editLang === "zh" ? "繁體中文" : editLang === "en" ? "English" : "日本語";

    const code = `<!-- 327 ART SEO Meta (${langLabel}) for ${currentPage.name} -->
<title>${title}</title>
<meta name="description" content="${desc}" />
${kw ? `<meta name="keywords" content="${kw}" />\n` : ""}<meta property="og:title" content="${title}" />
<meta property="og:description" content="${desc}" />
<meta property="og:url" content="https://327-art.com${currentPage.path === "/" ? "" : currentPage.path}" />`;

    navigator.clipboard.writeText(code);
    setCopiedMsg(`已複製【${langLabel}】HTML Meta 代碼到剪貼簿！`);
    setTimeout(() => setCopiedMsg(""), 3000);
  };

  // Google Breadcrumb generator
  const getGoogleBreadcrumb = (path: string, lang = "zh") => {
    const base = "https://327-art.com";
    if (path === "/") return base;
    return `${base} › ${path.replace(/^\//, "").replace(/\//g, " › ")}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center relative z-10">
        <div className="max-w-md w-full bg-slate-900/90 border border-slate-700/60 rounded-2xl p-8 backdrop-blur-xl shadow-2xl text-center">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-400">
            <Lock className="w-8 h-8" />
          </div>
          
          <h1 className="text-2xl font-serif text-white tracking-wider mb-2">327 ART 後台管理中心</h1>
          <p className="text-slate-400 text-sm mb-6">
            請輸入管理密碼以進入網站 SEO 與多語言搜尋營運系統
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="輸入密碼 (預設: 327art)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 transition-all text-center tracking-widest"
              />
            </div>

            {authError && (
              <p className="text-rose-400 text-xs text-left bg-rose-950/40 border border-rose-800/40 p-2.5 rounded-lg">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold rounded-xl tracking-wider transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98]"
            >
              登入管理後台
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <button 
              onClick={handleQuickUnlock}
              className="text-amber-400/80 hover:text-amber-300 underline underline-offset-4 flex items-center gap-1.5"
            >
              <Unlock className="w-3.5 h-3.5" /> 忘記密碼？一鍵以負責人身分登入
            </button>
            <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> 回網站首頁
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const pageKeys = Object.keys(seoConfig.pages);

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto relative z-10">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-serif text-white tracking-wider flex items-center gap-2">
              <Settings className="w-7 h-7 text-amber-400" />
              327 ART 網站後台管理
            </h1>
            <span className="text-xs px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-full flex items-center gap-1">
              <Languages className="w-3.5 h-3.5" /> 中／英／日 多語言 SEO
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            自訂台灣、歐美海外與日本 Google 搜尋標題、Meta 描述摘要、關鍵字詞與即時模擬
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            target="_blank"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-sm transition-colors flex items-center gap-2 border border-slate-700"
          >
            <ExternalLink className="w-4 h-4" /> 預覽網站前台
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-red-200 border border-red-800/40 rounded-lg text-sm transition-colors"
          >
            登出
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800 max-w-fit">
        <button
          onClick={() => setActiveTab("seo")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === "seo"
              ? "bg-amber-500 text-slate-950 shadow-md font-semibold"
              : "text-slate-400 hover:text-white hover:bg-slate-800/50"
          }`}
        >
          <Search className="w-4 h-4" /> SEO 多語言設定與 Google 模擬
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === "preview"
              ? "bg-amber-500 text-slate-950 shadow-md font-semibold"
              : "text-slate-400 hover:text-white hover:bg-slate-800/50"
          }`}
        >
          <Eye className="w-4 h-4" /> 全站 Google 搜尋結果總覽
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === "orders"
              ? "bg-amber-500 text-slate-950 shadow-md font-semibold"
              : "text-slate-400 hover:text-white hover:bg-slate-800/50"
          }`}
        >
          <PackageCheck className="w-4 h-4" /> 訂單與許願池管理
        </button>
        <button
          onClick={() => setActiveTab("help")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === "help"
              ? "bg-amber-500 text-slate-950 shadow-md font-semibold"
              : "text-slate-400 hover:text-white hover:bg-slate-800/50"
          }`}
        >
          <HelpCircle className="w-4 h-4" /> 跨國海外 SEO 策略指南
        </button>
      </div>

      {/* Alert toast message */}
      {saveSuccessMsg && (
        <div className="mb-6 p-4 bg-emerald-950/70 border border-emerald-500/40 rounded-xl text-emerald-200 text-sm flex items-center justify-between shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button 
            onClick={() => setSaveSuccessMsg("")}
            className="text-emerald-400 hover:text-emerald-200 text-xs px-2 py-1"
          >
            關閉
          </button>
        </div>
      )}

      {copiedMsg && (
        <div className="mb-6 p-3 bg-amber-950/70 border border-amber-500/40 rounded-xl text-amber-200 text-sm flex items-center gap-2 shadow-lg">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{copiedMsg}</span>
        </div>
      )}

      {/* TAB 1: SEO Management */}
      {activeTab === "seo" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Page Selector & Global Settings */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Status Box */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
              <h2 className="text-white text-base font-semibold flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                全站 SEO 狀態監控
              </h2>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">支援語系</span>
                  <span className="text-amber-300 font-medium">中文 (ZH) / 英文 (EN) / 日文 (JA)</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">已優化分頁</span>
                  <span className="text-white font-medium">{pageKeys.length} 個主要頁面</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Sitemap 索引地圖</span>
                  <a 
                    href="/sitemap.xml" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-amber-400 hover:underline flex items-center gap-1 font-mono"
                  >
                    /sitemap.xml <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">爬蟲設定 (robots.txt)</span>
                  <a 
                    href="/robots.txt" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-amber-400 hover:underline flex items-center gap-1 font-mono"
                  >
                    /robots.txt <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-slate-400">Schema 結構化資料</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 已啟動 (Organization/Product)
                  </span>
                </div>
              </div>
            </div>

            {/* Google Search Console Verification code setting */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
              <h2 className="text-white text-sm font-semibold flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-blue-400" />
                Google Search Console 驗證碼
              </h2>
              <p className="text-slate-400 text-xs mb-3 leading-relaxed">
                若 Google 提示您使用「HTML 標記」驗證網站所有權，請將整段代碼或 content 貼在下方：
              </p>
              <input
                type="text"
                placeholder='例如：google-site-verification 或整段 <meta... />'
                value={seoConfig.googleSiteVerification}
                onChange={(e) => handleVerificationChange(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-mono placeholder-slate-600 focus:outline-none focus:border-amber-400"
              />
              <div className="flex justify-between items-center mt-2 text-[11px] text-slate-500">
                <span>{seoConfig.googleSiteVerification ? "✅ 已設定驗證碼" : "尚未填寫"}</span>
                <button
                  type="button"
                  onClick={handleSave}
                  className="text-amber-400 hover:text-amber-300 font-medium"
                >
                  立即套用
                </button>
              </div>
            </div>

            {/* Page Selector Tabs */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-white text-sm font-semibold">選擇要編輯的分頁</h2>
                <span className="text-[11px] text-slate-400">{pageKeys.length} 頁</span>
              </div>
              <div className="space-y-1.5">
                {pageKeys.map((path) => {
                  const p = seoConfig.pages[path];
                  const isSelected = path === selectedPagePath;
                  return (
                    <button
                      key={path}
                      onClick={() => setSelectedPagePath(path)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-amber-500/15 border border-amber-500/40 text-amber-300 font-medium"
                          : "bg-slate-800/40 hover:bg-slate-800 text-slate-300 border border-transparent"
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="font-medium text-slate-200">{p.name}</div>
                        <div className="text-[11px] font-mono text-slate-400 truncate">{p.path}</div>
                      </div>
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0 shadow-sm" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Page SEO Editor & Real-time Google SERP Preview */}
          <div className="lg:col-span-8 space-y-6">
            {/* Editor Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {currentPage.name}
                    </span>
                    <span className="text-slate-400 text-xs font-mono">{currentPage.path}</span>
                  </div>
                  <h3 className="text-lg font-medium text-white mt-1">
                    編輯「{currentPage.name}」的搜尋標籤
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyMetaTags}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs transition-colors flex items-center gap-1.5 border border-slate-700"
                    title="複製 HTML Meta 標籤"
                  >
                    <Copy className="w-3.5 h-3.5" /> 複製此語系代碼
                  </button>
                  <Link
                    to={currentPage.path}
                    target="_blank"
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs transition-colors flex items-center gap-1.5 border border-slate-700"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> 查看此頁
                  </Link>
                </div>
              </div>

              {/* Language Selector within Editor */}
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                  <Languages className="w-4 h-4 text-amber-400" />
                  切換欲設定的目標搜尋語系：
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setEditLang("zh")}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        editLang === "zh"
                          ? "bg-amber-500 text-slate-950 font-semibold shadow"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      🇹🇼 繁體中文 (ZH)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditLang("en")}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        editLang === "en"
                          ? "bg-amber-500 text-slate-950 font-semibold shadow"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      🇺🇸 English (EN)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditLang("ja")}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        editLang === "ja"
                          ? "bg-amber-500 text-slate-950 font-semibold shadow"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      🇯🇵 日本語 (JA)
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleSyncChineseToForeign}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 rounded-lg text-xs transition-colors flex items-center gap-1.5 border border-amber-500/30"
                    title="為此頁套用包含「張景雯 Win」與「Aurora Magical Animal Cards (Oracle Cards / オラクルカード)」之最佳英日文"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> 一鍵同步英日文
                  </button>
                </div>
              </div>

              {/* Title Field */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="text-slate-300 font-medium flex items-center gap-1.5">
                    SEO 標題 ({editLang.toUpperCase()} Title Tag)
                    <span className="text-[10px] text-slate-400">
                      （{editLang === "zh" ? "在台灣 Google 搜尋顯示" : editLang === "en" ? "在英文語系 Google 搜尋顯示" : "在日本 Yahoo/Google 搜尋顯示"}）
                    </span>
                  </label>
                  <span className={`text-[11px] font-mono ${
                    getActiveTitle().length > 60 ? "text-amber-400" : "text-slate-400"
                  }`}>
                    {getActiveTitle().length} / 60 字元 {getActiveTitle().length <= 60 ? "✓ 建議範圍" : "⚠ 稍長可能會被截斷"}
                  </span>
                </div>
                <input
                  type="text"
                  value={getActiveTitle()}
                  onChange={(e) => handleLocalizedFieldChange("title", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50"
                  placeholder={`輸入此頁面在 ${editLang.toUpperCase()} 搜尋引擎顯示的標題`}
                />
              </div>

              {/* Description Field */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="text-slate-300 font-medium flex items-center gap-1.5">
                    SEO 描述 ({editLang.toUpperCase()} Meta Description)
                    <span className="text-[10px] text-slate-400">（在搜尋結果下方顯示的簡介內文）</span>
                  </label>
                  <span className={`text-[11px] font-mono ${
                    getActiveDescription().length > 160 ? "text-amber-400" : "text-slate-400"
                  }`}>
                    {getActiveDescription().length} / 160 字元 {getActiveDescription().length <= 160 ? "✓ 建議範圍" : "⚠ 稍長可能會被截斷"}
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={getActiveDescription()}
                  onChange={(e) => handleLocalizedFieldChange("description", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 resize-y"
                  placeholder={`輸入此頁面在 ${editLang.toUpperCase()} 搜尋引擎顯示的摘要說明`}
                />
              </div>

              {/* Keywords Field */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium text-xs flex items-center gap-1.5">
                  關鍵字詞 ({editLang.toUpperCase()} Keywords)
                  <span className="text-[10px] text-slate-400">（以逗號區隔，幫助搜尋引擎抓取目標客群搜尋詞）</span>
                </label>
                <input
                  type="text"
                  value={getActiveKeywords()}
                  onChange={(e) => handleLocalizedFieldChange("keywords", e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400/80 font-mono"
                  placeholder={editLang === "en" ? "e.g., Aurora Magical Animal Cards, Oracle Cards, 327 ART" : editLang === "ja" ? "例：オーロラ・マジカル・アニマル・カード, オラクルカード, 327 ART" : "例如：327 ART, 極光動物魔法卡, 神諭卡, 奇蹟之筆"}
                />
              </div>

              {/* Live Google Search Preview (SERP Snippet) */}
              <div className="mt-8 pt-6 border-t border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-slate-300 tracking-wider flex items-center gap-1.5 uppercase">
                    <Search className="w-3.5 h-3.5 text-blue-400" />
                    Google 搜尋結果即時模擬卡片 ({editLang.toUpperCase()} SERP Preview)
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {editLang === "zh" ? "繁體中文搜尋模擬" : editLang === "en" ? "海外英文搜尋模擬" : "日本地區搜尋模擬"}
                  </span>
                </div>

                {/* Google Snippet Box */}
                <div className="bg-[#202124] text-white p-5 rounded-2xl border border-slate-700/80 shadow-inner max-w-2xl font-sans">
                  {/* Google Breadcrumb */}
                  <div className="flex items-center gap-2 mb-1.5 text-xs text-[#bdc1c6]">
                    <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-amber-300 font-serif font-bold">
                      327
                    </div>
                    <div className="flex flex-col leading-tight">
                      <span className="text-[13px] text-white font-medium">327 ART</span>
                      <span className="text-[11px] text-[#bdc1c6] font-mono truncate max-w-md">
                        {getGoogleBreadcrumb(currentPage.path, editLang)}
                      </span>
                    </div>
                  </div>

                  {/* Google Blue Title */}
                  <h5 className="text-[19px] leading-snug font-medium text-[#8ab4f8] hover:underline cursor-pointer mb-1.5">
                    {getActiveTitle() || "327 ART｜未設定標題"}
                  </h5>

                  {/* Google Snippet Description */}
                  <p className="text-[13.5px] leading-relaxed text-[#bdc1c6] line-clamp-3">
                    {getActiveDescription() || "尚未填寫頁面描述。請於上方欄位輸入，以呈現吸引人的搜尋簡介。"}
                  </p>
                </div>
              </div>

              {/* Bottom Action Buttons */}
              <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handleResetToGeminiDefaults}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs transition-colors flex items-center gap-2 border border-slate-700"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> 恢復中英日最佳推薦值
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98] flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" /> 儲存並即時套用全語系設定
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Full Site Google Previews */}
      {activeTab === "preview" && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-medium text-white flex items-center gap-2">
                  <Eye className="w-5 h-5 text-amber-400" />
                  全站各分頁在 Google 上的呈現效果一覽
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  您可以切換語系，檢視全站各主要頁面在不同國家地區 Google 上的呈現卡片：
                </p>
              </div>

              {/* Language Switcher for Preview */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start">
                <button
                  onClick={() => setPreviewLang("zh")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    previewLang === "zh" ? "bg-amber-500 text-slate-950 font-semibold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  🇹🇼 繁體中文
                </button>
                <button
                  onClick={() => setPreviewLang("en")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    previewLang === "en" ? "bg-amber-500 text-slate-950 font-semibold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  🇺🇸 English
                </button>
                <button
                  onClick={() => setPreviewLang("ja")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    previewLang === "ja" ? "bg-amber-500 text-slate-950 font-semibold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  🇯🇵 日本語
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pageKeys.map((path) => {
                const p = seoConfig.pages[path];
                let title = p.title;
                let desc = p.description;

                if (previewLang === "en" && p.translations?.en) {
                  title = p.translations.en.title || title;
                  desc = p.translations.en.description || desc;
                } else if (previewLang === "ja" && p.translations?.ja) {
                  title = p.translations.ja.title || title;
                  desc = p.translations.ja.description || desc;
                }

                return (
                  <div key={path} className="bg-[#202124] p-5 rounded-2xl border border-slate-700/80 shadow space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-[#bdc1c6]">
                        <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[9px] text-amber-300 font-serif font-bold">
                          327
                        </div>
                        <span className="text-white font-medium">327 ART</span>
                        <span className="text-[#9aa0a6] font-mono text-[11px] truncate max-w-[200px]">
                          {getGoogleBreadcrumb(path, previewLang)}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedPagePath(path);
                          setEditLang(previewLang);
                          setActiveTab("seo");
                        }}
                        className="text-[11px] text-amber-400 hover:underline"
                      >
                        編輯此頁
                      </button>
                    </div>

                    <h4 className="text-[17px] font-medium text-[#8ab4f8] leading-snug">
                      {title}
                    </h4>

                    <p className="text-[13px] text-[#bdc1c6] leading-relaxed line-clamp-2">
                      {desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Orders & Wish Pool status */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
            <h2 className="text-xl font-medium text-white mb-2 flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-amber-400" />
              網站訂單與許願池管理說明
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              本網站結帳訂單（Orders）與許願池留言／預購（PreOrders）皆妥善儲存於 Google Firebase 雲端資料庫中。
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-3">
                <h3 className="text-white font-semibold text-base flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  結帳訂單資料夾 (orders)
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  每當有顧客在網站完成極光動物魔法卡或 T-shirt 購物結帳，顧客的姓名、電話、收件地址與訂單明細會即時寫入 Firebase 資料庫。
                </p>
                <div className="bg-slate-900 p-3 rounded-lg text-xs font-mono text-slate-300">
                  集合路徑：/orders/{`{orderId}`}
                </div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-3">
                <h3 className="text-white font-semibold text-base flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                  線上許願池資料夾 (preOrders)
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  顧客在「線上許願池」或「預購專區」留下的心願、預約數量與聯絡信箱，均保存在此集合中。
                </p>
                <div className="bg-slate-900 p-3 rounded-lg text-xs font-mono text-slate-300">
                  集合路徑：/preOrders/{`{preOrderId}`}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-200 leading-relaxed">
              💡 提示：若您想直接瀏覽或匯出所有顧客訂單詳細名單，您可以隨時登入 <strong>Google Firebase 控制台</strong>（專案 ID：ai-studio-84268b87-4d3d-48a7-955e-e2438c1d5c4d）直接檢視 Firestore 資料庫！
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Google SEO indexing instructions */}
      {activeTab === "help" && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md space-y-6">
          <div>
            <h2 className="text-xl font-medium text-white mb-2 flex items-center gap-2">
              <Globe className="w-5 h-5 text-amber-400" />
              如何讓英文與日文使用者在 Google 搜尋到您的網站？
            </h2>
            <p className="text-slate-400 text-sm">
              海外搜尋引擎（歐美 Google、日本 Google/Yahoo）是如何運作的？
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0">
                1
              </div>
              <div className="space-y-1">
                <h3 className="text-white text-sm font-semibold">為什麼一定要設定英文與日文 SEO 標籤？</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  日本網友在搜尋時會輸入日語（如「オラクルカード」（神諭卡）、「オーロラ・マジカル・アニマル・カード」），歐美網友則會輸入英文（如「Aurora Magical Animal Cards」、「Oracle Cards」）。如果網站的標題與搜尋描述只有繁體中文，海外搜尋引擎無法判斷相關性，就不會排在前面。
                </p>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0">
                2
              </div>
              <div className="space-y-1">
                <h3 className="text-white text-sm font-semibold">後台已幫您全數配置好中英日三種語言</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  在我們新升級的 SEO 後台裡，您可以隨時點擊 🇹🇼 繁體中文、🇺🇸 English、🇯🇵 日本語 切換。我們已經替您寫好了所有分頁的高品質日文與英文 SEO 標題、描述與關鍵字，您也可以隨心所欲自由修改！
                </p>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0">
                3
              </div>
              <div className="space-y-1">
                <h3 className="text-white text-sm font-semibold">自動多語言語系辨識技術</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  當外國顧客進入網站或海外爬蟲來訪時，系統會自動切換為對應的語系 Meta 標籤與 HTML 語言宣告（zh-TW / en / ja），讓跨國搜尋收錄效果達到最佳化！
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
