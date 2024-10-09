import React from "react";
import "../css/Project.css";

import Project0 from "../videos/pro0.mp4";
import Project01 from "../img/pro01.png";
import Project02 from "../videos/pro02.mp4";
import Project03 from "../img/pro03.png";
import Project04 from "../img/pro04.png";
import Project05 from "../img/pro05.png";
import Project06 from "../videos/pro06.mp4";
import Project07 from "../img/pro07.png";
import Project08 from "../videos/pro08.mp4";
import Project09 from "../videos/pro09.mp4";
import Project10 from "../videos/pro10.mp4";
import Project11 from "../img/pro11.png";
import Project12 from "../videos/pro12.mp4";


function Projects() {
  // project 0
  const Project0_Github = (event) => {
    event.preventDefault();
    window.location.href = "https://github.com/akashkumar8115/mobile_store";
  };
  const Project0_LiveDemo = (event) => {
    event.preventDefault();
    window.location.href = "https://mobile-store-sooty-phi.vercel.app/";
  };
  // project 12
  const Project12_Github = (event) => {
    event.preventDefault();
    window.location.href = "https://github.com/akashkumar8115/online-cpp-compiler";
  };
  const Project12_LiveDemo = (event) => {
    event.preventDefault();
    window.location.href = "https://online-cpp-compiler-pearl.vercel.app/";
  };

  const Project01_Github = (event) => {
    event.preventDefault();
    window.location.href = "https://github.com/akashkumar8115/youtube.com";
  };

  const Project01_LiveDemo = (event) => {
    event.preventDefault();
    window.location.href = "https://youtube-com-one.vercel.app/";
  };

  const Project02_Github = (event) => {
    event.preventDefault();
    window.location.href =
      "https://github.com/akashkumar8115/AspireNex_web-scraping-ecommerce-websites-";
  };

  const Project02_LiveDemo = (event) => {
    event.preventDefault();
    window.location.href = "https://c7cmzk-5173.csb.app/";
  };
  const Project03_Github = (event) => {
    event.preventDefault();
    window.location.href = "https://github.com/akashkumar8115/www.csrl.in";
  };

  const Project03_LiveDemo = (event) => {
    event.preventDefault();
    window.location.href = "https://www-csrl-in.vercel.app/";
  };

  // project 04
  const Project04_Github = (event) => {
    event.preventDefault();
    window.location.href = "https://github.com/akashkumar8115/food_buy";
  };

  const Project04_LiveDemo = (event) => {
    event.preventDefault();
    window.location.href = "https://food-buy.vercel.app/";
  };

  // project 05
  const Project05_Github = (event) => {
    event.preventDefault();
    window.location.href = "https://github.com/akashkumar8115/netflixclone";
  };

  const Project05_LiveDemo = (event) => {
    event.preventDefault();
    window.location.href =
      "https://netflixclone-jm50j62fb-akash-kumars-projects-4915495c.vercel.app/";
  };
  // project 06
  const Project06_Github = (event) => {
    event.preventDefault();
    window.location.href = "https://github.com/akashkumar8115/portfolio3d";
  };

  const Project06_LiveDemo = (event) => {
    event.preventDefault();
    window.location.href = "https://portfolio3d-iota-silk.vercel.app/";
  };
  // project 07
  const Project07_Github = (event) => {
    event.preventDefault();
    window.location.href =
      "https://github.com/akashkumar8115/Personal_bookmark_page";
  };

  const Project07_LiveDemo = (event) => {
    event.preventDefault();
    window.location.href = "https://personal-bookmark-page.vercel.app/";
  };
  // project 08
  const Project08_Github = (event) => {
    event.preventDefault();
    window.location.href = "https://github.com/akashkumar8115/buy_book";
  };

  const Project08_LiveDemo = (event) => {
    event.preventDefault();
    window.location.href = "https://buy-book-two.vercel.app/";
  };
  // project 09
  const Project09_Github = (event) => {
    event.preventDefault();
    window.location.href = "https://github.com/akashkumar8115/Chat_App";
  };
  const Project09_LiveDemo = (event) => {
    event.preventDefault();
    window.location.href = "https://github.com/akashkumar8115/Chat_App";
  };
  // project 10
  const Project10_Github = (event) => {
    event.preventDefault();
    window.location.href = "https://github.com/akashkumar8115/mytunes";
  };
  const Project10_LiveDemo = (event) => {
    event.preventDefault();
    window.location.href = "https://mytunes-opal.vercel.app/";
  };
  // project 11
  const Project11_Github = (event) => {
    event.preventDefault();
    window.location.href = "https://github.com/akashkumar8115/monkey_game";
  };
  const Project11_LiveDemo = (event) => {
    event.preventDefault();
    window.location.href = "https://monkey-game-one.vercel.app/";
  };

  // project 12

  // arrow
  const Arrow = (event) => {
    event.preventDefault();
    window.location.href = "/#contact";
  };
  return (
    <div>
      <section id="projects">
        <p className="section__text__p1">Browse My Recent</p>
        <h1 className="title">Projects</h1>
        <div className="experience-details-container">
          <div className="about-containers project_div">
            {/* projecet card start */}
            {/* prject 01 */}
            <div className="details-container color-container">
              <div className="article-container">
                <video src={Project0} controls autoPlay muted>
                  <source src={Project0} type="video/mp4" />
                </video>
              </div>
              <h2 className="experience-sub-title project-title">
                Mobile store
              </h2>
              <div className="btn-container">
                <button
                  className="btn btn-color-2 project-btn"
                  onClick={Project0_Github}
                >
                  Github
                </button>
                <button
                  className="btn btn-color-2 project-btn"
                  onClick={Project0_LiveDemo}
                >
                  Live Demo
                </button>
              </div>
            </div>

            {/* project 12 */}
            <div className="details-container color-container">
              <div className="article-container">
                <video src={Project12} controls autoPlay muted>
                  <source src={Project12} type="video/mp4" />
                </video>
              </div>
              <h2 className="experience-sub-title project-title">
                Online C++ compiler
              </h2>
              <div className="btn-container">
                <button
                  className="btn btn-color-2 project-btn"
                  onClick={Project12_Github}
                >
                  Github
                </button>
                <button
                  className="btn btn-color-2 project-btn"
                  onClick={Project12_LiveDemo}
                >
                  Live Demo
                </button>
              </div>
            </div>

            <div className="details-container color-container">
              <div className="article-container">
                <img src={Project01} alt="Project01" className="project-img" />
              </div>
              <h2 className="experience-sub-title project-title">
                Youtube Clone Website
              </h2>
              <div className="btn-container">
                <button
                  className="btn btn-color-2 project-btn"
                  onClick={Project01_Github}
                >
                  Github
                </button>
                <button
                  className="btn btn-color-2 project-btn"
                  onClick={Project01_LiveDemo}
                >
                  Live Demo
                </button>
              </div>
            </div>

            <div className="details-container color-container">
              <div className="article-container">
                <video src={Project02} controls autoPlay muted>
                  <source src={Project02} type="video/mp4" />
                </video>
              </div>
              <h2 className="experience-sub-title project-title">
                Web Scraping Website
              </h2>
              <div className="btn-container">
                <button
                  className="btn btn-color-2 project-btn"
                  onClick={Project02_Github}
                >
                  Github
                </button>
                <button
                  className="btn btn-color-2 project-btn"
                  onClick={Project02_LiveDemo}
                >
                  Live Demo
                </button>
              </div>
            </div>

            <div className="details-container color-container">
              <div className="article-container">
                <img src={Project03} alt="Project03" className="project-img" />
              </div>
              <h2 className="experience-sub-title project-title">
                CSRL website
              </h2>
              <div className="btn-container">
                <button
                  className="btn btn-color-2 project-btn"
                  onClick={Project03_Github}
                >
                  Github
                </button>
                <button
                  className="btn btn-color-2 project-btn"
                  onClick={Project03_LiveDemo}
                >
                  Live Demo
                </button>
              </div>
            </div>

            <div className="details-container color-container">
              <div className="article-container">
                <img src={Project04} alt="Project04" className="project-img" />
              </div>
              <h2 className="experience-sub-title project-title">
                Buy Food website
              </h2>
              <div className="btn-container">
                <button
                  className="btn btn-color-2 project-btn"
                  onClick={Project04_Github}
                >
                  Github
                </button>
                <button
                  className="btn btn-color-2 project-btn"
                  onClick={Project04_LiveDemo}
                >
                  Live Demo
                </button>
              </div>
            </div>

            <div className="details-container color-container">
              <div className="article-container">
                <img src={Project05} alt="Project05" className="project-img" />
              </div>
              <h2 className="experience-sub-title project-title">
                Netflix Clone website
              </h2>
              <div className="btn-container">
                <button
                  className="btn btn-color-2 project-btn"
                  onClick={Project05_Github}
                >
                  Github
                </button>
                <button
                  className="btn btn-color-2 project-btn"
                  onClick={Project05_LiveDemo}
                >
                  Live Demo
                </button>
              </div>
            </div>
            <div className="details-container color-container">
              <div className="article-container">
                <video src={Project06} controls autoPlay muted>
                  <source src={Project06} type="video/mp4" />
                </video>
              </div>
              <h2 className="experience-sub-title project-title">
                Portfolio Website
              </h2>
              <div className="btn-container">
                <button
                  className="btn btn-color-2 project-btn"
                  onClick={Project06_Github}
                >
                  Github
                </button>
                <button
                  className="btn btn-color-2 project-btn"
                  onClick={Project06_LiveDemo}
                >
                  Live Demo
                </button>
              </div>
            </div>

            <div className="details-container color-container">
              <div className="article-container">
                <img src={Project07} alt="Project07" className="project-img" />
              </div>
              <h2 className="experience-sub-title project-title">
                Personal bookmark Page
              </h2>
              <div className="btn-container">
                <button
                  className="btn btn-color-2 project-btn"
                  onClick={Project07_Github}
                >
                  Github
                </button>
                <button
                  className="btn btn-color-2 project-btn"
                  onClick={Project07_LiveDemo}
                >
                  Live Demo
                </button>
              </div>
            </div>

            <div className="details-container color-container">
              <div className="article-container">
                <video src={Project08} controls autoPlay muted>
                  <source src={Project08} type="video/mp4" />
                </video>
              </div>
              <h2 className="experience-sub-title project-title">Buy Book</h2>
              <div className="btn-container">
                <button
                  className="btn btn-color-2 project-btn"
                  onClick={Project08_Github}
                >
                  Github
                </button>
                <button
                  className="btn btn-color-2 project-btn"
                  onClick={Project08_LiveDemo}
                >
                  Live Demo
                </button>
              </div>
            </div>

            <div className="details-container color-container">
              <div className="article-container">
                <video src={Project09} controls autoPlay muted>
                  <source src={Project09} type="video/mp4" />
                </video>
              </div>
              <h2 className="experience-sub-title project-title">Chat App</h2>
              <div className="btn-container">
                <button
                  className="btn btn-color-2 project-btn"
                  onClick={Project09_Github}
                >
                  Github
                </button>
                <button
                  className="btn btn-color-2 project-btn"
                  onClick={Project09_LiveDemo}
                >
                  Live Demo
                </button>
              </div>
            </div>

            <div className="details-container color-container">
              <div className="article-container">
                <video src={Project10} controls autoPlay muted>
                  <source src={Project10} type="video/mp4" />
                </video>
              </div>
              <h2 className="experience-sub-title project-title">MyTunes</h2>
              <div className="btn-container">
                <button
                  className="btn btn-color-2 project-btn"
                  onClick={Project10_Github}
                >
                  Github
                </button>
                <button
                  className="btn btn-color-2 project-btn"
                  onClick={Project10_LiveDemo}
                >
                  Live Demo
                </button>
              </div>
            </div>

            <div className="details-container color-container">
              <div className="article-container">
                <img src={Project11} alt="Project01" className="project-img" />
              </div>
              <h2 className="experience-sub-title project-title">
                Monkey Game
              </h2>
              <div className="btn-container">
                <button
                  className="btn btn-color-2 project-btn"
                  onClick={Project11_Github}
                >
                  Github
                </button>
                <button
                  className="btn btn-color-2 project-btn"
                  onClick={Project11_LiveDemo}
                >
                  Live Demo
                </button>
              </div>
            </div>

            {/* end project card */}
          </div>
        </div>
        <img
          src="./assets/arrow.png"
          alt=""
          className="icon arrow"
          onClick={Arrow}
        />
      </section>
    </div>
  );
}

export default Projects;
