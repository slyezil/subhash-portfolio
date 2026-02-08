import React from 'react';
import Header from '../components/Header';
import { useParams } from 'react-router-dom';
import POSTS from '../posts/postsIndex';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Post() {
  const { slug } = useParams();
  const post = POSTS.find(p => p.slug === slug);

  // Handlers for not found
  if (!post) return (
    <div><Header /><div className="container" style={{ paddingTop: '100px', textAlign: 'center' }}><h2>Post not found</h2><p>The article you are looking for does not exist.</p></div></div>
  );

  const content = post.content || "Content not available. Please restart the server to regenerate posts.";

  return (
    <div>
      <Header />
      <article className="container blog-layout">
        <div className="post-header animate-in">
          <h1 className="post-title">{post.title}</h1>
          <div className="blog-meta" style={{ justifyContent: 'center', marginBottom: '16px' }}>
            <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>·</span>
            <span>{post.readTime || 'Read'}</span>
          </div>
          {post.tags && (
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', opacity: 0.8 }}>
              {post.tags.map(t => <span key={t} style={{ fontSize: '0.85rem', color: 'var(--accent)' }}>#{t}</span>)}
            </div>
          )}
        </div>

        <div className="post-content animate-in" style={{ animationDelay: '100ms' }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>

        <div style={{ marginTop: '80px', paddingTop: '40px', borderTop: '1px solid var(--card-border)', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>Thanks for reading.</p>
        </div>
      </article>
    </div>
  );
}