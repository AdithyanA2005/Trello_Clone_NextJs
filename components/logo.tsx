import localFont from "next/font/local";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const headingFont = localFont({
  src: "..//public/fonts/cal-sans.woff2",
});

export function Logo({ containerClassName, size = 30 }: { containerClassName?: string; size?: number }) {
  return (
    <Link href="/">
      <div className={cn("hidden items-center gap-2 transition hover:opacity-75 md:flex", containerClassName)}>
        <Image src="/logo.svg" alt="Logo" height={size} width={size} />
        <p className={cn("pb-1 text-lg text-neutral-700", headingFont.className)}>{siteConfig.name}</p>
      </div>
    </Link>
  );
}
