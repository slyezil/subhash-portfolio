import React, { useEffect, useState } from 'react';
import FuturisticHero from '../components/FuturisticHero';
import SpinningPyramids from '../components/SpinningPyramids';
import FloatingNodes from '../components/FloatingNodes';
import Header from '../components/Header';
import ProjectCard from '../components/ProjectCard';
import { SITE } from '../data/siteConfig';

const PROJECTS = [
  { title: 'Project One', desc: 'A sophisticated dashboard built with React and D3.js.', link: '#' },
  { title: 'Project Two', desc: 'Secure and scalable API backend using Spring Boot.', link: '#' },
  { title: 'Project Three', desc: 'Interactive 3D visualization platform.', link: '#' }
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
        <section className="animate-in" style={{ marginTop: '40px' }}>
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            <FuturisticHero />
          </div>
          <div className="glass-card">
            <h1 style={{ fontSize: '3.5rem', marginBottom: '16px' }}>{SITE.name}</h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              {SITE.title} — {SITE.bio}
            </p>
            <div style={{ marginTop: '24px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {SITE.skills.map((skill, i) => (
                <span key={i} style={{
                  background: 'var(--bg-subtle)',
                  padding: '6px 16px',
                  borderRadius: '99px',
                  border: '1px solid var(--card-border)',
                  fontSize: '0.9rem'
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 3D Interlude 1: Floating Nodes */}
        <section className="animate-in" style={{ animationDelay: '0.2s' }}>
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            <FloatingNodes height={400} />
          </div>
        </section>

        {/* Codeforces / Stats */}
        <section className="animate-in" style={{ animationDelay: '0.3s' }}>
          <h2 className="section-title">Performance</h2>
          <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
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
            <div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Contributions</div>
              <div style={{ fontSize: '3rem', fontWeight: 800 }}>500+</div>
            </div>
          </div>
        </section>



        {/* Projects */}
        <section className="animate-in" style={{ animationDelay: '0.5s' }}>
          <h2 className="section-title">Selected Works</h2>
          <div className="projects-grid">
            {PROJECTS.map((p, i) => (
              <div key={i} className="glass-card" style={{ margin: 0 }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>{p.title}</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '20px', lineHeight: '1.5' }}>{p.desc}</p>
                <a className="link" href={p.link}>Case Study →</a>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
