import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Logo from './Logo';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import BookIcon from '@mui/icons-material/Book';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import InfoIcon from '@mui/icons-material/Info';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import CloseIcon from '@mui/icons-material/Close';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
const navigationItems = [
  { 
    text: 'الصفحة الرئيسية', 
    icon: HomeIcon, 
    href: '/',
    color: '#4CAF50'
  },
  {
    text: 'تصفح المصحف',
    icon: BookIcon,
    href: '/quran-pages/1',
    color: '#2196F3'
  },
  {
    text: 'السور',
    icon: MenuBookIcon,
    href: '/quran/1',
    color: '#9C27B0'
  },
  {
    text: 'قارئ القرآن',
    icon: ImportContactsIcon,
    href: '/quran-reader?page=1',
    color: '#00BCD4'
  },
  {
    text: 'الصوتيات',
    icon: VolumeUpIcon,
    href: '/quran-sound',
    color: '#FF9800'
  },
  { 
    text: 'المصحف PDF', 
    icon: PictureAsPdfIcon, 
    href: '/quran-pdf',
    color: '#F44336'
  },
  {
    text: 'الإذاعة',
    icon: LiveTvIcon,
    href: '/live',
    color: '#E91E63'
  },
  { 
    text: 'API', 
    icon: BookIcon, 
    href: 'https://msr-quran-data.vercel.app',
    color: '#607D8B'
  },
  { 
    text: 'من نحن', 
    icon: InfoIcon, 
    href: '/about',
    color: '#795548'
  },
];

