import { useMotionValue, motion, useSpring, useTransform } from "framer-motion";
import React, { useRef, useState } from "react";
import { FiArrowRight, FiDownload } from "react-icons/fi";
import DropDownButton from "./animate-ui/primitives/buttons/dropdown-button";

export const HoverImageLinks = () => {
  return (
    <section className="bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        
        {/* قسم كتب الفقه */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-chart-10 mb-8 text-center arabic-font">
            كتب الفقه
          </h2>
          
          <Link
            heading="كتاب رياض الصالحين"
            subheading="فقه"
            imgSrc="/images/001f.png"
            href="https://archive.org/download/20211221_20211221_2057/%D8%B1%D9%8A%D8%A7%D8%B6%20%D8%A7%D9%84%D8%B5%D8%A7%D9%84%D8%AD%D9%8A%D9%86%20%D8%A8%D8%B4%D8%B1%D8%AD%20%D8%A7%D9%84%D8%B5%D8%A7%D8%A8%D9%88%D9%86%D9%8A_text.pdf"
          />

          <FiqhIslamiLink />

          <Link
            heading="زاد المستقنع"
            subheading="فقه"
            imgSrc="/images/003f.png"
            href="https://dn790008.ca.archive.org/0/items/20230117_20230117_0926/%D8%B2%D8%A7%D8%AF%20%D8%A7%D9%84%D9%85%D8%B3%D8%AA%D9%82%D9%86%D8%B9_text.pdf"
          />

          <Link
            heading="مختصر زاد المعاد"
            subheading="فقه"
            imgSrc="/images/004f.png"
            href="https://archive.org/download/Ash_778/ZAD%20ALMEAD.pdf"
          />
        </div>

        {/* خط فاصل */}
        <div className="border-t border-neutral-700 my-16"></div>

        {/* قسم كتب التوحيد */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-chart-10 mb-8 text-center arabic-font">
            كتب التوحيد
          </h2>
          
          <Link
            heading="كتاب التوحيد"
            subheading=" توحيد"
            imgSrc="/images/001t.png"
            href="https://archive.org/download/Ash_961/Islamic_text.pdf"
          />

          <Link
            heading="القول المفيد في كتاب التوحيد"
            subheading="توحيد"
            imgSrc="/images/002t.png"
            href="https://archive.org/download/20231016_20231016_0702/%D8%A7%D9%84%D9%82%D9%88%D9%84%20%D8%A7%D9%84%D9%85%D9%81%D9%8A%D8%AF%20%D8%B9%D9%84%D9%89%20%D9%83%D8%AA%D8%A7%D8%A8%20%D8%A7%D9%84%D8%AA%D9%88%D8%AD%D9%8A%D8%AF%20-%20%D8%A7%D8%A8%D9%86%20%D8%B9%D8%AB%D9%8A%D9%85%D9%8A%D9%86_text.pdf"
          />
        </div>
      </div>
    </section>
  );
};

// مكون خاص بكتاب الفقه الإسلامي مع dropdown للأجزاء الثمانية
const FiqhIslamiLink = () => {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const [selectedPart, setSelectedPart] = useState("");

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const top = useTransform(mouseYSpring, [0.5, -0.5], ["40%", "60%"]);
  const left = useTransform(mouseXSpring, [0.5, -0.5], ["60%", "70%"]);

  const fiqhParts = [
    { label: "الجزء الأول", value: "part1", href: "https://archive.org/download/fia2_20200228/%D8%A7%D9%84%D9%81%D9%82%D9%87%20%D8%A7%D9%84%D8%A5%D8%B3%D9%84%D8%A7%D9%85%D9%8A%20%D9%88%D8%A3%D8%AF%D9%84%D8%AA%D9%87/fia0_text.pdf" },
    { label: "الجزء الثاني", value: "part2", href: "https://archive.org/download/fia2_20200228/%D8%A7%D9%84%D9%81%D9%82%D9%87%20%D8%A7%D9%84%D8%A5%D8%B3%D9%84%D8%A7%D9%85%D9%8A%20%D9%88%D8%A3%D8%AF%D9%84%D8%AA%D9%87/fia1_text.pdf" },
    { label: "الجزء الثالث", value: "part3", href: "https://archive.org/download/fia2_20200228/%D8%A7%D9%84%D9%81%D9%82%D9%87%20%D8%A7%D9%84%D8%A5%D8%B3%D9%84%D8%A7%D9%85%D9%8A%20%D9%88%D8%A3%D8%AF%D9%84%D8%AA%D9%87/fia2_text.pdf" },
    { label: "الجزء الرابع", value: "part4", href: "https://archive.org/download/fia2_20200228/%D8%A7%D9%84%D9%81%D9%82%D9%87%20%D8%A7%D9%84%D8%A5%D8%B3%D9%84%D8%A7%D9%85%D9%8A%20%D9%88%D8%A3%D8%AF%D9%84%D8%AA%D9%87/fia3_text.pdf" },
    { label: "الجزء الخامس", value: "part5", href: "https://archive.org/download/fia2_20200228/%D8%A7%D9%84%D9%81%D9%82%D9%87%20%D8%A7%D9%84%D8%A5%D8%B3%D9%84%D8%A7%D9%85%D9%8A%20%D9%88%D8%A3%D8%AF%D9%84%D8%AA%D9%87/fia4_text.pdf" },
    { label: "الجزء السادس", value: "part6", href: "https://archive.org/download/fia2_20200228/%D8%A7%D9%84%D9%81%D9%82%D9%87%20%D8%A7%D9%84%D8%A5%D8%B3%D9%84%D8%A7%D9%85%D9%8A%20%D9%88%D8%A3%D8%AF%D9%84%D8%AA%D9%87/fia5_text.pdf" },
    { label: "الجزء السابع", value: "part7", href: "https://archive.org/download/fia2_20200228/%D8%A7%D9%84%D9%81%D9%82%D9%87%20%D8%A7%D9%84%D8%A5%D8%B3%D9%84%D8%A7%D9%85%D9%8A%20%D9%88%D8%A3%D8%AF%D9%84%D8%AA%D9%87/fia7_text.pdf" },
    { label: "الجزء الثامن", value: "part8", href: "https://archive.org/download/fia2_20200228/%D8%A7%D9%84%D9%81%D9%82%D9%87%20%D8%A7%D9%84%D8%A5%D8%B3%D9%84%D8%A7%D9%85%D9%8A%20%D9%88%D8%A3%D8%AF%D9%84%D8%AA%D9%87/fia8_text.pdf" }
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const rect = ref.current!.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleDownload = () => {
    if (selectedPart) {
      const selectedPartData = fiqhParts.find(part => part.value === selectedPart);
      if (selectedPartData) {
        window.open(selectedPartData.href, '_blank');
      }
    }
  };

  return (
    <motion.a
      ref={ref}
      onMouseMove={handleMouseMove}
      initial="initial"
      whileHover="whileHover"
      className="group relative flex items-center justify-between border-b-2 border-neutral-700 py-4 transition-colors duration-500 hover:border-neutral-50 md:py-8"
    >
      <div className="flex-1">
        <motion.span
          variants={{
            initial: { x: 0 },
            whileHover: { x: -16 },
          }}
          transition={{
            type: "spring",
            duration: 0.3,
          }}
          className="relative z-50 block text-2xl font-bold text-neutral-500 transition-colors duration-500 group-hover:text-neutral-50 md:text-4xl arabic-font"
        >
          الفقه الإسلامي وأدلته
        </motion.span>
        
        <span className="relative z-50 mt-2 block text-base text-neutral-500 transition-colors duration-500 group-hover:text-neutral-50 arabic-font">
          موسوعة شاملة في الفقه الإسلامي - 8 أجزاء
        </span>

        {/* Dropdown للأجزاء */}
        <div className="mt-4 flex items-center gap-4 z-40 relative">
          <DropDownButton
            options={fiqhParts}
            value={selectedPart}
            onChange={setSelectedPart}
            placeholder="اختر الجزء"
          />
          {selectedPart && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors text-sm font-medium arabic-font"
            >
              <FiDownload className="w-4 h-4" />
              تحميل الجزء
            </motion.button>
          )}
        </div>
      </div>

      <motion.img
        style={{
          top,
          left,
          translateX: "-50%",
          translateY: "-50%",
        }}
        variants={{
          initial: { scale: 0, rotate: "0deg" },
          whileHover: { scale: 1, rotate: "0deg" },
        }}
        transition={{ type: "spring" }}
        src="/images/002f.png"
        className="absolute z-50 h-58 w-52 rounded-lg object-cover md:h-80 md:w-56 shadow-2xl pointer-events-none"
        alt="كتاب الفقه الإسلامي وأدلته"
      />

      <motion.div
        variants={{
          initial: { x: "25%", opacity: 0 },
          whileHover: { x: "0%", opacity: 1 },
        }}
        transition={{ type: "spring" }}
        className="relative  p-4"
      >
        <FiArrowRight className="text-5xl z-0 text-neutral-50" />
      </motion.div>
    </motion.a>
  );
};


interface LinkProps {
  heading: string;
  imgSrc: string;
  subheading: string;
  href: string;
}

const Link = ({ heading, imgSrc, subheading, href }: LinkProps) => {
  const ref = useRef<HTMLAnchorElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const top = useTransform(mouseYSpring, [0.5, -0.5], ["40%", "60%"]);
  const left = useTransform(mouseXSpring, [0.5, -0.5], ["60%", "70%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const rect = ref.current!.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      ref={ref}
      onMouseMove={handleMouseMove}
      initial="initial"
      whileHover="whileHover"
      className="group relative flex items-center justify-between border-b-2 border-neutral-700 py-4 transition-colors duration-500 hover:border-neutral-50 md:py-8"
    >
      <div>
        <motion.span
          variants={{
            initial: { x: 0 },
            whileHover: { x: -16 },
          }}
          transition={{
            type: "spring",
            duration: 0.3,
          }}
          className="relative  block text-2xl font-bold text-neutral-500 transition-colors duration-500 group-hover:text-neutral-50 md:text-4xl arabic-font"
        >
          {heading}
        </motion.span>
        <span className="relative  mt-2 block text-base text-neutral-500 transition-colors duration-500 group-hover:text-neutral-50 arabic-font">
          {subheading}
        </span>
      </div>

      <motion.img
        style={{
          top,
          left,
          translateX: "-50%",
          translateY: "-50%",
        }}
        variants={{
          initial: { scale: 0, rotate: "0deg" },
          whileHover: { scale: 1, rotate: "0deg" },
        }}
        transition={{ type: "spring" }}
        src={imgSrc}
        className="absolute z-50 h-48 w-32 rounded-lg object-cover md:h-80 md:w-56 shadow-2xl pointer-events-none"
        alt={`صورة كتاب ${heading}`}
      />

      <motion.div
        variants={{
          initial: { x: "25%", opacity: 0 },
          whileHover: { x: "0%", opacity: 1 },
        }}
        transition={{ type: "spring" }}
        className="relative z-50 p-4"
      >
        <FiArrowRight className="text-5xl text-neutral-50" />
      </motion.div>
    </motion.a>
  );
};