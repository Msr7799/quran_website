// import * as React from 'react';
// import { alpha, styled } from '@mui/material/styles';
// import Box from '@mui/material/Box';
// import AppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
// import Button from '@mui/material/Button';
// import IconButton from '@mui/material/IconButton';
// import Container from '@mui/material/Container';
// import Divider from '@mui/material/Divider';
// import MenuItem from '@mui/material/MenuItem';
// import Drawer from '@mui/material/Drawer';
// import MenuIcon from '@mui/icons-material/Menu';
// import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
// import ColorModeIconDropdown from '.././theme/ColorModeIconDropdown';
// import Sitemark from './SitemarkIcon';

// const StyledToolbar = styled(Toolbar)(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'space-between',
//   flexShrink: 0,
//   borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
//   backdropFilter: 'blur(24px)',
//   border: '1px solid',
//   borderColor: (theme.vars || theme).palette.divider,
//   backgroundColor: theme.vars
//     ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
//     : alpha(theme.palette.background.default, 0.4),
//   boxShadow: (theme.vars || theme).shadows[1],
//   padding: '8px 12px',
// }));

// export default function AppAppBar() {
//   const [open, setOpen] = React.useState(false);

//   const toggleDrawer = (newOpen: boolean) => () => {
//     setOpen(newOpen);
//   };

//   return (
//     <AppBar
//       position="fixed"
//       enableColorOnDark
//       sx={{
//         boxShadow: 0,
//         bgcolor: 'transparent',
//         backgroundImage: 'none',
//         mt: 'calc(var(--template-frame-height, 0px) + 28px)',
//       }}
//     >
//       <Container maxWidth="lg">
//         <StyledToolbar variant="dense" disableGutters>
//           <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
//             <Sitemark />
//             <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
//               <Button variant="text" color="info" size="small">
//                 Features
//               </Button>
//               <Button variant="text" color="info" size="small">
//                 Testimonials
//               </Button>
//               <Button variant="text" color="info" size="small">
//                 Highlights
//               </Button>
//               <Button variant="text" color="info" size="small">
//                 Pricing
//               </Button>
//               <Button variant="text" color="info" size="small" sx={{ minWidth: 0 }}>
//                 FAQ
//               </Button>
//               <Button variant="text" color="info" size="small" sx={{ minWidth: 0 }}>
//                 Blog
//               </Button>
//             </Box>
//           </Box>
//           <Box
//             sx={{
//               display: { xs: 'none', md: 'flex' },
//               gap: 1,
//               al

              
// [data-theme="light"] body {
//   background: linear-gradient(180deg, #cfd9df 0%, #ffffff 100%) !important;


//   color: #000000 !important;
// }

// /* الوضع الليلي: تدرج أسود مع أزرق وبنفسجي خفيف */
// [data-theme="dark"] body {
//   background: radial-gradient(ellipse at 70% 0%, #3bb4e5 0%, #222b3a 40%, #000 80%),
//               radial-gradient(ellipse at 30% 60%, #a05fa7 0%, transparent 60%) !important;
//   background-blend-mode: lighten !important;
//   color: #f0eaeae6 !important;
//   font-weight: 600;
// }

// /* تقليل البنفسجي: opacity أقل أو مزج مع الشفافية */
// [data-theme="dark"] body {
//   /* البنفسجي خفيف جداً */
//   background: 
//     radial-gradient(ellipse at 70% 0%, #3bb4e5 0%, #222b3a 40%, #000 80%),
//     radial-gradient(ellipse at 30% 60%, rgba(160,95,167,0.25) 0%, transparent 60%) !important; 
//      background-blend-mode: lighten !important ;
//   color: #bababa !important;
//   font-weight: 600;
// }
