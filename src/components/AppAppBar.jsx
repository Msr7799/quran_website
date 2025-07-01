import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Tooltip from '@mui/material/Tooltip';
import ClickAwayListener from '@mui/material/ClickAwayListener';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import BookIcon from '@mui/icons-material/Book';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import RadioIcon from '@mui/icons-material/Radio';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import InfoIcon from '@mui/icons-material/Info';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PersonIcon from '@mui/icons-material/Person';
import ErrorIcon from '@mui/icons-material/Error';
import MenuIcon from '@mui/icons-material/Menu';

import ColorModeIconDropdown from '../theme/ColorModeIconDropdown';

const SIDEBAR_WIDTH = 100;

// Styled Components
const SidebarContainer = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: 0,
  right: 0,
  height: '100vh',
  background: theme.palette.mode === 'light'
    ? 'linear-gradient(135deg, #333334, #606060)'
    : 'linear-gradient(135deg,rgb(117, 139, 161) 0%,rgb(255, 255, 255) 100%)',
  zIndex: 1300,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '10px 0',
  boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
  backdropFilter: 'blur(10px)',
  transition: 'width 0.3s ease',
  overflow: 'hidden',
}));

const SidebarIcon = styled(IconButton)(({ theme }) => ({
  width: 55,
  height: 45,
  margin: '4px',
  color: 'rgba(255,255,255,0.7)',
  backgroundColor: 'transparent',
  borderRadius: '14px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#fff',
    transform: 'scale(1.1)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '26px',
  },
  '&.active': {
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.2)',
  }
}));

const MenuButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  top: '10px',
  right: '100px', 
  width: '70px',
 height: '70px',
  zIndex: 1400,
  color: '#fff',
  backgroundColor: 'rgba(0, 0, 0, 0.553)',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.457)',
  },
}));

const SearchContainer = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: '75px',
  right: '75px',
  height: '50px',
  backgroundColor: 'rgba(255,255,255,0.95)',
  borderRadius: '25px',
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  zIndex: 1400,
  backdropFilter: 'blur(10px)',
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
  flex: 1,
  padding: '0 20px',
  color: '#333',
  fontSize: '16px',
  '& .MuiInputBase-input': {
    '&::placeholder': {
      color: '#666',
      opacity: 1,
    },
  },
}));

const SearchButton = styled(IconButton)(({ theme }) => ({
  padding: '10px',
  color: '#666',
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
}));

const ThemeToggleContainer = styled(Box)(({ theme }) => ({
  marginTop: 'auto',
  marginBottom: '20px',
}));

const MainContent = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  transition: 'margin-right 0.3s ease',
}));

const navigationItems = [
  { text: 'الصفحة الرئيسية', icon: HomeIcon, href: '/' },
  { text: 'المصحف الشريف', icon: BookIcon, href: '/quran' },
  { text: 'الصوتيات', icon: VolumeUpIcon, href: '/quran-sound' },
  { text: 'المصحف PDF', icon: PictureAsPdfIcon, href: '/quran-pdf' },
  { text: 'الإذاعة', icon: LiveTvIcon, href: '/live' },
  { text: 'التفسير', icon: BookIcon, href: '/quran-tafseer' },
  { text: 'من نحن', icon: InfoIcon, href: '/about' },
  { text: 'صفحة الخطأ', icon: ErrorIcon, href: '/404' },
];

