import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { getPostBySlug } from "@/lib/posts";
import { Layout } from "@/components/Layout";
import { TableOfContents } from "@/components/TableOfContents";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : null;

  if (!post) {
    return (
      <Layout>
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Link
            to="/"
            className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
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

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  const markdownComponents = {
    img: ({ src, alt }: { src?: string; alt?: string }) => {
      if (!src) return null;
      return (
        <figure className="my-8">
          <img
            src={src}
            alt={alt || ''}
            className="w-full max-w-3xl mx-auto rounded-xl shadow-lg"
          />
          {alt && alt !== src && (
            <figcaption className="text-center text-sm text-muted-foreground mt-3">
              {alt}
            </figcaption>
          )}
        </figure>
      );
    },
    a: ({ href, children, ...props }: any) => {
      if (!href) return <a {...props}>{children}</a>;
      const videoId = getYouTubeVideoId(href);
      if (videoId) {
        return (
          <div className="my-8 relative rounded-xl overflow-hidden shadow-lg aspect-video bg-secondary/20">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video"
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline decoration-dotted underline-offset-2 hover:decoration-solid transition-all"
          {...props}
        >
          {children}
        </a>
      );
    },
  };

  return (
    <Layout>
      <article className="animate-fade-in">

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back
        </Link>

        {/* Header */}
        <header className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
            <time>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span className="text-border">•</span>
            <span>{post.readingTime}</span>
          </div>
        </header>


        <div className="relative">
          <aside className="hidden xl:flex fixed right-8 top-1/2 -translate-y-1/2 w-52 z-10">
            <TableOfContents content={post.content} />
          </aside>


          <motion.div
            className="prose prose-lg prose-p:text-lg max-w-none"
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
              components={{ ...headingRenderer, ...markdownComponents }}
            >
              {post.content}
            </ReactMarkdown>
          </motion.div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <footer className="mt-12 pt-6 border-t border-border">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-medium bg-secondary text-muted-foreground rounded-full"
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

export default BlogPost;
