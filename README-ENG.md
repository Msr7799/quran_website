# 🕌 Quran Application

<div align="center">


![Quran Website](site-pic2.png)

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-MIT-orange?style=for-the-badge)](LICENSE)
[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://msr-quran-app.vercel.app)

</div>

## 📖 Overview

[![Read in Arabic](https://img.shields.io/badge/Read%20in-Arabic-green?style=for-the-badge&logo=googletranslate&logoColor=white)](README.md)

A comprehensive web application for reading and browsing the Holy Quran with advanced features for interaction and listening. The application provides an exceptional user experience with full Arabic language support and dark mode.

## ✨ Key Features

### 📚 Quran Browsing
- **SVG Mushaf Display** with zoom in/out capability
- **Page-by-page Browsing** with smooth navigation
- **Surah Display** with all verses and tafsir (interpretation)
- **Advanced Search** in texts and surahs

### 🎵 Audio & Recitation
- **158+ Reciters** from the most famous reciters in the Islamic world
- **Precise Synchronization** of verses with audio (19 reciters)
- **Verse Highlighting** during recitation
- **Full Control** over playback and pause

### 🎨 User Interface
- **Modern Design** with Material-UI
- **Dark/Light Mode Support**
- **Fully Responsive** across all devices
- **Authentic Arabic Fonts** (Uthmani script)

### 📖 Tafsir & Sharing
- **Multi-source Tafsir** (Al-Jalalayn, Ibn Kathir, As-Sa'di)
- **Share Verses** with tafsir
- **Easy Text Copying**
- **Arabic Numerals** for verses and pages

## 🛠️ Technologies Used

### Frontend
- **Next.js 14** - React Framework
- **TypeScript** - Programming Language
- **Material-UI (MUI)** - Main Component Library
- **Radix UI** - Advanced UI Components
- **Tailwind CSS** - CSS Framework
- **React Hooks** - State Management

### Animation & Interaction
- **Framer Motion** - Animations and interactions
- **GSAP** - Advanced animations
- **Three.js** - 3D Graphics

### Authentication & Database
- **Next Auth** - Authentication System
- **MongoDB** - Database

### Artificial Intelligence
- **Google Generative AI** - Gemini Integration
- **Hugging Face** - AI Models
- **OpenAI** - ChatGPT Integration

### Data
- **Local JSON** - 6,236 verse files
- **External APIs** - For timings and tafsir
- **SVG** - Mushaf page images
- **MP3** - Audio files

### Additional Libraries
- **React Hook Form** - Form Management
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **Axios** - HTTP Requests

### Tools
- **PNPM** - Package Manager
- **ESLint** - Code Linting
- **PostCSS** - CSS Processing

## 🚀 Installation & Setup

### Requirements
- Node.js 18+
- PNPM
- MongoDB (optional - for advanced features)

### Installation Steps

```bash
# Clone the project
git clone https://github.com/Msr7799/Quran_Website.git

# Navigate to the folder
cd Quran_Website

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env.local

# Run development server
pnpm dev
```

Open your browser at [http://localhost:3000](http://localhost:3000)

### 🔐 Environment Variables Setup

Edit `.env.local` and add the following variables:

```env
# Database (optional)
MONGODB_URI=your_mongodb_connection_string

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key

# AI Integration (optional)
GOOGLE_AI_API_KEY=your_google_ai_key
OPENAI_API_KEY=your_openai_key
HUGGINGFACE_API_KEY=your_huggingface_key

# Email (optional)
EMAIL_SERVER=smtp.gmail.com
EMAIL_FROM=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

**Note:** Most features work without these variables. Only required for advanced features like chatbot and authentication.

### Production Build

```bash
# Build the project
pnpm build

# Run production
pnpm start
```

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── AudioPlayer/     # Audio player and timings
│   ├── QuranPage/       # Mushaf page display
│   └── ...
├── pages/              # Application pages
│   ├── quran/          # Surah pages
│   ├── quran-pages/    # Mushaf browsing
│   ├── quran-sound/    # Audio
│   └── ...
├── styles/             # Style files
├── utils/              # Helper utilities
└── hooks/              # Custom React Hooks

public/
└── json/               # Local data
    ├── audio/          # Audio files (114)
    ├── surah/          # Surah data (114)
    ├── verses/         # Verse files (6,236)
    ├── metadata.json   # Metadata
    └── quranMp3.json   # Reciters list
```

## 🌐 Main Pages

| Page | Description | Path |
|---------|--------|--------|
| **Home** | Overview and quick links | `/` |
| **Browse Mushaf** | View Quran pages in SVG | `/quran-pages/[page]` |
| **Quran Reader** | Advanced reader with extra features | `/quran-reader` |
| **Surahs** | Read surahs with tafsir | `/quran/[surahId]` |
| **Audio** | Listen to recitations | `/quran-sound` |
| **Chatbot** | Islamic AI Assistant | `/chat-bot` |
| **Live Radio** | Live Quran radio stations | `/live` |
| **PDF** | View Mushaf in PDF format | `/quran-pdf` |
| **Search** | Search in the Quran | `/search` |
| **About** | Project information | `/about` |
| **Sign In** | Authentication system | `/auth/signin` |

## 📊 Data Statistics

- **114 Complete Surahs**
- **6,236 Individual Verses**
- **158+ Available Reciters**
- **19 Reciters** with precise synchronization
- **604 Mushaf Pages**
- **77,429 Words** in the Quran
- **323,015 Total Characters**

## 📖 Component Usage Guide

### 🎵 AudioPlayer Component

Advanced audio player with precise verse synchronization and automatic highlighting.

#### Basic Usage:

```jsx
import QuranAudioPlayer from '@/components/AudioPlayer/QuranAudioPlayer';

function MyPage() {
  return (
    <QuranAudioPlayer
      surahNumber={1}
      reciterId="ar.abdulbasitmurattal"
      autoPlay={false}
      showTimeline={true}
      onVerseChange={(verseNumber) => console.log('Verse:', verseNumber)}
    />
  );
}
```

#### Available Props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `surahNumber` | number | **required** | Surah number (1-114) |
| `reciterId` | string | **required** | Reciter identifier |
| `autoPlay` | boolean | `false` | Auto-play on load |
| `showTimeline` | boolean | `true` | Show timeline bar |
| `highlightVerse` | boolean | `true` | Highlight current verse |
| `onVerseChange` | function | - | Callback on verse change |

#### Keyboard Shortcuts:

- `Space` - Play/Pause
- `→` - Next verse
- `←` - Previous verse
- `↑` - Volume up
- `↓` - Volume down
- `R` - Repeat verse

#### Advanced Example:

```jsx
import { useState } from 'react';
import QuranAudioPlayer from '@/components/AudioPlayer/QuranAudioPlayer';
import CompactAudioPlayer from '@/components/AudioPlayer/CompactAudioPlayer';

function QuranPage() {
  const [currentVerse, setCurrentVerse] = useState(1);
  
  return (
    <div>
      {/* Advanced Player */}
      <QuranAudioPlayer
        surahNumber={2}
        reciterId="ar.alafasy"
        autoPlay={true}
        onVerseChange={setCurrentVerse}
      />
      
      {/* Compact Player */}
      <CompactAudioPlayer
        audioUrl="https://server.mp3quran.net/..."
        title="Surah Al-Baqarah"
      />
    </div>
  );
}
```

### 📖 QuranPage Component

Display Mushaf pages in SVG format with zoom capabilities.

```jsx
import SVGPageViewer from '@/components/QuranPage/SVGPageViewer';

function QuranPageView() {
  return (
    <SVGPageViewer
      pageNumber={1}
      enableZoom={true}
      showPageNumber={true}
      onPageChange={(page) => console.log('Page:', page)}
    />
  );
}
```

### 🤖 IslamicChatbot Component

AI-powered Islamic assistant.

```jsx
import IslamicChatbot from '@/components/IslamicChatbot';

function ChatPage() {
  return (
    <IslamicChatbot
      model="gemini" // or "openai" or "huggingface"
      contextType="quran" // or "hadith" or "general"
      language="ar"
    />
  );
}
```

📘 **For more:** See [Complete Component Guide](Docs/COMPONENTS_SHOW_ROUTES.md)

## 🔗 APIs Used

### External APIs

#### Audio & Timings
- `https://mp3quran.net/api/v3/ayat_timing/reads` - Reciters list
- `https://mp3quran.net/api/v3/ayat_timing` - Verse timings

#### Images
- `https://www.mp3quran.net/api/quran_pages_svg/` - SVG pages

#### Tafsir
- `http://api.quran-tafseer.com/quran/` - Verse tafsir

### Internal APIs

#### Search
```bash
GET /api/search-verses?q=Allah
GET /api/search-surahs?q=Baqarah
```

#### Quran Data
```bash
GET /api/quran/[surahId]
GET /api/get-verse-page?surah=1&verse=1
```

#### AI Integration
```bash
POST /api/chat/gemini
POST /api/chat/openai
POST /api/enhance-prompt
```

📘 **For more:** See [Complete API Guide](Docs/API_USE.md)

## 🔧 Troubleshooting

### ❌ Issue: Audio not working

**Solution:**
1. Make sure dependencies are installed: `pnpm install`
2. Check your internet connection
3. Try a different reciter from the list
4. Check Console for errors

### ❌ Issue: Database error

**Solution:**
1. Verify `MONGODB_URI` in `.env.local`
2. Ensure MongoDB is running
3. Check access permissions
4. Review [MongoDB Guide](Docs/mongodb-atlas-setup.md)

### ❌ Issue: Chatbot not working

**Solution:**
1. Add API Keys in `.env.local`
2. Verify key validity
3. Ensure API account has credits

### ❌ Issue: Build error

**Solution:**
```bash
# Remove old build files
rm -rf .next
rm -rf node_modules

# Reinstall
pnpm install

# Build again
pnpm build
```

### ❌ Other Issues

For immediate help:
- 🐛 [Open New Issue](https://github.com/Msr7799/Quran_Website/issues)
- 💬 [Contact Developer](mailto:alromaihi2224@gmail.com)
- 📖 [Testing Guide](Docs/TESTING_INSTRUCTIONS.md)

## 🗺️ Roadmap

### ✅ Completed
- [x] Audio player with synchronization
- [x] 158+ available reciters
- [x] SVG Mushaf display
- [x] Smart chatbot
- [x] Authentication system (Next Auth)
- [x] Dark/Light mode
- [x] Fully responsive design
- [x] Advanced search

### 🚧 In Development
- [ ] Mobile app (React Native)
- [ ] Full PWA support
- [ ] Offline Mode
- [ ] Advanced SEO optimization
- [ ] Email notification system
- [ ] Performance improvements

### 📋 Planned
- [ ] Additional language support (English, Urdu, French)
- [ ] User progress tracking system
- [ ] Bookmark feature
- [ ] Enhanced social sharing
- [ ] Cloud service integration
- [ ] User statistics dashboard

## ⚡ Performance & Optimization

<div align="center">

| Metric | Value |
|---------|-------|
| **Lighthouse Score** | 95+ |
| **First Contentful Paint** | < 1.5s |
| **Time to Interactive** | < 2.5s |
| **Speed Index** | < 2.0s |
| **Total Bundle Size** | Optimized |
| **SEO Score** | 100 |
| **Accessibility** | WCAG 2.1 AA |

</div>

### 🚀 Performance Features:
- ✅ **Code Splitting** to reduce bundle size
- ✅ **Lazy Loading** for images and components
- ✅ **Image Optimization** with Next.js Image
- ✅ **Static Generation** for static pages
- ✅ **API Route Caching** for faster responses

## 🤝 Contributing

Contributions are welcome! 🎉

### 📝 How to Contribute:

1. **Fork** the project
2. **Clone** your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Quran_Website.git
   cd Quran_Website
   ```
3. Create a new **branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. Make changes and follow the existing **coding style**
5. **Test** your changes locally:
   ```bash
   pnpm dev
   pnpm lint
   ```
6. **Commit** with a clear message:
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
7. **Push** to your branch:
   ```bash
   git push origin feature/amazing-feature
   ```
8. Open a **Pull Request**

### 📌 Guidelines:
- ✅ Follow existing ESLint rules
- ✅ Add comments for complex code
- ✅ Test on mobile and desktop
- ✅ Maintain RTL support
- ✅ Don't remove or weaken tests

### 🎯 Contribution Types:
- 🐛 **Bug Fixes** - Fix errors
- ✨ **New Features** - Add new features
- 📝 **Documentation** - Improve docs
- 🎨 **UI/UX** - Enhance interface
- ⚡ **Performance** - Optimize performance
- 🌍 **i18n** - Add language support

### 💬 Commit Convention:
```
feat: new feature
fix: bug fix
docs: documentation update
style: code formatting
refactor: code restructure
perf: performance improvement
test: add tests
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Mohammed Al-Rumaihi** - [@Msr7799](https://github.com/Msr7799)

## 🙏 Acknowledgments

- **mp3quran.net** - For timings and SVG pages
- **quran-tafseer.com** - For tafsir service
- **Material-UI** - For component library
- **Next.js** - For the amazing framework

---

<div align="center">

**Built with ❤️ to serve the Holy Quran**

[🌐 Live Website](https://msr-quran-app.vercel.app) | [📚 API Guide](Docs/API_USE.md) | [🐛 Report Bug](https://github.com/Msr7799/test_quran_app/issues)

</div>
