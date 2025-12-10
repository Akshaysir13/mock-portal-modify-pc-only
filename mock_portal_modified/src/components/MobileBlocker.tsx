import { useState, useEffect } from 'react';

export default function MobileBlocker({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';
      
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS|FxiOS/i.test(userAgent);
      
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 1;
      
      const isMobileScreen = window.innerWidth < 768;
      
      const mobile = isMobileDevice || (hasTouchScreen && isMobileScreen);
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-white text-2xl font-bold mb-4">Desktop Only</h1>
          <p className="text-gray-300 text-lg">
            This test portal is only accessible on desktop devices. 
            Please use a laptop or computer to access the mock test.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
