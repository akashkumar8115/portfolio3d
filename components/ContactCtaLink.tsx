"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

const campaignParameters = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

type ContactCtaLinkProps = {
  origin: "project" | "blog";
  originId: string;
  children: ReactNode;
  className: string;
};

export default function ContactCtaLink({
  origin,
  originId,
  children,
  className,
}: ContactCtaLinkProps) {
  const router = useRouter();
  const fallbackHref = "/#contact";

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    const destination = new URL("/", window.location.origin);
    destination.searchParams.set("inquiry_from", `${origin}:${originId}`);
    const current = new URLSearchParams(window.location.search);
    for (const parameter of campaignParameters) {
      const value = current.get(parameter)?.trim().slice(0, 150);
      if (value && !/[\u0000-\u001f\u007f]/.test(value)) {
        destination.searchParams.set(parameter, value);
      }
    }
    destination.hash = "contact";
    router.push(`${destination.pathname}${destination.search}${destination.hash}`);
  };

  return (
    <Link href={fallbackHref} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
