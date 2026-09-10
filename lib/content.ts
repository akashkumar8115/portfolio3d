import { Types } from "mongoose";
import { connectDB } from "@/server/db";
import { BlogModel } from "@/server/models/Blog";
import { ProjectModel } from "@/server/models/Project";
import { ventures } from "@/server/data/projects";

function isId(id: string) {
  return Types.ObjectId.isValid(id);
}

export async function getPublishedProject(id: string) {
  if (!isId(id)) {
    return null;
  }
  try {
    await connectDB();
    const project = await ProjectModel.findOne({ _id: id, published: true }).lean();
    if (!project) {
      return null;
    }
    return {
      id: String(project._id),
      title: project.title,
      description: project.description,
      details: project.details ?? "",
      image: project.image,
      github: project.github ?? "",
      demo: project.demo ?? "",
      technologies: project.technologies ?? [],
      highlights: project.highlights ?? [],
      company: project.company ?? "",
      role: project.role ?? "",
      kind: project.kind === "partnership" ? "partnership" : "personal",
      companySlug: project.companySlug ?? "",
      updatedAt: project.updatedAt instanceof Date ? project.updatedAt.toISOString() : undefined,
    };
  } catch {
    return null;
  }
}

export async function getPublishedBlog(id: string) {
  if (!isId(id)) {
    return null;
  }
  try {
    await connectDB();
    const blog = await BlogModel.findOne({ _id: id, published: true }).lean();
    if (!blog) {
      return null;
    }
    return {
      id: String(blog._id),
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      image: blog.image ?? "",
      tags: blog.tags ?? [],
      createdAt: blog.createdAt instanceof Date ? blog.createdAt.toISOString() : undefined,
      updatedAt: blog.updatedAt instanceof Date ? blog.updatedAt.toISOString() : undefined,
    };
  } catch {
    return null;
  }
}

export async function listPublishedProjects() {
  try {
    await connectDB();
    const projects = await ProjectModel.find({ published: true }).select("title updatedAt").lean();
    return projects.map((project) => ({
      id: String(project._id),
      title: project.title,
      updatedAt: project.updatedAt instanceof Date ? project.updatedAt : undefined,
    }));
  } catch {
    return [];
  }
}

export async function listPublishedBlogs() {
  try {
    await connectDB();
    const blogs = await BlogModel.find({ published: true }).select("title updatedAt").lean();
    return blogs.map((blog) => ({
      id: String(blog._id),
      title: blog.title,
      updatedAt: blog.updatedAt instanceof Date ? blog.updatedAt : undefined,
    }));
  } catch {
    return [];
  }
}

export function getVenture(slug: string) {
  return ventures.find((item) => item.slug === slug) ?? null;
}

export { ventures };
