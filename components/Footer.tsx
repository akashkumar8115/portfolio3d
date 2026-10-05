import Link from "next/link";
import { FaEnvelope, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 px-4 py-12 text-slate-300 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Link href="/" className="text-xl font-bold text-white">Akash Kumar</Link>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
            Product strategy, SaaS engineering, and thoughtful digital experiences built with ambitious teams.
          </p>
          <p className="mt-5 text-xs text-slate-500">Copyright © {new Date().getFullYear()} Akash Kumar.</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">Explore</h2>
          <nav className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <Link href="/#about" className="transition hover:text-white">About</Link>
            <Link href="/#leadership" className="transition hover:text-white">Partnerships</Link>
            <Link href="/projects" className="transition hover:text-white">Projects</Link>
            <Link href="/blogs" className="transition hover:text-white">Blogs</Link>
            <Link href="/search" className="transition hover:text-white">Search</Link>
            <Link href="/#contact" className="transition hover:text-white">Start a project</Link>
          </nav>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">Let&apos;s connect</h2>
          <div className="mt-4 flex flex-col items-start gap-3 text-sm">
            <a href="mailto:akash2884182@gmail.com" className="inline-flex items-center gap-2 transition hover:text-white">
              <FaEnvelope aria-hidden="true" /> Email Akash
            </a>
            <a
              href="https://www.linkedin.com/in/akash-kumar-54073a209/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 transition hover:text-white"
            >
              <FaLinkedin aria-hidden="true" /> LinkedIn
            </a>
          </div>
          <p className="mt-6 text-xs text-slate-500">Designed and developed by Akash Kumar</p>
        </div>
      </div>
    </footer>
  );
}
