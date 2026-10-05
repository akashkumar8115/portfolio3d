import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { getPublishedProject } from "@/lib/content";
import { projectJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

type Props = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = await getPublishedProject(id);
  if (!project) {
    return pageMetadata({
      title: "Project not found",
      description: "This project is not available.",
      path: `/projects/${id}`,
      noIndex: true,
    });
  }

  const description = project.description;
  return pageMetadata({
    title: project.projectType ? `${project.title} | ${project.projectType}` : project.title,
    description,
    path: `/projects/${project.id}`,
    image: project.isVideo ? undefined : project.image,
    keywords: [
      project.title,
      project.company,
      project.role,
      project.projectType,
      project.category,
      ...project.technologies,
      ...project.highlights,
    ].filter(Boolean),
  });
}

export default async function ProjectDetailLayout({ children, params }: Props) {
  const { id } = await params;
  const project = await getPublishedProject(id);
  return (
    <>
      {project && <JsonLd data={projectJsonLd(project)} />}
      {children}
    </>
  );
}
