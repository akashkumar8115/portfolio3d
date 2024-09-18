import React, { useEffect, useState } from 'react';
import axios from 'axios';

import "../css/Contact.css"
import LinkedinImg from "../img/linkedin.png"
import EmailImg from "../img/email.png"
function Contact() {
    const [visitCount, setVisitCount] = useState(0);
    const namespace = 'akash';
    const key = 'kumar';
    const [isLoaded, setIsLoaded] = useState(false); // Animation trigger
    // Load visit count from localStorage and update it when the component mounts
    useEffect(() => {
        // Increment the visit count on page load
        axios.put(`http://localhost:3001/api/hit/${namespace}/${key}`)
            .then(response => {
                setVisitCount(response.data.value);
            })
            .catch(error => {
                console.error('Error incrementing visit count:', error);
            });

        // Fetch the current visit count
        axios.get(`http://localhost:3001/api/get/${namespace}/${key}`)
            .then(response => {
                setVisitCount(response.data.value);
            })
            .catch(error => {
                console.error('Error fetching visit count:', error);
            });

        // Trigger animation
        setTimeout(() => setIsLoaded(true), 300);

    }, []);


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
                        <p><a href="20dec024@gmail.com">akash@gmail.com</a></p>
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
            <div className={`footer-count ${isLoaded ? 'fade-in' : ''}`}>
                <div className="visit-message">
                    <p>
                        <span className="highlight">Thank you for visiting!</span><br />
                        You are visitor number
                        <span className="visit-number">{visitCount}</span>
                        on this page. <br />Your presence truly means a lot!
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Contact
