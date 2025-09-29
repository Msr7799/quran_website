import React, { useEffect, useState, Dispatch, SetStateAction } from "react";

import { motion, useMotionValue } from "framer-motion";

// نوع بيانات الصورة مع الوصف
interface ImageData {
  src: string;
  description: string;
}


const imgs: ImageData[] = [
  {
    src: "alf.gif",
    description: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
  },
  {
    src: "img/hero1.png", 
    description: " قال تعالى في سورة الإسراء: إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ               وَيُبَشِّرُ الْمُؤْمِنِينَ الَّذِينَ يَعْمَلُونَ الصَّالِحَاتِ أَنَّ لَهُمْ أَجْرًا كَبِيرًا"
  },
  {
    src: "img/hero2.png",
    description: "نور وهداية للمؤمنين"
  },
  {
    src: "img/hero3.png",
    description: " "
  },
  {
    src: "img/hero4.png",
    description: " " 
  },
  {
    src: "img/hero5.png",
    description: " "
  },
  {
    src: "img/hero6.png",
    description: "إِنَّ أَوَّلَ بَيْتٍ وُضِعَ لِلنَّاسِ لَلَّذِي بِبَكَّةَ مُبَارَكًا وَهُدًى لِّلْعَالَمِينَ / فِيهِ آيَاتٌ بَيِّنَاتٌ مَّقَامُ إِبْرَاهِيمَ وَمَن دَخَلَهُ كَانَ آمِنًا وَلِلّهِ عَلَى النَّاسِ حِجُّ الْبَيْتِ مَنِ اسْتَطَاعَ إِلَيْهِ سَبِيلاً وَمَن كَفَرَ فَإِنَّ الله غَنِيٌّ عَنِ الْعَالَمِينَ"
  },
  {
    src: "img/hero7.png",
    description: "أَفَلَا يَنظُرُونَ إِلَى ٱلۡإِبِلِ كَيۡفَ خُلِقَتۡ"
  }
];

const ONE_SECOND = 1000;

const AUTO_DELAY = ONE_SECOND * 10;

const DRAG_BUFFER = 50;


const SPRING_OPTIONS = {

  type: "spring" as const,

  mass: 3,

  stiffness: 400,

  damping: 50,

};


export const SwipeCarousel = () => {

  const [imgIndex, setImgIndex] = useState(0);


  const dragX = useMotionValue(0);


  useEffect(() => {

    const intervalRef = setInterval(() => {

      const x = dragX.get();


      if (x === 0) {

        setImgIndex((pv) => {

          if (pv === imgs.length  - 1) {

            return 0;
          }

          return pv + 1; // للمواقع العربية RTL: التحرك للأمام

        });

      }

    }, AUTO_DELAY);


    return () => clearInterval(intervalRef);

  }, [dragX]);


  const onDragEnd = () => {

    const x = dragX.get();


    // 🔄 مهم: منطق السحب يعتمد على اتجاه الموقع
    // للمواقع الإنجليزية: السحب لليسار = التالي
    // للمواقع العربية: السحب لليمين = التالي
    if (x <= -DRAG_BUFFER && imgIndex < imgs.length - 1) {

      setImgIndex((pv) => pv - 1); // السحب لليسار = التالي (إنجليزي)

    } else if (x >= DRAG_BUFFER && imgIndex > 0) {

      setImgIndex((pv) => pv - 1); // السحب لليمين = السابق (إنجليزي)

    }

  };


  return (

    <div className="relative mb-10 overflow-hidden bg-neutral-950 py-8">

      <motion.div

        drag="x"

        dragConstraints={{

          left: 0,

          right: 0,

        }}

        style={{

          x: dragX,

        }}

        animate={{
          // ⚠️ مهم جداً: هذا يحدد اتجاه حركة الصور
          // القيمة السالبة (-) = حركة لليسار (نمط إنجليزي)
          // القيمة الموجبة (+) = حركة لليمين (نمط عربي)
          translateX: `${imgIndex * 100}%`,

        }}

        transition={SPRING_OPTIONS}

        onDragEnd={onDragEnd}

        className="flex cursor-grab items-center active:cursor-grabbing"

      >

        <Images imgIndex={imgIndex} />

      </motion.div>


      <Dots imgIndex={imgIndex} setImgIndex={setImgIndex} />

      <GradientEdges />

    </div>

  );

};


const Images = ({ imgIndex }: { imgIndex: number }) => {

  return (

    <>

      {imgs.map((imgData, idx) => {
        // 📌 مهم: ترتيب الصور في DOM يحدد الاتجاه
        // بدون reverse = نمط إنجليزي (LTR)
        // مع reverse = نمط عربي (RTL)

        return (

          <motion.div

            key={idx}
            
            className="relative aspect-video w-screen shrink-0 rounded-xl bg-neutral-800 object-cover overflow-hidden"

            style={{

              backgroundImage: `url(${imgData.src})`,

              backgroundSize: "cover",

              backgroundPosition: "center",

            }}

            animate={{

              scale: imgIndex === idx ? 0.95 : 0.85,

            }}

            transition={SPRING_OPTIONS}

          >
            {/* وصف الصورة */}
            <div className="absolute left-70 inset-0 !bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-center p-6 w-full">
              <div className="text-center max-w-md">
                <h3 className="relative text-white bg-black/30 text-lg md:text-2xl lg:text-6xl font-semibold leading-relaxed [text-shadow:3px_3px_6px_rgba(0,0,0,0.9)] animate-in fade-in duration-700 w-[60vw] left-30">
                  {imgData.description}
                </h3>
              </div>
            </div>
          </motion.div>

        );

      })}

    </>

  );

};


const Dots = ({

  imgIndex,

  setImgIndex,

}: {

  imgIndex: number;

  setImgIndex: Dispatch<SetStateAction<number>>;

}) => {

  return (

    <div className="mt-4 flex w-full justify-center gap-2">

      {imgs.map((_, idx) => {
        // 📍 مهم: ترتيب النقاط يجب أن يتطابق مع ترتيب الصور
        // بدون reverse = نقاط بالترتيب العادي
        // مع reverse = نقاط معكوسة للعربي

        return (

          <button

            key={idx}

            onClick={() => setImgIndex(idx)}

            className={`h-3 w-3 rounded-full transition-colors ${

              idx === imgIndex ? "bg-neutral-50" : "bg-neutral-500"

            }`}

          />

        );

      })}

    </div>

  );

};


const GradientEdges = () => {

  return (

    <>

      <div className="pointer-events-none absolute bottom-0 left-0 top-0 w-[10vw] max-w-[100px] bg-gradient-to-r from-neutral-950/50 to-neutral-950/0" />

      <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-[10vw] max-w-[100px] bg-gradient-to-l from-neutral-950/50 to-neutral-950/0" />

    </>

  );

};