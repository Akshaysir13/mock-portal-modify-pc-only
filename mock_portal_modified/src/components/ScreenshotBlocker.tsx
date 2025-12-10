import { useState, useEffect } from "react";

export default function MobileBlocker({ children }: { children: React.ReactNode }) {
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = () => {
      const mqPointerFine = window.matchMedia("(pointer: fine)").matches;
      const mqHover = window.matchMedia("(hover: hover)").matches;

      const hasRealMouse = mqPointerFine && mqHover;

      // Keyboard heuristic: desktops usually report > 10 keys
      const hasRealKeyboard = navigator.keyboard
        ? true
        : (navigator as any).keyboardLayoutMap
        ? true
        : window.navigator.maxTouchPoints === 0;

      // Screen width requirement
      const wideEnough = window.innerWidth >= 1024;

      // FINAL STRICT CHECK
      const isDesktop = hasRealMouse && hasRealKeyboard && wideEnough;

      setAllowed(isDesktop);
      setLoading(false);
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black text-white flex items-center justify-center">
        Verifying device…
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="fixed inset-0 bg-black text-white flex items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-3xl font-bold mb-4">Desktop Only</h1>
          <p>This portal cannot be accessed on mobile, tablet, or desktop-mode on mobile.</p>
          <p className="mt-3 text-gray-400 text-sm">Please use a real laptop or desktop computer.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
