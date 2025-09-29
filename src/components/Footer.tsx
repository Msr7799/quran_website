/* eslint-disable @next/next/no-img-element */
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/X';
import LanguageIcon from '@mui/icons-material/Language';
import ScrollToTop from './ScrollToTop';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';




function Copyright() {
  
  return (

    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      width: '100%',
      mt: 4,
      mb: 2,
      px: { xs: 2, sm: 3, md: 4 }
    }}>
      <Typography 
        variant="h4" 
        sx={{ 
          color: 'rgba(91, 101, 97, 0.8)', 
          fontSize: { xs: '1.25rem', sm: '1.375rem', md: '1.5rem' },
          lineHeight: { xs: 1.6, sm: 1.7, md: 1.3 },
          fontWeight: 800,
          textAlign: 'center',
          letterSpacing: '2px',
          textShadow: '0 3px 5px rgba(26, 26, 26, 0.05), 0 1px 2px rgba(0,0,0,0.2)',
          textDecoration: 'none',
         mb: 3,
          fontFamily: '"Amiri", "Times New Roman", serif'
          }}
          >
        اللهم أجعل هذا الموقع صدقه جاريه لي ولحمد المران ولاهل بيتنا ووالدينا وموتانا اللهم اغفر لهم ورحمهم ووفقنا لخدمة الدين
      </Typography>
      
      <Typography 
        variant="body1" 
        sx={{ 
          color: '#444', 
          fontSize: { xs: '1rem', sm: '1.125rem', md: '1.5rem' },
          lineHeight: { xs: 1.6, sm: 1.7, md: 1.8 },
          fontWeight: 800,
          textAlign: 'center',
          letterSpacing: '1px',
          textShadow: '0 1px 3px rgba(0, 0, 0, 0.13)',
          fontFamily: '"Uthman", "Times New Roman", serif'
        }}
      >
        الموقع هذا يعتبر مصدر مفتوح لنشر القرآن الكريم وبجوده
        <br />
        هذا الموقع مفتوح المصدر وويمكنك أستعمال الكود في حسابي في قت هاب
        <br />
        وقريبا سيتم أنشآء تطبيقين ios & android platforms
        <br />
        اللهم أني أبتغي وجهك فبارك لنا فيه
        <br />
        <strong style={{ color: "rgba(68, 74, 68, 0.78)" }}>
        📿 مـطور الموقع: محمد الـرميـحي | Msr7799 
        </strong>
      </Typography>
    </Box>
  );
}

const keywords = [
  // المجموعة الأولى - الأساسيات
  'القرآن الكريم', 'سور القرآن', 'آيات القرآن', 'Quran Chapters', 'Quran Verses', 'Quran Pages',
  // المجموعة الثانية - البيانات والتقنية  
  'بيانات القرآن', 'Quran API', 'Quran Data', 'قراءة القرآن', 'Quran Recitation', 'تجويد القرآن',
  // المجموعة الثالثة - الصوت والتوقيت
  'صوت القرآن', 'Quran Audio', 'توقيت التلاوة', 'Quran Timing'
];

