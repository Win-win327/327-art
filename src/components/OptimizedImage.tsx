import React, { useState, useEffect } from "react";
import { RefreshCw, ImageOff } from "lucide-react";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string;
  fallbackSrc?: string;
}

export default function OptimizedImage({
  src,
  alt = "",
  className = "",
  loading = "lazy",
  wrapperClassName = "",
  fallbackSrc,
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
    setLoaded(false);
    setHasError(false);
    setRetryCount(0);
  }, [src]);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setLoaded(true);
    setHasError(false);
    if (onLoad) onLoad(e);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (retryCount < 2) {
      // Auto retry after 2 seconds (helps when ImgBB has brief 503 spike)
      setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        if (src) {
          const sep = src.includes("?") ? "&" : "?";
          setCurrentSrc(`${src}${sep}retry=${Date.now()}`);
        }
      }, 2000);
    } else if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setRetryCount(0);
    } else {
      setHasError(true);
      if (onError) onError(e);
    }
  };

  const handleManualRetry = () => {
    setHasError(false);
    setLoaded(false);
    setRetryCount(0);
    if (src) {
      const sep = src.includes("?") ? "&" : "?";
      setCurrentSrc(`${src}${sep}retry=${Date.now()}`);
    }
  };

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      {!loaded && !hasError && (
        <div className="absolute inset-0 animate-shimmer bg-white/5 rounded-[inherit]" />
      )}

      {hasError ? (
        <div className="w-full h-full min-h-[140px] flex flex-col items-center justify-center p-4 bg-slate-900/60 border border-white/10 rounded-[inherit] text-center">
          <ImageOff className="w-8 h-8 text-gold-end/60 mb-2" />
          <p className="text-xs text-white/70 line-clamp-1 mb-2 font-serif">
            {alt || "作品載入中"}
          </p>
          <button
            type="button"
            onClick={handleManualRetry}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs bg-gold-end/20 text-gold-end hover:bg-gold-end/30 border border-gold-end/40 transition-colors"
          >
            <RefreshCw className="w-3 h-3 animate-spin-reverse" />
            <span>重新載入</span>
          </button>
        </div>
      ) : (
        <img
          src={currentSrc}
          alt={alt}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-500 ease-in-out ${
            loaded ? "opacity-100" : "opacity-0"
          } ${className}`}
          referrerPolicy="no-referrer"
          decoding="async"
          {...props}
        />
      )}
    </div>
  );
}

