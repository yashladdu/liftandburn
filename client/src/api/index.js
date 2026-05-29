const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const get = async (path) => {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json();
};

export const api = {
  articles:  {
    list:     (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return get(`/articles${q ? `?${q}` : ''}`);
    },
    featured: ()           => get('/articles/featured'),
    bySlug:   (slug)       => get(`/articles/${slug}`),
    related:  (slug)       => get(`/articles/${slug}/related`),
  },
  categories: {
    list:     ()           => get('/categories'),
    byName:   (name)       => get(`/categories/${name}`),
  },
  search:     (q)          => get(`/search?q=${encodeURIComponent(q)}`),
  programs: {
    list:     ()           => get('/programs'),
    featured: ()           => get('/programs/featured'),
    bySlug:   (slug)       => get(`/programs/${slug}`),
  },
};
