import { useState, useEffect } from 'react';

export default function MobileBlocker({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';
      
      // Check user agent for mobile keywords
      const mobileKeywords = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS|FxiOS|Tablet|PlayBook|Silk|Kindle|ARM|Touch/i;
      const isMobileUA = mobileKeywords.test(userAgent);
      
      // Check platform
      const platform = navigator.platform || '';
      const mobilePlatforms = /iPhone|iPad|iPod|Android|Linux armv|Linux aarch/i;
      const isMobilePlatform = mobilePlatforms.test(platform);
      
      // Check touch points (mobile devices typically have more touch points)
      const hasMobileTouch = navigator.maxTouchPoints > 1;
      
      // Check for orientation property (mobile-specific)
      const hasOrientation = typeof window.orientation !== 'undefined';
      
      // Check screen dimensions (both width AND height to catch desktop view on mobile)
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Check actual screen size (not just viewport)
      const smallScreen = screenWidth < 1024 || screenHeight < 600;
      
      // Check aspect ratio
      const screenRatio = screenWidth / screenHeight;
      const isMobileRatio = screenRatio < 0.7 || screenRatio > 1.5;
      
      // Check if viewport is significantly smaller than screen (desktop view on mobile)
      const viewportMismatch = (screenWidth > 1024 && viewportWidth < 768) || 
                               (screenHeight > 600 && viewportHeight < 500);
      
      // Check for pointer type (coarse = touch device)
      const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
      
      // Check device memory (mobile devices typically have less)
      const deviceMemory = (navigator as any).deviceMemory;
      const lowMemory = deviceMemory && deviceMemory <= 4;
      
      // Combine all checks - block if ANY mobile indicator is present
      const mobile = isMobileUA || 
                     isMobilePlatform || 
                     hasOrientation || 
                     smallScreen ||
                     viewportMismatch ||
                     hasCoarsePointer ||
                     (hasMobileTouch && (isMobileRatio || smallScreen)) ||
                     (lowMemory && (isMobileUA || hasCoarsePointer));
      
      setIsMobile(mobile);
      setLoading(false);
    };

    // Initial check with a small delay to ensure all properties are available
    const timer = setTimeout(checkMobile, 100);
    
    // Add event listeners
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);
    
    // Periodically recheck (in case user switches view mode)
    const interval = setInterval(checkMobile, 2000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  // Show loading state briefly to prevent flash
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-6 overflow-hidden">
        <div className="max-w-md text-center space-y-6">
          <div className="w-20 h-20 mx-auto bg-red-500/10 rounded-full flex items-center justify-center">
            <svg 
              className="w-10 h-10 text-red-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
          
          <div>
            <h1 className="text-white text-3xl font-bold mb-3">
              Desktop Only Access
            </h1>
            <p className="text-gray-400 text-base leading-relaxed">
              This test portal requires a desktop computer for proper functionality and security. 
              Mobile devices and tablet views are not supported.
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
            <p className="text-gray-300 text-sm">
              Please access this portal using a laptop or desktop computer with a minimum screen resolution of 1024×600 pixels.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
