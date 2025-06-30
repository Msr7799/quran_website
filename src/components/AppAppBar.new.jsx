// import React, { useState } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/router';
// import { alpha, styled, useTheme } from '@mui/material/styles';
// import Box from '@mui/material/Box';
// import Drawer from '@mui/material/Drawer';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import IconButton from '@mui/material/IconButton';
// import InputBase from '@mui/material/InputBase';
// import Divider from '@mui/material/Divider';
// import Collapse from '@mui/material/Collapse';
// import Avatar from '@mui/material/Avatar';
// import Typography from '@mui/material/Typography';

// // Icons
// import MenuIcon from '@mui/icons-material/Menu';
// import CloseIcon from '@mui/icons-material/Close';
// import SearchIcon from '@mui/icons-material/Search';
// import HomeIcon from '@mui/icons-material/Home';
// import BookIcon from '@mui/icons-material/Book';
// import VolumeUpIcon from '@mui/icons-material/VolumeUp';
// import RadioIcon from '@mui/icons-material/Radio';
// import InfoIcon from '@mui/icons-material/Info';
// import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
// import PersonIcon from '@mui/icons-material/Person';
// import ExpandLessIcon from '@mui/icons-material/ExpandLess';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import DarkModeIcon from '@mui/icons-material/DarkMode';
// import LightModeIcon from '@mui/icons-material/LightMode';

// import ColorModeIconDropdown from '../theme/ColorModeIconDropdown';
// import AsmaAllahCarousel from './AsmaAllahCarousel';
// import HadithCarousel from './HadithCarousel';
// import Image from 'next/image';

// const DRAWER_WIDTH = 320;

// // Styled Components
// const StyledDrawer = styled(Drawer)(({ theme }) => ({
//   width: DRAWER_WIDTH,
//   flexShrink: 0,
//   '& .MuiDrawer-paper': {
//     width: DRAWER_WIDTH,
//     boxSizing: 'border-box',
//     background: theme.palette.mode === 'light' 
//       ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
//       : 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
//     color: '#fff',
//     borderRadius: '0 20px 20px 0',
//     boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
//     backdropFilter: 'blur(10px)',
//     border: 'none',
//   },
// }));

// const LogoSection = styled(Box)(({ theme }) => ({
//   padding: '20px 16px',
//   textAlign: 'center',
//   borderBottom: '1px solid rgba(255,255,255,0.1)',
//   background: 'rgba(255,255,255,0.05)',
// }));

// const SearchSection = styled(Box)(({ theme }) => ({
//   padding: '16px',
//   borderBottom: '1px solid rgba(255,255,255,0.1)',
// }));

// const StyledSearchInput = styled(InputBase)(({ theme }) => ({
//   width: '100%',
//   padding: '10px 16px',
//   backgroundColor: 'rgba(255,255,255,0.1)',
//   borderRadius: '25px',
//   color: '#fff',
//   border: '1px solid rgba(255,255,255,0.2)',
//   '&:hover': {
//     backgroundColor: 'rgba(255,255,255,0.15)',
//   },
//   '&.Mui-focused': {
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     border: '1px solid rgba(255,255,255,0.4)',
//   },
//   '& .MuiInputBase-input': {
//     '&::placeholder': {
//       color: 'rgba(255,255,255,0.7)',
//       opacity: 1,
//     },
//   },
// }));

// const MenuToggle = styled(IconButton)(({ theme }) => ({
//   position: 'fixed',
//   top: 20,
//   right: 20,
//   zIndex: 1300,
//   backgroundColor: theme.palette.mode === 'light' ? '#667eea' : '#2c3e50',
//   color: '#fff',
//   width: 56,
//   height: 56,
//   boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
//   '&:hover': {
//     backgroundColor: theme.palette.mode === 'light' ? '#5a6fd8' : '#34495e',
//     transform: 'scale(1.05)',
//   },
//   transition: 'all 0.3s ease',
// }));

