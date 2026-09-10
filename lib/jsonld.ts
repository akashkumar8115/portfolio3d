import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/seo";

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    description: SITE_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/search")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_NAME,
    jobTitle: SITE_TAGLINE,
    url: absoluteUrl("/"),
    image: absoluteUrl("/images/image-ak.jpg"),
    email: "mailto:20dec024@gmail.com",
    sameAs: [
      "https://www.linkedin.com/in/akash-kumar-54073a209/",
      "https://github.com/akashkumar8115",
    ],
    worksFor: [
      { "@type": "Organization", name: "Intopie" },
      { "@type": "Organization", name: "VRV InfoLed" },
      { "@type": "Organization", name: "SKDS" },
      { "@type": "Organization", name: "AM Future Tech Solution" },
    ],
    knowsAbout: ["SaaS", "Full Stack Development", "Enterprise Web", "Digital Transformation", "React", "Node.js"],
  };
}

export function projectJsonLd(project: {
  id: string;
  title: string;
  description: string;
  details?: string;
  image: string;
  github?: string;
  demo?: string;
  technologies?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: project.details || project.description,
    image: absoluteUrl(project.image),
    url: absoluteUrl(`/projects/${project.id}`),
    applicationCategory: "WebApplication",
    author: { "@type": "Person", name: SITE_NAME },
    keywords: (project.technologies ?? []).join(", "),
    ...(project.demo ? { installUrl: project.demo, sameAs: [project.demo, project.github].filter(Boolean) } : {}),
  };
}

export function blogJsonLd(blog: {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt,
    articleBody: blog.content,
    image: blog.image ? absoluteUrl(blog.image) : absoluteUrl("/images/image-ak.jpg"),
    url: absoluteUrl(`/blogs/${blog.id}`),
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
    author: { "@type": "Person", name: SITE_NAME, url: absoluteUrl("/") },
    publisher: { "@type": "Person", name: SITE_NAME },
    keywords: (blog.tags ?? []).join(", "),
    mainEntityOfPage: absoluteUrl(`/blogs/${blog.id}`),
  };
}

export function ventureJsonLd(venture: { slug: string; name: string; legal: string; title: string; summary: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: venture.legal,
    alternateName: venture.name,
    description: `${venture.title}. ${venture.summary}`,
    url: absoluteUrl(`/ventures/${venture.slug}`),
    employee: { "@type": "Person", name: SITE_NAME, jobTitle: venture.title },
  };
}
