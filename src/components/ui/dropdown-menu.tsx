// المسار: src/components/ui/dropdown-menu.tsx — يوفر مكوّنات قوائم منسدلة قابلة للبحث وإعادة الاستخدام.
"use client";

import * as React from "react";
import * as Primitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown } from "lucide-react";

export const DropdownMenu = Primitive.Root;
export const DropdownMenuTrigger = Primitive.Trigger;
export const DropdownMenuGroup = Primitive.Group;
export const DropdownMenuPortal = Primitive.Portal;
export const DropdownMenuSeparator = Primitive.Separator;

// يعرض حاوية القائمة المنسدلة داخل بوابة مرئية.
export function DropdownMenuContent({ className = "", sideOffset = 6, ...props }: React.ComponentProps<typeof Primitive.Content>) {
  return <Primitive.Portal><Primitive.Content className={`site-dropdown-content ${className}`} sideOffset={sideOffset} collisionPadding={12} {...props} /></Primitive.Portal>;
}

// يعرض عنصرًا عاديًا داخل القائمة المنسدلة.
export function DropdownMenuItem({ className = "", ...props }: React.ComponentProps<typeof Primitive.Item>) {
  return <Primitive.Item className={`site-dropdown-item ${className}`} {...props} />;
}

// يجمع خيارات القائمة ذات الاختيار الواحد.
export function DropdownMenuRadioGroup(props: React.ComponentProps<typeof Primitive.RadioGroup>) {
  return <Primitive.RadioGroup {...props} />;
}

// يعرض خيارًا قابلاً للتحديد مع علامة الحالة.
export function DropdownMenuRadioItem({ children, className = "", ...props }: React.ComponentProps<typeof Primitive.RadioItem>) {
  return <Primitive.RadioItem className={`site-dropdown-item site-dropdown-radio ${className}`} {...props}><Primitive.ItemIndicator className="site-dropdown-indicator"><Check /></Primitive.ItemIndicator><span className="site-dropdown-label">{children}</span></Primitive.RadioItem>;
}

type Option = { value: string; label: React.ReactNode; searchText?: string };

// يعرض قائمة اختيار قابلة للبحث من مجموعة خيارات.
export function SelectDropdown({ value, options, onValueChange, ariaLabel, placeholder = "اختر", className = "", contentClassName = "" }: {
  value: string;
  options: Option[];
  onValueChange: (value: string) => void;
  ariaLabel: string;
  placeholder?: string;
  className?: string;
  contentClassName?: string;
}) {
  const selected = options.find((option) => option.value === value);
  const [query, setQuery] = React.useState("");
  const filtered = query ? options.filter((option) => (option.searchText ?? String(option.label)).toLocaleLowerCase().includes(query.toLocaleLowerCase())) : options;

  return <DropdownMenu onOpenChange={(open) => { if (!open) setQuery(""); }}>
    <DropdownMenuTrigger className={`site-dropdown-trigger ${className}`} aria-label={ariaLabel}>
      <span>{selected?.label ?? placeholder}</span><ChevronDown />
    </DropdownMenuTrigger>
    <DropdownMenuContent className={`site-select-menu ${contentClassName}`} align="start">
      {options.length > 8 && <div className="site-dropdown-search" onKeyDown={(event) => event.stopPropagation()}><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="بحث..." aria-label="بحث في القائمة" /></div>}
      <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
        {filtered.map((option) => <DropdownMenuRadioItem value={option.value} key={option.value}>{option.label}</DropdownMenuRadioItem>)}
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>;
}
