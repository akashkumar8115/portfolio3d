import React from 'react'
// import ChackMark from "../img/checkmark.png"
import "../css/Experience.css"
// import HtmlRot from "./HtmlRot.jsx"
// import Try from './Try.jsx'
// import ExperinceImg from "./Html3d.jsx"

import Arrow from "../img/arrow.png";
// experince png
import Html3d from "./Html3d.jsx"
import Css3d from "./Css3d.jsx"
import Js3d from "./Js3d.jsx"
import React3d from "./React3d.jsx"
import Node3d from "./Node3d.jsx"
import Python3d from "./Python3d.jsx"
import Telwind3d from "./Telwind3d.jsx"
import Git3d from "./Git3d.jsx"
import Github3d from "./Github3d.jsx"
import Aws3d from "./Aws3d.jsx"
import Express3d from "./Express3d.jsx"


// import Html from "../img/html.png";

function Experience() {
    const handleArrowClick = () => {
        window.location.href = './#projects';
    };
    return (
        <div>
            <section id="experience">
                <p className="section__text__p1">Explore My</p>
                <h1 className="title">Technical Skills</h1>
                <div className="experience-details-container">
                    <div className="about-containers">
                        <div className="details-container">
                            <h2 className="experience-sub-title">Frontend Development</h2>
                            <div className="article-container">
                                <article className='shapere'>
                                    <Html3d />
                                    <h3>Html</h3>
                                </article>

                                <article className='shapere'>
                                    <Css3d />
                                    <h3>CSS</h3>

                                </article>

                                <article className='shapere'>
                                    <Js3d />
                                    <h3>JavaScript</h3>

                                </article>
                                <article className='shapere'>
                                    <React3d />
                                    <h3>React</h3>
                                </article>
                                <article className='shapere'>
                                    <Telwind3d />
                                    <h3>Telwind</h3>
                                </article>
                            </div>
                        </div>
                        <div className="details-container">
                            <h2 className="experience-sub-title">Backend Development</h2>
                            <div className="article-container">
                                <article className='shapere'>
                                    <Node3d />
                                    <h3>Node</h3>
                                </article>

                                <article className='shapere'>
                                    <Express3d />
                                    <h3>Express</h3>
                                </article>
                                <article className='shapere'>
                                    <Python3d />
                                    <h3>Python</h3>
                                </article>


                                <article className='shapere'>
                                    <Git3d />
                                    <h3>Git</h3>
                                </article>
                                <article className='shapere'>
                                    <Github3d />
                                    <h3>GitHub</h3>
                                </article>

                                <article className='shapere'>
                                    <Aws3d />
                                    <h3>Aws</h3>
                                </article>

                            </div>
                        </div>
                    </div>
                </div>
                <img
                    src={Arrow}
                    className="icon arrow"
                    onClick={handleArrowClick} // Corrected to use React event handling
                />
            </section>
        </div>
    )
}

export default Experience
