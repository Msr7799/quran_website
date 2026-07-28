import Image from "next/image";
import Link from "next/link";
export default function NotFound() { return <div className="not-found"><Image src="/images/page-not-found.svg" width={360} height={260} alt="الصفحة غير موجودة" /><h1>الصفحة غير موجودة</h1><p>يبدو أن الرابط غير صحيح أو أن الصفحة نُقلت.</p><Link className="button primary" href="/">العودة للرئيسية</Link></div>; }
