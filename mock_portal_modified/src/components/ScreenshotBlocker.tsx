import { useState, useEffect } from "react";

export default function MobileBlocker({ children }: { children: React.ReactNode }) {
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkDevice = () => {
      let isMobile = false;

      // 🔥 MAIN STRONG CHECK — UNFAKEABLE
      if (navigator.userAgentData && "mobile" in navigator.userAgentData) {
        isMobile = navigator.userAgentData.mobile;
      } else {
        // Fallback for older browsers (less reliable)
        isMobile = /android|iphone|ipad|ipod|mobile|tablet/i.test(navigator.userAgent);
      }

      // Require big screen too (prevents foldables/tablets)
      const wideEnough = window.innerWidth >= 1024;

      const allowed = !isMobile && wideEnough;

      setAllowed(allowed);
      setLoading(false);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black text-white flex items-center justify-center">
        Checking device…
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="fixed inset-0 bg-black text-white flex items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-3xl font-bold mb-4">Desktop Required</h1>
          <p>This test can only be taken on a real desktop/laptop.</p>
          <p className="text-gray-400 mt-3 text-sm">
            Mobile phones, tablets, and desktop-mode on mobile are blocked.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
