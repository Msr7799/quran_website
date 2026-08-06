// المسار: src/components/PageHeader.tsx — يعرض عنوانًا موحدًا ووصفًا لصفحات الموقع.
// يعرض مقدمة الصفحة من العنوان والوصف والتصنيف.
export function PageHeader({ eyebrow, title, description }: { eyebrow?: string; title: string; description: string }) {
  return <section className="page-heading">{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h1>{title}</h1><p>{description}</p></section>;
}
