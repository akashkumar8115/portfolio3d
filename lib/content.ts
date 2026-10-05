import { cache } from "react";
import { Types } from "mongoose";
import { connectDB } from "@/server/db";
import { BlogModel } from "@/server/models/Blog";
import { ProjectModel } from "@/server/models/Project";
import { ventures } from "@/server/data/projects";
import type { PublicBlog, PublicProject } from "@/lib/contentTypes";

function isId(id: string) {
  return Types.ObjectId.isValid(id);
}

type ProjectRecord = {
  _id: { toString(): string };
  title: string;
  description: string;
  image: string;
  github?: string;
  demo?: string;
  socialLinks?: { linkedin?: string | null } | null;
  isVideo?: boolean;
  technologies?: string[];
  company?: string;
  role?: string;
  projectType?: string;
  highlights?: string[];
  details?: string;
  kind?: string;
  companySlug?: string;
  category?: string;
  published?: boolean;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

type BlogRecord = {
  _id: { toString(): string };
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  tags?: string[];
  published?: boolean;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export function serializeProject(project: ProjectRecord): PublicProject {
  return {
    id: project._id.toString(),
    title: project.title,
    description: project.description,
    image: project.image,
    github: project.github ?? "",
    demo: project.demo ?? "",
    socialLinks: project.socialLinks?.linkedin ? { linkedin: project.socialLinks.linkedin } : undefined,
    isVideo: Boolean(project.isVideo),
    technologies: project.technologies ?? [],
    company: project.company ?? "",
    role: project.role ?? "",
    projectType: project.projectType ?? "",
    highlights: project.highlights ?? [],
    details: project.details ?? "",
    kind: project.kind === "partnership" ? "partnership" : "personal",
    companySlug: project.companySlug ?? "",
    category: project.category ?? "Full Stack",
    published: project.published !== false,
    order: project.order ?? 0,
    createdAt: project.createdAt?.toISOString() ?? null,
    updatedAt: project.updatedAt?.toISOString() ?? null,
  };
}

export function serializeBlog(blog: BlogRecord): PublicBlog {
  return {
    id: blog._id.toString(),
    title: blog.title,
    excerpt: blog.excerpt,
    content: blog.content,
    image: blog.image ?? "",
    tags: blog.tags ?? [],
    published: blog.published !== false,
    order: blog.order ?? 0,
    createdAt: blog.createdAt?.toISOString() ?? null,
    updatedAt: blog.updatedAt?.toISOString() ?? null,
  };
}

export const getPublishedProject = cache(async (id: string): Promise<PublicProject | null> => {
  if (!isId(id)) {
    return null;
  }
  await connectDB();
  const project = await ProjectModel.findOne({ _id: id, published: { $ne: false } }).lean();
  return project ? serializeProject(project) : null;
});

export const getPublishedBlog = cache(async (id: string): Promise<PublicBlog | null> => {
  if (!isId(id)) {
    return null;
  }
  await connectDB();
  const blog = await BlogModel.findOne({ _id: id, published: { $ne: false } }).lean();
  return blog ? serializeBlog(blog) : null;
});

export async function listPublishedProjects(filters: { kind?: "personal" | "partnership"; companySlug?: string } = {}) {
  await connectDB();
  const query: Record<string, unknown> = { published: { $ne: false } };
  if (filters.kind) query.kind = filters.kind;
  if (filters.companySlug) query.companySlug = filters.companySlug;
  const projects = await ProjectModel.find(query).sort({ order: 1, createdAt: -1 }).lean();
  return projects.map(serializeProject);
}

export async function listPublishedBlogs() {
  await connectDB();
  const blogs = await BlogModel.find({ published: { $ne: false } }).sort({ order: 1, createdAt: -1 }).lean();
  return blogs.map(serializeBlog);
}

export function getVenture(slug: string) {
  return ventures.find((item) => item.slug === slug) ?? null;
}

export { ventures };
