import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return <div className="page-loading" role="status" aria-live="polite"><LoaderCircle className="spin" /><span>جاري تحميل الصفحة...</span></div>;
}
