import type { MetadataRoute } from "next";
import { listPublishedBlogs, listPublishedProjects, ventures } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = ["/", "/projects", "/blogs"].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));

  const ventureRoutes = ventures.map((venture) => ({
    url: absoluteUrl(`/ventures/${venture.slug}`),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const [projects, blogs] = await Promise.all([listPublishedProjects(), listPublishedBlogs()]);

  const projectRoutes = projects.map((project) => {
    const lastModified = project.updatedAt ?? project.createdAt;
    return {
      url: absoluteUrl(`/projects/${project.id}`),
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    };
  });

  const blogRoutes = blogs.map((blog) => {
    const lastModified = blog.updatedAt ?? blog.createdAt;
    return {
      url: absoluteUrl(`/blogs/${blog.id}`),
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: "weekly" as const,
      priority: 0.75,
    };
  });

  return [...staticRoutes, ...ventureRoutes, ...projectRoutes, ...blogRoutes];
}
