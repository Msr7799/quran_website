"use client";

// pages/404.jsx
import Link from 'next/link'
import SeoHead from '../components/SeoHead'
import { LightRays } from "@/registry/magicui/light-rays"
import { Button } from "@components/ui/button"
import { WarpBackground } from "@/registry/magicui/warp-background"

export default function Custom404() {
  return (
        <WarpBackground
        gridColor= "#ccc "
        beamColor={["var(--secondary-foreground)", "var(--chart-4)", "var(--chart-3)", "var(--destructive)" ]}
        beamDelayMax= "4"
        beamsPerSide= "2"
        
        >
    <>
      <SeoHead
        title="صفحة غير موجودة - عذرًا"
        description="عذرًا، الصفحة التي تحاول الوصول إليها غير موجودة. ربما تم نقلها أو حذفها."
        url={`${process.env.NEXT_PUBLIC_BASE_URL}/404`}
        image={`${process.env.NEXT_PUBLIC_BASE_URL}/images/page-not-found.svg`}
        keywords="خطأ 404, صفحة غير موجودة, عذرًا, موقع"
      />
    <div className="relative opacity-90 h-[100vh] w-full overflow-hidden bg-[#f9f9f9]/10 rounded-lg ">

      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="text-4xl font-semibold tracking-[0.35em] text-slate-800/60 uppercase dark:text-slate-200/60">
        صفحة غير موجودة - عذرًا !!
        </span>
        <h1 className="text-muted-foreground md:text-9xl font-bold md:text-5xl">
         404
        </h1>
        <p className="max-w-md text-sm text-slate-800/80 md:text-base dark:text-slate-200/80 font-uthmanic">
          عذرًا، الصفحة التي تحاول الوصول إليها غير موجودة. ربما تم نقلها أو حذفها.
        </p>

        <Link href="/">
          <Button className='px-8 py-5 border border-[var(--muted-foreground)]/30 cursor-pointer bg-[var(--chart-5)]/60 font-uthmanic'>
            العودة للصفحة الرئيسية
          </Button>
        </Link>
      </div>
<LightRays 
count= "2"
color="rgb(255, 255, 255)"
/>
  </div>
    </>
</WarpBackground>
  );
}
