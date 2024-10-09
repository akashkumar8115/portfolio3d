import React from 'react'
import "../css/Footer.css"
function Footer() {
    return (
        <div className='footer_div'>
            <footer>
                <nav>
                    <div className="nav-links-container">
                        <ul className="nav-links">
                            <li><a href="#about">About</a></li>
                            <li><a href="#experience">Experience</a></li>
                            <li><a href="#projects">Projects</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </div>
                </nav>
                <p>Copyright &#169; 2024 Akash. All Rights Reserved.</p>
                <p  className='created'><a href="https://www.linkedin.com/in/akash-kumar-54073a209/">Created By Akash kumar </a></p>
            </footer>
        </div>
    )
}

export default Footer
