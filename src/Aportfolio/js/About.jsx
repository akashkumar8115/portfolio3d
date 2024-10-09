import React from 'react'
import ProfileP from '../img/profilepic.jpg'
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
                <h1 className="title">About Me</h1>
                <div className="section-container">
                    <div className="hover-container">
                        <div className="section__pic-container hover-image">
                            <img
                                src={ProfileP}
                                alt="Profile_picture"
                                className="about-pic"
                            />
                            <div className="content">
                                <p><h3> Akash Kumar</h3>

                                    <b> Previous Education:</b> <br />

                                    Ex-Jawahar Navodaya Vidyalaya (JNV), Mahoba <br />
                                    Ex-GAIL Utkarsh Super 100, Kanpur <br />


                                    .</p>
                            </div>
                        </div>
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
                                <p><b>National Institute of Technology, Hamirpur
                                    Pursuing a Dual Degree in Electronics and Communication Engineering</b>
                                    <br />  At NIT Hamirpur, I am immersed in a rigorous academic environment that fosters innovation and technical excellence, equipping me with the skills to excel in the ever-evolving field of electronics and communication.</p>
                            </div>
                        </div>
                        <div className="text-container">
                            <ol>
                                <li><h3>Comfortable working across the entire stack</h3></li>
                                <p>Proficient in both front-end and back-end development, I ensure a seamless connection between design and functionality.
                                </p>
                                <li><h3>Connecting front-end magic to back-end logic
                                </h3></li>
                                <p>I bring together user-friendly interfaces with robust back-end systems to create dynamic web applications.</p>

                                <li><h3>Creating seamless user experiences</h3></li>
                                <p>Focused on building intuitive, smooth, and engaging user experiences backed by efficient architecture.</p>
                            </ol>

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
