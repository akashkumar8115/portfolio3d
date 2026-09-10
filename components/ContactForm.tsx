"use client";

import { useMutation } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { useTRPC } from "@/lib/trpc";

const initialForm = { name: "", email: "", message: "" };

export default function ContactForm() {
  const trpc = useTRPC();
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState("");

  const sendMessage = useMutation(
    trpc.contact.send.mutationOptions({
      onSuccess: () => {
        setStatus("Message received. I will get back to you shortly.");
        setFormData(initialForm);
      },
      onError: (error) => setStatus(error.message || "Unable to send the message right now."),
    }),
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("");
    sendMessage.mutate(formData);
  };

  return (
    <section className="bg-slate-50 px-4 pb-8 pt-6 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-slate-900 shadow-xl"
      >
        <h2 className="text-center text-2xl font-bold">Let&apos;s build something</h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          For SaaS partnerships, enterprise delivery, or consulting through Intopie, SKDS, VRV
          InfoLed, or AM Future Tech Solution.
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold">
            Name
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
              value={formData.name}
              onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
          </label>
          <label className="block text-sm font-semibold">
            Email
            <input
              type="email"
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
              value={formData.email}
              onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
              required
            />
          </label>
          <label className="block text-sm font-semibold">
            Message
            <textarea
              className="mt-1 min-h-28 w-full rounded-xl border border-slate-200 px-4 py-3"
              value={formData.message}
              onChange={(event) => setFormData((prev) => ({ ...prev, message: event.target.value }))}
              required
            />
          </label>
          <button
            type="submit"
            disabled={sendMessage.isPending}
            className="w-full rounded-xl bg-sky-500 py-3 font-semibold text-white disabled:opacity-60"
          >
            {sendMessage.isPending ? "Sending..." : "Send Message"}
          </button>
        </form>
        {status && (
          <p className={`mt-4 text-center text-sm ${sendMessage.isError ? "text-red-600" : "text-emerald-700"}`}>
            {status}
          </p>
        )}
      </motion.div>
    </section>
  );
}
