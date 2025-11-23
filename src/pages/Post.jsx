import React from 'react';
import Header from '../components/Header';
import { useParams } from 'react-router-dom';
import POSTS from '../posts/postsIndex';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Post(){
  const {slug} = useParams();
  const post = POSTS.find(p=>p.slug===slug);
  if(!post) return (
    <div><Header /><div className="container card">Post not found</div></div>
  );
  const content = require(`../posts/${post.file}`).default;
  return (
    <div>
      <Header />
      <div className="container">
        <h1>{post.title}</h1>
        <div style={{color:'var(--muted)'}}>{post.date} · {post.tags?.join(', ')}</div>
        <div className="card post-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}