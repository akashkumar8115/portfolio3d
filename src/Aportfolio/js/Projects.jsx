  import React, { useState, useEffect } from "react";
  import { motion, AnimatePresence } from "framer-motion";
  import { projectsData, projectCategories } from "../data/projectsData";
  import "../css/Project.css";

  function Projects() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [filteredProjects, setFilteredProjects] = useState(projectsData);
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
      const filtered = selectedCategory === "All" 
        ? projectsData
        : projectsData.filter(project => project.category === selectedCategory);
      setFilteredProjects(filtered);
    }, [selectedCategory]);

    const ProjectCard = ({ project }) => (
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="project-card"
        whileHover={{ y: -10 }}
      >
        <div className="project-media">
          {project.isVideo ? (
            <video 
              src={project.image} 
              controls 
              autoPlay 
              muted 
              loop 
              className="project-video"
            />
          ) : (
            <img 
              src={project.image} 
              alt={project.title} 
              className="project-img" 
              loading="lazy" 
            />
          )}
        </div>

        <div className="project-content">
          <h3>{project.title}</h3>
          <p>{project.description}</p>
        
          <div className="project-tech-stack">
            {project.technologies.map((tech, index) => (
              <span key={index} className="tech-tag">{tech}</span>
            ))}
          </div>

          <div className="project-links">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-github"
              onClick={() => window.open(project.github, "_blank")}
            >
              <i className="fab fa-github"></i> Code
            </motion.button>
          
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-demo"
              onClick={() => window.open(project.demo, "_blank")}
            >
              <i className="fas fa-external-link-alt"></i> Demo
            </motion.button>
          </div>
        </div>
      </motion.div>
    );

    return (
      <section id="projects">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="projects-header"
        >
          <h2>Featured Projects</h2>
          <p>Discover my latest work</p>
        </motion.div>
{/* 
        <div className="category-filters">
          {projectCategories.map(category => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </motion.button>
          ))}
        </div> */}

        <motion.div 
          layout 
          className="projects-grid"
        >
          <AnimatePresence>
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
    );
  }

  export default Projects;
