import Portfolio from "@/components/Portfolio";
import JsonLd from "@/components/JsonLd";
import { personJsonLd, websiteJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Akash Kumar | Tech Entrepreneur & Strategic Partner",
  description:
    "Portfolio of Akash Kumar — SaaS product leadership, enterprise web delivery, and partnership work across Intopie, VRV InfoLed, SKDS, and AM Future Tech Solution.",
  path: "/",
  keywords: [
    "Akash Kumar portfolio",
    "SaaS founder",
    "strategic partner",
    "Intopie CTO",
    "SKDS projects",
    "AM Future Tech Solution",
  ],
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={[websiteJsonLd(), personJsonLd()]} />
      <Portfolio />
    </>
  );
}
