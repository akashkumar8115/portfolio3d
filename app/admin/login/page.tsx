"use client";

import { useMutation } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/lib/trpc";

export default function AdminLoginPage() {
  const trpc = useTRPC();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = useMutation(
    trpc.auth.login.mutationOptions({
      onSuccess: () => router.push("/admin"),
      onError: (err) => setError(err.message),
    }),
  );

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    login.mutate({ email, password });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl"
      >
        <p className="text-sm uppercase tracking-[0.25em] text-sky-600">Private</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Dashboard login</h1>
        <p className="mt-2 text-sm text-slate-500">Sign in to manage projects and leads.</p>
        <label className="mt-6 block text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            autoComplete="username"
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label className="mt-4 block text-sm font-medium text-slate-700">
          Password
          <input
            type="password"
            autoComplete="current-password"
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={login.isPending}
          className="mt-6 w-full rounded-xl bg-sky-500 py-3 font-semibold text-white disabled:opacity-60"
        >
          {login.isPending ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
