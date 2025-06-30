import React, { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import styles from '../styles/EmblaCarousel.module.css';

export default function HadithCarousel() {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' });
  const [hadiths, setHadiths] = useState([]);

  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-bukhari/1.json')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.hadiths)) setHadiths(data.hadiths.slice(0, 10));
        else setHadiths([data]);
      })
      .catch(err => console.error('خطأ جلب الأحاديث:', err));
  }, []);

  return (
    <div className={styles.embla} ref={emblaRef}>
      <div className={styles.embla__container}>
        {hadiths.map((h, i) => (
          <div key={i} className={styles.embla__slide}>
            <p><strong>حَدِيث {h.hadithNumber || h.number || i + 1}</strong></p>
            {h.hadithArabic && <p>{h.hadithArabic}</p>}
            {h.hadithEnglish && <p><em>{h.hadithEnglish}</em></p>}
            {!h.hadithEnglish && h.text && <p><em>{h.text}</em></p>}
          </div>
        ))}
      </div>
    </div>
  );
}
