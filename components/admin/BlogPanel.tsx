"use client";

import { FormEvent, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc";

const emptyBlog = {
  title: "",
  excerpt: "",
  content: "",
  image: "",
  tags: "",
  published: true,
  order: 0,
};

type BlogForm = typeof emptyBlog & { id?: string };

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-400";
const labelClass = "block text-sm font-semibold text-slate-700";

export default function BlogPanel() {
  const trpc = useTRPC();
  const [form, setForm] = useState<BlogForm>(emptyBlog);
  const [status, setStatus] = useState("");
  const blogsQuery = useQuery(trpc.blog.adminList.queryOptions());

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
      order: Number(form.order) || 0,
    }),
    [form],
  );

  const createBlog = useMutation(
    trpc.blog.create.mutationOptions({
      onSuccess: async () => {
        setStatus("Blog published.");
        setForm(emptyBlog);
        await blogsQuery.refetch();
      },
      onError: (error) => setStatus(error.message),
    }),
  );

  const updateBlog = useMutation(
    trpc.blog.update.mutationOptions({
      onSuccess: async () => {
        setStatus("Blog updated.");
        setForm(emptyBlog);
        await blogsQuery.refetch();
      },
      onError: (error) => setStatus(error.message),
    }),
  );

  const deleteBlog = useMutation(
    trpc.blog.delete.mutationOptions({
      onSuccess: () => blogsQuery.refetch(),
    }),
  );

  const uploadFile = async (file: File) => {
    const data = new FormData();
    data.append("file", file);
    const response = await fetch("/api/upload", { method: "POST", body: data });
    const json = (await response.json()) as { url?: string; error?: string };
    if (!response.ok || !json.url) {
      setStatus(json.error || "Upload failed.");
      return;
    }
    setForm((prev) => ({ ...prev, image: json.url as string }));
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setStatus("");
    if (form.id) {
      updateBlog.mutate({ id: form.id, ...payload });
      return;
    }
    createBlog.mutate(payload);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-semibold">{form.id ? "Edit blog" : "Add blog"}</h2>
        <p className="mt-1 text-sm text-slate-500">Published blogs appear in the home slider and /blogs.</p>
        <div className="mt-5 grid gap-4">
          <label className={labelClass}>
            Title
            <input className={fieldClass} value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} required />
          </label>
          <label className={labelClass}>
            Short excerpt
            <textarea className={`min-h-20 ${fieldClass}`} value={form.excerpt} onChange={(event) => setForm((prev) => ({ ...prev, excerpt: event.target.value }))} required />
          </label>
          <label className={labelClass}>
            Full article
            <textarea className={`min-h-40 ${fieldClass}`} value={form.content} onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))} required />
          </label>
          <label className={labelClass}>
            Cover image URL
            <input className={fieldClass} value={form.image} onChange={(event) => setForm((prev) => ({ ...prev, image: event.target.value }))} />
          </label>
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
            <input className={fieldClass} placeholder="SaaS, Architecture" value={form.tags} onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))} />
          </label>
          <label className={labelClass}>
            Display order
            <input type="number" className={fieldClass} value={form.order} onChange={(event) => setForm((prev) => ({ ...prev, order: Number(event.target.value) }))} />
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input type="checkbox" checked={form.published} onChange={(event) => setForm((prev) => ({ ...prev, published: event.target.checked }))} />
            Published
          </label>
        </div>
        <div className="mt-5 flex gap-3">
          <button type="submit" className="rounded-xl bg-sky-500 px-5 py-3 font-semibold text-white">
            {form.id ? "Update blog" : "Add blog"}
          </button>
          {form.id && (
            <button type="button" className="rounded-xl border border-slate-200 px-5 py-3" onClick={() => setForm(emptyBlog)}>
              Cancel
            </button>
          )}
        </div>
        {status && <p className="mt-4 text-sm text-sky-700">{status}</p>}
      </form>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-semibold">All blogs</h2>
        <div className="mt-4 space-y-3">
          {(blogsQuery.data ?? []).map((blog) => (
            <div key={blog.id} className="rounded-xl border border-slate-200 p-4">
              <h3 className="font-semibold">{blog.title}</h3>
              <p className="text-xs text-slate-500">{blog.published ? "Published" : "Draft"}</p>
              <div className="mt-2 flex gap-3">
                <button
                  type="button"
                  className="text-sm font-semibold text-sky-600"
                  onClick={() =>
                    setForm({
                      id: blog.id,
                      title: blog.title,
                      excerpt: blog.excerpt,
                      content: blog.content,
                      image: blog.image,
                      tags: blog.tags.join(", "),
                      published: blog.published,
                      order: blog.order,
                    })
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
          {!blogsQuery.data?.length && <p className="text-sm text-slate-500">No blogs yet.</p>}
        </div>
      </div>
    </div>
  );
}
