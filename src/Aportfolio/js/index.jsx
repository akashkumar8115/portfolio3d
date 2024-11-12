import React from "react";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import ScrollTop from "./ScrollTop.jsx";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Profile from "./Profile.jsx";
import About from "./About.jsx";
import Experience from "./Experience.jsx";
import Projects from "./Projects.jsx";
import ContactForm from "./ContactForm.jsx";
import Contact from "./Contact.jsx";

import Footer from "./Footer.jsx";
import Try from "./Try.jsx"
import "../css/MediaQuari.css";
function index() {
  // const location = useLocation();

  // useEffect(() => {
  //   window.scrollTo({ top: 10 });
  // }, [location.pathname]);


  // useEffect(() => {
  //   // Initialize AOS animations
  //   AOS.init({
  //     once: true,
  //     duration: 900,
  //     easing: "ease-out-sine",
  //     delay: 100,
  //   });
  // }, []);

  // AOS.refresh();
  return (
    <div>
      {/* <Try /> */}
      <Navbar />
      <Profile />
      <About />
      <Projects />
      <Experience />
      <ContactForm />
      <Contact />
      {/* <ScrollTop /> */}
      <Footer />
    </div>
  );
}

export default index;
