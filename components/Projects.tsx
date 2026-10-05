"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useTRPC } from "@/lib/trpc";
import AutoCarousel from "@/components/AutoCarousel";
import ProjectCard from "@/components/ProjectCard";
import ProjectMedia from "@/components/ProjectMedia";
import type { PublicProject } from "@/lib/contentTypes";

export default function Projects({
  initialProjects,
  featuredProject,
}: {
  initialProjects: PublicProject[];
  featuredProject?: PublicProject;
}) {
  const trpc = useTRPC();
  const projectsQuery = useQuery({
    ...trpc.project.getAll.queryOptions({ kind: "personal" }),
    initialData: initialProjects,
  });
  const projects = (projectsQuery.data ?? []).filter((project) => project.kind === "personal");

  return (
    <section id="projects" className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white px-4 py-20 sm:px-6">
      <motion.div
        className="pointer-events-none absolute -left-20 top-10 h-40 w-40 rounded-full bg-sky-200/50 blur-3xl"
        animate={{ y: [0, 18, 0], x: [0, 10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative mx-auto max-w-6xl">
        <p className="text-center text-sm uppercase tracking-[0.3em] text-sky-600">Selected work</p>
        <h2 className="mt-2 text-center text-4xl font-bold text-slate-900">Products & Projects</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
          SaaS products, digital platforms, and independent engineering work.
        </p>

        {featuredProject && (
          <article className="mt-10 grid overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 text-white shadow-xl md:grid-cols-2">
            <div className="min-h-64 bg-slate-900">
              <ProjectMedia
                src={featuredProject.image}
                title={featuredProject.title}
                isVideo={featuredProject.isVideo}
                className="h-full min-h-64 w-full object-cover"
                imageClassName="h-full min-h-64 w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-7 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">Featured work</p>
              <h3 className="mt-3 text-3xl font-bold">{featuredProject.title}</h3>
              <p className="mt-1 font-medium text-slate-300">Indoor Navigation &amp; Digital Wayfinding Platform</p>
              <p className="mt-4 text-sm leading-7 text-slate-300">{featuredProject.description}</p>
              {featuredProject.role && <p className="mt-4 text-sm text-slate-200">Role: {featuredProject.role}</p>}
              <div className="mt-4 flex flex-wrap gap-2">
                {featuredProject.technologies.slice(0, 5).map((technology) => (
                  <span key={technology} className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-200">
                    {technology}
                  </span>
                ))}
              </div>
              <Link
                href={`/projects/${featuredProject.id}`}
                className="mt-6 inline-flex w-fit rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
              >
                View case study
              </Link>
            </div>
          </article>
        )}

        {projectsQuery.isLoading && <p className="py-12 text-center text-slate-500">Loading projects...</p>}
        {projectsQuery.isError && (
          <p className="py-12 text-center text-red-500">Could not load projects. Check MongoDB and try again.</p>
        )}

        {projects.length > 0 && (
          <AutoCarousel>
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} compact />
            ))}
          </AutoCarousel>
        )}

        <div className="mt-8 flex justify-center">
          <Link
            href="/projects"
            className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-sky-600"
          >
            View more projects
          </Link>
        </div>
      </div>
    </section>
  );
}
