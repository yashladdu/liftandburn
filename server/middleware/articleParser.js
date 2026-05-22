import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import slugify from 'slugify';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, '../content');

// Convert a filename to a URL-friendly slug
const toSlug = (str) =>
  slugify(str, { lower: true, strict: true });

// Estimate reading time from word count
const readingTime = (text) => {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / 200); // avg 200 wpm
};

// Parse a single .md file into an article object
export const parseArticle = async (filename) => {
  const filepath = path.join(CONTENT_DIR, filename);
  const rawFile = await fs.readFile(filepath, 'utf-8');

  // Normalize Windows CRLF → LF so gray-matter parses frontmatter correctly
  const raw = rawFile.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  const { data: frontmatter, content } = matter(raw);

  const slug = frontmatter.slug || toSlug(path.basename(filename, '.md'));

  return {
    slug,
    title: frontmatter.title || 'Untitled',
    description: frontmatter.description || '',
    category: frontmatter.category || 'general',
    tags: frontmatter.tags || [],
    author: frontmatter.author || 'LiftAndBurn',
    publishedAt: frontmatter.publishedAt || null,
    updatedAt: frontmatter.updatedAt || null,
    readingTime: readingTime(content),
    featured: frontmatter.featured || false,
    content,                        // raw markdown (for search)
    html: marked(content),         // rendered HTML (for frontend)
  };
};

// Load all articles from the content directory
export const getAllArticles = async () => {
  const files = await fs.readdir(CONTENT_DIR);
  const mdFiles = files.filter((f) => f.endsWith('.md'));

  const articles = await Promise.all(mdFiles.map(parseArticle));

  // Sort by publishedAt descending (newest first)
  return articles.sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
  );
};

// Load a single article by slug
export const getArticleBySlug = async (slug) => {
  const all = await getAllArticles();
  return all.find((a) => a.slug === slug) || null;
};
