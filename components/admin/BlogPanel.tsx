"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc";
import { getGoogleDriveImageSource } from "@/lib/projectMedia";
import { blogCreateSchema } from "@/lib/validation/blog";

const emptyBlog = {
  title: "",
  excerpt: "",
  content: "",
  image: "",
  tags: "",
  published: true,
  order: 0,
};
type BlogFilter = "all" | "published" | "drafts";

type BlogForm = Omit<typeof emptyBlog, "order"> & { order: number | ""; id?: string };

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-400";
const labelClass = "block text-sm font-semibold text-slate-700";

export default function BlogPanel() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<BlogForm>(emptyBlog);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const [statusIsError, setStatusIsError] = useState(false);
  const [search, setSearch] = useState("");
  const [publication, setPublication] = useState<BlogFilter>("all");
  const blogsQuery = useQuery(trpc.blog.adminList.queryOptions());

  useEffect(() => {
    if (!status) {
      return;
    }
    const timer = window.setTimeout(() => setStatus(""), 5000);
    return () => window.clearTimeout(timer);
  }, [status]);
  const filteredBlogs = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (blogsQuery.data ?? []).filter((blog) => {
      const matchesText =
        !query ||
        [blog.title, blog.excerpt, blog.content, ...blog.tags].some((value) =>
          value.toLowerCase().includes(query),
        );
      const matchesPublication =
        publication === "all" || (publication === "published" ? blog.published : !blog.published);
      return matchesText && matchesPublication;
    });
  }, [blogsQuery.data, publication, search]);

  const refreshBlogs = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: trpc.blog.adminList.queryKey() }),
      queryClient.invalidateQueries({ queryKey: trpc.blog.getAll.queryKey() }),
      queryClient.invalidateQueries({ queryKey: trpc.blog.getById.queryKey() }),
    ]);
  };

  const payload = useMemo(
    () => ({
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      image: form.image,
      tags: form.tags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      published: form.published,
      order: form.order,
    }),
    [form],
  );

  const createBlog = useMutation(
    trpc.blog.create.mutationOptions({
      onSuccess: async () => {
        setStatus("Blog saved.");
        setStatusIsError(false);
        setForm(emptyBlog);
        setFieldErrors({});
        await refreshBlogs();
      },
      onError: (error) => {
        setStatus(error.message);
        setStatusIsError(true);
      },
    }),
  );

  const updateBlog = useMutation(
    trpc.blog.update.mutationOptions({
      onSuccess: async () => {
        setStatus("Blog updated.");
        setStatusIsError(false);
        setForm(emptyBlog);
        setFieldErrors({});
        await refreshBlogs();
      },
      onError: (error) => {
        setStatus(error.message);
        setStatusIsError(true);
      },
    }),
  );

  const deleteBlog = useMutation(
    trpc.blog.delete.mutationOptions({
      onSuccess: async () => {
        setStatus("Blog deleted.");
        setStatusIsError(false);
        await refreshBlogs();
      },
      onError: (error) => {
        setStatus(error.message);
        setStatusIsError(true);
      },
    }),
  );

  const uploadFile = async (file: File) => {
    try {
      const data = new FormData();
      data.append("file", file);
      const response = await fetch("/api/upload", { method: "POST", body: data });
      const json = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !json.url) {
        setStatus(json.error || "Upload failed.");
        setStatusIsError(true);
        return;
      }
      setForm((prev) => ({ ...prev, image: json.url as string }));
      setStatus("Cover image uploaded.");
      setStatusIsError(false);
    } catch {
      setStatus("Cover image upload failed. Check your connection and try again.");
      setStatusIsError(true);
    }
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setStatus("");
    setStatusIsError(false);
    const parsed = blogCreateSchema.safeParse(payload);
    if (!parsed.success) {
      setFieldErrors(
        Object.fromEntries(
          Object.entries(parsed.error.flatten().fieldErrors).map(([field, messages]) => [field, messages?.[0] ?? "Please check this field."]),
        ),
      );
      setStatus("Please review the highlighted blog fields.");
      setStatusIsError(true);
      return;
    }
    setFieldErrors({});
    if (form.id) {
      updateBlog.mutate({ id: form.id, ...parsed.data });
      return;
    }
    createBlog.mutate(parsed.data);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      {status && (
        <p
          role={statusIsError ? "alert" : "status"}
          className={`fixed right-4 top-4 z-50 max-w-sm rounded-2xl border bg-white p-4 shadow-xl ${
            statusIsError ? "border-rose-200 text-rose-700" : "border-emerald-200 text-emerald-700"
          }`}
        >
          {status}
        </p>
      )}
      <form onSubmit={onSubmit} noValidate className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-semibold">{form.id ? "Edit blog" : "Add blog"}</h2>
        <p className="mt-1 text-sm text-slate-500">Published blogs appear in the home slider and /blogs.</p>
        <div className="mt-5 grid gap-4">
          <label className={labelClass}>
            Title
            <input className={fieldClass} value={form.title} aria-invalid={Boolean(fieldErrors.title)} onChange={(event) => {
              setFieldErrors((errors) => ({ ...errors, title: "" }));
              setForm((prev) => ({ ...prev, title: event.target.value }));
            }} required />
            {fieldErrors.title && <span role="alert" className="mt-1 block text-xs text-rose-600">{fieldErrors.title}</span>}
          </label>
          <label className={labelClass}>
            Short excerpt
            <textarea className={`min-h-20 ${fieldClass}`} value={form.excerpt} aria-invalid={Boolean(fieldErrors.excerpt)} onChange={(event) => {
              setFieldErrors((errors) => ({ ...errors, excerpt: "" }));
              setForm((prev) => ({ ...prev, excerpt: event.target.value }));
            }} required />
            {fieldErrors.excerpt && <span role="alert" className="mt-1 block text-xs text-rose-600">{fieldErrors.excerpt}</span>}
          </label>
          <label className={labelClass}>
            Full article
            <textarea className={`min-h-40 ${fieldClass}`} value={form.content} aria-invalid={Boolean(fieldErrors.content)} onChange={(event) => {
              setFieldErrors((errors) => ({ ...errors, content: "" }));
              setForm((prev) => ({ ...prev, content: event.target.value }));
            }} required />
            {fieldErrors.content && <span role="alert" className="mt-1 block text-xs text-rose-600">{fieldErrors.content}</span>}
          </label>
          <label className={labelClass}>
            Cover image URL
            <input
              className={fieldClass}
              placeholder="Paste an image URL or Google Drive share link"
              value={form.image}
              aria-invalid={Boolean(fieldErrors.image)}
              onChange={(event) => {
                setFieldErrors((errors) => ({ ...errors, image: "" }));
                setForm((prev) => ({ ...prev, image: event.target.value }));
              }}
            />
            {fieldErrors.image && <span role="alert" className="mt-1 block text-xs text-rose-600">{fieldErrors.image}</span>}
            <span className="mt-1 block text-xs font-normal text-slate-500">
              For Drive, set access to “Anyone with the link”.
            </span>
          </label>
          {form.image.trim() && (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <p className="px-3 py-2 text-xs font-semibold text-slate-500">Cover preview</p>
              <img
                src={getGoogleDriveImageSource(form.image.trim())}
                alt={`${form.title || "Blog"} cover preview`}
                className="max-h-64 w-full object-cover"
                onError={() => {
                  setStatus("Cover preview failed. Check the URL and Drive sharing access.");
                  setStatusIsError(true);
                }}
              />
            </div>
          )}
          <label className={labelClass}>
            Upload cover
            <input
              className="mt-1.5 w-full text-sm"
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void uploadFile(file);
                }
              }}
            />
          </label>
          <label className={labelClass}>
            Tags
            <input className={fieldClass} placeholder="SaaS, Architecture" value={form.tags} aria-invalid={Boolean(fieldErrors.tags)} onChange={(event) => {
              setFieldErrors((errors) => ({ ...errors, tags: "" }));
              setForm((prev) => ({ ...prev, tags: event.target.value }));
            }} />
            {fieldErrors.tags && <span role="alert" className="mt-1 block text-xs text-rose-600">{fieldErrors.tags}</span>}
          </label>
          <label className={labelClass}>
            Display order
            <input type="number" min="0" step="1" className={fieldClass} value={form.order} aria-invalid={Boolean(fieldErrors.order)} onChange={(event) => {
              setFieldErrors((errors) => ({ ...errors, order: "" }));
              setForm((prev) => ({ ...prev, order: event.target.value === "" ? "" : event.target.valueAsNumber }));
            }} />
            {fieldErrors.order && <span role="alert" className="mt-1 block text-xs text-rose-600">{fieldErrors.order}</span>}
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input type="checkbox" checked={form.published} onChange={(event) => setForm((prev) => ({ ...prev, published: event.target.checked }))} />
            Published
          </label>
        </div>
        <div className="mt-5 flex gap-3">
          <button
            type="submit"
            disabled={createBlog.isPending || updateBlog.isPending}
            className="rounded-xl bg-sky-500 px-5 py-3 font-semibold text-white disabled:opacity-60"
          >
            {form.id ? "Update blog" : "Add blog"}
          </button>
          {form.id && (
            <button type="button" className="rounded-xl border border-slate-200 px-5 py-3" onClick={() => {
              setFieldErrors({});
              setForm(emptyBlog);
            }}>
              Cancel
            </button>
          )}
        </div>
      </form>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-semibold">All blogs</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
          <label className="sr-only" htmlFor="blog-search">Search blogs</label>
          <input
            id="blog-search"
            type="search"
            className={fieldClass}
            placeholder="Search title, excerpt, content, or tags"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <label className="sr-only" htmlFor="blog-publication">Filter blogs by publication</label>
          <select
            id="blog-publication"
            className={`${fieldClass} sm:min-w-40`}
            value={publication}
            onChange={(event) => setPublication(event.target.value as BlogFilter)}
          >
            <option value="all">All blogs</option>
            <option value="published">Published</option>
            <option value="drafts">Drafts</option>
          </select>
        </div>
        {blogsQuery.isError && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            Could not load blogs: {blogsQuery.error.message}
          </p>
        )}
        <div className="mt-4 space-y-3">
          {filteredBlogs.map((blog) => (
            <div key={blog.id} className="rounded-xl border border-slate-200 p-4">
              <h3 className="font-semibold">{blog.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-slate-600">{blog.excerpt}</p>
              <p className="text-xs text-slate-500">{blog.published ? "Published" : "Draft"}</p>
              <div className="mt-2 flex gap-3">
                <button
                  type="button"
                  className="text-sm font-semibold text-sky-600"
                  onClick={() =>
                    {
                      setFieldErrors({});
                      setForm({
                        id: blog.id,
                        title: blog.title,
                        excerpt: blog.excerpt,
                        content: blog.content,
                        image: blog.image,
                        tags: blog.tags.join(", "),
                        published: blog.published,
                        order: blog.order,
                      });
                    }
                  }
                >
                  Edit
                </button>
                <button type="button" className="text-sm font-semibold text-rose-500" onClick={() => deleteBlog.mutate({ id: blog.id })}>
                  Delete
                </button>
              </div>
            </div>
          ))}
          {!blogsQuery.isLoading && !blogsQuery.isError && !filteredBlogs.length && (
            <p className="text-sm text-slate-500">
              {blogsQuery.data?.length ? "No blogs match these filters." : "No blogs yet."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
