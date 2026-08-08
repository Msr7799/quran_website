import { LottiePlayer } from "@/components/LottiePlayer";

export default function Loading() {
  return <div className="page-loading" role="status" aria-live="polite"><LottiePlayer className="page-loading-animation" src="/lottie/splash_loading.json" /><span>جاري تحميل الصفحة...</span></div>;
}
