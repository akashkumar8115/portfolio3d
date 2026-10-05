"use client";

import { useMutation } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { useTRPC } from "@/lib/trpc";
import {
  inquiryBudgets,
  inquirySchema,
  inquiryServices,
  inquiryTimelines,
  type InquiryInput,
} from "@/lib/leadValidation";

type InquiryDraft = Omit<
  InquiryInput,
  | "service"
  | "source"
  | "landingPage"
  | "referrer"
  | "utmSource"
  | "utmMedium"
  | "utmCampaign"
  | "utmContent"
  | "utmTerm"
> & { service: InquiryInput["service"] | "" };

const initialForm: InquiryDraft = {
  name: "",
  email: "",
  phone: "",
  company: "",
  service: "",
  budget: "",
  timeline: "",
  message: "",
};

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100";
const labelClass = "block text-left text-sm font-semibold text-slate-700";

function getInquiryAttribution(): Pick<
  InquiryInput,
  "source" | "landingPage" | "referrer" | "utmSource" | "utmMedium" | "utmCampaign" | "utmContent" | "utmTerm"
> {
  const page = new URL(window.location.href);
  const referrer = document.referrer;
  let referrerUrl: URL | null = null;
  try {
    referrerUrl = referrer ? new URL(referrer) : null;
  } catch {
    referrerUrl = null;
  }
  const readCampaign = (key: string) => {
    const value = page.searchParams.get(key)?.trim().slice(0, 150) ?? "";
    return /[\u0000-\u001f\u007f]/.test(value) ? "" : value;
  };
  const inquiryFrom = page.searchParams.get("inquiry_from")?.match(/^(project|blog):([a-f\d]{24})$/i);
  const utmSource = readCampaign("utm_source");
  const sourceHint = (utmSource || referrerUrl?.hostname || "").toLowerCase();
  const source = sourceHint.includes("google")
    ? "google"
    : sourceHint.includes("linkedin")
      ? "linkedin"
      : sourceHint
        ? "referral"
        : "direct";

  return {
    source,
    landingPage: inquiryFrom
      ? `/${inquiryFrom[1].toLowerCase()}s/${inquiryFrom[2]}`
      : page.pathname.slice(0, 500),
    referrer: referrerUrl && ["https:", "http:"].includes(referrerUrl.protocol)
      ? referrerUrl.origin.slice(0, 500)
      : "",
    utmSource,
    utmMedium: readCampaign("utm_medium"),
    utmCampaign: readCampaign("utm_campaign"),
    utmContent: readCampaign("utm_content"),
    utmTerm: readCampaign("utm_term"),
  };
}

