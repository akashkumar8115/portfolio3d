"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import { useTRPC } from "@/lib/trpc";
import PublicShell from "@/components/PublicShell";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const trpc = useTRPC();
  const projectQuery = useQuery(trpc.project.getById.queryOptions({ id: params.id }));
  const project = projectQuery.data;

  return (
    <PublicShell>
      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <Link href="/projects" className="text-sm font-semibold text-sky-700">
            ← All projects
          </Link>

          {projectQuery.isLoading && <p className="py-16 text-center text-slate-500">Loading project...</p>}
          {projectQuery.isError && (
            <p className="py-16 text-center text-red-500">This project is not available.</p>
          )}

          {project && (
            <article className="mt-8">
              <p className="text-sm uppercase tracking-[0.25em] text-sky-600">
                {project.kind === "partnership" ? project.company || "Partnership" : "Self project"}
              </p>
              <h1 className="mt-2 text-4xl font-bold text-slate-900">{project.title}</h1>
              {project.role && <p className="mt-2 text-lg font-medium text-slate-600">{project.role}</p>}
              {project.projectType && <p className="mt-1 text-sm text-slate-500">{project.projectType}</p>}

              <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
                {project.isVideo ? (
                  <video src={project.image} controls className="w-full" />
                ) : (
                  <img src={project.image} alt={project.title} className="w-full object-cover" />
                )}
              </div>

              <p className="mt-8 text-lg leading-8 text-slate-700">{project.description}</p>

              {project.details && (
                <div className="mt-6 whitespace-pre-wrap rounded-3xl border border-slate-200 bg-slate-50 p-6 text-base leading-8 text-slate-700">
                  {project.details}
                </div>
              )}

              {project.highlights.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-slate-900">Highlights</h2>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {project.highlights.map((item) => (
                      <li key={item} className="rounded-xl bg-sky-50 px-4 py-3 text-sm text-sky-900">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.technologies.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-slate-900">Technologies</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 space-y-2 text-sm">
                {project.demo && (
                  <p>
                    <span className="font-semibold text-slate-800">Live URL: </span>
                    <a href={project.demo} target="_blank" rel="noreferrer" className="break-all text-sky-700">
                      {project.demo}
                    </a>
                  </p>
                )}
                {project.github && (
                  <p>
                    <span className="font-semibold text-slate-800">Code URL: </span>
                    <a href={project.github} target="_blank" rel="noreferrer" className="break-all text-sky-700">
                      {project.github}
                    </a>
                  </p>
                )}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
                  >
                    <FaGithub /> Open code
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white"
                  >
                    <FaExternalLinkAlt /> Visit live
                  </a>
                )}
                {project.companySlug && (
                  <Link
                    href={`/ventures/${project.companySlug}`}
                    className="inline-flex items-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700"
                  >
                    More from {project.company}
                  </Link>
                )}
              </div>
            </article>
          )}
        </div>
      </section>
    </PublicShell>
  );
}
