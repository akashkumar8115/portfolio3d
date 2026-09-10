"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTRPC } from "@/lib/trpc";
import ProjectCard from "@/components/ProjectCard";
import PublicShell from "@/components/PublicShell";

const filters = [
  { id: "all", label: "All work" },
  { id: "personal", label: "Self projects" },
  { id: "partnership", label: "Partnerships" },
] as const;

export default function ProjectsPage() {
  const trpc = useTRPC();
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const projectsQuery = useQuery(trpc.project.getAll.queryOptions({}));
  const projects = projectsQuery.data ?? [];

  const visible = useMemo(() => {
    if (filter === "all") return projects;
    return projects.filter((project) => project.kind === filter);
  }, [filter, projects]);

  return (
    <PublicShell>
      <section className="relative overflow-hidden px-4 py-16 sm:px-6">
        <motion.div
          className="pointer-events-none absolute -right-16 top-10 h-56 w-56 rounded-full bg-sky-200/50 blur-3xl"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative mx-auto max-w-6xl">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Archive</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">All projects</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Everything in one place. Self-built products, then partnership delivery. Open a company
            card on the home page to see only that partnership.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {filters.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
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

          {projectsQuery.isLoading && <p className="py-16 text-center text-slate-500">Loading projects...</p>}
          {projectsQuery.isError && (
            <p className="py-16 text-center text-red-500">Could not load projects right now.</p>
          )}

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          {!projectsQuery.isLoading && !visible.length && (
            <p className="py-16 text-center text-slate-500">No projects in this filter yet.</p>
          )}
        </div>
      </section>
    </PublicShell>
  );
}
