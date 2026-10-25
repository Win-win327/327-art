import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function scrollToHash(hash: string, smooth = true) {
  const cleanId = hash.replace("#", "");
  if (!cleanId) return;

  let userInterrupted = false;
  const onUserInteraction = () => {
    userInterrupted = true;
  };

  window.addEventListener("wheel", onUserInteraction, { once: true, passive: true });
  window.addEventListener("touchmove", onUserInteraction, { once: true, passive: true });

  const getTarget = () => document.getElementById(cleanId);

  const performScroll = (behavior: ScrollBehavior) => {
    if (userInterrupted) return false;
    const el = getTarget();
    if (!el) return false;
    const navOffset = 85; // Fixed navbar height with buffer
    const targetY = Math.max(0, el.getBoundingClientRect().top + window.pageYOffset - navOffset);
    window.scrollTo({
      top: targetY,
      behavior,
    });
    return true;
  };

  // Immediate frame
  requestAnimationFrame(() => {
    performScroll(smooth ? "smooth" : "auto");
  });

  // Keep observing layout shifts (images, fonts, dynamic content loading)
  let lastHeight = document.documentElement.scrollHeight;
  let checks = 0;
  const interval = setInterval(() => {
    checks++;
    if (userInterrupted || checks > 15) {
      clearInterval(interval);
      window.removeEventListener("wheel", onUserInteraction);
      window.removeEventListener("touchmove", onUserInteraction);
      return;
    }

    const currentHeight = document.documentElement.scrollHeight;
    const el = getTarget();
    if (el && Math.abs(currentHeight - lastHeight) > 10) {
      lastHeight = currentHeight;
      performScroll("smooth");
    }
  }, 100);
}

export default function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if (location.hash) {
      const timer = setTimeout(() => {
        scrollToHash(location.hash, true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [location.pathname, location.hash]);

  return null;
}
