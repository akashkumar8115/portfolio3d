// import React, { useRef } from 'react';
// import emailjs from '@emailjs/browser';

import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import '../css/ContactForm.css';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        emailjs

            .sendForm(
                'service_94a0ajl', // Replace with your EmailJS service ID
                'template_rr333mm', // Replace with your EmailJS template ID
                e.target,
                '3m7UXeTZ-ezBidXgm' // Replace with your EmailJS user ID
            )
            .then(
                (result) => {
                    console.log('Message Sent:', result.text);
                    alert('Message sent successfully!');
                },
                (error) => {
                    console.log('Error:', error.text);
                    alert('An error occurred, please try again.');
                }
            );

        setFormData({
            name: '',
            email: '',
            message: '',
        });
    };

    return (
        <div className="contact-form-container">
            <h2>Contact Me</h2>
            <form onSubmit={handleSubmit}>
                <label>Name:</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <label>Message:</label>
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                />

                <button type="submit">Send Message</button>
            </form>
        </div>
    );
};

export default ContactForm;
