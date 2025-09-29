import React, { useState, useEffect } from 'react';
import { Search, BookOpen, X } from 'lucide-react';
import Link from 'next/link';

const QuranSearchWidget = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // البحث في الآيات
  const handleSearch = async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    setShowResults(true);
    
    try {
      const response = await fetch(`/api/search-verses?q=${encodeURIComponent(searchQuery)}&limit=20`);
      const data = await response.json();
      
      if (data.success) {
        setResults(data.results);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // البحث التلقائي مع تأخير
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        handleSearch(query);
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* شريط البحث */}
      <div className="relative">
        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="ابحث في آيات القرآن الكريم..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-gray-800/90 backdrop-blur-sm text-white placeholder-gray-400 rounded-full px-12 py-4 border border-gray-600 focus:border-blue-500 focus:outline-none text-right shadow-lg"
        />
        
        {query && (
          <button
            onClick={clearSearch}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        )}
        
        {isSearching && (
          <div className="absolute left-12 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
          </div>
        )}
      </div>

      {/* نتائج البحث */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800/95 backdrop-blur-sm border border-gray-600 rounded-lg shadow-2xl max-h-96 overflow-y-auto z-50">
          {isSearching ? (
            <div className="p-4 text-center text-gray-400">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mx-auto mb-2"></div>
              جاري البحث...
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="p-3 border-b border-gray-700 text-sm text-gray-300 bg-gray-700/50">
                تم العثور على {results.length} نتيجة
              </div>
              <div className="max-h-80 overflow-y-auto">
                {results.slice(0, 10).map((result, index) => (
                  <Link 
                    key={index} 
                    href={`/quran/${result.surahNumber}`}
                    className="block p-4 hover:bg-gray-700/50 transition-colors border-b border-gray-700/50 last:border-b-0"
                    onClick={() => setShowResults(false)}
                  >
                    <div className="flex items-center gap-2 mb-2 text-blue-400 text-sm">
                      <BookOpen size={14} />
                      <span className="font-medium">{result.surahName}</span>
                      <span>•</span>
                      <span>الآية {result.verseNumber}</span>
                    </div>
                    
                    <div className="text-right">
                      <p 
                        className="text-green-300 text-sm leading-relaxed overflow-hidden"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}
                        dangerouslySetInnerHTML={{ 
                          __html: result.highlightedText.length > 150 
                            ? result.highlightedText.substring(0, 150) + '...'
                            : result.highlightedText 
                        }}
                      />
                    </div>
                    
                    <div className="text-xs text-gray-400 mt-2">
                      الجزء {result.juz} • الصفحة {result.page}
                    </div>
                  </Link>
                ))}
              </div>
              
              {results.length > 10 && (
                <div className="p-3 text-center border-t border-gray-700 bg-gray-700/30">
                  <span className="text-sm text-gray-400">
                    و {results.length - 10} نتائج أخرى...
                  </span>
                </div>
              )}
            </>
          ) : query.trim().length >= 2 ? (
            <div className="p-4 text-center text-gray-400">
              <BookOpen size={24} className="mx-auto mb-2 opacity-50" />
              <p>لم يتم العثور على نتائج</p>
              <p className="text-xs mt-1">جرب كلمات أخرى للبحث</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default QuranSearchWidget;
