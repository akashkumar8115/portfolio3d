"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaBell,
  FaBriefcase,
  FaChartPie,
  FaEnvelopeOpenText,
  FaExternalLinkAlt,
  FaLinkedin,
  FaPen,
  FaPlus,
  FaSignOutAlt,
  FaTimes,
  FaTrashAlt,
} from "react-icons/fa";
import { useTRPC } from "@/lib/trpc";
import { ventures } from "@/server/data/projects";
import BlogPanel from "@/components/admin/BlogPanel";

const emptyForm = {
  title: "",
  description: "",
  image: "",
  github: "",
  demo: "",
  linkedin: "",
  isVideo: false,
  technologies: "",
  highlights: "",
  details: "",
  role: "",
  projectType: "",
  kind: "personal" as "personal" | "partnership",
  companySlug: "",
  company: "",
  category: "Full Stack" as "Web Development" | "Full Stack" | "Frontend" | "Backend",
  published: true,
  order: 0,
};

type FormState = typeof emptyForm & { id?: string };
type Section = "overview" | "projects" | "blogs" | "leads";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-400";
const labelClass = "block text-sm font-semibold text-slate-700";

function notifyBrowser(title: string, body: string) {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return;
  }
  if (Notification.permission === "granted") {
    new Notification(title, { body, icon: "/favicon.jpg" });
  }
}

