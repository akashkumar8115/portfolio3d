import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  FaArrowRight,
  FaExternalLinkAlt,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";
import ProjectCard from "@/components/ProjectCard";
import ProjectMedia from "@/components/ProjectMedia";
import PublicShell from "@/components/PublicShell";
import ContactCtaLink from "@/components/ContactCtaLink";
import { getPublishedProject, listPublishedProjects } from "@/lib/content";
import { getGoogleDriveImageSource } from "@/lib/projectMedia";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

const sectionClass = "border-t border-slate-200 py-10 sm:py-12";
const sectionHeadingClass = "text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl";

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

  const projectLinks = [
    project.demo ? {
      href: project.demo,
      label: "View live project",
      icon: FaExternalLinkAlt,
      className: "bg-sky-600 text-white hover:bg-sky-700",
    } : null,
    project.documentationUrl ? {
      href: project.documentationUrl,
      label: "Read documentation",
      icon: FaExternalLinkAlt,
      className: "border border-sky-200 bg-sky-50 text-sky-800 hover:bg-sky-100",
    } : null,
    project.github ? {
      href: project.github,
      label: "View source code",
      icon: FaGithub,
      className: "bg-slate-900 text-white hover:bg-slate-800",
    } : null,
    project.socialLinks?.linkedin ? {
      href: project.socialLinks.linkedin,
      label: "View on LinkedIn",
      icon: FaLinkedin,
      className: "bg-[#0A66C2] text-white hover:bg-[#004182]",
    } : null,
  ].filter((link) => link !== null);

  return (
    <PublicShell>
      <article className="px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/projects"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-sky-700 transition hover:text-sky-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600"
          >
            <span aria-hidden="true">←</span> All projects
          </Link>

          <header className="py-8 sm:py-12">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-sky-800">
                {project.kind === "partnership" ? project.company || "Partnership project" : "Independent project"}
              </span>
              {project.category && (
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
                  {project.category}
                </span>
              )}
              {project.projectType && (
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
                  {project.projectType}
                </span>
              )}
            </div>
            <h1 className="mt-5 max-w-5xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              {project.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl sm:leading-9">
              {project.description}
            </p>

            {(project.role || project.company) && (
              <dl className="mt-7 flex flex-wrap gap-x-8 gap-y-4">
                {project.role && (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">My contribution</dt>
                    <dd className="mt-1 font-semibold text-slate-900">{project.role}</dd>
                  </div>
                )}
                {project.company && (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Organization</dt>
                    <dd className="mt-1 font-semibold text-slate-900">{project.company}</dd>
                  </div>
                )}
              </dl>
            )}

            {projectLinks.length > 0 && (
              <nav aria-label="Project resources" className="mt-8 flex flex-wrap gap-3">
                {projectLinks.map(({ href, label, icon: Icon, className }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 ${className}`}
                  >
                    <Icon aria-hidden="true" />
                    {label}
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                ))}
              </nav>
            )}
          </header>

          <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:rounded-3xl">
            <ProjectMedia
              src={project.image}
              title={project.title}
              isVideo={project.isVideo}
              priority={!project.isVideo}
              className="aspect-[4/3] w-full sm:aspect-[16/9]"
              imageClassName="h-full w-full object-cover"
            />
            <figcaption className="sr-only">{project.title} project preview</figcaption>
          </figure>

          {project.highlights.length > 0 && (
            <section aria-labelledby="project-highlights" className={sectionClass}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">At a glance</p>
              <h2 id="project-highlights" className={`${sectionHeadingClass} mt-2`}>Key highlights</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {project.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700 shadow-sm">
                    <span aria-hidden="true" className="mt-0.5 font-bold text-sky-600">✓</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {project.impactMetrics.length > 0 && (
            <section aria-labelledby="project-impact" className={sectionClass}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Measured outcomes</p>
              <h2 id="project-impact" className={`${sectionHeadingClass} mt-2`}>Project impact</h2>
              <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {project.impactMetrics.map((metric) => (
                  <div key={`${metric.label}-${metric.value}`} className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-6 sm:p-7">
                    <dt className="text-sm font-medium text-slate-600">{metric.label}</dt>
                    <dd className="mt-2 text-4xl font-bold tracking-tight text-sky-800">{metric.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {project.details && (
            <section aria-labelledby="project-story" className={sectionClass}>
              <div className="grid gap-5 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-12">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Behind the work</p>
                  <h2 id="project-story" className={`${sectionHeadingClass} mt-2`}>Project story</h2>
                </div>
                <div className="whitespace-pre-wrap rounded-2xl border border-slate-200 bg-white p-5 text-base leading-8 text-slate-700 shadow-sm sm:p-7">
                  {project.details}
                </div>
              </div>
            </section>
          )}

          {project.technologies.length > 0 && (
            <section aria-labelledby="project-technologies" className={sectionClass}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Built with</p>
              <h2 id="project-technologies" className={`${sectionHeadingClass} mt-2`}>Technologies</h2>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies used">
                {project.technologies.map((technology) => (
                  <li key={technology} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                    {technology}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {project.clients.length > 0 && (
            <section aria-labelledby="project-clients" className={sectionClass}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">In good company</p>
              <h2 id="project-clients" className={`${sectionHeadingClass} mt-2`}>Clients &amp; organizations</h2>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {project.clients.map((client) => (
                  <li key={`${client.name}-${client.website}`} className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    {client.logo && (
                      <Image
                        src={getGoogleDriveImageSource(client.logo)}
                        alt={`${client.name} logo`}
                        width={160}
                        height={56}
                        sizes="160px"
                        loading="lazy"
                        unoptimized={client.logo.startsWith("http")}
                        className="mb-4 h-14 max-w-40 object-contain object-left"
                      />
                    )}
                    <h3 className="text-lg font-semibold text-slate-900">{client.name}</h3>
                    {client.description && <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{client.description}</p>}
                    {client.website && (
                      <a
                        href={client.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold text-sky-700 hover:text-sky-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                      >
                        Visit website <FaExternalLinkAlt aria-hidden="true" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {project.testimonials.length > 0 && (
            <section aria-labelledby="project-testimonials" className={sectionClass}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Trusted feedback</p>
              <h2 id="project-testimonials" className={`${sectionHeadingClass} mt-2`}>What they say</h2>
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {project.testimonials.map((testimonial, index) => (
                  <figure key={`${testimonial.name}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-7">
                    <blockquote className="whitespace-pre-wrap text-lg leading-8 text-slate-700">
                      “{testimonial.quote}”
                    </blockquote>
                    {(testimonial.name || testimonial.designation || testimonial.organization) && (
                      <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-200 pt-4">
                        {testimonial.avatar && (
                          <Image
                            src={getGoogleDriveImageSource(testimonial.avatar)}
                            alt=""
                            width={48}
                            height={48}
                            sizes="48px"
                            loading="lazy"
                            unoptimized={testimonial.avatar.startsWith("http")}
                            className="h-12 w-12 rounded-full object-cover"
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

          {project.companySlug && (
            <div className="mt-8">
              <Link
                href={`/ventures/${project.companySlug}`}
                className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600"
              >
                More from {project.company} <FaArrowRight aria-hidden="true" />
              </Link>
            </div>
          )}

          <section aria-labelledby="project-cta" className="mt-14 overflow-hidden rounded-3xl bg-slate-950 px-6 py-9 text-white sm:px-10 sm:py-12">
            <div className="grid items-center gap-7 md:grid-cols-[1fr_auto]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">Have a project in mind?</p>
                <h2 id="project-cta" className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                  Let’s build something meaningful.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                  Share what you’re working on and let’s explore how I can help.
                </p>
              </div>
              <ContactCtaLink
                origin="project"
                originId={project.id}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300"
              >
                Have a similar project? Let&apos;s talk <FaArrowRight aria-hidden="true" />
              </ContactCtaLink>
            </div>
          </section>

          {relatedProjects.length > 0 && (
            <section aria-labelledby="related-projects" className="mt-14 border-t border-slate-200 pt-10 sm:mt-16 sm:pt-12">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Keep exploring</p>
              <h2 id="related-projects" className={`${sectionHeadingClass} mt-2`}>
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
