export interface ProjectMeta {
  slug: string;
  title: string;
  description: string;
  image: string;
  videoUrl?: string;
  videoThumbnail?: string;
  tags?: string[];
  link?: string;
  role?: string;
  external?: boolean;
}

export interface Project extends ProjectMeta {
  content: string;
}

// Import all markdown files from content/projects
const projectModules = import.meta.glob('/src/content/projects/*.md', { 
  query: '?raw',
  import: 'default',
  eager: true 
});

function parseFrontmatter(content: string): { meta: Record<string, string>; body: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { meta: {}, body: content };
  }

  const frontmatter = match[1];
  const body = match[2];
  
  const meta: Record<string, string> = {};
  frontmatter.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      meta[key] = value;
    }
  });

  return { meta, body };
}

function getSlugFromPath(path: string): string {
  const filename = path.split('/').pop() || '';
  return filename.replace('.md', '');
}

export function getAllProjects(): ProjectMeta[] {
  const projects: ProjectMeta[] = [];

  for (const [path, content] of Object.entries(projectModules)) {
    const { meta } = parseFrontmatter(content as string);
    const slug = getSlugFromPath(path);
    
    projects.push({
      slug,
      title: meta.title || slug,
      description: meta.description || '',
      image: meta.image || '',
      videoUrl: meta.videoUrl || '',
      videoThumbnail: meta.videoThumbnail || '',
      link: meta.link || '',
      role: meta.role || '',
      tags: meta.tags ? meta.tags.split(',').map(t => t.trim()) : [],
      external: meta.external === 'true',
    });
  }

  return projects;
}

export function getProjectBySlug(slug: string): Project | null {
  const path = `/src/content/projects/${slug}.md`;
  const content = projectModules[path] as string | undefined;
  
  if (!content) {
    return null;
  }

  const { meta, body } = parseFrontmatter(content);

  return {
    slug,
    title: meta.title || slug,
    description: meta.description || '',
    image: meta.image || '',
    videoUrl: meta.videoUrl || '',
    videoThumbnail: meta.videoThumbnail || '',
    link: meta.link || '',
    role: meta.role || '',
    tags: meta.tags ? meta.tags.split(',').map(t => t.trim()) : [],
    external: meta.external === 'true',
    content: body,
  };
}
