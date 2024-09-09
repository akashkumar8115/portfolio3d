import React from "react";
// import AkashP from "../img/image-ak.png";
import Linkedin from "../img/linkedin.png";
import GitHub from "../img/github.png";
import RotatableBall from "./EarthR.jsx";
// import RotatableId from "./BubbleLiD.jsx"
import Resume from "../img/Resume.pdf";

import "../css/App.css";
import "../css/Profile.css";
function Profile() {
  const handleDownloadCV = async () => {
    const url = Resume;
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "resume_akash.pdf";
    link.click();
  };

  const handleContactInfo = () => {
    window.location.href = "/#contact";
  };

  const Linkedinpage = () => {
    window.location.href = "https://www.linkedin.com/in/akash-kumar-54073a209/";
  };
  const GitHubpage = () => {
    window.location.href = "https://github.com/akashkumar8115";
  };

  return (
    <>
      <div className="div_pro">
        <section id="profile">
          <div className="section_earth_container">
            <header className="App-header">
              <RotatableBall />
            </header>
          </div>
          <div className="section__text">
            <div class="container">
              <p className="section__text__p1">Hello, I'm</p>
              <div className="auto-type">
                <span className="text">
                  <h1 className="title">Akash</h1>
                </span>
              </div>
            </div>
            <span className="text">Enjoy creating effects!</span>

            {/* <h1 className="title">Akash Kumar</h1> */}
            <p className="section__text__p2">Full Stack Web Developer</p>

            <div className="btn-container">
              <button
                className="btn btn-color-2"
                onClick={handleDownloadCV} // Use React event handling
              >
                My CV
              </button>
              <button
                className="btn btn-color-1"
                onClick={handleContactInfo} // Use React event handling
              >
                Contact Info
              </button>
            </div>
            <div id="socials-container">
              <div>
                <img
                  src={Linkedin}
                  alt="LinkedIn_profile"
                  className="icon"
                  onClick={Linkedinpage}
                />
              </div>
              <div>
                <img
                  src={GitHub}
                  alt="Github_profile"
                  className="icon"
                  onClick={GitHubpage}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Profile;
