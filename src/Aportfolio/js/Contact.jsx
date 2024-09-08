import React from 'react'
import "../css/Contact.css"
import LinkedinImg from "../img/linkedin.png"
import EmailImg from "../img/email.png"
function Contact() {
    return (
        <div>
            <section id="contact">
                <p className="section__text__p1">Get in Touch</p>
                <h1 className="title">Contact Me</h1>
                <div className="contact-info-upper-container">
                    <div className="contact-info-container">
                        <img
                            src={EmailImg}
                            alt="Email_icon"
                            className="icon contact-icon email-icon"
                        />
                        <p><a href="mailto:examplemail@gmail.com">Example@gmail.com</a></p>
                    </div>
                    <div className="contact-info-container">
                        <img
                            src={LinkedinImg}
                            alt="LinkedIn_icon"
                            className="icon contact-icon"
                        />
                        <p><a href="https://www.linkedin.com/in/akash-kumar-54073a209/'">LinkedIn</a></p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Contact
