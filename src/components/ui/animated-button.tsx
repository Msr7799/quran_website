import React from "react";
import { useRouter } from 'next/router';

const DrawOutlineButton = ({

  children,

  ...rest

}: React.DetailedHTMLProps<

  React.ButtonHTMLAttributes<HTMLButtonElement>,

  HTMLButtonElement

>) => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/quran-pages/1');
  };

  return (

    <button

      {...rest}

      onClick={handleClick}

      className="group relative w-full sm:w-auto px-8 py-4 text-lg md:text-xl font-bold  hover:from-[#5a6578] hover:via-[#4a5568] hover:to-[#2d3748] text-white transition-all duration-300 shadow-2xl shadow-black/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] hover:scale-105 hover:-translate-y-1 rounded-lg border border-[#606060]/30 hover:border-[#707070]/50 overflow-hidden"

    >

      <span>{children}</span>

      {/* TOP - الخط العلوي */}
      <span className="absolute left-0 top-0 h-[1px] w-0 border-t-2 border-white/60 transition-all duration-200 group-hover:w-full" />

      {/* RIGHT - الخط الأيمن */}
      <span className="absolute right-0 top-0 h-0 w-[1px] border-r-2 border-white/60 transition-all delay-100 duration-200 group-hover:h-full" />

      {/* BOTTOM - الخط السفلي */}
      <span className="absolute bottom-0 right-0 h-[1px] w-0 border-b-2 border-white/60 transition-all delay-200 duration-200 group-hover:w-full" />

      {/* LEFT - الخط الأيسر */}
      <span className="absolute bottom-0 left-0 h-0 w-[1px] border-l-2 border-white/60 transition-all delay-300 duration-200 group-hover:h-full" />

    </button>

  );

};

export default DrawOutlineButton;