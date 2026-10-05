"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc";
import ProjectCard from "@/components/ProjectCard";
import PublicShell from "@/components/PublicShell";
import type { PublicProject } from "@/lib/contentTypes";

const filters = [
  { id: "all", label: "All work" },
  { id: "personal", label: "Self projects" },
  { id: "partnership", label: "Partnerships" },
] as const;

export default function ProjectsArchive({ initialProjects }: { initialProjects: PublicProject[] }) {
  const trpc = useTRPC();
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const projectsQuery = useQuery({
    ...trpc.project.getAll.queryOptions({}),
    initialData: initialProjects,
  });
  const visible = useMemo(
    () => {
      const projects = projectsQuery.data ?? [];
      return filter === "all" ? projects : projects.filter((project) => project.kind === filter);
    },
    [filter, projectsQuery.data],
  );

  return (
    <PublicShell>
      <section className="relative overflow-hidden px-4 py-16 sm:px-6">
        <motion.div
          className="pointer-events-none absolute -right-16 top-10 h-56 w-56 rounded-full bg-sky-200/50 blur-3xl"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative mx-auto max-w-6xl">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Selected work</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">Projects &amp; Case Studies</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            SaaS products, independent builds, and partnership delivery across web platforms and custom software.
          </p>
          <div className="mt-6 flex flex-wrap gap-3" aria-label="Filter projects">
            {filters.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={filter === item.id}
                onClick={() => setFilter(item.id)}
                className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                  filter === item.id ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                {item.label}
              </button>
            ))}
            <Link href="/#leadership" className="rounded-full px-4 py-2 text-sm font-semibold text-sky-700">
              Browse partnerships →
            </Link>
          </div>

          {projectsQuery.isError && (
            <p role="alert" className="py-8 text-center text-red-600">Could not refresh projects right now.</p>
          )}
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((project) => <ProjectCard key={project.id} project={project} />)}
          </div>
          {!projectsQuery.isError && !visible.length && (
            <p className="py-16 text-center text-slate-500">No projects in this filter yet.</p>
          )}
        </div>
      </section>
    </PublicShell>
  );
}
