import React, { useState, useRef } from 'react';
import Head from 'next/head';
import styles from '../styles/Live.module.css';

const radioStations = [
  {
    id: 1,
    name: 'إذاعة القرآن الكريم من الرياض',
    url: 'https://live.mp3quran.net:8006/stream',
    description: 'تلاوات متنوعة من كبار القراء'
  },
  {
    id: 2,
    name: 'إذاعة القرآن الكريم - السعودية',
    url: 'https://stream.radiojar.com/4wqre23fytzuv',
    description: 'بث مباشر للقرآن الكريم'
  },
  {
    id: 3,
    name: 'إذاعة القرآن الكريم - مصر',
    url: 'https://live.mp3quran.net:8002/stream',
    description: 'إذاعة القرآن الكريم من القاهرة'
  },
  {
    id: 4,
    name: 'راديو الحرمين الشريفين',
    url: 'https://live.mp3quran.net:8004/stream',
    description: 'إذاعة الحرمين الشريفين'
  }
];

export default function LivePage() {
  const [selectedStation, setSelectedStation] = useState(radioStations[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const audioRef = useRef(null);

  const handleStationChange = (station) => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    setSelectedStation(station);
  };

  const handleAudioPlay = () => {
    setIsPlaying(true);
  };

  const handleAudioPause = () => {
    setIsPlaying(false);
  };

  // معرف قناة الحرم المكي الشريف على يوتيوب
  const makkahChannelVideoId = "II7g5CmzNd4"; // البث المباشر من الحرم المكي

  return (
    <>
      <Head>
        <title>البث المباشر - القرآن الكريم</title>
        <meta name="description" content="شاهد البث المباشر من الحرم المكي الشريف واستمع لإذاعات القرآن الكريم" />
        <meta name="keywords" content="البث المباشر, مكة المكرمة, إذاعة القرآن, الحرم المكي" />
      </Head>

      <div className={styles.liveContainer}>
        <h1 className={styles.pageTitle}>البث المباشر للقرآن الكريم</h1>
        
        <div className={styles.contentGrid}>
          {/* البث المباشر من مكة - في الأعلى ويأخذ العرض الكامل */}
          <div className={`${styles.liveSection} ${styles.videoSection}`}>
            <h2 className={styles.sectionTitle}>🕋 البث المباشر من الحرم المكي الشريف</h2>
            <div className={styles.videoContainer}>
              {!videoLoaded && (
                <div className={styles.loadingMessage}>
                  جاري تحميل البث المباشر...
                </div>
              )}
              <iframe
                src={`https://www.youtube.com/embed/${makkahChannelVideoId}?autoplay=0&mute=0`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="البث المباشر من الحرم المكي الشريف"
                onLoad={() => setVideoLoaded(true)}
              />
            </div>
          </div>

          {/* إذاعات القرآن الكريم - في الأسفل */}
          <div className={styles.liveSection}>
            <h2 className={styles.sectionTitle}>📻 إذاعات القرآن الكريم</h2>
            
            <div className={styles.radioSection}>
              {/* مشغل الراديو */}
              <div className={styles.radioPlayer}>
                <h3 className={styles.radioTitle}>{selectedStation.name}</h3>
                <p className={styles.stationDesc}>{selectedStation.description}</p>
                <div className={styles.audioControls}>
                  <audio
                    ref={audioRef}
                    controls
                    preload="none"
                    onPlay={handleAudioPlay}
                    onPause={handleAudioPause}
                    key={selectedStation.id}
                  >
                    <source src={selectedStation.url} type="audio/mpeg" />
                    متصفحك لا يدعم تشغيل الصوت
                  </audio>
                </div>
              </div>

              {/* قائمة المحطات */}
              <div className={styles.radioStationsList}>
                <h4 className={styles.stationsListTitle}>اختر محطة راديو:</h4>
                {radioStations.map((station) => (
                  <div
                    key={station.id}
                    className={`${styles.radioStation} ${
                      selectedStation.id === station.id ? styles.active : ''
                    }`}
                    onClick={() => handleStationChange(station)}
                  >
                    <div className={styles.stationName}>{station.name}</div>
                    <div className={styles.stationDesc}>{station.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* معلومات إضافية */}
        <div className={styles.liveSection} style={{ marginTop: '2rem' }}>
          <h2 className={styles.sectionTitle}>📖 معلومات مهمة</h2>
          <div style={{ textAlign: 'center', color: 'var(--text-color-2)', lineHeight: '1.8' }}>
            <p>• البث المباشر متاح على مدار الساعة من الحرم المكي الشريف</p>
            <p>• يمكنك الاستماع لإذاعات القرآن الكريم أثناء تصفح الموقع</p>
            <p>• جميع المحتويات متاحة بجودة عالية ومجانية</p>
            <p>• اللهم بارك لنا في هذا العمل واجعله خالصاً لوجهك الكريم</p>
          </div>
        </div>
      </div>
    </>
  );
}
