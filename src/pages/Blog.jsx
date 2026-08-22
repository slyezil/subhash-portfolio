import { Link } from 'react-router-dom';
import POSTS from '../posts/postsIndex';

export default function Blog() {
  return (
    <div className="container page-shell">
      <header className="section-head blog-head animate-in">
        <span className="mono">//LOG</span>
        <h1 className="section-title">Writing.Log</h1>
        <span className="count-chip mono">{POSTS.length} ENTRIES</span>
      </header>

      {POSTS.length === 0 ? (
        <p className="mono empty-note">// NO_ENTRIES_FOUND — check back soon.</p>
      ) : (
        <ul className="post-list">
          {POSTS.map((p, i) => (
            <li key={p.slug} className="post-row animate-in" style={{ animationDelay: `${Math.min(i, 8) * 70}ms` }}>
              <span className="row-num mono" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <div className="row-body">
                <Link className="row-title" to={`/post/${p.slug}`}>
                  {p.title}
                </Link>
                <p className="row-desc">{p.description || 'Click to read more…'}</p>
                <div className="blog-meta mono">
                  <span>{new Date(p.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  <span className="meta-dot" aria-hidden="true">·</span>
                  <span>{p.readTime || 'Read'}</span>
                  {p.tags && p.tags.map((t) => <span key={t} className="tag mag">#{t}</span>)}
                </div>
              </div>
              <span className="row-arrow mono" aria-hidden="true">→</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
