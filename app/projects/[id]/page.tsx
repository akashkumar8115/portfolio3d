import Link from "next/link";
import { notFound } from "next/navigation";
import { FaExternalLinkAlt, FaGithub, FaLinkedin } from "react-icons/fa";
import ProjectCard from "@/components/ProjectCard";
import ProjectMedia from "@/components/ProjectMedia";
import PublicShell from "@/components/PublicShell";
import { getPublishedProject, listPublishedProjects } from "@/lib/content";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const [project, projects] = await Promise.all([
    getPublishedProject(id),
    listPublishedProjects(),
  ]);
  if (!project) notFound();

  const relatedProjects = projects
    .filter((item) => item.id !== project.id && (
      project.kind === "partnership"
        ? item.companySlug === project.companySlug
        : item.kind === "personal"
    ))
    .slice(0, 3);

  return (
    <PublicShell>
      <article className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <Link href="/projects" className="text-sm font-semibold text-sky-700 hover:text-sky-900">
            ← All projects
          </Link>
          <header className="mt-8">
            <p className="text-sm uppercase tracking-[0.25em] text-sky-600">
              {project.kind === "partnership" ? project.company || "Partnership" : "Independent project"}
            </p>
            <h1 className="mt-2 text-4xl font-bold text-slate-900">{project.title}</h1>
            {project.role && <p className="mt-2 text-lg font-medium text-slate-600">{project.role}</p>}
            {project.projectType && <p className="mt-1 text-sm text-slate-500">{project.projectType}</p>}
          </header>

          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
            <ProjectMedia
              src={project.image}
              title={project.title}
              isVideo={project.isVideo}
              className="aspect-video w-full"
              imageClassName="w-full object-cover"
            />
          </div>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-slate-900">Overview</h2>
            <p className="mt-3 text-lg leading-8 text-slate-700">{project.description}</p>
          </section>

          {project.details && (
            <section className="mt-6">
              <h2 className="text-xl font-semibold text-slate-900">Project details</h2>
              <div className="mt-3 whitespace-pre-wrap rounded-3xl border border-slate-200 bg-slate-50 p-6 text-base leading-8 text-slate-700">
                {project.details}
              </div>
            </section>
          )}

          {project.highlights.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl font-semibold text-slate-900">Capabilities</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {project.highlights.map((item) => (
                  <li key={item} className="rounded-xl bg-sky-50 px-4 py-3 text-sm text-sky-900">{item}</li>
                ))}
              </ul>
            </section>
          )}

          {project.technologies.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl font-semibold text-slate-900">Technologies</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.technologies.map((technology) => (
                  <span key={technology} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                    {technology}
                  </span>
                ))}
              </div>
            </section>
          )}

          <nav aria-label="Project links" className="mt-8 flex flex-wrap gap-3">
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
                <FaGithub aria-hidden="true" /> Source code
              </a>
            )}
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white">
                <FaExternalLinkAlt aria-hidden="true" /> Live demo
              </a>
            )}
            {project.socialLinks?.linkedin && (
              <a href={project.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#0A66C2] px-5 py-3 text-sm font-semibold text-white">
                <FaLinkedin aria-hidden="true" /> LinkedIn
              </a>
            )}
            {project.companySlug && (
              <Link href={`/ventures/${project.companySlug}`} className="inline-flex items-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700">
                More from {project.company}
              </Link>
            )}
          </nav>

          {relatedProjects.length > 0 && (
            <section className="mt-16 border-t border-slate-200 pt-10">
              <h2 className="text-2xl font-bold text-slate-900">
                {project.kind === "partnership" ? `More ${project.company} work` : "More projects"}
              </h2>
              <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {relatedProjects.map((related) => <ProjectCard key={related.id} project={related} />)}
              </div>
            </section>
          )}
        </div>
      </article>
    </PublicShell>
  );
}
