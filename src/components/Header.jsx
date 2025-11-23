import React from 'react';
import { Link } from 'react-router-dom';
import { SITE } from '../data/siteConfig';
export default function Header(){
  return (
    <header className="header container">
      <div>
        <div className="name">{SITE.name}</div>
        <div style={{color:'var(--muted)'}}>{SITE.title}</div>
      </div>
      <nav className="nav">
        <Link className="link" to="/">Home</Link>
        <Link className="link" to="/blog">Blog</Link>
        <a className="link" href={SITE.github} target="_blank" rel="noreferrer">GitHub</a>
        <a className="link" href={`mailto:${SITE.email}`}>Email</a>
      </nav>
    </header>
  );
}