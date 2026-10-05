"use client";

import About from "@/components/About";
import Contact from "@/components/Contact";
import ContactForm from "@/components/ContactForm";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Leadership from "@/components/Leadership";
import Navbar from "@/components/Navbar";
import Profile from "@/components/Profile";
import Blogs from "@/components/Blogs";
import Projects from "@/components/Projects";
import ScrollTop from "@/components/ScrollTop";
import type { PublicBlog, PublicProject } from "@/lib/contentTypes";

export default function Portfolio({
  initialProjects,
  featuredProject,
  initialBlogs,
}: {
  initialProjects: PublicProject[];
  featuredProject?: PublicProject;
  initialBlogs: PublicBlog[];
}) {
  return (
    <div className="overflow-x-hidden bg-white">
      <Navbar />
      <Profile />
      <About />
      <Leadership />
      <Projects initialProjects={initialProjects} featuredProject={featuredProject} />
      <Blogs initialBlogs={initialBlogs} />
      <Experience />
      <ContactForm />
      <Contact />
      <ScrollTop />
      <Footer />
    </div>
  );
}
