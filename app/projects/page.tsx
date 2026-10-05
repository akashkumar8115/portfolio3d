import ProjectsArchive from "@/components/ProjectsArchive";
import { listPublishedProjects } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await listPublishedProjects();
  return <ProjectsArchive initialProjects={projects} />;
}
