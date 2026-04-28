import { Layout } from "@/components/Layout";
import { useState } from "react";
import { audioEngine } from "@/lib/audio";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { getAllProjects } from "@/lib/projects";

const filters = ["design", "product", "experiential"];

const Projects = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const allProjects = getAllProjects();
  const orderedSlugs = ["kumo", "align", "geksu", "dhar", "kalakoi", "root"];
  const projects = [
    ...allProjects.filter(p => orderedSlugs.includes(p.slug)).sort((a, b) => orderedSlugs.indexOf(a.slug) - orderedSlugs.indexOf(b.slug)),
    ...allProjects.filter(p => !orderedSlugs.includes(p.slug))
  ];

  return (
    <Layout maxWidth="max-w-5xl">
      <div className="animate-fade-in w-full mx-auto">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-2xl font-semibold tracking-tight mb-8 text-foreground">
            experiments
          </h1>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button 
                key={filter}
                className="px-4 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              >
                {filter}
              </button>
            ))}
          </div>
        </header>

        {/* Projects Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16 pb-20">
          {projects.map((project, index) => (
            project.external ? (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                key={project.slug}
                
                className="relative p-3 -m-3 rounded-2xl group cursor-pointer block"
                onMouseEnter={() => {
                  setHoveredIndex(index);
                  audioEngine.isEnabled() && audioEngine.playSound("click");
                }}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <AnimatePresence>
                  {hoveredIndex === index && (
                    <motion.div
                      layoutId="project-hover"
                      className="absolute inset-0 bg-secondary/80 rounded-2xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 35,
                        opacity: { duration: 0.15 }
                      }}
                    />
                  )}
                </AnimatePresence>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-5 bg-secondary/20 relative overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]" 
                    />
                    {/* Minimal overlay */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center bg-black/30">
                      <span className="text-white text-sm font-medium tracking-widest uppercase">View →</span>
                    </div>
                  </div>
                  <div className="px-1 pb-1">
                    <h3 className="text-base font-medium tracking-tight text-foreground mb-3 capitalize">{project.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tags?.map(tag => (
                        <span 
                          key={tag}
                          className="text-xs text-muted-foreground bg-secondary/50 px-2.5 py-1 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </a>
            ) : (
              <Link 
                to={`/projects/${project.slug}`}
                key={project.slug}
                className="relative p-3 -m-3 rounded-2xl group cursor-pointer block"
                onMouseEnter={() => {
                  setHoveredIndex(index);
                  audioEngine.isEnabled() && audioEngine.playSound("click");
                }}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <AnimatePresence>
                  {hoveredIndex === index && (
                    <motion.div
                      layoutId="project-hover"
                      className="absolute inset-0 bg-secondary/80 rounded-2xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 35,
                        opacity: { duration: 0.15 }
                      }}
                    />
                  )}
                </AnimatePresence>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-5 bg-secondary/20">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]" 
                    />
                  </div>
                  <div className="px-1 pb-1">
                    <h3 className="text-base font-medium tracking-tight text-foreground mb-3 capitalize">{project.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tags?.map(tag => (
                        <span 
                          key={tag}
                          className="text-xs text-muted-foreground bg-secondary/50 px-2.5 py-1 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            )
          ))}
        </section>
      </div>
    </Layout>
  );
};

export default Projects;