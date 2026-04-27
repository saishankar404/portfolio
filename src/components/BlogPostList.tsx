import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlogPostItem } from "./BlogPostItem";

interface PostData {
  slug: string;
  title: string;
  date: string;
  readingTime: string;
  wordCount: number;
}

interface BlogPostListProps {
  posts: PostData[];
}

export function BlogPostList({ posts }: BlogPostListProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const handleMouseEnter = useCallback((index: number) => {
    setHoveredIndex(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  // Calculate the position of the hovered item
  const getHoverStyles = () => {
    if (hoveredIndex === null || !itemRefs.current[hoveredIndex] || !containerRef.current) {
      return { opacity: 0, top: 0, height: 0 };
    }
    
    const item = itemRefs.current[hoveredIndex];
    const container = containerRef.current;
    const itemRect = item.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    return {
      opacity: 1,
      top: itemRect.top - containerRect.top,
      height: itemRect.height,
    };
  };

  const hoverStyles = getHoverStyles();

  return (
    <ul ref={containerRef} className="space-y-1 relative">
      {/* Shared animated background */}
      <AnimatePresence>
        {hoveredIndex !== null && (
          <motion.div
            className="absolute rounded-[14px] pointer-events-none bg-black/[0.02] dark:bg-secondary/40 shadow-[0_1px_4px_-1px_rgba(0,0,0,0.04),0_2px_8px_-2px_rgba(0,0,0,0.03)]"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: hoverStyles.opacity,
              top: hoverStyles.top,
              height: hoverStyles.height,
            }}
            exit={{ opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 35,
            }}
            style={{ 
              left: "-0.75rem", 
              right: "-0.75rem",
            }}
          />
        )}
      </AnimatePresence>

      {posts.map((post, index) => (
        <BlogPostItem
          key={post.slug}
          ref={(el) => { itemRefs.current[index] = el; }}
          slug={post.slug}
          title={post.title}
          date={post.date}
          readingTime={post.readingTime}
          wordCount={post.wordCount}
          index={index}
          isHovered={hoveredIndex === index}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        />
      ))}
    </ul>
  );
}