export default function ContactForm() {
  const trpc = useTRPC();
  const [formData, setFormData] = useState<InquiryDraft>(initialForm);
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof InquiryDraft, string>>>({});

  const sendMessage = useMutation(
    trpc.contact.send.mutationOptions({
      onSuccess: () => {
        setStatus("Thanks! Your inquiry has been received. I’ll review it and follow up using the email you provided.");
        setFormData(initialForm);
        setErrors({});
      },
      onError: () => setStatus("Something went wrong while sending your message. Please try again."),
    }),
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sendMessage.isPending) {
      return;
    }
    setStatus("");
    const parsed = inquirySchema.safeParse(formData);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors(
        Object.fromEntries(
          Object.entries(fieldErrors).map(([field, messages]) => [field, messages?.[0]]),
        ) as Partial<Record<keyof InquiryDraft, string>>,
      );
      setStatus("Please review the highlighted fields.");
      return;
    }
    setErrors({});
    sendMessage.mutate({ ...parsed.data, ...getInquiryAttribution() });
  };

  const setField = (field: keyof InquiryDraft, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setStatus("");
  };

  return (
    <section id="contact" className="relative scroll-mt-20 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 px-4 py-16 text-white sm:px-6 sm:py-20">
      <div className="pointer-events-none absolute -left-24 top-12 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]"
      >
        <div className="pt-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Project inquiry</p>
          <h2 className="mt-3 text-4xl font-bold sm:text-5xl">Let&apos;s build something meaningful.</h2>
          <p className="mt-5 max-w-xl leading-7 text-slate-300">
            Share what you&apos;re planning, what you need help with, and when you want to get started.
            Your inquiry goes straight to the private portfolio inbox. You can leave optional details blank.
          </p>
          <div className="mt-8 space-y-3 text-sm text-slate-300">
            <p>✓ SaaS products and MVPs</p>
            <p>✓ Web platforms and integrations</p>
            <p>✓ Product strategy and technical consulting</p>
            <p>✓ Ongoing engineering partnerships</p>
          </div>
        </div>

        <form
          className="rounded-3xl border border-white/10 bg-white p-6 text-slate-900 shadow-2xl shadow-black/25 sm:p-8"
          onSubmit={handleSubmit}
          noValidate
          aria-label="Project inquiry form"
          aria-busy={sendMessage.isPending}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className={labelClass}>
              Your name *
              <input id="inquiry-name" className={inputClass} autoComplete="name" value={formData.name} onChange={(event) => setField("name", event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "inquiry-name-error" : undefined} required />
              {errors.name && <span id="inquiry-name-error" role="alert" className="mt-1 block text-xs font-medium text-red-600">{errors.name}</span>}
            </label>
            <label className={labelClass}>
              Work email *
              <input id="inquiry-email" className={inputClass} type="email" autoComplete="email" value={formData.email} onChange={(event) => setField("email", event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "inquiry-email-error" : undefined} required />
              {errors.email && <span id="inquiry-email-error" role="alert" className="mt-1 block text-xs font-medium text-red-600">{errors.email}</span>}
            </label>
            <label className={labelClass}>
              Phone / WhatsApp <span className="font-normal text-slate-400">Optional</span>
              <input id="inquiry-phone" className={inputClass} type="tel" autoComplete="tel" value={formData.phone} onChange={(event) => setField("phone", event.target.value)} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "inquiry-phone-error" : undefined} />
              {errors.phone && <span id="inquiry-phone-error" role="alert" className="mt-1 block text-xs font-medium text-red-600">{errors.phone}</span>}
            </label>
            <label className={labelClass}>
              Company <span className="font-normal text-slate-400">Optional</span>
              <input id="inquiry-company" className={inputClass} autoComplete="organization" value={formData.company} onChange={(event) => setField("company", event.target.value)} aria-invalid={Boolean(errors.company)} aria-describedby={errors.company ? "inquiry-company-error" : undefined} />
              {errors.company && <span id="inquiry-company-error" role="alert" className="mt-1 block text-xs font-medium text-red-600">{errors.company}</span>}
            </label>
            <label className={labelClass}>
              What do you need? *
              <select id="inquiry-service" className={inputClass} value={formData.service} onChange={(event) => setField("service", event.target.value)} aria-invalid={Boolean(errors.service)} aria-describedby={errors.service ? "inquiry-service-error" : undefined} required>
                <option value="">Select a service</option>
                {inquiryServices.map((service) => <option key={service} value={service}>{service}</option>)}
              </select>
              {errors.service && <span id="inquiry-service-error" role="alert" className="mt-1 block text-xs font-medium text-red-600">{errors.service}</span>}
            </label>
            <label className={labelClass}>
              Estimated budget <span className="font-normal text-slate-400">Optional</span>
              <select id="inquiry-budget" className={inputClass} value={formData.budget} onChange={(event) => setField("budget", event.target.value)} aria-invalid={Boolean(errors.budget)} aria-describedby={errors.budget ? "inquiry-budget-error" : undefined}>
                <option value="">Prefer not to say</option>
                {inquiryBudgets.map((budget) => <option key={budget} value={budget}>{budget}</option>)}
              </select>
              {errors.budget && <span id="inquiry-budget-error" role="alert" className="mt-1 block text-xs font-medium text-red-600">{errors.budget}</span>}
            </label>
            <label className={`${labelClass} sm:col-span-2`}>
              Target timeline <span className="font-normal text-slate-400">Optional</span>
              <select id="inquiry-timeline" className={inputClass} value={formData.timeline} onChange={(event) => setField("timeline", event.target.value)} aria-invalid={Boolean(errors.timeline)} aria-describedby={errors.timeline ? "inquiry-timeline-error" : undefined}>
                <option value="">Choose a timeline</option>
                {inquiryTimelines.map((timeline) => <option key={timeline} value={timeline}>{timeline}</option>)}
              </select>
              {errors.timeline && <span id="inquiry-timeline-error" role="alert" className="mt-1 block text-xs font-medium text-red-600">{errors.timeline}</span>}
            </label>
            <label className={`${labelClass} sm:col-span-2`}>
              Tell me about the project *
              <textarea
                className={`${inputClass} min-h-36 resize-y`}
                id="inquiry-message"
                placeholder="What are you building, who is it for, and what would success look like?"
                value={formData.message}
                onChange={(event) => setField("message", event.target.value)}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "inquiry-message-error" : "inquiry-message-help"}
                minLength={10}
                maxLength={5000}
                required
              />
              <span className="mt-1 flex justify-between text-xs text-slate-500">
                {errors.message ? <span id="inquiry-message-error" role="alert" className="text-red-600">{errors.message}</span> : <span id="inquiry-message-help">At least 10 characters</span>}
                <span>{formData.message.length}/5000</span>
              </span>
            </label>
          </div>
          <button
            type="submit"
            disabled={sendMessage.isPending}
            className="mt-6 w-full cursor-pointer rounded-xl bg-sky-600 px-5 py-3.5 font-semibold text-white transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:cursor-wait disabled:opacity-60"
          >
            {sendMessage.isPending ? "Sending inquiry..." : "Send project inquiry"}
          </button>
          {status && (
            <p role={sendMessage.isError || Object.keys(errors).length ? "alert" : "status"} aria-live={sendMessage.isError || Object.keys(errors).length ? "assertive" : "polite"} className={`mt-4 text-center text-sm ${sendMessage.isError || Object.keys(errors).length ? "text-red-600" : "text-emerald-700"}`}>
              {status}
            </p>
          )}
        </form>
      </motion.div>
    </section>
  );
}
