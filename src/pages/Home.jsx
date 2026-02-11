import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FuturisticHero from '../components/FuturisticHero';
import SpinningPyramids from '../components/SpinningPyramids';
import FloatingNodes from '../components/FloatingNodes';
import Header from '../components/Header';
import ProjectCard from '../components/ProjectCard';
import { SITE } from '../data/siteConfig';

const PROJECTS = [
  { title: 'AgentFlow', desc: 'A sophisticated Java memory layer enabling stateful conversations with local LLMs.', link: '/post/building-agentflow', tags: ['Java', 'AI'] },
  { title: 'SyncSpace', desc: 'Real-time collaborative workspace using Operational Transformation and WebSockets.', link: '#', tags: ['React', 'Node.js'] },
  { title: 'VectorVault', desc: 'Custom vector indexing system for high-performance RAG implementations.', link: '#', tags: ['Python', 'Vector DB'] }
];

export default function Home() {
  const [cfRating, setCfRating] = useState(0);

  useEffect(() => {
    const target = 1683;
    const duration = 1500;
    const cycle = 5000;

    const start = Date.now();
    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      const phase = elapsed % cycle;

      if (phase <= duration) {
        const progress = phase / duration;
        setCfRating(Math.round(target * progress));
      } else {
        setCfRating(target);
      }
    }, 50);

    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ paddingBottom: '100px' }}>
      <Header />

      <main className="container">
        {/* Hero Section */}
        <section className="animate-in" style={{ marginTop: '60px' }}>
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ width: '100%', borderBottom: '1px solid var(--card-border)' }}>
              <FuturisticHero />
            </div>
            <div style={{ padding: '40px' }}>
              <h1 className="text-gradient" style={{ fontSize: '4.5rem', marginBottom: '8px', lineHeight: 1 }}>{SITE.name}</h1>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--accent)', marginBottom: '24px', fontWeight: 600 }}>{SITE.title}</h2>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: '1.7', maxWidth: '800px' }}>
                {SITE.bio}
              </p>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="animate-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="section-title">Technical Expertise</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {SITE.skillCategories.map((cat, i) => (
              <div key={i} className="glass-card" style={{ margin: 0 }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--accent)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{cat.name}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {cat.skills.map((skill, j) => (
                    <span key={j} className="badge">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3D Interlude 1: Floating Nodes */}
        <section className="animate-in" style={{ animationDelay: '0.2s' }}>
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden', background: 'radial-gradient(circle at center, var(--bg-subtle) 0%, var(--bg) 100%)' }}>
            <FloatingNodes height={450} />
          </div>
        </section>

        {/* Codeforces / Stats */}
        <section className="animate-in" style={{ animationDelay: '0.3s' }}>
          <h2 className="section-title">Competitive Programming</h2>
          <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '40px', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Codeforces Rating</div>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--accent)' }}>{cfRating}</div>
              <a className="link" href={SITE.codeforces} target="_blank" rel="noopener noreferrer" style={{ marginTop: '12px', display: 'inline-block' }}>
                View Profile →
              </a>
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Global Rank</div>
              <div style={{ fontSize: '3rem', fontWeight: 800 }}>Top 5%</div>
            </div>
          </div>
        </section>



        {/* Projects */}
        <section className="animate-in" style={{ animationDelay: '0.5s' }}>
          <h2 className="section-title">Selected Works</h2>
          <div className="projects-grid">
            {PROJECTS.map((p, i) => (
              <div key={i} className="glass-card project-card" style={{ margin: 0 }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  {p.tags.map((tag, idx) => (
                    <span key={idx} style={{ fontSize: '0.7rem', color: 'var(--text-muted)', border: '1px solid var(--card-border)', padding: '2px 8px', borderRadius: '4px' }}>{tag}</span>
                  ))}
                </div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>{p.title}</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.6', fontSize: '0.95rem' }}>{p.desc}</p>
                <div style={{ marginTop: 'auto' }}>
                  {p.link.startsWith('/') ? (
                    <Link className="link accent-link" to={p.link}>View Project Case Study →</Link>
                  ) : (
                    <a className="link accent-link" href={p.link} target={p.link !== '#' ? "_blank" : undefined} rel={p.link !== '#' ? "noopener noreferrer" : undefined}>Explore Project →</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
