import { useEffect } from 'react';
import { useColorScheme } from '@mui/material/styles';
import { useTheme } from './ThemeContext';

export function ThemeSync() {
  const { mode } = useColorScheme();
  const { darkMode, setDarkMode } = useTheme();
  
  // مزامنة وضع MUI مع ThemeContext
  useEffect(() => {
    if (mode === 'dark' && !darkMode) {
      setDarkMode(true);
    } else if (mode === 'light' && darkMode) {
      setDarkMode(false);
    }
  }, [mode, darkMode, setDarkMode]);

  useEffect(() => {
    // تطبيق الثيم على العنصر الجذر
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // هذا المكون لا يعرض شيئاً، فقط يتعامل مع الثيم
  return null;
}