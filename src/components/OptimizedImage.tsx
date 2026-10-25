import React, { useState } from "react";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string;
}

export default function OptimizedImage({
  src,
  alt = "",
  className = "",
  loading = "lazy",
  wrapperClassName = "",
  onLoad,
  ...props
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setLoaded(true);
    if (onLoad) onLoad(e);
  };

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      {!loaded && (
        <div className="absolute inset-0 animate-shimmer bg-white/5 rounded-[inherit]" />
      )}
      <img
        src={src}
        alt={alt}
        loading={loading}
        onLoad={handleLoad}
        className={`transition-opacity duration-500 ease-in-out ${
          loaded ? "opacity-100" : "opacity-0"
        } ${className}`}
        referrerPolicy="no-referrer"
        decoding="async"
        {...props}
      />
    </div>
  );
}