export default function Footer() {
  const theme = useTheme();
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [messageType, setMessageType] = React.useState<'success' | 'error' | 'warning' | ''>('');
  const [showUnsubscribe, setShowUnsubscribe] = React.useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage('يرجى إدخال بريد إلكتروني صحيح');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();
      
      if (data.ok) {
        setMessage('✅ تم الاشتراك بنجاح! تفقد بريدك الإلكتروني');
        setMessageType('success');
        setEmail(''); // مسح الإيميل بعد النجاح
        setShowUnsubscribe(false);
      } else if (response.status === 409 && data.exists) {
        // الإيميل موجود بالفعل - اعرض خيار إلغاء الاشتراك
        setMessage('هذا البريد الإلكتروني مشترك بالفعل');
        setMessageType('warning');
        setShowUnsubscribe(true);
      } else {
        setMessage(data.message || 'حدث خطأ أثناء الاشتراك');
        setMessageType('error');
        setShowUnsubscribe(false);
      }
    } catch (error) {
      console.error('خطأ في الاشتراك:', error);
      setMessage('حدث خطأ في الشبكة. يرجى المحاولة مرة أخرى.');
      setMessageType('error');
      setShowUnsubscribe(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!email) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/send-unsubscribe-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('خطأ في تحليل استجابة JSON:', parseError);
        data = { error: 'استجابة غير صحيحة من الخادم' };
      }

      if (response.ok) {
        setMessage('تم إرسال رابط تأكيد إلغاء الاشتراك إلى بريدك الإلكتروني 📧');
        setMessageType('success');
        setShowUnsubscribe(false);
        setEmail(''); // مسح الإيميل
        
        // إخفاء الرسالة بعد 10 ثواني
        setTimeout(() => {
          setMessage('');
          setMessageType('');
        }, 10000);
      } else if (response.status === 429) {
        setMessage(data.error || 'تم تجاوز الحد المسموح من المحاولات');
        setMessageType('error');
      } else if (response.status === 404) {
        setMessage('هذا البريد الإلكتروني غير مشترك في النشرة البريدية');
        setMessageType('warning');
        setShowUnsubscribe(false);
      } else if (response.status === 500) {
        setMessage(data.error || 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً.');
        setMessageType('error');
      } else {
        setMessage(data.error || `خطأ غير متوقع (${response.status}). يرجى المحاولة لاحقاً.`);
        setMessageType('error');
      }
    } catch (error) {
      console.error('خطأ في إرسال رابط إلغاء الاشتراك:', error);
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setMessage('فشل الاتصال بالخادم. تحقق من الاتصال بالإنترنت.');
      } else {
        setMessage('حدث خطأ في إرسال رابط التأكيد. يرجى المحاولة لاحقاً.');
      }
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Divider sx={{ borderColor: theme.palette.divider }} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'space-between',
          gap: { xs: 4, sm: 8 , md: 12},
          py: { xs: 8, sm: 10 , md: 12},
          px: { xs: 2, sm: 4, md: 6, lg: 8 },
          textAlign: { sm: 'center', md: 'left' },
          backgroundColor: '#c4c4c4',
          color: theme.palette.text.primary,
          width: '100%',
          maxWidth: '100%',
        }}
        >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            width: '100%',
            justifyContent: 'space-between',
          }}
          >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              minWidth: { xs: '100%', sm: '60%' },
            }}
            >
            <Box sx={{ width: { xs: '70%', sm: '60%' } }}>
              <img
                src="logo.png"
                alt="Quran Logo"
                style={{
                  width: "100px",
                  height: "100px",
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: "10px",
                  backgroundColor: theme.palette.background.paper
                }}
              />
              <Typography
                variant="h6"
                gutterBottom
                sx={{ 
                  fontWeight: 700, 
                  mt: 2, 
                  color: '#262626',
                  fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.375rem' },
                  letterSpacing: '0.8px',
                  textShadow: '0 1px 3px rgba(0,0,0,0.4)',
                  fontFamily: '"Amiri", "Times New Roman", serif'
                }}
              >
                اشترك في الحديث اليومي
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'Firebrick', 
                  mb: 2,
                  fontSize: { xs: '1rem', sm: '1rem', md: '1.25rem' },
                  fontWeight: 600,
                  letterSpacing: '0.6px',

                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.18)',
                  fontFamily: '"Amiri", "Times New Roman", serif'
                }}
              >
                احصل على حديث شريف يومياً من صحيح البخاري أو مسلم في بريدك الإلكتروني
              </Typography>
              <InputLabel 
                htmlFor="email-newsletter" 
                sx={{ 
                  color: '#262626', 
                  mb: 1,
                  fontSize: { xs: '0.9rem', sm: '1rem', md: '1.125rem' },
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  fontFamily: '"Amiri", "Times New Roman", serif'
                }}
              >

              </InputLabel>
              <form onSubmit={handleSend}>
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={{ xs: 2, sm: 1 }} 
                  useFlexGap
                  sx={{ width: '100%' }}
                >
                  <TextField
                    id="email-newsletter"
                    hiddenLabel
                    size="small"
                    variant="outlined"
                    fullWidth
                    aria-label="Enter your email address"
                    placeholder="أدخل بريدك الإلكتروني"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    slotProps={{
                      htmlInput: {
                        autoComplete: 'off',
                        'aria-label': 'Enter your email address',
                      },
                    }}
                    sx={{
                      width: { xs: '100%', sm: '250px' },
                      '& .MuiOutlinedInput-root': {
                        color: theme.palette.text.primary,
                        backgroundColor: theme.palette.background.paper,
                        '& fieldset': {
                          borderColor: 'rgba(31, 86, 115, 0.8)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(31, 86, 115, 0.8)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'rgba(31, 86, 115, 0.8)',
                        },
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: '#262626',
                        opacity: 0.5,
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="medium"
                    disabled={isLoading}
                    sx={{
                      flexShrink: 0,
                      backgroundColor: 'rgba(31, 86, 115, 0.8)', // chart-3 equivalent with opacity
                      color: '#f9f9f9',
                      minWidth: { xs: '100%', sm: '100px' },
                      height: { xs: '50px', sm: '45px' },
                      fontSize: { xs: '1rem', sm: '0.875rem', md: '1rem' },
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      borderRadius: '12px',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                      boxShadow: '0 4px 12px rgba(20, 35, 64, 0.3), 0 2px 4px rgba(0,0,0,0.1)',
                      fontFamily: '"Amiri", "Times New Roman", serif',
                      '&:hover': {
                        backgroundColor: 'rgba(16, 120, 185, 0.9)',
                        boxShadow: '0 6px 16px rgba(255, 255, 255, 0.98), 0 2px 6px rgba(0,0,0,0.15)',
                        transform: 'translateY(-1px)',
                      },
                      '&:disabled': {
                        backgroundColor: 'rgba(26, 94, 102, 0.5)',
                        opacity: 0.7,
                      },
                    }}
                    >
                    {isLoading ? <CircularProgress size={20} color="inherit" /> : 'اشترك'}
                  </Button>
                </Stack>
              </form>
              
              {/* رسائل الحالة */}
              {message && (
                <Box
                  sx={{
                    mt: 2,
                    p: 1.5,
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    flexDirection: showUnsubscribe ? 'column' : 'row',
                    backgroundColor: messageType === 'success' 
                    ? 'rgba(76, 175, 80, 0.1)' 
                    : messageType === 'warning'
                      ? 'rgba(255, 152, 0, 0.1)'
                      : 'rgba(244, 67, 54, 0.1)',
                      border: `1px solid ${messageType === 'success' 
                        ? 'rgba(76, 175, 80, 0.3)' 
                      : messageType === 'warning'
                      ? 'rgba(255, 152, 0, 0.3)'
                      : 'rgba(244, 67, 54, 0.3)'}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    
                    {messageType === 'success' ? (
                      <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                    ) : messageType === 'warning' ? (
                      <ErrorIcon sx={{ color: '#ff9800', fontSize: 20 }} />
                    ) : (
                      <ErrorIcon sx={{ color: '#f44336', fontSize: 20 }} />
                    )}
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#262626',
                        fontWeight: 600,
                        fontSize: { xs: '0.9rem', sm: '1rem', md: '1.125rem' },
                        letterSpacing: '0.5px',
                        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                        fontFamily: '"Amiri", "Times New Roman", serif'
                      }}
                    >
                      {message}
                    </Typography>
                  </Box>
                  
                  {/* زر إرسال رابط إلغاء الاشتراك */}
                  {showUnsubscribe && (
                    <Button
                      onClick={handleUnsubscribe}
                      variant="outlined"
                      size="small"
                      disabled={isLoading}
                      sx={{
                        backgroundColor: 'rgba(151, 31, 31, 0.35)',
                        mt: 1,
                        borderColor: 'rgba(38, 45, 42, 0.8)',
                        color: '#262626',
                        fontSize: { xs: '1rem', sm: '1.5rem', md: '1.5rem' },
                        fontWeight: 700,
                        py: 0.75,
                        px: 3,
                        borderRadius: '8px',
                        letterSpacing: '0.4px',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.12)',
                        fontFamily: '"Amiri", "Times New Roman", serif',
                        '&:hover': {
                          borderColor: 'rgba(116, 187, 146, 0.32)',
                          backgroundColor: 'rgba(31, 107, 183, 0.1)',
                          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)',
                        },
                        '&:disabled': {
                          opacity: 0.6,
                        },
                      }}
                    >
                      {isLoading ? (
                        <CircularProgress size={11} color="inherit" />
                      ) : (
                        '📧 إرسال رابط الإلغاء'
                      )}
                    </Button>
                  )}
                </Box>
              )}
            </Box>
          </Box>
          {/* روابط ومفاتيح */}
          <Box
            sx={{
              display: { xs: 'flex', sm: 'flex' },
              flexDirection: 'column-reverse',
              gap: 1,
              width: { xs: '50%', sm: 'auto', md: 'auto', lg: 'auto' },
              mt: { xs: 3, sm: 0 }
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#262626',
                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                mb: 0,
                letterSpacing: '0.6px',
                textShadow: '0 1px 3px rgba(214, 211, 211, 0.4)',
                fontFamily: '"Uthman", "Times New Roman", serif',
                direction: 'rtl'
              }}
            >
              الأساسيات القرآنية
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: { xs: 0.5, sm: 0.3 },
              justifyContent: { xs: 'center', sm: 'flex-start' }
            }}>
              {keywords.slice(0, 6).map((word, idx) => (
                <Box
                  key={idx}
                  sx={{
                    border: `1px solid rgba(72, 83, 79, 0.8)`,
                    color: 'rgba(72, 83, 79, 0.8)',
                    borderRadius: '20px',
                    px: { xs: 5 , sm: 1, md: 2},
                    py: { xs: 0.3, sm: 0.3, md: 0.5},
                    m: { xs: 0.5, sm: 0.5, md: 1},
                    fontSize: { xs: 16, sm: 16, md: 18 },
                    fontWeight: 700,
                    letterSpacing: '0.7px',
                    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                    fontFamily: '"Amiri", "Times New Roman", serif',
                    textAlign: 'center',
                    width: 'fit-content',
                    transition: 'all 0.3s ease',
                    display: { xs: idx < 4 ? 'block' : 'none', sm: 'block' },
                    '&:hover': {
                      backgroundColor: 'rgba(13, 76, 147, 0.8)',
                      color: 'white',
                      boxShadow: '0 2px 8px rgba(197, 223, 232, 0.99)',
                    }
                  }}
                >
                  {word}
                </Box>
              ))}
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              flexDirection: 'column',
              gap: 1,
            }}
          >
          </Box>
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              flexDirection: 'column',
              gap: 1,
            }}
          >
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            pt: { xs: 6, sm: 9 , md: 12, },
            width: '100%',
            borderTop: '1px solid',
            borderColor: theme.palette.divider,
            mb: 3,
          }}
        >
          <div>
            <Copyright />
          </div>
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{ justifyContent: 'left', color: theme.palette.text.secondary }}
          >
            <IconButton
              color="inherit"
              size="large"
              href="https://github.com/Msr7799"
              aria-label="GitHub"
              sx={{
                alignSelf: 'center',
                color: '#262626',
                '&:hover': {
                  color: theme.palette.primary.main,
                  backgroundColor: '#262626',
                }
              }}
              target="_blank"
              rel="noopener"
            >
              <GitHubIcon />
            </IconButton>
            <IconButton
              color="inherit"
              size="small"
              href="https://x.com"
              aria-label="X"
              sx={{
                alignSelf: 'center',
                color: theme.palette.text.secondary,
                '&:hover': {
                  color: theme.palette.primary.main,
                  backgroundColor: theme.palette.action.hover,
                }
              }}
              target="_blank"
              rel="noopener"
            >
              <TwitterIcon />
            </IconButton>
            <IconButton
              color="inherit"
              size="large"
              href="https://msr-quran-data.vercel.app/"
              aria-label="Website"
              sx={{
                alignSelf: 'center',
                color: theme.palette.text.secondary,
                '&:hover': {
                  color: theme.palette.primary.main,
                  backgroundColor: theme.palette.action.hover,
                 fontSize: '1.5rem',  
                }
              }}
              target="_blank"
              rel="noopener"
            >
              <LanguageIcon />
            </IconButton>
          </Stack>
        </Box>
      </Box>

      {/* مكون العودة لأعلى الصفحة */}
      <ScrollToTop
        showAfter={400}
        behavior="smooth"
        position="bottom-right"
        size="large"
        variant="primary"
        ariaLabel="العودة إلى أعلى الصفحة"
        />
    </React.Fragment>
  );
}
