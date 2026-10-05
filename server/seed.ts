import { connectDB } from "@/server/db";
import { ProjectModel } from "@/server/models/Project";
import { projectsData } from "@/server/data/projects";

export async function seedProjectsIfEmpty() {
  await connectDB();

  if (await ProjectModel.exists({})) {
    return;
  }

  for (const [index, project] of projectsData.entries()) {
    await ProjectModel.findOneAndUpdate(
      { title: project.title },
      {
        $set: {
          title: project.title,
          description: project.description,
          image: project.image,
          github: project.github,
          demo: project.demo,
          isVideo: project.isVideo,
          technologies: project.technologies,
          company: project.company,
          companySlug: project.companySlug,
          kind: project.kind,
          role: project.role,
          projectType: project.projectType,
          highlights: project.highlights,
          category: project.category,
          published: true,
          order: index + 1,
        },
      },
      { upsert: true },
    );
  }
}
