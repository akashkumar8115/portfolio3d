"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useTRPC } from "@/lib/trpc";
import AutoCarousel from "@/components/AutoCarousel";
import ProjectCard from "@/components/ProjectCard";

export default function Projects() {
  const trpc = useTRPC();
  const projectsQuery = useQuery(trpc.project.getAll.queryOptions({ kind: "personal" }));
  const projects = (projectsQuery.data ?? []).filter((project) => project.kind === "personal");

  return (
    <section id="projects" className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white px-4 py-20 sm:px-6">
      <motion.div
        className="pointer-events-none absolute -left-20 top-10 h-40 w-40 rounded-full bg-sky-200/50 blur-3xl"
        animate={{ y: [0, 18, 0], x: [0, 10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative mx-auto max-w-6xl">
        <p className="text-center text-sm uppercase tracking-[0.3em] text-sky-600">Self work</p>
        <h2 className="mt-2 text-center text-4xl font-bold text-slate-900">Personal Projects</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
          Independent builds, auto-sliding so you can browse without effort. Click a card for full details.
        </p>

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