function AppAppBar() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldShakeLogo, setShouldShakeLogo] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isIndicatorTouched, setIsIndicatorTouched] = useState(false);
  
  const router = useRouter();
  const searchInputRef = useRef(null);
  const hideMenuTimerRef = useRef(null);
  const indicatorTouchTimerRef = useRef(null);

  const isQuranReaderPage = router.pathname === '/quran-reader' || router.pathname.startsWith('/quran-pages');
  const shouldShowLogo = !isVisible && !isQuranReaderPage;

  // إظهار القائمة تلقائيًا عند فتح الموقع لأول مرة
  useEffect(() => {
    const hasSeenMenuOnLoad = sessionStorage.getItem('hasSeenMenuOnLoad');
    
    if (!hasSeenMenuOnLoad) {
      // إظهار القائمة بعد نصف ثانية من التحميل
      const showTimer = setTimeout(() => {
        setIsVisible(true);
        
        // إخفاءها بعد 3 ثوانٍ
        const hideTimer = setTimeout(() => {
          setIsVisible(false);
          sessionStorage.setItem('hasSeenMenuOnLoad', 'true');
        }, 3000);
        
        return () => clearTimeout(hideTimer);
      }, 500);
      
      return () => clearTimeout(showTimer);
    }
  }, []);

  // إخفاء القائمة تلقائيًا بعد 5 ثوانٍ من عدم التفاعل
  useEffect(() => {
    if (isVisible) {
      // إلغاء أي timer سابق
      if (hideMenuTimerRef.current) {
        clearTimeout(hideMenuTimerRef.current);
      }
      
      // بدء timer جديد
      hideMenuTimerRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 5000); // 5 ثوانٍ
    }
    
    return () => {
      if (hideMenuTimerRef.current) {
        clearTimeout(hideMenuTimerRef.current);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    setMounted(true);
    const hasSeenMenuInThisTab = sessionStorage.getItem('hasSeenMenuInThisTab');

    if (!hasSeenMenuInThisTab) {
      const timer = setTimeout(() => {
        setShouldShakeLogo(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setShouldShakeLogo(false);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        setIsDarkMode(savedTheme === 'dark');
        document.documentElement.setAttribute('data-theme', savedTheme);
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(prefersDark);
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
      }
    }
  }, [mounted]);

  const toggleDarkMode = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search/${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchExpanded(false);
      setSearchQuery('');
    }
  };

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 300);
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isSearchExpanded) {
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isSearchExpanded]);

  const isActive = (href) => {
    if (href === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(href);
  };

  const handleItemMouseEnter = (index) => {
    setHoveredItem(index);
  };

  const handleItemMouseLeave = () => {
    setHoveredItem(null);
  };

  const resetHideTimer = () => {
    if (hideMenuTimerRef.current) {
      clearTimeout(hideMenuTimerRef.current);
    }
    
    if (isVisible) {
      hideMenuTimerRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    }
  };

  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };

  const handleLogoClick = () => {
    setShouldShakeLogo(false);
    sessionStorage.setItem('hasSeenMenuInThisTab', 'true');
    toggleSidebar();
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[e.targetTouches.length - 1].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isRightSwipe && !isVisible) {
      setIsVisible(true);
      setShouldShakeLogo(false);
      sessionStorage.setItem('hasSeenMenuInThisTab', 'true');
    }
    
    if (isLeftSwipe && isVisible) {
      setIsVisible(false);
    }
    
    setIsDragging(false);
  };

  const onMouseDown = (e) => {
    setTouchEnd(null);
    setTouchStart(e.clientX);
    setIsDragging(true);
  };

  const onMouseMove = (e) => {
    if (isDragging) {
      setTouchEnd(e.clientX);
    }
  };

  const onMouseUp = useCallback(() => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isRightSwipe && !isVisible) {
      setIsVisible(true);
      sessionStorage.setItem('menuSeen', 'true');
    } else if (isLeftSwipe && isVisible) {
      setIsVisible(false);
    }
    
    setIsDragging(false);
    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, isVisible]);

  useEffect(() => {
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseUp]);

  useEffect(() => {
    const timer = indicatorTouchTimerRef.current;
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* منطقة السحب - فقط عندما تكون القائمة مخفية */}
      {!isVisible && (
        <>
          <div
            className="swipe-zone"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseEnter={() => setIsIndicatorTouched(true)}
            onMouseLeave={() => setIsIndicatorTouched(false)}
          />
          
          {/* مؤشر القائمة المخفية - سهم وحافة متوهجة */}
          <div 
            className={`menu-indicator ${isIndicatorTouched ? 'touched' : ''}`}
            data-tooltip="انقر لفتح القائمة"
            onClick={() => setIsVisible(true)}
            style={{ cursor: 'pointer', pointerEvents: 'none' }}
          >
            <div className="menu-edge-glow"></div>
            <div className="menu-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </>
      )}

      {/* منطقة السحب - فقط عندما تكون القائمة مرئية */}
      {isVisible && (
        <div
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
            pointerEvents: 'auto',
          }}
        />
      )}

      {/* زر الهمبرجر الثابت */}
      {shouldShowLogo && (
        <div className={`logo-menu-button ${shouldShakeLogo ? 'shake-active' : ''}`}>
          <div onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
            <Logo size={85} disableLink={true} />
          </div>
        </div>
      )}

      {/* الشريط الجانبي الثابت */}
      <div 
        className={`fixed-sidebar ${isVisible ? 'visible' : 'hidden'}`}
        role="navigation"
        aria-label="قائمة التنقل الرئيسية"
        onMouseEnter={resetHideTimer}
        onMouseMove={resetHideTimer}
        onTouchStart={resetHideTimer}
      >
        {/* قسم البحث */}
        <div className="sidebar-search-section">
          <button
            className={`search-icon-btn ${isSearchExpanded ? 'active' : ''}`}
            onClick={() => {
              toggleSearch();
              resetHideTimer();
            }}
            aria-label={isSearchExpanded ? 'إغلاق البحث' : 'فتح البحث'}
            data-tooltip="البحث في القرآن"
          >
            {isSearchExpanded ? <CloseIcon /> : <SearchIcon />}
          </button>

        </div>

        {/* عناصر التنقل */}
        <nav className="sidebar-nav">
          {navigationItems.map((item, index) => (
            <div key={index} className="nav-item-wrapper">
              <Link
                href={item.href}
                className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
                onMouseEnter={() => {
                  handleItemMouseEnter(index);
                  resetHideTimer();
                }}
                onMouseLeave={handleItemMouseLeave}
                onClick={resetHideTimer}
                style={{
                  '--item-color': item.color,
                }}
                data-tooltip={item.text}
              >
                <item.icon className="nav-icon" />
                
                {isActive(item.href) && (
                  <div className="active-indicator" style={{ backgroundColor: item.color }} />
                )}
                
                {hoveredItem === index && (
                  <div 
                    className="glow-effect" 
                    style={{ backgroundColor: item.color + '20' }}
                  />
                )}
              </Link>
            </div>
          ))}
        </nav>

        {/* تبديل الوضع المظلم */}
        <div className="sidebar-footer">
          <button 
            className="theme-toggle-btn"
            onClick={() => {
              toggleDarkMode();
              resetHideTimer();
            }}
            onMouseEnter={resetHideTimer}
            title={isDarkMode ? 'الوضع الفاتح' : 'الوضع المظلم'}
          >
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </button>
        </div>
      </div>

      {/* Search Overlay - خارج الـ sidebar */}
      {isSearchExpanded && (
        <div
          className="search-backdrop"
          onClick={() => setIsSearchExpanded(false)}
        />
      )}
      <div className={`search-form-overlay ${isSearchExpanded ? 'expanded' : ''}`}>
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-container">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="ابحث في القرآن الكريم..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              dir="rtl"
            />
            <button type="submit" className="search-submit-btn">
              <SearchIcon />
            </button>
          </div>
        </form>
      </div>

      {/* الأنماط المحسنة - إزالة الحركة مع التمرير وإزالة مؤشر الإخفاء */}
      <style jsx global>{`
        /* زر اللوجو الثابت */
        .logo-menu-button {
          position: fixed;
          top: 20px;
          right: 20px; /* إعادة اللوجو إلى اليمين */
          z-index: 1001;

          /* تحسينات للشاشات الصغيرة */
          @media (max-width: 768px) {
            top: 80px; /* تحت البسملة مباشرة */
            right: 20px; /* يبقى في اليمين */
          }
          cursor: pointer;
          outline: none;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

          /* الدائرة المحسنة مع الفلاتر */
          width: 70px;
          height: 70px;
          border-radius: 50%; /* شكل دائري مثالي */
          background: #87a8c1ed; /* خلفية بيضاء نقية */
          border: 3px solid #000000; /* بوردر أسود أسمك */
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .logo-menu-button:hover {
          border-radius: 50%; /* شكل دائري مثالي */
          background: #8a9ba8; /* لون رمادي فاتح لإبراز اللوقو */
          border: 3px solid #000000; /* بوردر أسود أسمك */
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

          /* فلاتر لإبراز اللوقو */
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        /* فلاتر إضافية للوقو لإبرازه */
        .logo-menu-button :global(.logo-img) {
          filter: brightness(1.1) contrast(1.2) saturate(1.1);
          transition: filter 0.3s ease;
        }

        .logo-menu-button:hover :global(.logo-img) {
          filter: brightness(1.5) contrast(1.3) saturate(1.2);
        }

        /* أنيميشن سريع مع توقف 4 ثوانٍ */
        .logo-menu-button.shake-active {
          animation: fastIntervalShake 5s infinite ease-in-out !important;
        }

        @keyframes fastIntervalShake {
          /* الاهتزاز السريع جداً لمدة ثانية واحدة (20% من 5 ثوانٍ) */
          0% {
            transform: scale(1) translateX(0);
            box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.6);
            border-radius: 45%;
          }
          1% {
            transform: scale(1.03) translateX(-1px);
            box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.4);
            border-radius: 45%;
          }
          2% {
            transform: scale(1.05) translateX(1px);
            box-shadow: 0 0 0 5px rgba(25, 118, 210, 0.3);
            border-radius: 45%;
          }
          3% {
            transform: scale(1.04) translateX(-1px);
            box-shadow: 0 0 0 4px rgba(25, 118, 210, 0.4);
            border-radius: 45%;
          }
          4% {
            transform: scale(1.06) translateX(1px);
            box-shadow: 0 0 0 6px rgba(25, 118, 210, 0.2);
            border-radius: 45%;
          }
          5% {
            transform: scale(1.03) translateX(-1px);
            box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.4);
            border-radius: 45%;
          }
          6% {
            transform: scale(1.05) translateX(1px);
            box-shadow: 0 0 0 5px rgba(25, 118, 210, 0.3);
            border-radius: 45%;
          }
          7% {
            transform: scale(1.04) translateX(-1px);
            box-shadow: 0 0 0 4px rgba(25, 118, 210, 0.4);
            border-radius: 45%;
          }
          8% {
            transform: scale(1.06) translateX(1px);
            box-shadow: 0 0 0 6px rgba(25, 118, 210, 0.2);
            border-radius: 45%;
          }
          9% {
            transform: scale(1.03) translateX(-1px);
            box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.4);
            border-radius: 45%;
          }
          10% {
            transform: scale(1.05) translateX(1px);
            box-shadow: 0 0 0 5px rgba(25, 118, 210, 0.3);
            border-radius: 45%;
          }
          11% {
            transform: scale(1.04) translateX(-1px);
            box-shadow: 0 0 0 4px rgba(25, 118, 210, 0.4);
            border-radius: 45%;
          }
          12% {
            transform: scale(1.06) translateX(1px);
            box-shadow: 0 0 0 6px rgba(25, 118, 210, 0.2);
            border-radius: 45%;
          }
          13% {
            transform: scale(1.03) translateX(-1px);
            box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.4);
            border-radius: 45%;
          }
          14% {
            transform: scale(1.05) translateX(1px);
            box-shadow: 0 0 0 5px rgba(25, 118, 210, 0.3);
            border-radius: 45%;
          }
          15% {
            transform: scale(1.04) translateX(-1px);
            box-shadow: 0 0 0 4px rgba(25, 118, 210, 0.4);
            border-radius: 45%;
          }
          16% {
            transform: scale(1.03) translateX(1px);
            box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.5);
            border-radius: 45%;
          }
          17% {
            transform: scale(1.02) translateX(-1px);
            box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.6);
            border-radius: 45%;
          }
          18% {
            transform: scale(1.01) translateX(1px);
            box-shadow: 0 0 0 1px rgba(25, 118, 210, 0.7);
            border-radius: 45%;
          }
          20% {
            transform: scale(1) translateX(0);
            box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.6);
            border-radius: 45%;
          }
          /* توقف لمدة 4 ثوانٍ (80% من 5 ثوانٍ) */
          21%, 100% {
            transform: scale(1) translateX(0);
            box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.2);
            border-radius: 45%;
          }
        }

        @keyframes shakeMotion {
          0% { transform: translateX(0); }
          25% { transform: translateX(-1px); }
          50% { transform: translateX(1px); }
          75% { transform: translateX(-1px); }
          100% { transform: translateX(0); }
        }

        .logo-menu-button:hover {
          transform: scale(1.05);
        }

        .logo-menu-button:active {
          transform: scale(0.95);
        }

        /* ستايل الوضع المظلم للوقو */
        [data-theme="dark"] .logo-menu-button {
          background: #9ca3af; /* لون رمادي فاتح أكثر في الوضع المظلم */
          border-color: #ffffff; /* بوردر أبيض في الوضع المظلم للتباين */
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
        }

        /* فلاتر إضافية في الوضع المظلم */
        [data-theme="dark"] .logo-menu-button :global(.logo-img) {
          filter: brightness(1.2) contrast(1.3) saturate(1.2);
        }

        /* منطقة السحب */
        .swipe-zone {
          position: fixed;
          top: 0;
          left: 0;
          width: 150px; /* عرض المنطقة على الكمبيوتر */
          height: 100vh;
          z-index: 999;
          pointer-events: auto;
          /* خلفية شفافة تماماً - للمستخدم العادي لا يراها */
          background: transparent;
        }

        /* تأثير خفيف جداً عند التمرير لإظهار حدود المنطقة */
        .swipe-zone:hover {
          background: linear-gradient(
            to right,
            rgba(104, 123, 140, 0.03) 0%,
            transparent 100%
          );
        }

        [data-theme="dark"] .swipe-zone:hover {
          background: linear-gradient(
            to right,
            rgba(147, 197, 253, 0.03) 0%,
            transparent 100%
          );
        }

        /* تكبير منطقة السحب على الشاشات الصغيرة */
        @media (max-width: 768px) {
          .swipe-zone {
            width: 200px; /* أوسع على الموبايل */
          }
        }

        @media (max-width: 480px) {
          .swipe-zone {
            width: 250px; /* أوسع جداً على الشاشات الصغيرة */
          }
        }

        /* مؤشر القائمة المخفية */
        .menu-indicator {
          position: fixed;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          z-index: 998;
          display: flex;
          align-items: center;
          transition: all 0.4s ease;
        }

        /* السهم مخفي بشكل افتراضي */
        .menu-indicator .menu-arrow {
          opacity: 0;
          transform: translateX(-10px);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* الحافة مخفية بشكل افتراضي */
        .menu-edge-glow {
          opacity: 0;
          transition: all 0.4s ease;
        }

        /* عند التمرير أو اللمس - إظهار السهم والحافة */
        .menu-indicator.touched,
        .menu-indicator:hover {
          transform: translateY(-50%);
        }

        .menu-indicator.touched .menu-arrow,
        .menu-indicator:hover .menu-arrow {
          opacity: 1;
          transform: translateX(0) scale(1);
          box-shadow: 0 4px 16px rgba(104, 123, 140, 0.5);
        }

        .menu-indicator.touched .menu-edge-glow,
        .menu-indicator:hover .menu-edge-glow {
          opacity: 1;
        }

        /* تأثير أقوى عند hover */
        .menu-indicator:hover .menu-arrow {
          transform: translateX(4px) scale(1.05);
        }

        /* عند الضغط */
        .menu-indicator:active .menu-arrow {
          transform: translateX(2px) scale(0.95);
        }

        .menu-edge-glow {
          position: absolute;
          left: 0;
          width: 4px;
          height: 120px;
          background: linear-gradient(
            to right,
            rgba(104, 123, 140, 0.8) 0%,
            rgba(104, 123, 140, 0.4) 50%,
            transparent 100%
          );
          border-radius: 0 4px 4px 0;
        }

        [data-theme="dark"] .menu-edge-glow {
          background: linear-gradient(
            to right,
            rgba(147, 197, 253, 0.6) 0%,
            rgba(147, 197, 253, 0.3) 50%,
            transparent 100%
          );
        }

        .menu-arrow {
          position: absolute;
          left: 8px;
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, rgba(104, 123, 140, 0.95), rgba(145, 151, 154, 0.95));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
        }

        [data-theme="dark"] .menu-arrow {
          background: linear-gradient(135deg, rgba(30, 58, 138, 0.95), rgba(59, 130, 246, 0.95));
          color: white;
        }



        /* إخفاء المؤشر على الشاشات الكبيرة جداً إذا لزم الأمر */
        @media (min-width: 1920px) {
          .menu-indicator {
            opacity: 0.7;
          }
        }

        /* تحسين المؤشر للموبايل */
        @media (max-width: 768px) {
          .menu-arrow {
            width: 28px;
            height: 28px;
            left: 6px;
          }
          
          .menu-edge-glow {
            width: 3px;
            height: 100px;
          }
        }

        /* التلميح للمؤشر */
        .menu-indicator[data-tooltip]:hover::after {
          content: attr(data-tooltip);
          position: absolute;
          left: 50px;
          top: 50%;
          transform: translateY(-50%);
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(30, 30, 30, 0.95) 100%);
          color: white;
          padding: 10px 15px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
          z-index: 10000;
          backdrop-filter: blur(15px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
          font-family: 'Cairo', -apple-system, BlinkMacSystemFont, sans-serif;
          animation: tooltipSlideIn 0.3s ease-out;
          pointer-events: none;
        }

        .menu-indicator[data-tooltip]:hover::before {
          content: '';
          position: absolute;
          left: 42px;
          top: 50%;
          transform: translateY(-50%);
          border: 8px solid transparent;
          border-right-color: rgba(0, 0, 0, 0.95);
          z-index: 10001;
          pointer-events: none;
        }

        @keyframes tooltipSlideIn {
          0% {
            opacity: 0;
            transform: translateY(-50%) translateX(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
          }
        }

        /* إخفاء التلميح على الموبايل */
        @media (max-width: 768px) {
          .menu-indicator[data-tooltip]:hover::after,
          .menu-indicator[data-tooltip]:hover::before {
            display: none;
          }
        }

        /* الشريط الجانبي الثابت */
        .fixed-sidebar {
          position: fixed;
          top: 20px;
          left: 20px; /* نقل إلى اليسار */
          height: calc(100vh - 40px); /* الطول الكامل */
          width: 90px; /* تكبير العرض */
          background: linear-gradient(
            180deg,
            rgba(104, 123, 140, 0.95) 0%,
            rgba(145, 151, 154, 0.95) 50%,
            rgba(108, 113, 117, 0.95) 100%
          );
          backdrop-filter: blur(20px);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(52, 73, 94, 0.15);
          border: 1px solid rgba(52, 73, 94, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1000;
          transform: translateX(0);
          opacity: 1;
          overflow: visible; /* مهم جداً لظهور التلميحات */
        }

        .fixed-sidebar.visible {
          transform: translateX(0);
          opacity: 1;
        }

        .fixed-sidebar.hidden {
          transform: translateX(-120%); /* تغيير الاتجاه للإخفاء إلى اليسار */
          opacity: 0;
        }

        .sidebar-search-section {
          padding: 16px 0;
          border-bottom: 1px solid var(--border-color);
          position: relative;
        }

        .search-icon-btn {
          width: 60px; /* تكبير من 48px إلى 60px */
          height: 60px; /* تكبير من 48px إلى 60px */
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--chart-6);
          border: 1px solid #464444ff;
          border-radius: 15px; /* تكبير border-radius */
          color: var(--primary-color);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
          box-shadow: 0 2px 8px rgba(52, 73, 94, 0.1);
        }

        .search-icon-btn:hover {
          background: var(--chart-10);
          color: white;
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(52, 73, 94, 0.3);

        }

        .search-icon-btn.active {
          background: var(--primary-color);
          color: white;
          box-shadow: 0 4px 12px rgba(52, 73, 94, 0.52);
        }

        .search-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(4px);
          z-index: 9998;
          cursor: pointer;
        }

        .search-form-overlay {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%) scale(0.95);
          width: 500px;
          max-width: calc(100vw - 40px);
          max-height: 0;
          opacity: 0;
          visibility: hidden;
          overflow: hidden;
          background: var(--background-paper) !important;
          backdrop-filter: blur(20px);
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(52, 73, 94, 0.15);
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
          z-index: 9999;
          border: 2px solid black !important;
        }

        .search-form-overlay.expanded {
          max-height: 200px !important;
          opacity: 1 !important;
          visibility: visible !important;
          border: 2px solid var(--primary-color) !important;
          box-shadow: 0 8px 32px rgba(52, 73, 94, 0.4) !important;
          transform: translateX(-50%) scale(1) !important;
        }

        .search-form {
          padding: 16px;
          width: 100%;
        }

        .search-input-container {
          display: flex;
          align-items: center;
          background: var(--background-paper);
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(52, 73, 94, 0.1);
          border: 1px solid var(--border-color);
        }

        .search-input {
          flex: 1;
          padding: 12px 16px;
          border: none;
          background: transparent;
          font-size: 14px;
          color: var(--text-primary);
          font-family: var(--font-family-arabic);
          outline: none;
        }

        .search-input::placeholder {
          color: var(--text-muted);
        }

        .search-submit-btn {
          padding: 12px;
          background: var(--primary-color);
          border: none;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .search-submit-btn:hover {
          background: var(--primary-dark);
          transform: scale(1.05);
        }

        .sidebar-nav {
          flex: 1; /* إعادة التمدد الكامل */
          padding: 15px 0; /* تكبير المساحات الداخلية */
          display: flex;
          flex-direction: column;
          gap: 12px; /* تكبير المسافة بين العناصر */
          overflow-y: auto;
          scrollbar-width: none;
        }

        .sidebar-nav::-webkit-scrollbar {
          display: none;
        }

        .nav-item-wrapper {
          position: relative;
          margin: 0 11px;
          overflow: visible; /* مهم لظهور التلميحات */
          z-index: 1001; /* ضمان ظهور التلميحات فوق العناصر الأخرى */
        }

        .nav-item {
          width: 60px; /* تكبير من 48px إلى 60px */
          height: 60px; /* تكبير من 48px إلى 60px */
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          border-radius: 15px; /* تكبير border-radius */
          color: rgba(52, 65, 75, 0.86);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          background: rgba(52, 73, 94, 0.05);
          backdrop-filter: blur(1px);
          border: 2px solid rgba(167, 180, 194, 0.58);
        }

        .nav-item:hover {
          color: var(--item-color);
          background: rgba(52, 73, 94, 0.15);
          transform: translateX(-2px) scale(1.05);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }

        .nav-item.active {
          color: var(--item-color);
          background: rgba(52, 73, 94, 0.2);
          transform: translateX(-2px);
          box-shadow: 
            0 4px 16px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(52, 73, 94, 0.2);
        }

        .nav-icon {
          font-size: 26px !important; /* تكبير الأيقونات */
          transition: all 0.3s ease;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
        }

        .active-indicator {
          position: absolute;
          left: -11px; /* تغيير من right إلى left */
          top: 0;
          bottom: 0;
          width: 4px;
          border-radius: 0 2px 2px 0; /* تغيير border-radius للجهة اليسرى */
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            left: -20px; /* تغيير من right إلى left */
            opacity: 0;
          }
          to {
            left: -11px; /* تغيير من right إلى left */
            opacity: 1;
          }
        }

        .glow-effect {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border-radius: 14px;
          z-index: -1;
          animation: glow 0.3s ease;
        }

        @keyframes glow {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* tooltip عام لكل عناصر التنقل - نفس طريقة زر الثيم */
        .nav-item-wrapper {
          position: relative;
        }
        
        .nav-item[data-tooltip]:hover::after {
          content: attr(data-tooltip);
          position: absolute;
          left: 75px;
          top: 50%;
          transform: translateY(-50%);
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(30, 30, 30, 0.95) 100%);
          color: white;
          padding: 10px 15px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
          z-index: 9999;
          backdrop-filter: blur(15px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
          font-family: 'Cairo', -apple-system, BlinkMacSystemFont, sans-serif;
          animation: tooltipAppear 0.3s ease-out;
        }

        .nav-item[data-tooltip]:hover::before {
          content: '';
          position: absolute;
          left: 67px;
          top: 50%;
          transform: translateY(-50%);
          border: 8px solid transparent;
          border-right-color: rgba(0, 0, 0, 0.95);
          z-index: 10000;
        }

        @keyframes tooltipAppear {
          0% {
            opacity: 0;
            transform: translateY(-50%) translateX(0px) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: translateY(-50%) translateX(10px) scale(1);
          }
        }

        .sidebar-footer {
          padding: 16px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .theme-toggle-btn {
          width: 60px; /* تكبير من 48px إلى 60px */
          height: 60px; /* تكبير من 48px إلى 60px */
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 15px; /* تكبير border-radius */
          color: rgba(255, 255, 255, 0.9);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .theme-toggle-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }

        /* الوضع المظلم */
        [data-theme="dark"] .fixed-sidebar {
          background: linear-gradient(
            180deg,
            rgba(32, 31, 31, 0.73) 0%,
            rgba(30, 30, 30, 0.81) 50%,
            rgba(42, 42, 42, 0.95) 100%
          );
          border-left-color: rgba(255, 255, 255, 0.05);
        }

        [data-theme="dark"] .search-form-overlay {
          background: rgba(30, 30, 30, 0.95);
          border-color: rgba(255, 255, 255, 0.1);
        }

        [data-theme="dark"] .search-input-container {
          background: #2d2d2d;
        }

        [data-theme="dark"] .search-input {
          color: #e0e0e0;
        }

        [data-theme="dark"] .nav-item {
          border: none;
        }

        /* الاستجابة للشاشات المختلفة */
        @media (max-width: 480px) {
          .fixed-sidebar {
            width: 60px;
            left: 15px; /* القائمة في اليسار */
          }
          
          .logo-menu-button {
            top: 15px;
            right: 15px; /* اللوجو في اليمين */
          }
          
          .nav-item,
          .search-icon-btn,
          .theme-toggle-btn {
            width: 40px;
            height: 40px;
          }
          
          .search-form-overlay {
            width: calc(100vw - 20px);
            max-width: calc(100vw - 20px);
            top: 10px;
          }
        }

        /* الشاشات الصغيرة جداً */
        @media (max-width: 360px) {
          .logo-menu-button {
            top: 10px;
            right: 10px; /* اللوجو في اليمين */
          }

          .fixed-sidebar {
            left: 10px; /* القائمة في اليسار */
          }
        }

        @media (min-width: 768px) and (max-width: 1024px) {
          .search-form-overlay {
            width: 350px;
            right: 60px;
          }
        }

        /* تحسينات الأداء */
        .fixed-sidebar,
        .logo-menu-button {
          contain: layout style paint;
        }

        /* tooltip خاص بزر البحث - نفس طريقة باقي الأزرار */
        .search-icon-btn[data-tooltip]:hover::after {
          content: attr(data-tooltip);
          position: absolute;
          left: 75px;
          top: 50%;
          transform: translateY(-50%);
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(30, 30, 30, 0.95) 100%);
          color: white;
          padding: 10px 15px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
          z-index: 9999;
          backdrop-filter: blur(15px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
          font-family: 'Cairo', -apple-system, BlinkMacSystemFont, sans-serif;
          animation: tooltipAppear 0.3s ease-out;
        }

        .search-icon-btn[data-tooltip]:hover::before {
          content: '';
          position: absolute;
          left: 67px;
          top: 50%;
          transform: translateY(-50%);
          border: 8px solid transparent;
          border-right-color: rgba(0, 0, 0, 0.95);
          z-index: 10000;
        }

        /* tooltip خاص بزر الثيم */
        .theme-toggle-btn {
          position: relative;
        }

        .theme-toggle-btn:hover::after {
          content: 'تبديل الوضع المظلم/الفاتح';
          position: absolute;
          left: 75px;
          top: 50%;
          transform: translateY(-50%);
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(30, 30, 30, 0.95) 100%);
          color: white;
          padding: 10px 15px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
          z-index: 1002;
          backdrop-filter: blur(15px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
          font-family: 'Cairo', -apple-system, BlinkMacSystemFont, sans-serif;
          animation: tooltipAppear 0.3s ease-out;
        }

        .theme-toggle-btn:hover::before {
          content: '';
          position: absolute;
          left: 67px;
          top: 50%;
          transform: translateY(-50%);
          border: 8px solid transparent;
          border-right-color: rgba(0, 0, 0, 0.95);
          z-index: 1003;
        }

        /* تحسينات إمكانية الوصول */
        @media (prefers-reduced-motion: reduce) {
          .fixed-sidebar,
          .nav-item,
          .search-form-overlay,
          .tooltip,
          .glow-effect,
          .active-indicator {
            transition: none;
            animation: none;
          }
        }
      `}</style>
    </>
  );
}

export default AppAppBar;