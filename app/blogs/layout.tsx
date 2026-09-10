import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Blogs",
  description:
    "Articles by Akash Kumar on SaaS products, software architecture, enterprise delivery, and building with modern web technologies.",
  path: "/blogs",
  keywords: ["Akash Kumar blog", "SaaS articles", "software architecture writing"],
});

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
