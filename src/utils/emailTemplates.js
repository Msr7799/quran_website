// قوالب الإيميل باللغة العربية - نسخة محسّنة واحترافية
export function createWelcomeEmailTemplate(unsubscribeToken) {
    const currentDate = new Date().toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  
    return `
  <!DOCTYPE html>
  <html dir="rtl" lang="ar">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>مرحباً بك في نشرة الأحاديث اليومية</title>
      <!--[if mso]>
      <style type="text/css">
          body, table, td {font-family: Arial, sans-serif !important;}
      </style>
      <![endif]-->
      <style>
          @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap');
          
          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }
          
          body {
              font-family: 'Tajawal', 'Segoe UI', Tahoma, Arial, sans-serif;
              line-height: 1.8;
              color: #1a1a1a;
              background-color: #f5f7fa;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
          }
          
          table {
              border-collapse: collapse;
              border-spacing: 0;
          }
          
          img {
              border: 0;
              outline: none;
              text-decoration: none;
              -ms-interpolation-mode: bicubic;
              max-width: 100%;
              height: auto;
              display: block;
          }
          
          .wrapper {
              width: 100%;
              table-layout: fixed;
              background-color: #f5f7fa;
              padding: 20px 0;
          }
          
          .main {
              background-color: #ffffff;
              margin: 0 auto;
              width: 100%;
              max-width: 600px;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          }
          
          .header-bg {
              background: linear-gradient(135deg, #1e7e5c 0%, #2e9b73 100%);
              padding: 40px 20px 80px;
              text-align: center;
              position: relative;
          }
          
          .logo-container {
              margin-bottom: 20px;
          }
          
          .logo-img {
              width: 80px;
              height: 80px;
              margin: 0 auto;
              background: rgba(255, 255, 255, 0.15);
              border-radius: 50%;
              padding: 15px;
              backdrop-filter: blur(10px);
          }
          
          .header-title {
              color: #ffffff;
              font-size: 24px;
              font-weight: 700;
              margin: 15px 0 0;
              text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          
          .medina-image {
              width: 100%;
              max-width: 560px;
              margin: -60px auto 0;
              border-radius: 12px;
              box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          }
          
          .content {
              padding: 40px 30px;
          }
          
          .date-badge {
              background: linear-gradient(135deg, #f0f9f5 0%, #e8f5f1 100%);
              padding: 12px 20px;
              border-radius: 25px;
              text-align: center;
              color: #1e7e5c;
              font-weight: 600;
              font-size: 15px;
              margin-bottom: 30px;
              border: 2px solid #d4edda;
              display: inline-block;
              width: 100%;
          }
          
          .greeting-box {
              background: linear-gradient(135deg, #fff8e1 0%, #fff9e6 100%);
              padding: 25px;
              border-radius: 12px;
              border-right: 4px solid #ffa726;
              margin-bottom: 25px;
          }
          
          .greeting-title {
              color: #e65100;
              font-size: 20px;
              font-weight: 700;
              margin-bottom: 12px;
          }
          
          .greeting-text {
              color: #5d4037;
              font-size: 16px;
              line-height: 1.8;
              margin-bottom: 12px;
          }
          
          .features-box {
              background: linear-gradient(135deg, #f3e5f5 0%, #f8f4fa 100%);
              padding: 25px;
              border-radius: 12px;
              margin: 25px 0;
          }
          
          .features-title {
              color: #6a1b9a;
              font-size: 19px;
              font-weight: 700;
              margin-bottom: 18px;
              display: flex;
              align-items: center;
          }
          
          .feature-item {
              background: #ffffff;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 12px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
              display: flex;
              align-items: start;
          }
          
          .feature-icon {
              color: #6a1b9a;
              font-size: 20px;
              margin-left: 12px;
              flex-shrink: 0;
          }
          
          .feature-text {
              color: #4a148c;
              font-size: 15px;
              line-height: 1.6;
          }
          
          .dua-box {
              background: linear-gradient(135deg, #e3f2fd 0%, #e8f4fd 100%);
              padding: 25px;
              border-radius: 12px;
              text-align: center;
              margin: 25px 0;
              border: 2px solid #90caf9;
          }
          
          .dua-text {
              color: #0d47a1;
              font-size: 17px;
              font-weight: 600;
              line-height: 1.8;
              margin: 8px 0;
          }
          
          .cta-button {
              background: linear-gradient(135deg, #1e7e5c 0%, #2e9b73 100%);
              color: #ffffff !important;
              text-decoration: none;
              padding: 14px 32px;
              border-radius: 25px;
              display: inline-block;
              font-weight: 600;
              font-size: 16px;
              margin: 20px auto;
              box-shadow: 0 4px 12px rgba(30, 126, 92, 0.3);
              transition: transform 0.2s;
          }
          
          .cta-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 16px rgba(30, 126, 92, 0.4);
          }
          
          .footer {
              background: #f8f9fa;
              padding: 30px;
              text-align: center;
              border-top: 3px solid #e9ecef;
          }
          
          .footer-text {
              color: #6c757d;
              font-size: 14px;
              line-height: 1.6;
              margin: 8px 0;
          }
          
          .footer-link {
              color: #d32f2f;
              text-decoration: none;
              font-weight: 600;
          }
          
          .footer-link:hover {
              text-decoration: underline;
          }
          
          .developer-info {
              color: #adb5bd;
              font-size: 12px;
              margin-top: 15px;
              padding-top: 15px;
              border-top: 1px solid #dee2e6;
          }
          
          /* Responsive Design */
          @media only screen and (max-width: 600px) {
              .main {
                  width: 100% !important;
                  border-radius: 0 !important;
              }
              
              .content {
                  padding: 30px 20px !important;
              }
              
              .header-bg {
                  padding: 30px 15px 60px !important;
              }
              
              .header-title {
                  font-size: 20px !important;
              }
              
              .medina-image {
                  margin: -50px auto 0 !important;
                  border-radius: 8px !important;
              }
              
              .greeting-title {
                  font-size: 18px !important;
              }
              
              .greeting-text,
              .feature-text {
                  font-size: 14px !important;
              }
              
              .features-box,
              .greeting-box,
              .dua-box {
                  padding: 20px !important;
              }
              
              .cta-button {
                  padding: 12px 24px !important;
                  font-size: 15px !important;
              }
          }
          
          @media only screen and (max-width: 480px) {
              .logo-img {
                  width: 60px !important;
                  height: 60px !important;
                  padding: 10px !important;
              }
              
              .header-title {
                  font-size: 18px !important;
              }
              
              .wrapper {
                  padding: 10px 0 !important;
              }
          }
      </style>
  </head>
  <body>
      <table role="presentation" class="wrapper" width="100%" cellpadding="0" cellspacing="0">
          <tr>
              <td align="center">
                  <table role="presentation" class="main" width="600" cellpadding="0" cellspacing="0">
                      <!-- Header -->
                      <tr>
                          <td class="header-bg">
                              <div class="logo-container">
                                  <img src="https://msr-quran-app.vercel.app/images/logo.svg" alt="شعار موقع القرآن الكريم" class="logo-img" width="80" height="80">
                              </div>
                              <h1 class="header-title">مرحباً بك في نشرة الأحاديث اليومية</h1>
                          </td>
                      </tr>
                      
                      <!-- Medina Image -->
                      <tr>
                          <td align="center" style="padding: 0 20px;">
                              <img src="https://msr-quran-app.vercel.app/images/Medina.svg" alt="صورة المدينة المنورة" class="medina-image" width="560">
                          </td>
                      </tr>
                      
                      <!-- Content -->
                      <tr>
                          <td class="content">
                              <div class="date-badge">
                                  📅 ${currentDate}
                              </div>
                              
                              <div class="greeting-box">
                                  <h2 class="greeting-title">🌟 السلام عليكم ورحمة الله وبركاته</h2>
                                  <p class="greeting-text"><strong>نشكرك من أعماق قلوبنا</strong> على اشتراكك في نشرة الأحاديث اليومية من موقع القرآن الكريم.</p>
                                  <p class="greeting-text">هذه الخدمة المجانية تهدف إلى نشر السنة النبوية المباركة وإحياء سنة النبي محمد ﷺ في قلوب المؤمنين.</p>
                              </div>
                              
                              <div class="features-box">
                                  <h3 class="features-title">📋 ماذا ستستقبل في بريدك؟</h3>
                                  
                                  <div class="feature-item">
                                      <span class="feature-icon">📿</span>
                                      <span class="feature-text"><strong>حديث شريف يومي</strong> من صحيح البخاري أو صحيح مسلم</span>
                                  </div>
                                  
                                  <div class="feature-item">
                                      <span class="feature-icon">✅</span>
                                      <span class="feature-text"><strong>المصدر والراوي كاملين</strong> للتأكد من صحة الحديث</span>
                                  </div>
                                  
                                  <div class="feature-item">
                                      <span class="feature-icon">🎨</span>
                                      <span class="feature-text"><strong>تصميم جميل ومتجاوب</strong> يعمل على جميع الأجهزة</span>
                                  </div>
                                  
                                  <div class="feature-item">
                                      <span class="feature-icon">⏰</span>
                                      <span class="feature-text"><strong>وقت مناسب يومياً</strong> للتذكير والتدبر</span>
                                  </div>
                              </div>
                              
                              <div class="dua-box">
                                  <p class="dua-text">🤲 نسأل الله أن ينفعك بما تقرأ</p>
                                  <p class="dua-text">وأن يجعله في ميزان حسناتك وحسناتنا</p>
                                  <p class="dua-text">✨ بارك الله فيك وجزاك الله خيراً ✨</p>
                              </div>
                              
                              <div style="text-align: center;">
                                  <a href="https://msr-quran-app.vercel.app" class="cta-button">زيارة الموقع</a>
                              </div>
                          </td>
                      </tr>
                      
                      <!-- Footer -->
                      <tr>
                          <td class="footer">
                              <p class="footer-text">💌 <strong>نشرة الأحاديث اليومية</strong></p>
                              <p class="footer-text">موقع القرآن الكريم</p>
                              <p class="footer-text" style="margin-top: 15px;">
                                  إذا كنت لا ترغب في استقبال هذه الرسائل، يمكنك 
                                  <a href="${process.env.SITE_URL}/api/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}" class="footer-link">إلغاء الاشتراك من هنا</a>
                              </p>
                              <p class="developer-info">
                                  مطور الموقع: محمد الرميحي | CODE4EVER11@GMAIL.COM
                              </p>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>
  </body>
  </html>`;
  }
  
  // دالة مساعدة لإنشاء قالب إلغاء الاشتراك
  export function createUnsubscribeConfirmationTemplate() {
    return `
  <!DOCTYPE html>
  <html dir="rtl" lang="ar">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>تم إلغاء الاشتراك</title>
      <style>
          @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap');
          
          body {
              font-family: 'Tajawal', 'Segoe UI', Tahoma, Arial, sans-serif;
              line-height: 1.8;
              color: #1a1a1a;
              background-color: #f5f7fa;
              margin: 0;
              padding: 20px;
          }
          
          .wrapper {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          }
          
          .header-bg {
              background: linear-gradient(135deg, #d32f2f 0%, #e53935 100%);
              padding: 30px 20px;
              text-align: center;
          }
          
          .logo-img {
              width: 60px;
              height: 60px;
              margin: 0 auto 15px;
              background: rgba(255, 255, 255, 0.15);
              border-radius: 50%;
              padding: 12px;
          }
          
          .header-title {
              color: #ffffff;
              font-size: 22px;
              font-weight: 700;
              margin: 0;
          }
          
          .content {
              padding: 40px 30px;
              text-align: center;
          }
          
          .message-box {
              background: #fff3e0;
              padding: 25px;
              border-radius: 12px;
              margin: 20px 0;
              border: 2px solid #ffb74d;
          }
          
          .message-text {
              color: #e65100;
              font-size: 16px;
              line-height: 1.8;
              margin: 10px 0;
          }
          
          .cta-button {
              background: linear-gradient(135deg, #1e7e5c 0%, #2e9b73 100%);
              color: #ffffff !important;
              text-decoration: none;
              padding: 14px 32px;
              border-radius: 25px;
              display: inline-block;
              font-weight: 600;
              font-size: 16px;
              margin: 20px auto;
              box-shadow: 0 4px 12px rgba(30, 126, 92, 0.3);
          }
          
          .footer {
              background: #f8f9fa;
              padding: 25px;
              text-align: center;
              color: #6c757d;
              font-size: 14px;
          }
          
          @media only screen and (max-width: 600px) {
              .content {
                  padding: 30px 20px !important;
              }
              
              .header-title {
                  font-size: 19px !important;
              }
              
              .message-box {
                  padding: 20px !important;
              }
          }
      </style>
  </head>
  <body>
      <div class="wrapper">
          <div class="header-bg">
              <img src="https://msr-quran-app.vercel.app/images/logo.svg" alt="شعار الموقع" class="logo-img" width="60" height="60">
              <h1 class="header-title">تم إلغاء الاشتراك</h1>
          </div>
          
          <div class="content">
              <div class="message-box">
                  <p class="message-text">😔 <strong>تم إلغاء اشتراكك بنجاح</strong></p>
                  <p class="message-text">لن تصلك المزيد من رسائل الأحاديث اليومية.</p>
                  <p class="message-text">نتمنى أن تكون الخدمة قد نالت إعجابك.</p>
              </div>
              
              <p style="color: #666; font-size: 15px; margin: 20px 0;">
                  يمكنك دائماً زيارة موقعنا للاستفادة من المحتوى
              </p>
              
              <a href="https://msr-quran-app.vercel.app" class="cta-button">زيارة الموقع</a>
          </div>
          
          <div class="footer">
              <p>💌 موقع القرآن الكريم</p>
              <p style="margin-top: 10px; font-size: 12px; color: #adb5bd;">
                  مطور الموقع: محمد الرميحي | CODE4EVER11@GMAIL.COM
              </p>
          </div>
      </div>
  </body>
  </html>`;
  }
  
  export function createHadithEmailTemplate(hadith, unsubscribeToken) {
    const currentDate = new Date().toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  
    return `
  <!DOCTYPE html>
  <html dir="rtl" lang="ar">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>حديث اليوم - ${currentDate}</title>
      <!--[if mso]>
      <style type="text/css">
          body, table, td {font-family: Arial, sans-serif !important;}
      </style>
      <![endif]-->
      <style>
          @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&family=Amiri:wght@400;700&display=swap');
          
          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }
          
          body {
              font-family: 'Tajawal', 'Segoe UI', Tahoma, Arial, sans-serif;
              line-height: 1.8;
              color: #1a1a1a;
              background-color: #f5f7fa;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
          }
          
          table {
              border-collapse: collapse;
              border-spacing: 0;
          }
          
          img {
              border: 0;
              outline: none;
              text-decoration: none;
              -ms-interpolation-mode: bicubic;
              max-width: 100%;
              height: auto;
              display: block;
          }
          
          .wrapper {
              width: 100%;
              table-layout: fixed;
              background-color: #f5f7fa;
              padding: 20px 0;
          }
          
          .main {
              background-color: #ffffff;
              margin: 0 auto;
              width: 100%;
              max-width: 600px;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          }
          
          .header-bg {
              background: linear-gradient(135deg, #1e7e5c 0%, #2e9b73 100%);
              padding: 30px 20px;
              text-align: center;
          }
          
          .logo-container {
              margin-bottom: 15px;
          }
          
          .logo-img {
              width: 60px;
              height: 60px;
              margin: 0 auto;
              background: rgba(255, 255, 255, 0.15);
              border-radius: 50%;
              padding: 12px;
              backdrop-filter: blur(10px);
          }
          
          .header-title {
              color: #ffffff;
              font-size: 22px;
              font-weight: 700;
              margin: 10px 0 0;
              text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          
          .content {
              padding: 35px 30px;
          }
          
          .date-badge {
              background: linear-gradient(135deg, #e8f5f1 0%, #d4edda 100%);
              padding: 12px 20px;
              border-radius: 25px;
              text-align: center;
              color: #1e7e5c;
              font-weight: 600;
              font-size: 15px;
              margin-bottom: 25px;
              border: 2px solid #b8dbc9;
              display: inline-block;
              width: 100%;
          }
          
          .hadith-container {
              background: linear-gradient(135deg, #fffbea 0%, #fff8dc 100%);
              padding: 30px;
              border-radius: 12px;
              border-right: 5px solid #ffa726;
              margin: 25px 0;
              position: relative;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          }
          
          .hadith-decoration {
              position: absolute;
              top: -12px;
              right: 20px;
              background: #ffa726;
              color: white;
              width: 45px;
              height: 45px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 20px;
              box-shadow: 0 2px 8px rgba(255, 167, 38, 0.4);
          }
          
          .hadith-label {
              color: #e65100;
              font-size: 14px;
              font-weight: 600;
              margin-bottom: 15px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
          }
          
          .hadith-text {
              font-family: 'Amiri', 'Traditional Arabic', serif;
              font-size: 19px;
              line-height: 2.3;
              color: #2e7d32;
              font-weight: 500;
              text-align: justify;
              margin: 20px 0;
              padding: 20px;
              background: rgba(255, 255, 255, 0.7);
              border-radius: 8px;
          }
          
          .source-container {
              background: linear-gradient(135deg, #e3f2fd 0%, #e8f4fd 100%);
              padding: 20px;
              border-radius: 10px;
              border-right: 4px solid #1976d2;
              margin-top: 20px;
          }
          
          .source-item {
              color: #01579b;
              font-size: 14px;
              margin: 8px 0;
              display: flex;
              align-items: start;
          }
          
          .source-icon {
              margin-left: 8px;
              flex-shrink: 0;
          }
          
          .source-label {
              font-weight: 700;
              margin-left: 5px;
          }
          
          .reflection-box {
              background: linear-gradient(135deg, #fce4ec 0%, #fdeef3 100%);
              padding: 25px;
              border-radius: 12px;
              margin: 25px 0;
              border-right: 5px solid #e91e63;
          }
          
          .reflection-title {
              color: #c2185b;
              font-size: 18px;
              font-weight: 700;
              margin-bottom: 12px;
          }
          
          .reflection-text {
              color: #880e4f;
              font-size: 15px;
              line-height: 1.8;
              margin: 8px 0;
          }
          
          .dua-box {
              background: linear-gradient(135deg, #f3e5f5 0%, #f8f4fa 100%);
              padding: 25px;
              border-radius: 12px;
              text-align: center;
              margin: 25px 0;
              border: 2px solid #ce93d8;
          }
          
          .dua-text {
              color: #4a148c;
              font-size: 17px;
              font-weight: 600;
              line-height: 1.8;
          }
          
          .cta-button {
              background: linear-gradient(135deg, #1e7e5c 0%, #2e9b73 100%);
              color: #ffffff !important;
              text-decoration: none;
              padding: 14px 32px;
              border-radius: 25px;
              display: inline-block;
              font-weight: 600;
              font-size: 16px;
              margin: 20px auto;
              box-shadow: 0 4px 12px rgba(30, 126, 92, 0.3);
          }
          
          .footer {
              background: #f8f9fa;
              padding: 30px;
              text-align: center;
              border-top: 3px solid #e9ecef;
          }
          
          .footer-text {
              color: #6c757d;
              font-size: 14px;
              line-height: 1.6;
              margin: 8px 0;
          }
          
          .footer-link {
              color: #d32f2f;
              text-decoration: none;
              font-weight: 600;
          }
          
          .footer-link:hover {
              text-decoration: underline;
          }
          
          .developer-info {
              color: #adb5bd;
              font-size: 12px;
              margin-top: 15px;
              padding-top: 15px;
              border-top: 1px solid #dee2e6;
          }
          
          /* Responsive Design */
          @media only screen and (max-width: 600px) {
              .main {
                  width: 100% !important;
                  border-radius: 0 !important;
              }
              
              .content {
                  padding: 25px 20px !important;
              }
              
              .header-bg {
                  padding: 25px 15px !important;
              }
              
              .header-title {
                  font-size: 19px !important;
              }
              
              .hadith-text {
                  font-size: 17px !important;
                  line-height: 2.1 !important;
                  padding: 15px !important;
              }
              
              .hadith-container,
              .source-container,
              .reflection-box,
              .dua-box {
                  padding: 20px !important;
              }
              
              .hadith-decoration {
                  width: 40px !important;
                  height: 40px !important;
                  font-size: 18px !important;
              }
              
              .source-item {
                  font-size: 13px !important;
              }
              
              .reflection-text {
                  font-size: 14px !important;
              }
              
              .cta-button {
                  padding: 12px 24px !important;
                  font-size: 15px !important;
              }
          }
          
          @media only screen and (max-width: 480px) {
              .logo-img {
                  width: 50px !important;
                  height: 50px !important;
                  padding: 10px !important;
              }
              
              .header-title {
                  font-size: 17px !important;
              }
              
              .hadith-text {
                  font-size: 16px !important;
                  line-height: 2 !important;
              }
              
              .wrapper {
                  padding: 10px 0 !important;
              }
          }
      </style>
  </head>
  <body>
      <table role="presentation" class="wrapper" width="100%" cellpadding="0" cellspacing="0">
          <tr>
              <td align="center">
                  <table role="presentation" class="main" width="600" cellpadding="0" cellspacing="0">
                      <!-- Header -->
                      <tr>
                          <td class="header-bg">
                              <div class="logo-container">
                                  <img src="https://msr-quran-app.vercel.app/images/logo.svg" alt="شعار موقع القرآن الكريم" class="logo-img" width="60" height="60">
                              </div>
                              <h1 class="header-title">📿 حديث اليوم</h1>
                          </td>
                      </tr>
                      
                      <!-- Content -->
                      <tr>
                          <td class="content">
                              <div class="date-badge">
                                  📅 ${currentDate}
                              </div>
                              
                              <div class="hadith-container">
                                  <div class="hadith-decoration">💬</div>
                                  <div class="hadith-label">الحديث الشريف</div>
                                  <div class="hadith-text">
                                      "${hadith.hadithText || hadith.arab || 'النص غير متوفر'}"
                                  </div>
                                  
                                  <div class="source-container">
                                      <div class="source-item">
                                          <span class="source-icon">📚</span>
                                          <span><span class="source-label">المصدر:</span> ${hadith.book || 'صحيح البخاري'}</span>
                                      </div>
                                      <div class="source-item">
                                          <span class="source-icon">👤</span>
                                          <span><span class="source-label">الراوي:</span> ${hadith.englishNarrator || hadith.narrator || 'غير محدد'}</span>
                                      </div>
                                      ${hadith.hadithNumber ? `
                                      <div class="source-item">
                                          <span class="source-icon">🔢</span>
                                          <span><span class="source-label">رقم الحديث:</span> ${hadith.hadithNumber}</span>
                                      </div>` : ''}
                                      ${hadith.chapter ? `
                                      <div class="source-item">
                                          <span class="source-icon">📖</span>
                                          <span><span class="source-label">الباب:</span> ${hadith.chapter}</span>
                                      </div>` : ''}
                                  </div>
                              </div>
                              
                              <div class="reflection-box">
                                  <h3 class="reflection-title">💡 للتأمل والتدبر</h3>
                                  <p class="reflection-text">هذا الحديث الشريف يحمل في طياته هداية ونوراً من سنة نبينا محمد ﷺ.</p>
                                  <p class="reflection-text">نسأل الله أن يوفقنا للعمل بما جاء فيه وأن يجعله نبراساً ينير دربنا.</p>
                              </div>
                              
                              <div class="dua-box">
                                  <p class="dua-text">🤲 اللهم انفعنا بما علمتنا وعلمنا ما ينفعنا وزدنا علماً</p>
                              </div>
                              
                              <div style="text-align: center;">
                                  <a href="https://msr-quran-app.vercel.app" class="cta-button">زيارة موقع القرآن الكريم</a>
                              </div>
                          </td>
                      </tr>
                      
                      <!-- Footer -->
                      <tr>
                          <td class="footer">
                              <p class="footer-text">💌 <strong>نشرة الأحاديث اليومية</strong></p>
                              <p class="footer-text">موقع القرآن الكريم</p>
                              <p class="footer-text"><strong>جزاكم الله خيراً على متابعتكم</strong></p>
                              <p class="footer-text" style="margin-top: 15px;">
                                  إذا كنت لا ترغب في استقبال هذه الرسائل، يمكنك 
                                  <a href="${process.env.SITE_URL}/api/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}" class="footer-link">إلغاء الاشتراك</a>
                              </p>
                              <p class="developer-info">
                                  مطور الموقع: محمد الرميحي | CODE4EVER11@GMAIL.COM
                              </p>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>
  </body>
  </html>`;}