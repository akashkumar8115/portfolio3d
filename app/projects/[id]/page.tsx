import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FaExternalLinkAlt, FaGithub, FaLinkedin } from "react-icons/fa";
import ProjectCard from "@/components/ProjectCard";
import ProjectMedia from "@/components/ProjectMedia";
import PublicShell from "@/components/PublicShell";
import { getPublishedProject, listPublishedProjects } from "@/lib/content";
import { getGoogleDriveImageSource } from "@/lib/projectMedia";

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

          {project.clients.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900">Clients &amp; Organizations</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {project.clients.map((client) => (
                  <article key={`${client.name}-${client.website}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    {client.logo && (
                      <Image
                        src={getGoogleDriveImageSource(client.logo)}
                        alt={`${client.name} logo`}
                        width={160}
                        height={48}
                        unoptimized
                        className="mb-4 h-12 max-w-40 object-contain object-left"
                      />
                    )}
                    <h3 className="text-lg font-semibold text-slate-900">{client.name}</h3>
                    {client.description && <p className="mt-2 text-sm leading-6 text-slate-600">{client.description}</p>}
                    {client.website && (
                      <a
                        href={client.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900"
                      >
                        Visit Website <FaExternalLinkAlt aria-hidden="true" />
                      </a>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {project.impactMetrics.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900">Project Impact</h2>
              <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {project.impactMetrics.map((metric) => (
                  <div key={`${metric.label}-${metric.value}`} className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-6">
                    <dd className="text-3xl font-bold tracking-tight text-sky-700">{metric.value}</dd>
                    <dt className="mt-2 text-sm font-medium text-slate-600">{metric.label}</dt>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {project.testimonials.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900">What They Say</h2>
              <div className="mt-5 grid gap-4">
                {project.testimonials.map((testimonial, index) => (
                  <figure key={`${testimonial.name}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                    <blockquote className="whitespace-pre-wrap text-base leading-7 text-slate-700">
                      “{testimonial.quote}”
                    </blockquote>
                    {(testimonial.name || testimonial.designation || testimonial.organization) && (
                      <figcaption className="mt-5 flex items-center gap-3 border-t border-slate-200 pt-4">
                        {testimonial.avatar && (
                          <Image
                            src={getGoogleDriveImageSource(testimonial.avatar)}
                            alt=""
                            width={44}
                            height={44}
                            unoptimized
                            className="h-11 w-11 rounded-full object-cover"
                          />
                        )}
                        <div>
                          {testimonial.name && <p className="font-semibold text-slate-900">{testimonial.name}</p>}
                          {[testimonial.designation, testimonial.organization].filter(Boolean).length > 0 && (
                            <p className="mt-0.5 text-sm text-slate-500">
                              {[testimonial.designation, testimonial.organization].filter(Boolean).join(" · ")}
                            </p>
                          )}
                        </div>
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </section>
          )}

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
            {project.documentationUrl && (
              <a href={project.documentationUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-semibold text-sky-800">
                Documentation <FaExternalLinkAlt aria-hidden="true" />
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