export default function AdminDashboardPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [status, setStatus] = useState("");
  const [statusIsError, setStatusIsError] = useState(false);
  const [leadStatus, setLeadStatus] = useState("");
  const [leadStatusIsError, setLeadStatusIsError] = useState(false);
  const [projectSearch, setProjectSearch] = useState("");
  const [projectPublication, setProjectPublication] = useState<"all" | "published" | "drafts">("all");
  const [leadSearch, setLeadSearch] = useState("");
  const [leadReadFilter, setLeadReadFilter] = useState<"all" | "unread" | "read">("all");
  const [toast, setToast] = useState("");
  const [section, setSection] = useState<Section>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const seenUnread = useRef<number | null>(null);

  const statsQuery = useQuery(trpc.auth.dashboard.queryOptions());
  const projectsQuery = useQuery(trpc.project.adminList.queryOptions());
  const inboxQuery = useQuery({
    ...trpc.contact.inbox.queryOptions(),
    refetchInterval: 8000,
  });

  const unread = inboxQuery.data?.unread ?? statsQuery.data?.unread ?? 0;
  const messages = useMemo(() => inboxQuery.data?.items ?? [], [inboxQuery.data?.items]);
  const projects = useMemo(() => projectsQuery.data ?? [], [projectsQuery.data]);
  const filteredProjects = useMemo(() => {
    const query = projectSearch.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesQuery =
        !query ||
        [project.title, project.description, project.company, project.category, project.projectType]
          .some((value) => value?.toLowerCase().includes(query));
      const matchesPublication =
        projectPublication === "all" ||
        (projectPublication === "published" ? project.published : !project.published);
      return matchesQuery && matchesPublication;
    });
  }, [projectPublication, projectSearch, projects]);
  const filteredLeads = useMemo(() => {
    const query = leadSearch.trim().toLowerCase();
    return messages.filter((lead) => {
      const matchesQuery =
        !query ||
        [lead.name, lead.email, lead.phone, lead.company, lead.service, lead.source, lead.message]
          .some((value) => value?.toLowerCase().includes(query));
      const matchesRead =
        leadReadFilter === "all" ||
        (leadReadFilter === "read" ? lead.read : !lead.read);
      return matchesQuery && matchesRead;
    });
  }, [leadReadFilter, leadSearch, messages]);

  const refresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: trpc.auth.dashboard.queryKey() }),
      queryClient.invalidateQueries({ queryKey: trpc.project.adminList.queryKey() }),
      queryClient.invalidateQueries({ queryKey: trpc.project.getAll.queryKey() }),
      queryClient.invalidateQueries({ queryKey: trpc.project.getById.queryKey() }),
      queryClient.invalidateQueries({ queryKey: trpc.contact.inbox.queryKey() }),
    ]);
  };

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return;
    }
    if (Notification.permission === "default") {
      void Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (seenUnread.current === null) {
      seenUnread.current = unread;
      return;
    }
    if (unread > seenUnread.current) {
      const latest = messages.find((item) => !item.read);
      const body = latest ? `${latest.name}: ${latest.message.slice(0, 90)}` : "A visitor sent a new contact message.";
      setToast(body);
      notifyBrowser("New portfolio message", body);
      setSection("leads");
    }
    seenUnread.current = unread;
  }, [unread, messages]);

  useEffect(() => {
    if (!toast) {
      return;
    }
    const timer = window.setTimeout(() => setToast(""), 7000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!status && !leadStatus) {
      return;
    }
    const timer = window.setTimeout(() => {
      setStatus("");
      setLeadStatus("");
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [status, leadStatus]);

  useEffect(() => {
    document.title = unread > 0 ? `(${unread}) Dashboard` : "Dashboard";
  }, [unread]);

  const logout = useMutation(
    trpc.auth.logout.mutationOptions({
      onSuccess: () => router.push("/admin/login"),
    }),
  );

  const createProject = useMutation(
    trpc.project.create.mutationOptions({
      onSuccess: async () => {
        setStatus("Project saved.");
        setStatusIsError(false);
        setForm(emptyForm);
        await refresh();
      },
      onError: (error) => {
        setStatus(error.message);
        setStatusIsError(true);
      },
    }),
  );

  const updateProject = useMutation(
    trpc.project.update.mutationOptions({
      onSuccess: async () => {
        setStatus("Project updated.");
        setStatusIsError(false);
        setForm(emptyForm);
        await refresh();
      },
      onError: (error) => {
        setStatus(error.message);
        setStatusIsError(true);
      },
    }),
  );

  const deleteProject = useMutation(
    trpc.project.delete.mutationOptions({
      onSuccess: async () => {
        setStatus("Project removed.");
        setStatusIsError(false);
        await refresh();
      },
      onError: (error) => {
        setStatus(error.message);
        setStatusIsError(true);
      },
    }),
  );

  const markRead = useMutation(
    trpc.contact.markRead.mutationOptions({
      onSuccess: async (message) => {
        setLeadStatus(message.read ? "Lead marked as read." : "Lead marked as unread.");
        setLeadStatusIsError(false);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.contact.inbox.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.auth.dashboard.queryKey() }),
        ]);
      },
      onError: (error) => {
        setLeadStatus(error.message);
        setLeadStatusIsError(true);
      },
    }),
  );

  const markAllRead = useMutation(
    trpc.contact.markAllRead.mutationOptions({
      onSuccess: async () => {
        setLeadStatus("All leads marked as read.");
        setLeadStatusIsError(false);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.contact.inbox.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.auth.dashboard.queryKey() }),
        ]);
      },
      onError: (error) => {
        setLeadStatus(error.message);
        setLeadStatusIsError(true);
      },
    }),
  );

  const deleteLead = useMutation(
    trpc.contact.delete.mutationOptions({
      onSuccess: async () => {
        setLeadStatus("Lead deleted.");
        setLeadStatusIsError(false);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.contact.inbox.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.auth.dashboard.queryKey() }),
        ]);
      },
      onError: (error) => {
        setLeadStatus(error.message);
        setLeadStatusIsError(true);
      },
    }),
  );

  const payload = useMemo(() => {
    const venture = ventures.find((item) => item.slug === form.companySlug);
    return {
      title: form.title,
      description: form.description,
      image: form.image,
      github: form.github,
      demo: form.demo,
      socialLinks: { linkedin: form.linkedin },
      isVideo: form.isVideo,
      technologies: form.technologies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      highlights: form.highlights
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      details: form.details,
      role: form.role,
      projectType: form.projectType,
      kind: form.kind,
      companySlug: form.kind === "partnership" ? form.companySlug : "",
      company: form.kind === "partnership" ? (venture?.name ?? form.company) : "",
      category: form.category,
      published: form.published,
      order: Number(form.order) || 0,
    };
  }, [form]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setStatus("");
    setStatusIsError(false);
    if (form.kind === "partnership" && !form.companySlug) {
      setStatus("Choose a partnership company for this project.");
      return;
    }
    if (form.id) {
      updateProject.mutate({ id: form.id, ...payload });
      return;
    }
    createProject.mutate(payload);
  };

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
      setForm((prev) => ({ ...prev, image: json.url as string, isVideo: file.type.startsWith("video/") }));
      setStatus("Media uploaded.");
      setStatusIsError(false);
    } catch {
      setStatus("Media upload failed. Check your connection and try again.");
      setStatusIsError(true);
    }
  };

  const editProject = (project: (typeof projects)[number]) => {
    setForm({
      id: project.id,
      title: project.title,
      description: project.description,
      image: project.image,
      github: project.github,
      demo: project.demo,
      linkedin: project.socialLinks?.linkedin ?? "",
      isVideo: project.isVideo,
      technologies: project.technologies.join(", "),
      highlights: (project.highlights ?? []).join(", "),
      details: project.details ?? "",
      role: project.role ?? "",
      projectType: project.projectType ?? "",
      kind: project.kind === "partnership" ? "partnership" : "personal",
      companySlug: project.companySlug ?? "",
      company: project.company ?? "",
      category: project.category as FormState["category"],
      published: project.published,
      order: project.order,
    });
    setStatus("");
    setStatusIsError(false);
    setSection("projects");
    setSidebarOpen(false);
  };

  const nav = [
    { id: "overview" as const, label: "Overview", icon: FaChartPie },
    { id: "projects" as const, label: "Projects", icon: FaBriefcase },
    { id: "blogs" as const, label: "Blogs", icon: FaPen },
    { id: "leads" as const, label: "Leads", icon: FaEnvelopeOpenText, badge: unread },
  ];

  const stats = [
    ["Unique visitors", statsQuery.data?.uniqueVisitors ?? 0],
    ["Total views", statsQuery.data?.totalViews ?? 0],
    ["Projects", statsQuery.data?.projects ?? 0],
    ["Messages", inboxQuery.data?.total ?? statsQuery.data?.messages ?? messages.length],
    ["Unread leads", unread],
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {toast && (
        <div className="fixed right-4 top-4 z-50 max-w-sm rounded-2xl border border-sky-200 bg-white p-4 shadow-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-sky-600">New lead</p>
          <p className="mt-1 text-sm text-slate-800">{toast}</p>
        </div>
      )}
      {(status || leadStatus) && (
        <div
          role={(status ? statusIsError : leadStatusIsError) ? "alert" : "status"}
          className={`fixed right-4 ${toast ? "top-24" : "top-4"} z-50 max-w-sm rounded-2xl border bg-white p-4 shadow-xl ${
            (status ? statusIsError : leadStatusIsError)
              ? "border-rose-200 text-rose-700"
              : "border-emerald-200 text-emerald-700"
          }`}
        >
          {status || leadStatus}
        </div>
      )}

      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-sky-600">Private</p>
            <p className="text-lg font-semibold">Dashboard</p>
          </div>
          <button type="button" className="rounded-lg p-2 text-slate-500 lg:hidden" onClick={() => setSidebarOpen(false)}>
            <FaTimes />
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = section === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium ${
                  active ? "bg-sky-50 text-sky-700" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon />
                  {item.label}
                </span>
                {item.badge ? (
                  <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[11px] font-bold text-white">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
        <div className="space-y-2 border-t border-slate-200 p-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <FaExternalLinkAlt /> View site
          </Link>
          <button
            type="button"
            onClick={() => logout.mutate()}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg border border-slate-200 p-2 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              Menu
            </button>
            <div>
              <h1 className="text-xl font-bold capitalize sm:text-2xl">{section}</h1>
              <p className="text-sm text-slate-500">Manage portfolio data and incoming leads.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSection("leads")}
            className="relative rounded-full border border-slate-200 p-3 text-slate-600"
            aria-label="Open leads"
          >
            <FaBell />
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white">
                {unread}
              </span>
            )}
          </button>
        </header>

        <main className="px-4 py-6 sm:px-6">
          {section === "overview" && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {stats.map(([label, value]) => (
                  <div key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="mt-2 text-3xl font-bold">{value}</p>
                  </div>
                ))}
              </div>
              <div className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Recent leads</h2>
                    <button type="button" className="text-sm font-semibold text-sky-600" onClick={() => setSection("leads")}>
                      Open inbox
                    </button>
                  </div>
                  <div className="mt-4 space-y-3">
                    {messages.slice(0, 4).map((message) => (
                      <div key={message.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                        <p className="font-medium">{message.name}</p>
                        <p className="text-xs text-sky-600">{message.email}</p>
                        <p className="mt-2 line-clamp-2 text-sm text-slate-600">{message.message}</p>
                      </div>
                    ))}
                    {!messages.length && <p className="text-sm text-slate-500">No leads yet.</p>}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Latest projects</h2>
                    <button type="button" className="text-sm font-semibold text-sky-600" onClick={() => setSection("projects")}>
                      Manage
                    </button>
                  </div>
                  <div className="mt-4 space-y-3">
                    {projects.slice(0, 5).map((project) => (
                      <div key={project.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3">
                        <div>
                          <p className="font-medium">{project.title}</p>
                          <p className="text-xs text-slate-500">
                            {project.kind === "partnership" ? project.company : "Self project"}
                          </p>
                        </div>
                        <button type="button" className="text-sm text-sky-600" onClick={() => editProject(project)}>
                          Edit
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {section === "projects" && (
            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center gap-2">
                  <FaPlus className="text-sky-600" />
                  <h2 className="text-xl font-semibold">{form.id ? "Edit project" : "Add project"}</h2>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  Self projects go to the home slider. Partnership projects go under the company page.
                </p>
                <div className="mt-5 grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className={labelClass}>
                      Project type
                      <select
                        className={fieldClass}
                        value={form.kind}
                        onChange={(event) =>
                          setForm((prev) => ({
                            ...prev,
                            kind: event.target.value as FormState["kind"],
                            companySlug: event.target.value === "personal" ? "" : prev.companySlug,
                          }))
                        }
                      >
                        <option value="personal">Self project</option>
                        <option value="partnership">Partnership project</option>
                      </select>
                    </label>
                    {form.kind === "partnership" && (
                      <label className={labelClass}>
                        Partnership company
                        <select
                          className={fieldClass}
                          value={form.companySlug}
                          onChange={(event) => setForm((prev) => ({ ...prev, companySlug: event.target.value }))}
                          required
                        >
                          <option value="">Choose company</option>
                          {ventures.map((venture) => (
                            <option key={venture.slug} value={venture.slug}>
                              {venture.name}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}
                  </div>
                  <label className={labelClass}>
                    Project subtype
                    <input
                      className={fieldClass}
                      placeholder="e.g. Proprietary SaaS Solution"
                      value={form.projectType}
                      onChange={(event) => setForm((prev) => ({ ...prev, projectType: event.target.value }))}
                    />
                  </label>
                  <label className={labelClass}>
                    Project title
                    <input className={fieldClass} placeholder="e.g. Wayfinder" value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} required />
                  </label>
                  <label className={labelClass}>
                    Description
                    <textarea className={`min-h-24 ${fieldClass}`} placeholder="What this project does" value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} required />
                  </label>
                  <label className={labelClass}>
                    Full details
                    <textarea className={`min-h-36 ${fieldClass}`} placeholder="In-depth story, process, results. Shown on the project details page." value={form.details} onChange={(event) => setForm((prev) => ({ ...prev, details: event.target.value }))} />
                  </label>
                  <label className={labelClass}>
                    Your role
                    <input className={fieldClass} placeholder="e.g. Product Strategy" value={form.role} onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))} />
                  </label>
                  <label className={labelClass}>
                    Image or video URL
                    <input
                      className={fieldClass}
                      placeholder="Paste a direct URL or Google Drive share link"
                      value={form.image}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          image: event.target.value,
                          ...( /\.(mp4|webm|ogg|mov)(?:$|[?#])/i.test(event.target.value)
                            ? { isVideo: true }
                            : {} ),
                        }))
                      }
                      required
                    />
                    <span className="mt-1 block text-xs font-normal text-slate-500">
                      Drive link: set access to “Anyone with the link”. For Drive videos, enable Video media below.
                    </span>
                  </label>
                  <label className={labelClass}>
                    Upload media
                    <input
                      className="mt-1.5 w-full text-sm"
                      type="file"
                      accept="image/*,video/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          void uploadFile(file);
                        }
                      }}
                    />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className={labelClass}>
                      GitHub URL
                      <input className={fieldClass} placeholder="https://github.com/..." value={form.github} onChange={(event) => setForm((prev) => ({ ...prev, github: event.target.value }))} />
                    </label>
                    <label className={labelClass}>
                      Live demo URL
                      <input className={fieldClass} placeholder="https://..." value={form.demo} onChange={(event) => setForm((prev) => ({ ...prev, demo: event.target.value }))} />
                    </label>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700">Social Media</h3>
                    <label className={`${labelClass} mt-3`}>
                      LinkedIn URL
                      <span className="relative mt-1.5 block">
                        <FaLinkedin
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sky-700"
                          aria-hidden="true"
                        />
                        <input
                          type="url"
                          className={`${fieldClass} pl-11`}
                          placeholder="https://www.linkedin.com/..."
                          value={form.linkedin}
                          onChange={(event) => setForm((prev) => ({ ...prev, linkedin: event.target.value }))}
                        />
                      </span>
                    </label>
                  </div>
                  <label className={labelClass}>
                    Technologies
                    <input className={fieldClass} placeholder="React, Node.js, MongoDB" value={form.technologies} onChange={(event) => setForm((prev) => ({ ...prev, technologies: event.target.value }))} />
                  </label>
                  <label className={labelClass}>
                    Highlights
                    <input className={fieldClass} placeholder="Fast load, Role-based access" value={form.highlights} onChange={(event) => setForm((prev) => ({ ...prev, highlights: event.target.value }))} />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <label className={labelClass}>
                      Category
                      <select
                        className={fieldClass}
                        value={form.category}
                        onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value as FormState["category"] }))}
                      >
                        <option>Full Stack</option>
                        <option>Frontend</option>
                        <option>Backend</option>
                        <option>Web Development</option>
                      </select>
                    </label>
                    <label className={labelClass}>
                      Display order
                      <input type="number" className={fieldClass} placeholder="0" value={form.order} onChange={(event) => setForm((prev) => ({ ...prev, order: Number(event.target.value) }))} />
                    </label>
                    <label className={`${labelClass} flex items-end gap-2 pb-3`}>
                      <input type="checkbox" checked={form.isVideo} onChange={(event) => setForm((prev) => ({ ...prev, isVideo: event.target.checked }))} />
                      Video media
                    </label>
                  </div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <input type="checkbox" checked={form.published} onChange={(event) => setForm((prev) => ({ ...prev, published: event.target.checked }))} />
                    Published on the public site
                  </label>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={createProject.isPending || updateProject.isPending}
                    className="rounded-xl bg-sky-500 px-5 py-3 font-semibold text-white disabled:opacity-60"
                  >
                    {form.id ? "Update project" : "Add project"}
                  </button>
                  {form.id && (
                    <button type="button" className="rounded-xl border border-slate-200 px-5 py-3" onClick={() => setForm(emptyForm)}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-xl font-semibold">All projects</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
                  <label className="sr-only" htmlFor="project-search">Search projects</label>
                  <input
                    id="project-search"
                    type="search"
                    className={fieldClass}
                    placeholder="Search title, description, company, or category"
                    value={projectSearch}
                    onChange={(event) => setProjectSearch(event.target.value)}
                  />
                  <label className="sr-only" htmlFor="project-publication">Filter projects by publication</label>
                  <select
                    id="project-publication"
                    className={`${fieldClass} sm:min-w-40`}
                    value={projectPublication}
                    onChange={(event) => setProjectPublication(event.target.value as typeof projectPublication)}
                  >
                    <option value="all">All projects</option>
                    <option value="published">Published</option>
                    <option value="drafts">Drafts</option>
                  </select>
                </div>
                {projectsQuery.isError && (
                  <p role="alert" className="mt-3 text-sm text-red-600">
                    Could not load projects: {projectsQuery.error.message}
                  </p>
                )}
                <div className="mt-4 max-h-[820px] space-y-3 overflow-y-auto">
                  {filteredProjects.map((project) => (
                    <div key={project.id} className="rounded-xl border border-slate-200 p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="font-semibold">{project.title}</h3>
                          <p className="mt-1 line-clamp-2 text-sm text-slate-600">{project.description}</p>
                          <p className="text-xs text-slate-500">
                            {project.kind === "partnership" ? project.company || "Partnership" : "Self project"} · {project.category}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <button type="button" className="text-sm font-semibold text-sky-600" onClick={() => editProject(project)}>
                            Edit
                          </button>
                          <button type="button" className="text-sm font-semibold text-rose-500" onClick={() => deleteProject.mutate({ id: project.id })}>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {!projectsQuery.isLoading && !projectsQuery.isError && !filteredProjects.length && (
                    <p className="py-6 text-center text-sm text-slate-500">No projects match these filters.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {section === "blogs" && <BlogPanel />}

          {section === "leads" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">Contact leads</h2>
                  <p className="text-sm text-slate-500">Project inquiries and messages from the public contact form.</p>
                </div>
                <button
                  type="button"
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm disabled:opacity-40"
                  onClick={() => markAllRead.mutate()}
                  disabled={!unread}
                >
                  Mark all read
                </button>
              </div>
              {inboxQuery.isError && (
                <p role="alert" className="mt-3 text-sm text-red-600">
                  Could not load leads: {inboxQuery.error.message}
                </p>
              )}
              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
                <label className="sr-only" htmlFor="lead-search">Search leads</label>
                <input
                  id="lead-search"
                  type="search"
                  className={fieldClass}
                  placeholder="Search name, email, company, service, or inquiry"
                  value={leadSearch}
                  onChange={(event) => setLeadSearch(event.target.value)}
                />
                <label className="sr-only" htmlFor="lead-read-filter">Filter leads by read status</label>
                <select
                  id="lead-read-filter"
                  className={`${fieldClass} sm:min-w-40`}
                  value={leadReadFilter}
                  onChange={(event) => setLeadReadFilter(event.target.value as typeof leadReadFilter)}
                >
                  <option value="all">All leads</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </select>
              </div>
              <div className="mt-4 grid gap-3">
                {filteredLeads.map((message) => (
                  <div
                    key={message.id}
                    className={`rounded-xl p-4 ${message.read ? "border border-slate-200 bg-white" : "border border-sky-200 bg-sky-50"}`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-medium">{message.name}</p>
                        {message.service && <p className="mt-1 text-xs font-medium text-sky-700">{message.service}</p>}
                        <a href={`mailto:${message.email}`} className="text-xs text-sky-600">
                          {message.email}
                        </a>
                        {message.company && <p className="mt-1 text-xs text-slate-500">{message.company}</p>}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        {message.createdAt && <span>{new Date(message.createdAt).toLocaleString()}</span>}
                        {!message.read && (
                          <button
                            type="button"
                            className="rounded-full bg-sky-500 px-3 py-1 font-semibold text-white"
                            onClick={() => markRead.mutate({ id: message.id })}
                          >
                            Mark read
                          </button>
                        )}
                        {message.read && (
                          <button
                            type="button"
                            className="rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-600"
                            onClick={() => markRead.mutate({ id: message.id, read: false })}
                          >
                            Mark unread
                          </button>
                        )}
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-full border border-rose-200 px-3 py-1 font-semibold text-rose-600"
                          onClick={() => {
                            if (window.confirm(`Delete the lead from ${message.name}? This cannot be undone.`)) {
                              deleteLead.mutate({ id: message.id });
                            }
                          }}
                        >
                          <FaTrashAlt aria-hidden="true" /> Delete
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 line-clamp-3 text-sm text-slate-700">{message.message}</p>
                    <Link
                      href={`/admin/leads/${message.id}`}
                      className="mt-3 inline-flex items-center rounded-full border border-sky-200 px-3 py-1.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-50"
                    >
                      View full inquiry
                    </Link>
                  </div>
                ))}
                {!filteredLeads.length && !inboxQuery.isError && (
                  <p className="text-sm text-slate-500">
                    {messages.length ? "No leads match these filters." : "No leads yet."}
                  </p>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
