"use client";

import dynamic from "next/dynamic";
import About from "@/components/About";
import Contact from "@/components/Contact";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Leadership from "@/components/Leadership";
import Navbar from "@/components/Navbar";
import Profile from "@/components/Profile";
import Blogs from "@/components/Blogs";
import Projects from "@/components/Projects";
import ScrollTop from "@/components/ScrollTop";

const Experience = dynamic(() => import("@/components/Experience"), {
  ssr: false,
  loading: () => (
    <section id="experience" className="bg-white py-20 text-center text-slate-900">
      <h2 className="text-3xl font-bold">Technical Skills</h2>
    </section>
  ),
});

export default function Portfolio() {
  return (
    <div className="overflow-x-hidden bg-white">
      <Navbar />
      <Profile />
      <About />
      <Leadership />
      <Projects />
      <Blogs />
      <Experience />
      <ContactForm />
      <Contact />
      <ScrollTop />
      <Footer />
    </div>
  );
}
