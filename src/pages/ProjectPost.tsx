import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { getProjectBySlug } from "@/lib/projects";
import { Layout } from "@/components/Layout";
import { TableOfContents } from "@/components/TableOfContents";
import { VideoCover } from "@/components/VideoCover";

const ProjectPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProjectBySlug(slug) : null;

  if (!project) {
    return (
      <Layout>
        <div className="animate-fade-in">
          <h1 className="text-2xl font-semibold text-foreground mb-4">Project not found</h1>
          <Link
            to="/projects"
            className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to projects
          </Link>
        </div>
      </Layout>
    );
  }

  const headingRenderer = {
    h1: ({ children, ...props }: any) => {
      const text = String(children);
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      return <h1 id={id} {...props}>{children}</h1>;
    },
    h2: ({ children, ...props }: any) => {
      const text = String(children);
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      return <h2 id={id} {...props}>{children}</h2>;
    },
    h3: ({ children, ...props }: any) => {
      const text = String(children);
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      return <h3 id={id} {...props}>{children}</h3>;
    },
  };

  return (
    <Layout maxWidth="max-w-5xl">
      <article className="animate-fade-in">

        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-[15px] text-muted-foreground hover:text-foreground transition-colors mb-12 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to projects
        </Link>

        {/* Header */}
        <header className="mb-16">
          <h1 className="text-[32px] font-semibold tracking-tight mb-6 text-foreground capitalize leading-[40px]">
            {project.title}
            {project.link && (
              <span className="font-normal text-muted-foreground text-[24px] ml-3 normal-case">
                (
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-primary transition-colors"
                >
                  {project.link}
                </a>
                )
              </span>
            )}
          </h1>
          <p className="text-[15px] text-muted-foreground leading-[24px] max-w-3xl">
            {project.description}
          </p>
        </header>

        <div className="relative">
          {/* Table of Contents for Desktop */}
          <aside className="hidden xl:flex fixed right-8 top-1/2 -translate-y-1/2 w-52 z-10">
            <TableOfContents content={project.content} />
          </aside>

          {/* Hero Video Cover */}
          {project.image && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mb-12 rounded-lg overflow-hidden shadow-sm"
            >
              <VideoCover 
                thumbnail={project.videoThumbnail || project.image} 
                videoUrl={project.videoUrl || undefined}
              />
            </motion.div>
          )}

          {/* Markdown Content */}
          <motion.div
            className="prose prose-sm max-w-3xl prose-p:text-muted-foreground prose-p:text-[15px] prose-p:leading-[24px] prose-p:mb-8 prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-foreground prose-headings:mt-16 prose-headings:mb-6 prose-headings:text-[24px] prose-headings:leading-[32px] prose-li:text-muted-foreground prose-li:mb-3 prose-li:text-[15px] prose-img:rounded-lg prose-img:my-10 prose-strong:text-foreground/80 prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.2
            }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={headingRenderer}
            >
              {project.content}
            </ReactMarkdown>
          </motion.div>
        </div>

        {/* Tags Footer */}
        {project.tags && project.tags.length > 0 && (
          <footer className="mt-16 pt-8 border-t border-border">
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 text-xs text-muted-foreground bg-secondary rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          </footer>
        )}
      </article>
    </Layout>
  );
};

export default ProjectPost;
