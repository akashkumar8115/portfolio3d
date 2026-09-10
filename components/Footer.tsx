export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-10 text-slate-600 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 text-center">
        <nav className="flex flex-wrap justify-center gap-6 text-sm">
          <a href="/#about" className="hover:text-slate-900">About</a>
          <a href="/#leadership" className="hover:text-slate-900">Partnerships</a>
          <a href="/#projects" className="hover:text-slate-900">Projects</a>
          <a href="/#blogs" className="hover:text-slate-900">Blogs</a>
          <a href="/search" className="hover:text-slate-900">Search</a>
          <a href="/#contact" className="hover:text-slate-900">Contact</a>
        </nav>
        <p>Copyright © {new Date().getFullYear()} Akash Kumar. All rights reserved.</p>
        <a href="https://www.linkedin.com/in/akash-kumar-54073a209/" className="text-sky-700">
          Designed and developed by Akash Kumar
        </a>
      </div>
    </footer>
  );
}
