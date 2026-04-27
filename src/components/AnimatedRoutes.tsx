import { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

const Index = lazy(() => import("@/pages/Index"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const About = lazy(() => import("@/pages/About"));
const Projects = lazy(() => import("@/pages/Projects"));
const ProjectPost = lazy(() => import("@/pages/ProjectPost"));
const NotFound = lazy(() => import("@/pages/NotFound"));

export const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Suspense fallback={null}>
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Index />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/projects/:slug" element={<ProjectPost />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </AnimatePresence>
    );
};
