import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

// Simple posts loader: read from /posts directory at build-time by importing index manually.
// For simplicity here we provide a static list; when you add posts, update postsIndex.js
import POSTS from '../posts/postsIndex';

export default function Blog(){
  return (
    <div>
      <Header />
      <div className="container">
        <h1>Blog</h1>
        <ul className="blog-list">
          {POSTS.map((p,i)=>(
            <li key={i}><Link className="link" to={`/post/${p.slug}`}>{p.title}</Link> · <span style={{color:'var(--muted)'}}>{p.date} · {p.tags?.join(', ')}</span></li>
          ))}
        </ul>
      </div>
    </div>
  );
}