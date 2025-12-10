import { useState, useEffect } from 'react';

export default function MobileBlocker({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      // User Agent Check
      const userAgent = (navigator.userAgent || navigator.vendor || (window as any).opera || '').toLowerCase();
      const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|crios|fxios|tablet|playbook|silk|kindle/i.test(userAgent);
      
      // Platform Check
      const platform = (navigator.platform || '').toLowerCase();
      const isMobilePlatform = /iphone|ipad|ipod|android|arm|pike|linux aarch/i.test(platform);
      
      // Touch Support (more aggressive)
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || (navigator as any).msMaxTouchPoints > 0;
      
      // Pointer Type - coarse means touch
      const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
      const isAnyCoarsePointer = window.matchMedia('(any-pointer: coarse)').matches;
      
      // Screen Size Detection (physical screen, not viewport)
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const availWidth = window.screen.availWidth;
      const availHeight = window.screen.availHeight;
      
      // Get the smaller dimension for portrait/landscape check
      const minDimension = Math.min(screenWidth, screenHeight);
      const maxDimension = Math.max(screenWidth, screenHeight);
      
      // Mobile screens are typically narrower than 768px in portrait
      const hasSmallScreen = minDimension < 768 || maxDimension < 1024;
      const hasSmallAvailScreen = availWidth < 768 || availHeight < 600;
      
      // Orientation API (mobile-specific)
      const hasOrientationAPI = 'orientation' in window || 'onorientationchange' in window;
      
      // Device Pixel Ratio (mobile devices often have high DPR)
      const pixelRatio = window.devicePixelRatio || 1;
      const hasHighDPR = pixelRatio > 2;
      
      // Check for mobile-specific APIs
      const hasMobileAPIs = 'ondevicemotion' in window || 
                            'ondeviceorientation' in window ||
                            'ontouchstart' in document.documentElement;
      
      // Connection type (mobile networks)
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      const isMobileConnection = connection && (connection.type === 'cellular' || /\d+g/.test(connection.effectiveType));
      
      // Hardware concurrency (mobile devices typically have fewer cores or lower reported)
      const cores = navigator.hardwareConcurrency || 0;
      const lowCores = cores > 0 && cores <= 8;
      
      // Device Memory
      const memory = (navigator as any).deviceMemory;
      const lowMemory = memory && memory <= 4;
      
      // Check if screen dimensions match common mobile resolutions
      const commonMobileWidths = [320, 360, 375, 390, 393, 412, 414, 428, 768, 810, 820, 834, 1024];
      const matchesMobileWidth = commonMobileWidths.some(w => 
        Math.abs(screenWidth - w) < 5 || Math.abs(screenHeight - w) < 5
      );
      
      // Aspect ratio check
      const aspectRatio = maxDimension / minDimension;
      const isMobileAspectRatio = aspectRatio > 1.5; // Phones are typically > 1.7
      
      // AGGRESSIVE: Block if ANY of these are true
      const mobile = isMobileUA ||
                     isMobilePlatform ||
                     isCoarsePointer ||
                     isAnyCoarsePointer ||
                     hasSmallScreen ||
                     hasSmallAvailScreen ||
                     hasOrientationAPI ||
                     hasMobileAPIs ||
                     isMobileConnection ||
                     (isTouchDevice && hasSmallScreen) ||
                     (isTouchDevice && isMobileAspectRatio) ||
                     (hasHighDPR && hasSmallScreen) ||
                     (lowCores && isTouchDevice) ||
                     (lowMemory && isTouchDevice) ||
                     matchesMobileWidth;
      
      console.log('Mobile Detection Debug:', {
        isMobileUA,
        isMobilePlatform,
        isTouchDevice,
        isCoarsePointer,
        isAnyCoarsePointer,
        screenWidth,
        screenHeight,
        minDimension,
        hasSmallScreen,
        hasOrientationAPI,
        hasMobileAPIs,
        pixelRatio,
        cores,
        memory,
        matchesMobileWidth,
        aspectRatio,
        FINAL_RESULT: mobile
      });
      
      setIsMobile(mobile);
      setLoading(false);
    };

    // Check immediately
    checkMobile();
    
    // Recheck on various events
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);
    
    // Aggressive recheck every second
    const interval = setInterval(checkMobile, 1000);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-xl">Verifying device...</div>
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
              Mobile devices, tablets, and desktop view on mobile browsers are not supported.
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
            <p className="text-gray-300 text-sm">
              Please access this portal using a laptop or desktop computer with a minimum screen resolution of 1024×768 pixels.
            </p>
          </div>
          
          <div className="text-xs text-gray-500 mt-4">
            Device detected as mobile/tablet
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
