import '../styles/variables.css';
import '../styles/globals.css';
import AppTheme from '../theme/AppTheme';
import { Box } from '@mui/material';
import AppAppBar from '../components/AppAppBar';
import Footer from '../components/Footer';
import { ThemeProvider } from '../components/ThemeContext';
import { ThemeSync } from '../components/ThemeSync';
import Layout from '../components/Layout';

export default function MyApp({ Component, pageProps }) {
  return (
    <Box className="siteWrapper">
      <AppTheme>
        <ThemeProvider>
          <ThemeSync />
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <AppAppBar />
          <Footer />
        </ThemeProvider>
      </AppTheme>
    </Box>
  );
}
