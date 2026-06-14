import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/Layout";
import { X, Maximize2, ExternalLink } from "lucide-react";
import { experimentsList, Experiment } from "@/lib/experiments";
import { audioEngine } from "@/lib/audio";
import { gsap } from "gsap";
import { AnimatePresence, motion } from "framer-motion";

interface CardProps {
  experiment: Experiment;
  onOpen: () => void;
}

function ExperimentCard({ experiment, onOpen }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const onMouseEnter = () => {
      if (audioEngine.isEnabled()) {
        audioEngine.playSound("click");
      }
      
      // Animate card lift up (no shadows)
      gsap.to(card, {
        y: -6,
        duration: 0.4,
        ease: "power2.out"
      });

      // Scale & blur preview image
      if (previewRef.current) {
        gsap.to(previewRef.current, {
          scale: 1.05,
          filter: "blur(6px)",
          opacity: 0.6,
          duration: 0.4,
          ease: "power2.out"
        });
      }

      // Show overlay
      if (overlayRef.current) {
        gsap.to(overlayRef.current, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      }

      // Pop "Open" button
      if (btnRef.current) {
        gsap.fromTo(btnRef.current, 
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: "elastic.out(1, 0.75)" }
        );
      }
    };

    const onMouseLeave = () => {
      // Revert card positioning
      gsap.to(card, {
        y: 0,
        duration: 0.4,
        ease: "power2.out"
      });

      // Revert preview image
      if (previewRef.current) {
        gsap.to(previewRef.current, {
          scale: 1,
          filter: "blur(0px)",
          opacity: 1,
          duration: 0.4,
          ease: "power2.out"
        });
      }

      // Hide overlay
      if (overlayRef.current) {
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    };

    card.addEventListener("mouseenter", onMouseEnter);
    card.addEventListener("mouseleave", onMouseLeave);

    return () => {
      card.removeEventListener("mouseenter", onMouseEnter);
      card.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={onOpen}
      className="experiment-card cursor-pointer group flex flex-col justify-between bg-[#f1f1f3] dark:bg-[#1c1c1e] border border-border/40 rounded-3xl p-5 overflow-hidden transition-all duration-300 min-h-[360px] relative"
    >
      {/* Main Preview */}
      <div className="flex-1 flex items-center justify-center relative rounded-2xl bg-background border border-border/30 overflow-hidden mb-4 p-4 min-h-[200px]">
        {/* Preview Content */}
        <div ref={previewRef} className="w-full h-full flex items-center justify-center transition-all duration-300">
          {experiment.id === "02_interactive_pricing_slider" ? (
            // Custom decorative SVG design for the pricing slider experiment
            <svg viewBox="0 0 200 120" className="w-4/5 h-auto text-foreground/50 opacity-75">
              {/* Pricing card mockup */}
              <rect x="50" y="15" width="100" height="42" rx="4" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 2" opacity="0.4" />
              {/* Corner Marks */}
              <line x1="48" y1="15" x2="54" y2="15" stroke="currentColor" strokeWidth="1" opacity="0.4" />
              <line x1="50" y1="13" x2="50" y2="19" stroke="currentColor" strokeWidth="1" opacity="0.4" />
              <line x1="146" y1="15" x2="152" y2="15" stroke="currentColor" strokeWidth="1" opacity="0.4" />
              <line x1="150" y1="13" x2="150" y2="19" stroke="currentColor" strokeWidth="1" opacity="0.4" />
              <line x1="48" y1="57" x2="54" y2="57" stroke="currentColor" strokeWidth="1" opacity="0.4" />
              <line x1="50" y1="53" x2="50" y2="59" stroke="currentColor" strokeWidth="1" opacity="0.4" />
              <line x1="146" y1="57" x2="152" y2="57" stroke="currentColor" strokeWidth="1" opacity="0.4" />
              <line x1="150" y1="53" x2="150" y2="59" stroke="currentColor" strokeWidth="1" opacity="0.4" />

              {/* Price display text */}
              <text x="100" y="44" textAnchor="middle" fontFamily="sans-serif" fontSize="22" fontWeight="300" fill="currentColor" letterSpacing="-0.5">$69.99</text>
              
              {/* Slider Track line */}
              <line x1="30" y1="85" x2="170" y2="85" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
              
              {/* Ticks */}
              <line x1="30" y1="82" x2="30" y2="88" stroke="currentColor" strokeWidth="1" opacity="0.3" />
              <line x1="65" y1="83" x2="65" y2="87" stroke="currentColor" strokeWidth="1" opacity="0.3" />
              <line x1="100" y1="82" x2="100" y2="88" stroke="currentColor" strokeWidth="1" opacity="0.3" />
              <line x1="135" y1="83" x2="135" y2="87" stroke="currentColor" strokeWidth="1" opacity="0.3" />
              <line x1="170" y1="82" x2="170" y2="88" stroke="currentColor" strokeWidth="1" opacity="0.3" />
              
              {/* Floating Bubble */}
              <rect x="80" y="66" width="40" height="12" rx="6" fill="currentColor" opacity="0.08" />
              <rect x="80" y="66" width="40" height="12" rx="6" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
              <text x="100" y="74" textAnchor="middle" fontFamily="sans-serif" fontSize="6.5" fontWeight="600" fill="currentColor" opacity="0.7">7,000</text>

              {/* Slider Handle */}
              <circle cx="100" cy="85" r="4" fill="white" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          ) : experiment.id === "03_card_slider" ? (
            // Custom decorative SVG design for the 3D card slider deck experiment
            <svg viewBox="0 0 200 120" className="w-4/5 h-auto text-foreground/50 opacity-75">
              {/* Perspective deck stack */}
              {/* Back Card (small, rotated) */}
              <rect x="80" y="14" width="40" height="56" rx="5" fill="none" stroke="currentColor" strokeWidth="0.8" transform="rotate(-8 100 42)" opacity="0.15" />
              
              {/* Middle Card (rotated opposite) */}
              <rect x="78" y="18" width="44" height="62" rx="6" fill="none" stroke="currentColor" strokeWidth="1" transform="rotate(5 100 49)" opacity="0.3" />
              
              {/* Front Card (Active Focus) */}
              <g transform="translate(0, 4)">
                <rect x="75" y="20" width="50" height="70" rx="7" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.8" />
                {/* Album cover mockup box inside card */}
                <rect x="80" y="25" width="40" height="35" rx="3" fill="currentColor" opacity="0.06" />
                <rect x="80" y="25" width="40" height="35" rx="3" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
                {/* Text lines simulating song title */}
                <line x1="85" y1="67" x2="115" y2="67" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
                <line x1="85" y1="72" x2="105" y2="72" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
                <line x1="85" y1="77" x2="110" y2="77" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
                {/* Play triangle inside album cover */}
                <polygon points="97,38 103,42 97,46" fill="currentColor" opacity="0.5" />
              </g>
            </svg>
          ) : (
            // Image Preview
            <img
              src={experiment.image}
              alt={experiment.title}
              className="object-cover max-h-[160px] max-w-full rounded-lg"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          )}
        </div>

        {/* Hover Overlay */}
        <div 
          ref={overlayRef} 
          className="absolute inset-0 bg-background/20 backdrop-blur-[2px] opacity-0 flex items-center justify-center transition-opacity duration-300"
        >
          <button
            ref={btnRef}
            className="px-6 py-2.5 bg-foreground text-background font-medium text-xs rounded-full flex items-center gap-1.5 opacity-0 transition-all"
          >
            <span>Open</span>
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Title & Static Description */}
      <div className="z-10 mt-auto">
        <h3 className="text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary mb-1.5 text-lowercase">
          {experiment.title}
        </h3>
        
        <p className="text-[11px] text-muted-foreground leading-normal lowercase">
          {experiment.description}
        </p>
      </div>
    </div>
  );
}

