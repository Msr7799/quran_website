import Image from "next/image";
import { UserRound } from "lucide-react";
import { getReciterImage } from "@/lib/reciter-images";

export function ReciterAvatar({ reciterId, name, className = "", sizes = "44px" }: {
  reciterId: number | string;
  name: string;
  className?: string;
  sizes?: string;
}) {
  const src = getReciterImage(reciterId);

  return (
    <span className={`reciter-avatar ${className}`} aria-hidden="true">
      {src ? <Image src={src} width={180} height={180} sizes={sizes} alt={name} /> : <UserRound />}
    </span>
  );
}
