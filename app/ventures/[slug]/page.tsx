import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectCard from "@/components/ProjectCard";
import PublicShell from "@/components/PublicShell";
import { getVenture, listPublishedProjects } from "@/lib/content";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function VenturePage({ params }: Props) {
  const { slug } = await params;
  const venture = getVenture(slug);
  if (!venture) notFound();

  const allProjects = await listPublishedProjects();
  const projects = allProjects.filter(
    (project) => project.companySlug === slug || (!project.companySlug && project.company === venture.name),
  );

  return (
    <PublicShell>
      <section className="relative overflow-hidden px-4 py-16 sm:px-6">
        <div className="relative mx-auto max-w-6xl">
          <Link href="/#leadership" className="text-sm font-semibold text-sky-700 hover:text-sky-900">
            ← All partnerships
          </Link>
          <header className="mt-6">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-600">{venture.legal}</p>
            <h1 className="mt-2 text-4xl font-bold text-slate-900">{venture.name}</h1>
            <p className="mt-2 text-lg font-medium text-slate-700">{venture.title}</p>
            <p className="mt-4 max-w-3xl text-slate-600">{venture.summary}</p>
          </header>
          <ul className="mt-6 max-w-3xl space-y-2 text-sm leading-6 text-slate-600">
            {venture.points.map((point) => <li key={point}>{point}</li>)}
          </ul>

          <h2 className="mt-12 text-2xl font-bold text-slate-900">Projects in this partnership</h2>
          <p className="mt-2 text-slate-600">Selected work associated with {venture.name}.</p>
          {projects.length ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => <ProjectCard key={project.id} project={project} />)}
            </div>
          ) : (
            <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
              More {venture.name} projects will appear here as they are published.
            </div>
          )}
          <Link href="/#contact" className="mt-10 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700">
            Discuss a project
          </Link>
        </div>
      </section>
    </PublicShell>
  );
}
