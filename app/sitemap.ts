import type { MetadataRoute } from "next";
import { listPublishedBlogs, listPublishedProjects, ventures } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, blogs] = await Promise.all([listPublishedProjects(), listPublishedBlogs()]);

  const staticRoutes: MetadataRoute.Sitemap = ["/", "/projects", "/blogs"].map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));

  const ventureRoutes = ventures.map((venture) => ({
    url: absoluteUrl(`/ventures/${venture.slug}`),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const projectRoutes = projects.map((project) => ({
    url: absoluteUrl(`/projects/${project.id}`),
    lastModified: project.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const blogRoutes = blogs.map((blog) => ({
    url: absoluteUrl(`/blogs/${blog.id}`),
    lastModified: blog.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  return [...staticRoutes, ...ventureRoutes, ...projectRoutes, ...blogRoutes];
}
