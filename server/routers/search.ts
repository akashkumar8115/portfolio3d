import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/trpc";
import { connectDB } from "@/server/db";
import { BlogModel } from "@/server/models/Blog";
import { ProjectModel } from "@/server/models/Project";
import { ventures } from "@/server/data/projects";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const pages = [
  { title: "About", href: "/#about", text: "Tech entrepreneur and strategic partner bio" },
  { title: "Partnerships", href: "/#leadership", text: "Intopie VRV SKDS AM Future Tech Solution" },
  { title: "Projects", href: "/#projects", text: "Personal and partnership projects" },
  { title: "Blogs", href: "/#blogs", text: "Articles and writing" },
  { title: "Skills", href: "/#experience", text: "Technical skills frontend backend cloud" },
  { title: "Contact", href: "/#contact", text: "Get in touch email linkedin" },
  ...ventures.map((venture) => ({
    title: venture.name,
    href: `/ventures/${venture.slug}`,
    text: `${venture.legal} ${venture.title} ${venture.summary} ${venture.points.join(" ")}`,
  })),
];

export const searchRouter = createTRPCRouter({
  site: publicProcedure.input(z.object({ q: z.string().min(2).max(80) })).query(async ({ input }) => {
    await connectDB();
    const q = input.q.trim();
    const regex = new RegExp(escapeRegex(q), "i");

    const [projects, blogs] = await Promise.all([
      ProjectModel.find({
        published: true,
        $or: [
          { title: regex },
          { description: regex },
          { details: regex },
          { company: regex },
          { role: regex },
          { technologies: regex },
          { highlights: regex },
        ],
      })
        .sort({ order: 1 })
        .limit(12)
        .lean(),
      BlogModel.find({
        published: true,
        $or: [{ title: regex }, { excerpt: regex }, { content: regex }, { tags: regex }],
      })
        .sort({ order: 1 })
        .limit(12)
        .lean(),
    ]);

    const lower = q.toLowerCase();
    const matchedPages = pages.filter(
      (page) => page.title.toLowerCase().includes(lower) || page.text.toLowerCase().includes(lower),
    );

    return {
      query: q,
      projects: projects.map((project) => ({
        id: String(project._id),
        title: project.title,
        description: project.description,
        href: `/projects/${String(project._id)}`,
        kind: project.kind === "partnership" ? "partnership" : "personal",
      })),
      blogs: blogs.map((blog) => ({
        id: String(blog._id),
        title: blog.title,
        excerpt: blog.excerpt,
        href: `/blogs/${String(blog._id)}`,
      })),
      pages: matchedPages.map(({ title, href }) => ({ title, href })),
    };
  }),
});