// const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
//   borderRadius: '12px',
//   margin: '4px 8px',
//   padding: '12px 16px',
//   '&:hover': {
//     backgroundColor: 'rgba(255,255,255,0.1)',
//     transform: 'translateX(-5px)',
//   },
//   '&.Mui-selected': {
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     '&:hover': {
//       backgroundColor: 'rgba(255,255,255,0.25)',
//     },
//   },
//   transition: 'all 0.3s ease',
// }));

// const CarouselSection = styled(Box)(({ theme }) => ({
//   padding: '16px',
//   borderTop: '1px solid rgba(255,255,255,0.1)',
//   marginTop: 'auto',
// }));

// const navigationItems = [
//   { text: 'الصفحة الرئيسية', icon: HomeIcon, href: '/' },
//   { text: 'المصحف الشريف', icon: BookIcon, href: '/quran', hasSubmenu: true },
//   { text: 'الصوتيات', icon: VolumeUpIcon, href: '/quran-sound', hasSubmenu: true },
//   { text: 'المصحف PDF', icon: PictureAsPdfIcon, href: '/quran-pdf' },
//   { text: 'الراديو', icon: RadioIcon, href: '/quran-radio' },
//   { text: 'التفسير', icon: BookIcon, href: '/quran-tafseer' },
//   { text: 'من نحن', icon: InfoIcon, href: '/about' },
// ];

// const quranSubmenu = [
//   { text: 'فهرس السور', href: '/quran' },
//   { text: 'البحث في القرآن', href: '/search' },
// ];

// const audioSubmenu = [
//   { text: 'قائمة القراء', href: '/quran-sound' },
//   { text: 'أشهر القراء', href: '/quran-sound/popular' },
// ];

// function AppAppBarContent() {
//   const [open, setOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [expandedMenu, setExpandedMenu] = useState(null);
//   const router = useRouter();
//   const theme = useTheme();

//   React.useEffect(() => {
//     const link = document.createElement('link');
//     link.rel = 'preload';
//     link.as = 'image';
//     link.href = '/logoq.png';
//     document.head.appendChild(link);
//     return () => { document.head.removeChild(link); };
//   }, []);

//   const toggleDrawer = () => {
//     setOpen(!open);
//   };

//   const closeDrawer = () => {
//     setOpen(false);
//     setExpandedMenu(null);
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       router.push(`/search/${encodeURIComponent(searchQuery)}`);
//       closeDrawer();
//     }
//   };

//   const handleMenuExpand = (menuKey) => {
//     setExpandedMenu(expandedMenu === menuKey ? null : menuKey);
//   };

//   const isActive = (href) => {
//     return router.pathname === href || router.pathname.startsWith(href + '/');
//   };

//   return (
//     <>
//       {/* Toggle Button */}
//       <MenuToggle onClick={toggleDrawer}>
//         {open ? <CloseIcon /> : <MenuIcon />}
//       </MenuToggle>

//       {/* Sidebar Navigation */}
//       <StyledDrawer
//         variant="persistent"
//         anchor="right"
//         open={open}
//         onClose={closeDrawer}
//       >
//         {/* Logo Section */}
//         <LogoSection>
//           <Link href="/" onClick={closeDrawer}>
//             <Image
//               src="/logoq.png"
//               alt="Quran Logo"
//               width={80}
//               height={40}
//               style={{ marginBottom: '10px' }}
//               priority
//             />
//           </Link>
//           <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fff' }}>
//             القرآن الكريم
//           </Typography>
//           <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 1 }}>
//             موقع شامل للقرآن الكريم
//           </Typography>
//         </LogoSection>

//         {/* Search Section */}
//         <SearchSection>
//           <form onSubmit={handleSearch}>
//             <Box sx={{ position: 'relative' }}>
//               <StyledSearchInput
//                 placeholder="ابحث في القرآن..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 startAdornment={
//                   <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)', mr: 1 }} />
//                 }
//               />
//             </Box>
//           </form>
//         </SearchSection>

//         {/* Navigation Menu */}
//         <List sx={{ flex: 1, py: 2 }}>
//           {navigationItems.map((item) => (
//             <React.Fragment key={item.text}>
//               <ListItem disablePadding>
//                 {item.hasSubmenu ? (
//                   <StyledListItemButton
//                     selected={isActive(item.href)}
//                     onClick={() => handleMenuExpand(item.href)}
//                   >
//                     <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>
//                       <item.icon />
//                     </ListItemIcon>
//                     <ListItemText 
//                       primary={item.text} 
//                       sx={{ 
//                         '& .MuiListItemText-primary': { 
//                           fontWeight: 'medium',
//                           fontSize: '1rem' 
//                         } 
//                       }} 
//                     />
//                     {expandedMenu === item.href ? <ExpandLessIcon /> : <ExpandMoreIcon />}
//                   </StyledListItemButton>
//                 ) : (
//                   <Link href={item.href} style={{ width: '100%', textDecoration: 'none' }}>
//                     <StyledListItemButton
//                       selected={isActive(item.href)}
//                       onClick={closeDrawer}
//                     >
//                       <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>
//                         <item.icon />
//                       </ListItemIcon>
//                       <ListItemText 
//                         primary={item.text} 
//                         sx={{ 
//                           '& .MuiListItemText-primary': { 
//                             fontWeight: 'medium',
//                             fontSize: '1rem' 
//                           } 
//                         }} 
//                       />
//                     </StyledListItemButton>
//                   </Link>
//                 )}
//               </ListItem>

//               {/* Submenu for Quran */}
//               {item.href === '/quran' && (
//                 <Collapse in={expandedMenu === '/quran'} timeout="auto" unmountOnExit>
//                   <List component="div" disablePadding>
//                     {quranSubmenu.map((subItem) => (
//                       <ListItem key={subItem.text} disablePadding>
//                         <Link href={subItem.href} style={{ width: '100%', textDecoration: 'none' }}>
//                           <StyledListItemButton
//                             sx={{ pl: 6 }}
//                             selected={isActive(subItem.href)}
//                             onClick={closeDrawer}
//                           >
//                             <ListItemText 
//                               primary={subItem.text}
//                               sx={{ 
//                                 '& .MuiListItemText-primary': { 
//                                   fontSize: '0.9rem',
//                                   color: 'rgba(255,255,255,0.8)' 
//                                 } 
//                               }} 
//                             />
//                           </StyledListItemButton>
//                         </Link>
//                       </ListItem>
//                     ))}
//                   </List>
//                 </Collapse>
//               )}

//               {/* Submenu for Audio */}
//               {item.href === '/quran-sound' && (
//                 <Collapse in={expandedMenu === '/quran-sound'} timeout="auto" unmountOnExit>
//                   <List component="div" disablePadding>
//                     {audioSubmenu.map((subItem) => (
//                       <ListItem key={subItem.text} disablePadding>
//                         <Link href={subItem.href} style={{ width: '100%', textDecoration: 'none' }}>
//                           <StyledListItemButton
//                             sx={{ pl: 6 }}
//                             selected={isActive(subItem.href)}
//                             onClick={closeDrawer}
//                           >
//                             <ListItemText 
//                               primary={subItem.text}
//                               sx={{ 
//                                 '& .MuiListItemText-primary': { 
//                                   fontSize: '0.9rem',
//                                   color: 'rgba(255,255,255,0.8)' 
//                                 } 
//                               }} 
//                             />
//                           </StyledListItemButton>
//                         </Link>
//                       </ListItem>
//                     ))}
//                   </List>
//                 </Collapse>
//               )}
//             </React.Fragment>
//           ))}

//           <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
          
//           {/* Theme Toggle */}
//           <ListItem disablePadding>
//             <StyledListItemButton>
//               <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>
//                 {theme.palette.mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
//               </ListItemIcon>
//               <ColorModeIconDropdown />
//             </StyledListItemButton>
//           </ListItem>
//         </List>

//         {/* Carousel Sections */}
//         <CarouselSection>
//           <Typography variant="h6" sx={{ mb: 2, color: '#fff', textAlign: 'center' }}>
//             أسماء الله الحسنى
//           </Typography>
//           <AsmaAllahCarousel />
          
//           <Typography variant="h6" sx={{ mb: 2, mt: 3, color: '#fff', textAlign: 'center' }}>
//             الأحاديث الشريفة
//           </Typography>
//           <HadithCarousel />
//         </CarouselSection>
//       </StyledDrawer>

//       {/* Main Content Area */}
//       <Box
//         sx={{
//           transition: 'margin-right 0.3s ease',
//           marginRight: open ? `${DRAWER_WIDTH}px` : 0,
//           minHeight: '100vh',
//         }}
//       >
//         {/* Background Images */}
//         <Box
//           sx={{
//             backgroundImage: 'url(./liner.svg)',
//             height: '60vh',
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//             backgroundRepeat: 'no-repeat',
//             filter: 'contrast(1) brightness(0.9) drop-shadow(0 0 2px rgba(207, 193, 193, 0.356))'
//           }}
//         />
        
//         <Box
//           sx={{
//             backgroundImage: 'url(/alf.gif)',
//             height: '120vh',
//             borderTop: '19px solid #000',
//             borderBottom: '19px solid #000',
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//             margin: '1rem 0',
//             filter: 'contrast(1) brightness(0.9) drop-shadow(0 0 2px rgba(207, 193, 193, 0.356))'
//           }}
//         />
        
//         <Box sx={{ textAlign: 'center', margin: '2rem 0' }}>
//           <Image
//             src="./aqra1.svg"
//             alt="iqra"
//             width={1300}
//             height={350}
//             style={{
//               position: 'relative',
//               maxWidth: '50%',
//               left: 8,
//               zIndex: -5,
//               height: '30%',
//               filter: 'contrast(1.5) brightness(1) drop-shadow(0 2px 1px rgba(116, 52, 52, 0.06))'
//             }}
//             priority
//           />
//         </Box>
//       </Box>

//       {/* Overlay when drawer is open */}
//       {open && (
//         <Box
//           sx={{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             backgroundColor: 'rgba(0,0,0,0.5)',
//             zIndex: 1200,
//           }}
//           onClick={closeDrawer}
//         />
//       )}
//     </>
//   );
// }

// export default function AppAppBar() {
//   const theme = useTheme();
  
//   if (typeof window !== 'undefined') {
//     document.body.style.scrollPaddingTop = '80px';
//   }

//   return <AppAppBarContent />;
// }
