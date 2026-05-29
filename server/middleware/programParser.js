import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { fileURLToPath } from 'url';

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const PROGRAMS_DIR = path.join(__dirname, '../programs');

export const parseProgram = async (filename) => {
  const filepath = path.join(PROGRAMS_DIR, filename);
  const rawFile  = await fs.readFile(filepath, 'utf-8');
  const raw      = rawFile.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const { data: fm, content } = matter(raw);

  const slug = fm.slug || path.basename(filename, '.md');

  // Split content at the preview boundary
  // Preview = overview only, lock at "## What is in the program"
  const lockMarker  = '\n## What is in the program';
  const lockIndex   = content.indexOf(lockMarker);
  const previewMd   = lockIndex > -1 ? content.slice(0, lockIndex) : content;
  const lockedMd    = lockIndex > -1 ? content.slice(lockIndex) : '';

  return {
    slug,
    title:        fm.title        || 'Untitled',
    description:  fm.description  || '',
    category:     fm.category     || 'general',
    difficulty:   fm.difficulty   || 'intermediate',
    duration:     fm.duration     || 8,
    daysPerWeek:  fm.daysPerWeek  || 4,
    equipment:    fm.equipment    || [],
    goal:         fm.goal         || '',
    price:        fm.price        || 0,
    gumroadUrl:   fm.gumroadUrl   || '',
    publishedAt:  fm.publishedAt  || null,
    featured:     fm.featured     || false,
    previewWeeks: fm.previewWeeks || 1,
    highlights:   fm.highlights   || [],
    previewHtml:  marked(previewMd),
    lockedHtml:   marked(lockedMd),
    hasLockedContent: lockedMd.length > 0,
  };
};

export const getAllPrograms = async () => {
  const files = await fs.readdir(PROGRAMS_DIR);
  const mdFiles = files.filter(f => f.endsWith('.md'));
  const programs = await Promise.all(mdFiles.map(parseProgram));
  return programs.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
};

export const getProgramBySlug = async (slug) => {
  const all = await getAllPrograms();
  return all.find(p => p.slug === slug) || null;
};
