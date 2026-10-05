import type {
  ProjectClient,
  ProjectMetric,
  ProjectTestimonial,
} from "@/lib/validation/project";

export type PublicProject = {
  id: string;
  title: string;
  description: string;
  image: string;
  github: string;
  demo: string;
  socialLinks?: { linkedin?: string };
  documentationUrl?: string;
  clients: ProjectClient[];
  impactMetrics: ProjectMetric[];
  testimonials: ProjectTestimonial[];
  isVideo: boolean;
  technologies: string[];
  company: string;
  role: string;
  projectType: string;
  highlights: string[];
  details: string;
  kind: "personal" | "partnership";
  companySlug: string;
  category: string;
  published: boolean;
  order: number;
  createdAt: string | null;
  updatedAt: string | null;
};

export type PublicBlog = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  tags: string[];
  published: boolean;
  order: number;
  createdAt: string | null;
  updatedAt: string | null;
};
