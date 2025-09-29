// src/pages/api/search-surahs.js - البحث في أسماء السور
import fs from 'fs';
import path from 'path';

// تحميل بيانات السور من ملف metadata.json
let surahs = [];

try {
  const metadataPath = path.join(process.cwd(), 'public', 'json', 'metadata.json');
  const metadataFile = fs.readFileSync(metadataPath, 'utf8');
  surahs = JSON.parse(metadataFile);
} catch (error) {
  console.error('Error loading surah metadata:', error);
  surahs = []; // fallback to empty array
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Search query is required' 
      });
    }

    const query = q.trim().toLowerCase();
    
    // البحث في أسماء السور العربية والإنجليزية
    const results = surahs.filter(surah => 
      surah.name.ar.includes(query) || 
      surah.name.ar.toLowerCase().includes(query) ||
      surah.name.en.toLowerCase().includes(query) ||
      // البحث الجزئي المحسن
      surah.name.ar.replace(/[أإآ]/g, 'ا').includes(query.replace(/[أإآ]/g, 'ا')) ||
      surah.name.ar.replace(/[ىي]/g, 'ي').includes(query.replace(/[ىي]/g, 'ي'))
    );

    // ترتيب النتائج: التطابق التام أولاً، ثم التطابق الجزئي
    results.sort((a, b) => {
      const aExactMatch = a.name.ar === query || a.name.ar.toLowerCase() === query;
      const bExactMatch = b.name.ar === query || b.name.ar.toLowerCase() === query;
      
      if (aExactMatch && !bExactMatch) return -1;
      if (!aExactMatch && bExactMatch) return 1;
      
      // إذا لم يكن هناك تطابق تام، رتب حسب رقم السورة
      return a.number - b.number;
    });

    return res.status(200).json({
      success: true,
      results: results.slice(0, 10), // إرجاع أول 10 نتائج
      total: results.length
    });

  } catch (error) {
    console.error('Search surahs error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}
