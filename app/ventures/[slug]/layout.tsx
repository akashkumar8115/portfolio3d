import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { getVenture } from "@/lib/content";
import { ventureJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

type Props = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const venture = getVenture(slug);
  if (!venture) {
    return pageMetadata({
      title: "Partnership not found",
      description: "This partnership page is not available.",
      path: `/ventures/${slug}`,
      noIndex: true,
    });
  }

  return pageMetadata({
    title: `${venture.name} partnership`,
    description: `${venture.title} at ${venture.legal}. ${venture.summary} Projects delivered by Akash Kumar.`,
    path: `/ventures/${venture.slug}`,
    keywords: [venture.name, venture.legal, venture.title, "Akash Kumar partnership"],
  });
}

export default async function VentureLayout({ children, params }: Props) {
  const { slug } = await params;
  const venture = getVenture(slug);
  return (
    <>
      {venture && <JsonLd data={ventureJsonLd(venture)} />}
      {children}
    </>
  );
}
