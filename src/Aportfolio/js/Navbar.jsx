import React, { useState } from "react";
import "../css/Navbar.css";
import AkashP from "../img/image-ak.png";

function Navbar() {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
  return (
    <div>
      <nav id="desktop-nav">
        <div className="logo_name">
          <div className="logo_profile">
            <img src={AkashP} alt="Akash_profile" />
          </div>
          <div className="logo">
            <h1>AK</h1>
          </div>
        </div>
        <div className="toggle">
          <ul className="nav-links">
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#experience">Experience</a>
            </li>
            <li>
              <a href="#projects">Projects</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </div>
      </nav>

      <nav id="hamburger-nav">
        <div className="logo_name">
          <div className="logo_profile">
            <img src={AkashP} alt="Akash profile picture" />
          </div>
          <div className="logo">
            <h1>AK</h1>
          </div>
        </div>
        <div className="hamburger-menu">
          {/* Menu icon toggles the menu on click */}
          <div className="hamburger-icon" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>

          {/* Conditionally render the menu based on state */}
          {menuVisible && (
            <div className="menu-links">
              <li>
                <a href="#about" onClick={toggleMenu}>
                  About
                </a>
              </li>
              <li>
                <a href="#experience" onClick={toggleMenu}>
                  Experience
                </a>
              </li>
              <li>
                <a href="#projects" onClick={toggleMenu}>
                  Projects
                </a>
              </li>
              <li>
                <a href="#contact" onClick={toggleMenu}>
                  Contact
                </a>
              </li>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
