import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Projects",
  description:
    "Browse Akash Kumar's personal and partnership projects: SaaS platforms, enterprise web apps, and client delivery across Intopie, SKDS, VRV InfoLed, and AM Future Tech Solution.",
  path: "/projects",
  keywords: ["Akash Kumar projects", "SaaS portfolio", "full stack case studies"],
});

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
