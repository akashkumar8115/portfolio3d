import type { Metadata } from "next";

export const SITE_NAME = "Akash Kumar";
export const SITE_TAGLINE = "Tech Entrepreneur & Strategic Partner";
export const SITE_DESCRIPTION =
  "Tech entrepreneur and strategic partner across Intopie, VRV InfoLed, SKDS, and AM Future Tech Solution. SaaS products, enterprise web platforms, and digital transformation.";

export function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (raw) {
    return raw;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export function absoluteUrl(path = "/") {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const url = getSiteUrl();
  return `${url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function clipText(value: string, max = 160) {
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) {
    return clean;
  }
  return `${clean.slice(0, max - 1).trim()}…`;
}

export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  keywords = [],
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  keywords?: string[];
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const ogImage = absoluteUrl(image || "/images/image-ak.jpg");
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description: clipText(description),
    keywords: keywords.length ? keywords : undefined,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      title: fullTitle,
      description: clipText(description, 200),
      images: [{ url: ogImage, alt: title }],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: clipText(description, 200),
      images: [ogImage],
    },
  };
}
