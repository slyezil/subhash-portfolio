import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

// Simple posts loader: read from /posts directory at build-time by importing index manually.
// For simplicity here we provide a static list; when you add posts, update postsIndex.js
import POSTS from '../posts/postsIndex';

export default function Blog() {
  return (
    <div>
      <Header />
      <div className="container blog-layout">
        <h1 className="section-title" style={{ marginBottom: '40px' }}>Writing</h1>
        <div className="blog-list">
          {POSTS.map((p, i) => (
            <div key={i} className="blog-item animate-in" style={{ animationDelay: `${i * 100}ms` }}>
              <Link to={`/post/${p.slug}`} className="blog-title">
                {p.title}
              </Link>
              <div className="blog-desc">
                {p.description || "Click to read more..."}
              </div>
              <div className="blog-meta">
                <span>{new Date(p.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                <span>·</span>
                <span>{p.readTime || 'Read'}</span>
                {p.tags && p.tags.length > 0 && (
                  <span className="blog-tag">#{p.tags[0]}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}