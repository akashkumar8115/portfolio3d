import React from 'react'
import Navbar from './Navbar.jsx';
import Profile from './Profile.jsx';
import About from './About.jsx';
import Experience from './Experience.jsx';
import Projects from './Projects.jsx';
import ContactForm from './ContactForm.jsx';
import Contact from './Contact.jsx';

import Footer from './Footer.jsx';

import "../css/MediaQuari.css"
function index() {
    return (
        <div>

            <Navbar />
            <Profile />
            <About />
            <Experience />
            <Projects />
            <ContactForm />
            <Contact />
            <Footer />
        </div>
    )
}

export default index