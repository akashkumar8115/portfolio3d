import Portfolio from "@/components/Portfolio";
import JsonLd from "@/components/JsonLd";
import { personJsonLd, profilePageJsonLd, websiteJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { listPublishedBlogs, listPublishedProjects } from "@/lib/content";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata({
  title: "Akash Kumar | Technology Leader & Product Strategist",
  description:
    "Portfolio of Akash Kumar, Technology Leader, Product Strategist, and Full-Stack Engineer. SaaS products, software architecture, enterprise platforms, and custom software.",
  path: "/",
  keywords: [
    "Akash Kumar portfolio",
    "Technology leader",
    "Product strategist",
    "Full-Stack Engineer",
    "Intopie CTO",
    "SKDS projects",
    "AM Future Tech Solution",
  ],
});

export default async function HomePage() {
  const [projects, blogs] = await Promise.all([listPublishedProjects(), listPublishedBlogs()]);
  const featuredProject = projects.find((project) => project.title.toLowerCase() === "wayfinder");

  return (
    <>
      <JsonLd data={[websiteJsonLd(), personJsonLd(), profilePageJsonLd()]} />
      <Portfolio
        initialProjects={projects.filter((project) => project.kind === "personal")}
        featuredProject={featuredProject}
        initialBlogs={blogs}
      />
    </>
  );
}
