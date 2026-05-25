import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from '../api';
import { useFetch } from '../hooks/useFetch';
import ArticleCard from '../components/ArticleCard';
import './ListPage.css';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';

  const { data, loading } = useFetch(
    () => (q ? api.search(q) : Promise.resolve(null)),
    [q]
  );

  return (
    <>
      <Helmet>
        <title>{q ? `"${q}" — Search` : 'Search'} — LiftAndBurn</title>
        <link rel="canonical" href="https://liftandburn.fit/" />
      </Helmet>

      <div className="list-page container">
        <header className="list-header fade-up">
          <span className="list-header__eyebrow">Search results</span>
          <h1 className="list-header__title">"{q}"</h1>
          {data && (
            <p className="list-header__sub">{data.total} result{data.total !== 1 ? 's' : ''} found</p>
          )}
        </header>

        {loading && (
          <div className="skeleton-list">
            {[1,2,3].map((i) => <div key={i} className="skeleton-card" />)}
          </div>
        )}

        {!loading && data?.results?.length === 0 && (
          <p className="list-empty">No articles match "{q}". Try a different search.</p>
        )}

        {!loading && data?.results?.length > 0 && (
          <div className="article-list">
            {data.results.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
