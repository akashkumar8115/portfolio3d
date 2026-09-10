"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useTRPC } from "@/lib/trpc";
import ProjectCard from "@/components/ProjectCard";
import PublicShell from "@/components/PublicShell";
import { ventures } from "@/server/data/projects";

export default function VenturePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const venture = ventures.find((item) => item.slug === slug);
  const trpc = useTRPC();
  const projectsQuery = useQuery(trpc.project.getAll.queryOptions({ companySlug: slug }));
  const projects = (projectsQuery.data ?? []).filter(
    (project) => project.companySlug === slug || (!project.companySlug && project.company === venture?.name),
  );

  if (!venture) {
    return (
      <PublicShell>
        <section className="px-4 py-24 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Partnership not found</h1>
          <Link href="/#leadership" className="mt-4 inline-block text-sky-700">
            Back to partnerships
          </Link>
        </section>
      </PublicShell>
    );
  }

  return (
    <PublicShell>
      <section className="relative overflow-hidden px-4 py-16 sm:px-6">
        <motion.div
          className="pointer-events-none absolute left-[-60px] top-8 h-48 w-48 rounded-full bg-cyan-200/60 blur-3xl"
          animate={{ x: [0, 18, 0], y: [0, 12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative mx-auto max-w-6xl">
          <Link href="/#leadership" className="text-sm font-semibold text-sky-700">
            ← All partnerships
          </Link>
          <p className="mt-6 text-sm uppercase tracking-[0.3em] text-sky-600">{venture.legal}</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">{venture.name}</h1>
          <p className="mt-2 text-lg font-medium text-slate-700">{venture.title}</p>
          <p className="mt-4 max-w-3xl text-slate-600">{venture.summary}</p>
          <ul className="mt-6 max-w-3xl space-y-2 text-sm leading-6 text-slate-600">
            {venture.points.map((point) => (
              <li key={point}>• {point}</li>
            ))}
          </ul>

          <h2 className="mt-12 text-2xl font-bold text-slate-900">Projects in this partnership</h2>
          <p className="mt-2 text-slate-600">Work delivered with {venture.name}.</p>

          {projectsQuery.isLoading && <p className="py-16 text-center text-slate-500">Loading projects...</p>}
          {projectsQuery.isError && (
            <p className="py-16 text-center text-red-500">Could not load projects right now.</p>
          )}

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          {!projectsQuery.isLoading && !projects.length && (
            <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
              More {venture.name} projects will appear here as they are published.
            </div>
          )}
        </div>
      </section>
    </PublicShell>
  );
}
