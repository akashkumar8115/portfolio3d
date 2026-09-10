import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { getPublishedBlog } from "@/lib/content";
import { blogJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

type Props = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const blog = await getPublishedBlog(id);
  if (!blog) {
    return pageMetadata({
      title: "Article not found",
      description: "This blog post is not available.",
      path: `/blogs/${id}`,
      noIndex: true,
    });
  }

  return pageMetadata({
    title: blog.title,
    description: blog.excerpt,
    path: `/blogs/${blog.id}`,
    image: blog.image || undefined,
    type: "article",
    keywords: [blog.title, ...blog.tags, "Akash Kumar blog"],
  });
}

export default async function BlogDetailLayout({ children, params }: Props) {
  const { id } = await params;
  const blog = await getPublishedBlog(id);
  return (
    <>
      {blog && <JsonLd data={blogJsonLd(blog)} />}
      {children}
    </>
  );
}
