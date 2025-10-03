import React, { Dispatch, SetStateAction, useState } from "react";
import { FiBookOpen, FiDownload, FiBook, FiFileText, FiStar } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { useWindowSize } from "./useWindowSize";
import { IconType } from "react-icons";

const VerticalAccordion = () => {
  const [open, setOpen] = useState(items[0].id);

  return (
    <section className=" bg-[#333]  h-[90%]" >
      <div className="flex flex-col  h-full lg:flex-row mx-auto shadow overflow-hidden">
        {items.map((item) => {
          return (
            <Panel
              key={item.id}
              open={open}
              setOpen={setOpen}
              id={item.id}
              Icon={item.Icon}
              title={item.title}
              imgSrc={item.imgSrc}
              description={item.description}
              downloadUrl={item.downloadUrl}
              fileSize={item.fileSize}
            />
          );
        })}
      </div>
    </section>
  );
};

interface PanelProps {
  open: number;
  setOpen: Dispatch<SetStateAction<number>>;
  id: number;
  Icon: IconType;
  title: string;
  imgSrc: string;
  description: string;
  downloadUrl?: string;
  fileSize?: string;
}

const Panel = ({
  open,
  setOpen,
  id,
  Icon,
  title,
  imgSrc,
  description,
  downloadUrl,
  fileSize,
}: PanelProps) => {
  const { width } = useWindowSize();
  const isOpen = open === id;

  return (
    <>
      <button
        className="bg-chart-13 hover:bg-chart-17 transition-colors p-3 border-r-[1px] border-b-[1px] border-muted/50 rounded-sm flex flex-row-reverse lg:flex-col justify-start items-center gap-4 relative group"
        onClick={() => setOpen(id)}
      >
        <span
          style={{
            writingMode: "vertical-lr",
          }}
          className="hidden lg:block md:text-2xl  rotate-180"
        >
          
        </span>
        <span className=" lg:hidden text-xl font-light">{title}</span>
      
        <div className="w-6 lg:w-full aspect-square bg-[#000] border-2 rounded-full border-[#000] text-white grid place-items-center">
        <Icon /> 
        </div>
        <span className="w-4 h-4 bg-black/50 group-hover:bg-muted/30 transition-colors border-r-[1px] border-b-[1px] lg:border-b-0 lg:border-t-[1px] border-slate-200 rotate-45 absolute bottom-0 lg:bottom-[50%] right-[50%] lg:right-0 arabic-font translate-y-[50%] translate-x-[50%] z-20" />
      </button>


      <AnimatePresence>
        {isOpen && (
          <motion.div
            key={`panel-${id}`}
            variants={width && width > 1024 ? panelVariants : panelVariantsSm}
            initial="closed"
            animate="open"
            exit="closed"
            style={{
              backgroundImage: `url(${imgSrc})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              cursor: "pointer"
            }}
            className="w-full h-full overflow-hidden relative pb-3 bg-black flex items-end hover:scale-102 transition-transform duration-300 hover:shadow-2xl group"
            onClick={() => {
              if (downloadUrl) {
                window.open(downloadUrl, '_blank', 'noopener,noreferrer');
              }
            }}
            title={`اضغط لتحميل ${title}`}
          >
            {/* أيقونة التحميل */}
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <FiDownload className="arabic-font text-white text-xl" />
            </div>
            
            <motion.div
              variants={descriptionVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="px-4  rounded-10 justify-center text-semibold text-xl md:text-4xl bg-white/50 backdrop-blur-sm text-black/90"
            >
              <p className="mb-3">{description}</p>
              {fileSize && <p className="md:text-2xl opacity-75 mb-2">حجم الملف: {fileSize}</p>}
              {downloadUrl && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (downloadUrl) {
                      window.open(downloadUrl, '_blank', 'noopener,noreferrer');
                    }
                  }}
                  className="flex items-center gap-2 bg-white/20 hover:bg-black/20 px-3 py-1 rounded-md transition-colors"
                >
                  <FiDownload />
                  <span>تحميل المصحف</span>
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VerticalAccordion;

const panelVariants = {
  open: {
    width: "100%",
    height: "700px",
  },
  closed: {
    width: "0",
    height: "0px",
  },
};

const panelVariantsSm = {
  open: {
    width: "100%",
    height: "500px",
  },
  closed: {
    width: "100%",
    height: "0px",
  },
};

const descriptionVariants = {
  open: {
    opacity: 1,
    y: "0%",
    transition: {
      delay: 0.125,
    },
  },
  closed: { opacity: 0, y: "100%" },
};

const items = [
  {
    id: 1,
    title: "مصحف المدينة المنورة - النسخة الأزرق",
    Icon: FiBookOpen,
    imgSrc: "/images/001.png",
    description: "مصحف شريف برواية حفص عن عاصم بالرسم العثماني، مزين بإطارات زخرفية أزرق اللون مع خط واضح ومقروء",
    downloadUrl: "https://archive.org/download/Quran-Kareem-Khawagah-The-Blue-Page-Quran/Quran-Kareem-Khawagah-The-Blue-Page-Quran.pdf",
    fileSize: "160 MB"
  },
  {
    id: 2,
    title: "مصحف المدينة المنورة - النسخة الأخضر",
    Icon: FiStar,
    imgSrc: "/images/002.png",
    description: "نسخة مصحف المدينة المنورة بإطارات زخرفية خضراء جميلة، بالرسم العثماني وخط نسخ واضح ومريح للقراءة",
    downloadUrl: "https://archive.org/download/EQuran00001/E-Quran-00001.pdf",
    fileSize: "158 MB"
  },
  {
    id: 3,
    title: "مصحف المدينة المنورة - طبعة خاصة",
    Icon: FiBook,
    imgSrc: "/images/003.png",
    description: "طبعة مميزة من مصحف المدينة بزخارف إسلامية تقليدية وتصميم أنيق، مناسب للمساجد والبيوت",
    downloadUrl: "https://archive.org/download/arabic-568335686835685363568q3an1/arabic-quran2.pdf",
    fileSize: "93 MB"
  },
  {
    id: 4,
    title: "المصحف الشريف - طبعة ملونة",
    Icon: FiFileText,
    imgSrc: "/images/004.png",
    description: "مصحف بتصميم ملون وإطارات زخرفية متعددة الألوان، يجمع بين الجمال البصري والوضوح في القراءة",
    downloadUrl: "https://archive.org/download/Quran25/Quran25.pdf",
    fileSize: "192 MB"
  },
  {
    id: 5,
    title: "مصحف الحرمين الشريفين",
    Icon: FiBookOpen,
    imgSrc: "/images/005.png",
    description: "مصحف الحرمين الشريفين بطباعة فاخرة وزخارف إسلامية تراثية، من إصدار مجمع الملك فهد لطباعة المصحف الشريف",
    downloadUrl: "https://archive.org/download/QuranHaramain/QuranHaramain.pdf",
    fileSize: "145 MB"
  },
  {
    id: 6,
    title: "مصحف برواية ورش عن نافع",
    Icon: FiBook,
    imgSrc: "/images/006.png",
    description: "القرآن الكريم برواية الإمام ورش عن نافع المدني، المعتمد في بلدان المغرب العربي، بخط مغربي أصيل",
    downloadUrl: "https://archive.org/download/QuranWarsh/QuranWarsh.pdf",
    fileSize: "125 MB"
  },
  {
    id: 7,
    title: "القرآن الكريم مع التفسير الموضوعي",
    Icon: FiStar,
    imgSrc: "/images/09.png",
    description: "مصحف مع تفسير موضوعي شامل للآيات الكريمة، مفيد للباحثين والدارسين في علوم القرآن والتفسير",
    downloadUrl: "https://archive.org/download/quran-tafseer-mawdo/Quran_Tafseel-Mawdo_text.pdf",
    fileSize: "180 MB"
  },
  {
    id: 8,
    title: "مصحف الزخارف الوردية الفاخر",
    Icon: FiBookOpen,
    imgSrc: "/images/007.png",
    description: "مصحف شريف بتصميم فاخر مزين بزخارف وردية وبنفسجية أنيقة مع إطارات مذهبة، للمناسبات الخاصة",
    downloadUrl: "https://archive.org/download/QuranLuxury1/QuranLuxury1.pdf",
    fileSize: "210 MB"
  },
  {
    id: 9,
    title: "مصحف التصميم الكلاسيكي المزخرف",
    Icon: FiBook,
    imgSrc: "/images/008.png",
    description: "مصحف بتصميم كلاسيكي مع زخارف هندسية متقنة وألوان تراثية، يجمع بين الأصالة والجمال",
    downloadUrl: "https://archive.org/download/QuranClassic/QuranClassic.pdf",
    fileSize: "195 MB"
  },
  {
    id: 10,
    title: "مصحف الإطار الهندسي الملون",
    Icon: FiFileText,
    imgSrc: "/images/010.png",
    description: "مصحف مميز بإطارات هندسية ملونة وتصميم عصري يحافظ على الطابع التراثي الإسلامي",
    downloadUrl: "https://archive.org/download/QuranGeometric/QuranGeometric.pdf",
    fileSize: "175 MB"
  },
  {
    id: 11,
    title: "المصحف المفصل الموضوعي",
    Icon: FiStar,
    imgSrc: "/images/011.png",
    description: "مصحف مع تفصيل وتوضيحات موضوعية شاملة، مناسب للدراسة المتعمقة والبحث الأكاديمي",
    downloadUrl: "https://archive.org/download/QuranDetailed/QuranDetailed.pdf",
    fileSize: "320 MB"
  },
  {
    id: 12,
    title: "المصحف الذهبي الفاخر",
    Icon: FiBookOpen,
    imgSrc: "/images/012.png",
    description: "مصحف فاخر بخلفية سوداء وزخارف ذهبية براقة مع تصميم نجمة إسلامية في المنتصف، تحفة فنية رائعة",
    downloadUrl: "https://archive.org/download/QuranGolden/QuranGolden.pdf",
    fileSize: "250 MB"
  },
  {
    id: 13,
    title: "مصحف الإطار الأخضر والذهبي",
    Icon: FiBook,
    imgSrc: "/images/013.png",
    description: "مصحف مميز بإطار أخضر وذهبي جميل مع زخارف تراثية أنيقة، يجمع بين الوضوح والجمال في التصميم",
    downloadUrl: "https://archive.org/download/QuranGreenGold/QuranGreenGold.pdf",
    fileSize: "185 MB"
  }
];