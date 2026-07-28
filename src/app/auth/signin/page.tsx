import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
export default function SignIn() { return <div className="content-shell narrow"><PageHeader title="تسجيل الدخول" description="لا تحتاج إلى حساب للاستفادة من جميع مزايا القراءة والاستماع." /><div className="assistant-card"><p>أزلنا نظام الحسابات من النسخة الخفيفة لحماية الخصوصية وتقليل الاعتماديات.</p><Link className="button primary" href="/">العودة للرئيسية</Link></div></div>; }