export default function Experiments() {
  const [activeExperiment, setActiveExperiment] = useState<Experiment | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Stagger entry animation on mount
  useEffect(() => {
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current.querySelectorAll(".experiment-card"),
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" }
      );
    }
  }, []);

  const handleOpenExperiment = (exp: Experiment) => {
    setActiveExperiment(exp);
    if (audioEngine.isEnabled()) {
      audioEngine.playSound("success");
    }
  };

  const handleCloseExperiment = () => {
    setActiveExperiment(null);
    if (audioEngine.isEnabled()) {
      audioEngine.playSound("click");
    }
  };

  return (
    <Layout maxWidth="max-w-5xl">
      <div className="animate-fade-in w-full mx-auto">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-2xl font-semibold tracking-tight mb-8 text-foreground lowercase">
            experiments
          </h1>
        </header>

        {/* Projects Grid */}
        <section 
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20"
        >
          {experimentsList.map((exp) => (
            <ExperimentCard
              key={exp.id}
              experiment={exp}
              onOpen={() => handleOpenExperiment(exp)}
            />
          ))}
        </section>
      </div>

      {/* Interactive Fullscreen Iframe Modal */}
      <AnimatePresence>
        {activeExperiment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/60 backdrop-blur-md flex flex-col p-4 sm:p-6 md:p-8"
          >
            {/* Cohesive Window Container (No Shadow) */}
            <motion.div 
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 100, damping: 20 }}
              className="flex-1 flex flex-col bg-background border border-border/40 rounded-3xl overflow-hidden relative"
            >
              {/* Header (Top-left & Top-right rounded only, distinct color background) */}
              <div className="flex justify-between items-center bg-[#f1f1f3] dark:bg-[#1c1c1e] border-b border-border/60 px-5 py-3 select-none">
                <div className="flex items-center gap-3">
                  <h2 className="text-xs sm:text-sm font-semibold text-foreground text-lowercase">
                    {activeExperiment.title}
                  </h2>
                </div>
                
                <div className="flex items-center gap-2">
                  <a 
                    href={activeExperiment.path} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1.5 hover:bg-muted/60 dark:hover:bg-muted/20 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                    title="Open in new window"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <button
                    onClick={handleCloseExperiment}
                    className="p-1.5 hover:bg-muted/60 dark:hover:bg-muted/20 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                    title="Close preview"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Iframe View (Bottom-left & Bottom-right rounded only) */}
              <div className="flex-1 w-full h-full relative">
                <iframe
                  src={activeExperiment.path}
                  title={activeExperiment.title}
                  className="w-full h-full border-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  sandbox="allow-scripts allow-same-origin allow-popups"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
