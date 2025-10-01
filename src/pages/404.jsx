"use client";

// pages/404.jsx
import Link from 'next/link'
import SeoHead from '../components/SeoHead'
import { LightRays } from "@/registry/magicui/light-rays"
import { Button } from "@components/ui/button"
import { InteractiveGridPattern } from "@/registry/magicui/interactive-grid-pattern"
import { cn } from "@/lib/utils"

export default function Custom404() {
  return (
       
    <>
          
          <div className="z-10 flex h-[100vh] bg-neutral-950 flex-col items-center justify-center gap-4  text-center">
          <InteractiveGridPattern
        className={cn(
          "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]"
        )}
        width={20}
        height={20}
        squares={[80, 80]}
        squaresClassName="hover:fill-destructive"
      />
      <SeoHead
        title="صفحة غير موجودة - عذرًا"
        description="عذرًا، الصفحة التي تحاول الوصول إليها غير موجودة. ربما تم نقلها أو حذفها."
        url={`${process.env.NEXT_PUBLIC_BASE_URL}/404`}
        image={`${process.env.NEXT_PUBLIC_BASE_URL}/images/page-not-found.svg`}
        keywords="خطأ 404, صفحة غير موجودة, عذرًا, موقع"
      />

  
        <span className="md:text-4xl text-2xl shadow-2xl font-bold tracking-[0.35em] text-white/80 uppercase ">
        صفحة غير موجودة - عذرًا !!
        </span>
        <h1 className="text-white/70 z-10 md:text-9xl font-bold md:text-5xl shadow-2xl ">
         404
        </h1>
        <p className="max-w-md z-20 tracking-widest shadow-2xl text-lg text-white/80 md:text-2xl font-uthmanic">
          عذرًا، الصفحة التي تحاول الوصول إليها غير موجودة. ربما تم نقلها أو حذفها.
        </p>
        <div className="z-20">
        <Link href="/">
          <Button className='px-6 py-6 md:text-2xl text-lg border-2 !z-20 border-[var(--muted-foreground)]/30 cursor-pointer bg-[var(--chart-1)] font-uthmanic'>
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
  );
}
