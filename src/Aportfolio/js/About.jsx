import React from 'react'
import ProfileP from '../img/profilpik2.jpg'
import Arrow from "../img/arrow.png"
// import EducationI from "../img/education.png"
import EducationI from "../img/nithlogo.png"
import "../css/About.css"
function About() {
    const handleArrowClick = () => {
        window.location.href = './#experience';
    };
    return (
        <div className='about_div'>
            <section id="about">
                <p className="section__text__p">Get To Know More</p>
                <h1 className="title">About Me</h1>
                <div className="section-container">
                    <div className="section__pic-container">
                        <img
                            src={ProfileP}
                            alt="Profile_picture"
                            className="about-pic"
                        />
                    </div>
                    
                    <div className="about-details-container">
                        <div className="about-containers">
                            <div className="details-container">
                                <img
                                    src={EducationI}
                                    alt="Education_icon"
                                    className="icon"
                                />
                                <h3>Education</h3>
                                <p> National Institute of Technology, Hamirpur
                                    <br />   Dual Degree- Electronics and Communication Engineering</p>
                            </div>
                        </div>
                        <div className="text-container">
                            <p>
                                Comfortable working across the entire stack.”
                                “Connecting front-end magic to back-end logic.”
                                “Creating seamless user experiences.
                            </p>
                        </div>
                    </div>
                </div>
                <img
                    src={Arrow}
                    alt="Go"
                    className="icon arrow"
                    onClick={handleArrowClick}
                />
            </section>
        </div>
    )
}

export default About
