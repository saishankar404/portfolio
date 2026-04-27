import { useRef, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from "gsap";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { getAllPosts } from "@/lib/posts";
import { getAllProjects } from "@/lib/projects";
import { Layout } from "@/components/Layout";
import { BlogPostList } from "@/components/BlogPostList";
import { Volume2, VolumeX } from "lucide-react";
import { audioEngine } from "@/lib/audio";

gsap.registerPlugin(InertiaPlugin);

const Index = () => {
  const posts = getAllPosts();
  const allProjects = getAllProjects();
  const orderedSlugs = ["kumo", "geksu", "align", "dhar", "kalakoi", "root"];
  const projects = [
    ...allProjects.filter(p => orderedSlugs.includes(p.slug)).sort((a, b) => orderedSlugs.indexOf(a.slug) - orderedSlugs.indexOf(b.slug)),
    ...allProjects.filter(p => !orderedSlugs.includes(p.slug))
  ].slice(0, 3);

  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    audioEngine.setEnabled(true);
  }, []);

  const toggleSound = useCallback(() => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    audioEngine.setEnabled(newState);
    if (newState) {
      audioEngine.playSound("click");
    }
  }, [soundEnabled]);

  const oldX = useRef(0);
  const oldY = useRef(0);
  const deltaX = useRef(0);
  const deltaY = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      deltaX.current = e.clientX - oldX.current;
      deltaY.current = e.clientY - oldY.current;
      oldX.current = e.clientX;
      oldY.current = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const cards = document.querySelectorAll(".project-card");
    
    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        const tl = gsap.timeline({
          onComplete: () => tl.kill()
        });
        
        tl.to(card, {
          inertia: {
            x: {
              velocity: deltaX.current * 20,
              end: 0
            },
            y: {
              velocity: deltaY.current * 20,
              end: 0
            }
          },
          duration: 0.6,
          ease: "power2.out"
        });
      });
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        {/* Personal Intro */}
        <header className="mb-12 flex items-start justify-between">
          <motion.h1
            className="text-2xl font-semibold tracking-tight mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
          >
            hello! i'm sai
          </motion.h1>
          <motion.button
            onClick={toggleSound}
            className="text-muted-foreground hover:text-foreground transition-colors p-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.15 }}
            aria-label={soundEnabled ? "Mute sounds" : "Enable sounds"}
          >
            {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </motion.button>
        </header>

        <motion.div
          className="space-y-4 text-base text-foreground leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.2 }}
        >
          <p>
            i study computer science and spend a lot of my time designing and building things on the web.
          </p>

          <p>
            i've worked on multiple design and web{" "}
            <Link to="/projects" className="text-primary underline decoration-dotted underline-offset-2 hover:decoration-solid">
              experiments
            </Link>, explored branding and ui systems, and shipped things at blazing speed without compromising on quality, while actively trying to understand the fundamentals deeply.
          </p>

          <p>
            i enjoy clean interfaces, strong visual systems, and turning vague ideas into real, usable products. outside of work, i like traveling and thinking about how not to be bored and how to make life fun.
          </p>

          <p>
            i write occasionally. this site is mainly a space to document my thoughts, projects, and experiments, and also a place to know me a bit better. feel free to dm me{" "}
            <a
              href="https://x.com/saishankar404"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline decoration-dotted underline-offset-2 hover:decoration-solid"
            >
              on X
            </a>.
          </p>
        </motion.div>

        <motion.div
          className="border-t border-border my-8"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.3, delay: 0.3, ease: "easeOut" }}
          style={{ originX: 0 }}
        />

        {/* Projects Section */}
        <motion.header
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.32 }}
        >
          <Link 
            to="/projects" 
            className="text-lg font-medium tracking-tight text-foreground underline decoration-dotted underline-offset-4 hover:decoration-solid transition-all"
            onMouseEnter={() => soundEnabled && audioEngine.playSound("click")}
          >
            projects
          </Link>
        </motion.header>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.34 }}
        >
          {projects.map((project) => {
            return project.external ? (
              <a
                key={project.slug}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="project-card group relative block p-4 rounded-xl border border-border/50 hover:border-border hover:bg-secondary/20 transition-all duration-200 active:scale-[0.98]"
              >
                <div className="aspect-[4/3] rounded-lg overflow-hidden mb-3 bg-secondary/30">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-sm font-medium tracking-tight text-foreground capitalize">{project.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{project.description}</p>
              </a>
            ) : (
              <Link
                key={project.slug}
                to={`/projects/${project.slug}`}
                className="project-card group relative block p-4 rounded-xl border border-border/50 hover:border-border hover:bg-secondary/20 transition-all duration-200 active:scale-[0.98]"
              >
                <div className="aspect-[4/3] rounded-lg overflow-hidden mb-3 bg-secondary/30">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-sm font-medium tracking-tight text-foreground capitalize">{project.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{project.description}</p>
              </Link>
            );
          })}
        </motion.div>

        {/* Writings Header */}
        <motion.header
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.35 }}
        >
          <h2 
            className="text-lg font-medium tracking-tight text-foreground underline decoration-dotted underline-offset-4 cursor-pointer"
            onMouseEnter={() => soundEnabled && audioEngine.playSound("click")}
          >
            writings
          </h2>
        </motion.header>

        {/* Blog Posts List */}
        <section>
          <BlogPostList posts={posts} />
          <p className="text-center text-xs text-muted-foreground mt-8 italic">
            more coming soon...
          </p>
        </section>
      </motion.div>
    </Layout>
  );
};

export default Index;