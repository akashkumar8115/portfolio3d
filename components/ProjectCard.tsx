"use client";

import Link from "next/link";
import { MouseEvent } from "react";
import { motion } from "framer-motion";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";

export type ProjectCardData = {
  id: string;
  title: string;
  description: string;
  image: string;
  github: string;
  demo: string;
  isVideo: boolean;
  technologies: string[];
  company?: string;
  role?: string;
  projectType?: string;
  highlights?: string[];
  kind?: string;
};

export default function ProjectCard({
  project,
  compact = false,
}: {
  project: ProjectCardData;
  compact?: boolean;
}) {
  const openLink = (event: MouseEvent, url: string) => {
    event.preventDefault();
    event.stopPropagation();
    window.open(url, "_blank");
  };

  return (
    <Link href={`/projects/${project.id}`} className={compact ? "block min-w-[300px] max-w-[300px] snap-start sm:min-w-[340px] sm:max-w-[340px]" : "block"}>
      <motion.article
        layout
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: compact ? -6 : -10, scale: 1.015 }}
        transition={{ type: "spring", stiffness: 240, damping: 20 }}
        className="group h-full overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.08)]"
      >
        <div className={`relative overflow-hidden bg-slate-100 ${compact ? "h-44" : "h-52"}`}>
          {project.isVideo ? (
            <video
              src={project.image}
              muted
              loop
              playsInline
              autoPlay
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <img
              src={project.image}
              alt={project.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
          )}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/45 to-transparent" />
          {project.company && (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-sky-700">
              {project.company}
            </span>
          )}
        </div>
        <div className={compact ? "p-4" : "p-5"}>
          <h3 className="text-lg font-semibold text-slate-900">{project.title}</h3>
          {project.role && <p className="mt-1 text-xs font-medium uppercase tracking-wide text-sky-600">{project.role}</p>}
          <p className={`mt-2 text-sm leading-6 text-slate-600 ${compact ? "line-clamp-2" : "line-clamp-3"}`}>
            {project.description}
          </p>
          {project.demo && (
            <p className="mt-2 truncate text-xs text-sky-700" title={project.demo}>
              Live: {project.demo}
            </p>
          )}
          {project.github && (
            <p className="truncate text-xs text-slate-500" title={project.github}>
              Code: {project.github}
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {(project.highlights?.length ? project.highlights : project.technologies).slice(0, 3).map((tech) => (
              <span key={tech} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                {tech}
              </span>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            {project.github && (
              <button
                type="button"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 transition hover:bg-slate-900 hover:text-white"
                onClick={(event) => openLink(event, project.github)}
              >
                <FaGithub /> Code
              </button>
            )}
            {project.demo && (
              <button
                type="button"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-sky-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-sky-600"
                onClick={(event) => openLink(event, project.demo)}
              >
                <FaExternalLinkAlt /> Live
              </button>
            )}
            <span className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700">
              Details
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