function AppAppBarContent({ children }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const theme = useTheme();
  const searchInputRef = useRef(null);
  const inactivityTimerRef = useRef(null);
  const sidebarRef = useRef(null);

  // Función para manejar el toggle del menú
  const handleMenuToggle = () => {
    setSidebarExpanded(!sidebarExpanded);
    resetInactivityTimer();
  };

  // Función para manejar el toggle de la búsqueda
  const handleSearchToggle = () => {
    setSearchExpanded(!searchExpanded);
    resetInactivityTimer();
    
    // Focus on search input when expanded
    if (!searchExpanded) {
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 300);
    }
  };

  // Detectar clics en el icono de búsqueda
  const handleSearchIconClick = (e) => {
    e.preventDefault();
    handleSearchToggle();
  };

  // Restablecer el temporizador de inactividad
  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    
    inactivityTimerRef.current = setTimeout(() => {
      if (sidebarExpanded) {
        setSidebarExpanded(false);
      }
    }, 15000); // 15 segundos
  };

  // Detectar movimiento del mouse o interacción con el teclado para restablecer el temporizador
  useEffect(() => {
    const handleUserActivity = () => {
      resetInactivityTimer();
    };

    // Eventos para detectar actividad del usuario
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);

    // Iniciar el temporizador
    resetInactivityTimer();

    return () => {
      // Limpiar los event listeners y el temporizador al desmontar
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
      
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [sidebarExpanded]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // استخدام الروت الصحيح للبحث
      router.push(`/search/${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSearchExpanded(false);
    }
  };

  const handleSearchClickAway = () => {
    if (searchExpanded && !searchQuery.trim()) {
      setSearchExpanded(false);
    }
  };

  const isActive = (href) => {
    if (href === '/') {
      return router.pathname === '/';
    }
    return router.pathname === href || router.pathname.startsWith(href + '/');
  };

  return (
    <>
      {/* Menú Hamburguesa */}
      <MenuButton onClick={handleMenuToggle} aria-label="قائمة">
        <MenuIcon />
      </MenuButton>

      {/* Fixed Vertical Sidebar */}
      <SidebarContainer
        ref={sidebarRef}
        style={{
          width: sidebarExpanded ? `${SIDEBAR_WIDTH}px` : '0px',
        }}
      >
        {/* Search Icon */}
        <Tooltip title="البحث في القرآن" placement="bottom">
          <SidebarIcon onClick={handleSearchIconClick}>
            <SearchIcon />
          </SidebarIcon>
        </Tooltip>
        <div style={{ background: 'lime', width: 5, height: '80%', margin: '0 10px' }} />

        {/* Navigation Icons */}
        {navigationItems.map((item) => (
          <Tooltip key={item.href} title={item.text} placement="bottom">
            <Link href={item.href} passHref>
              <SidebarIcon className={isActive(item.href) ? 'active' : ''}>
                <item.icon />
              </SidebarIcon>
            </Link>
          </Tooltip>
        ))}

        {/* Theme Toggle - Moved to the right side */}
        <Box sx={{ marginLeft: 'auto' }}>
          <Tooltip title="تغيير المظهر" placement="bottom">
            <div style={{ display: 'inline-block', marginRight: '22px', border: '9px solid rgba(255,255,255,0.5)', borderRadius: '20%', marginBottom: '25px', marginTop: '9px'  }}>
              <ColorModeIconDropdown />
            </div>
          </Tooltip>
        </Box>
      </SidebarContainer>

      {/* Expandable Search */}
      {searchExpanded && (
        <ClickAwayListener onClickAway={handleSearchClickAway}>
          <SearchContainer style={{
            width: searchExpanded ? '320px' : '0px',
            opacity: searchExpanded ? 1 : 0,
            boxShadow: searchExpanded ? '0 4px 20px rgba(0,0,0,0.2)' : 'none',
          }}>
            <form onSubmit={handleSearchSubmit} style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
              <SearchInput
                placeholder="ابحث في القرآن الكريم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                inputRef={searchInputRef}
                autoFocus={true}
              />
              <SearchButton
               style={{
                 backgroundColor: 'rgba(214, 214, 214, 0.8)',
                 color: '#333',
                  borderRadius: '50%',
                  left: '5px',
               }}
              
              type="submit">
                <SearchIcon />
              </SearchButton>
            </form>
          </SearchContainer>
        </ClickAwayListener>
      )}

      {/* Main Content Area */}
      <MainContent style={{
        marginRight: sidebarExpanded ? `${SIDEBAR_WIDTH}px` : '0px',
        width: sidebarExpanded ? `calc(100% - ${SIDEBAR_WIDTH}px)` : '100%',
      }}>
        {children}
      </MainContent>
    </>
  );
}

export default function AppAppBar({ children }) {
  return <AppAppBarContent>{children}</AppAppBarContent>;
}