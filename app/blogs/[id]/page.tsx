import Link from "next/link";
import Image from "next/image";
import ContactCtaLink from "@/components/ContactCtaLink";
import { notFound } from "next/navigation";
import BlogCard from "@/components/BlogCard";
import PublicShell from "@/components/PublicShell";
import { getPublishedBlog, listPublishedBlogs } from "@/lib/content";
import { getGoogleDriveImageSource } from "@/lib/projectMedia";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function BlogDetailPage({ params }: Props) {
  const { id } = await params;
  const [blog, blogs] = await Promise.all([getPublishedBlog(id), listPublishedBlogs()]);
  if (!blog) notFound();

  const relatedBlogs = blogs
    .filter((item) => item.id !== blog.id && item.tags.some((tag) => blog.tags.includes(tag)))
    .slice(0, 3);

  return (
    <PublicShell>
      <article className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <Link href="/blogs" className="text-sm font-semibold text-sky-700 hover:text-sky-900">
            ← All articles
          </Link>
          <header className="mt-8">
            <p className="text-sm uppercase tracking-[0.25em] text-sky-600">Writing by Akash Kumar</p>
            <h1 className="mt-2 text-4xl font-bold text-slate-900">{blog.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
              <Link href="/#about" className="font-medium text-sky-700 hover:underline">Akash Kumar</Link>
              {blog.createdAt && (
                <>
                  <span aria-hidden="true">·</span>
                  <time dateTime={blog.createdAt}>
                    {new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "UTC" }).format(new Date(blog.createdAt))}
                  </time>
                </>
              )}
            </div>
          </header>
          {blog.image && (
            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl bg-slate-100">
              <Image
                src={getGoogleDriveImageSource(blog.image)}
                alt={`${blog.title} cover`}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                priority
                unoptimized={blog.image.startsWith("http")}
                className="object-cover"
              />
            </div>
          )}
          <p className="mt-8 text-lg leading-8 text-slate-700">{blog.excerpt}</p>
          <div className="mt-6 whitespace-pre-wrap text-base leading-8 text-slate-700">{blog.content}</div>
          {blog.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2" aria-label="Article topics">
              {blog.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">{tag}</span>
              ))}
            </div>
          )}
          <div className="mt-10 rounded-2xl bg-slate-50 p-6">
            <p className="font-semibold text-slate-900">Need help building something similar?</p>
            <p className="mt-2 text-sm text-slate-600">If this topic connects to a product you&apos;re planning, I&apos;d be glad to hear about it.</p>
            <ContactCtaLink
              origin="blog"
              originId={blog.id}
              className="mt-4 inline-flex min-h-11 items-center rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            >
              Discuss a project
            </ContactCtaLink>
          </div>
          {relatedBlogs.length > 0 && (
            <section className="mt-14 border-t border-slate-200 pt-9">
              <h2 className="text-2xl font-bold text-slate-900">Related articles</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {relatedBlogs.map((related) => <BlogCard key={related.id} blog={related} />)}
              </div>
            </section>
          )}
        </div>
      </article>
    </PublicShell>
  );
}
