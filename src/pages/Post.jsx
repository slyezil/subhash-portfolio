import { Link, useParams } from 'react-router-dom';
import POSTS from '../posts/postsIndex';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

export default function Post() {
  const { slug } = useParams();
  const post = POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="notfound container">
        <h1 className="glitch nf-code mono" data-text="404">404</h1>
        <p className="nf-msg mono">// ENTRY_NOT_FOUND — this log does not exist.</p>
        <Link className="btn btn-primary" to="/blog">Back to Writing.Log</Link>
      </div>
    );
  }

  const content = post.content || 'Content not available. Please restart the server to regenerate posts.';

  return (
    <article className="container blog-layout">
      <Link className="back-link mono animate-in" to="/blog">
        <span aria-hidden="true">←</span> cd ~/blog
      </Link>

      <header className="post-header animate-in">
        <h1 className="post-title">{post.title}</h1>
        <div className="blog-meta mono center">
          <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span className="meta-dot" aria-hidden="true">·</span>
          <span>{post.readTime || 'Read'}</span>
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map((t) => (
              <span key={t} className="tag mag">#{t}</span>
            ))}
          </div>
        )}
      </header>

      <div className="post-content animate-in" style={{ animationDelay: '90ms' }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
          {content}
        </ReactMarkdown>
      </div>

      <footer className="post-footer mono animate-in">
        <span>// FIN.</span>
        <Link className="proj-link mono" to="/blog">More entries →</Link>
      </footer>
    </article>
  );
}
