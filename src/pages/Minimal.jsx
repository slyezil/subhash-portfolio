import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { IDENTITY, RESUME, SITE } from '../data/siteConfig';
import { PROJECTS } from '../data/projects';
import ThemeToggle from '../components/ThemeToggle';

const SITE_URL = 'https://slyezil.github.io/subhash-portfolio';

function Section({ id, num, title, children }) {
  return (
    <section id={id} className="min-section" aria-labelledby={`${id}-title`}>
      <header className="min-head">
        <span className="mono min-num" aria-hidden="true">//{num}</span>
        <h2 id={`${id}-title`} className="min-h2">{title}</h2>
      </header>
      {children}
    </section>
  );
}

function ProjectLink({ project }) {
  if (!project.link || project.link === '#') return null;
  if (project.link.startsWith('/')) {
    return (
      <Link className="min-link mono" to={project.link}>
        Case study →
      </Link>
    );
  }
  return (
    <a className="min-link mono" href={project.link} target="_blank" rel="noopener noreferrer">
      Open ↗
    </a>
  );
}

export default function Minimal() {
  // Quiet mode: drop the scanline overlay while this page is mounted.
  useEffect(() => {
    document.documentElement.dataset.view = 'minimal';
    return () => {
      delete document.documentElement.dataset.view;
    };
  }, []);

  const cp = RESUME.competitive;

  return (
    <div className="min">
      <Helmet>
        <title>{`${IDENTITY.name} // Résumé`}</title>
        <meta name="description" content={RESUME.summary} />
        <link rel="canonical" href={`${SITE_URL}/minimal`} />
      </Helmet>

      <nav className="min-topbar mono no-print" aria-label="View switcher">
        <Link className="min-nav" to="/">← START</Link>
        <div className="min-topbar-right">
          <Link className="min-nav" to="/journey" title="Switch to the full interactive site">
            CONTINUE TO THE JOURNEY →
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      <header className="min-header animate-in">
        <h1 className="min-name">{IDENTITY.name}</h1>
        <p className="min-role">
          {IDENTITY.role} <span className="min-dot" aria-hidden="true">·</span> {IDENTITY.location}
        </p>
        <p className="min-summary">{RESUME.summary}</p>
        <ul className="min-links mono">
          <li><a href={`mailto:${SITE.socials.email}`}>{SITE.socials.email}</a></li>
          <li><a href={SITE.socials.github} target="_blank" rel="noreferrer">GitHub ↗</a></li>
          <li><a href={SITE.socials.codeforces} target="_blank" rel="noreferrer">Codeforces ↗</a></li>
          <li className="no-print"><a href={SITE.resume} download target="_blank" rel="noopener noreferrer">Résumé PDF ↓</a></li>
          <li className="no-print">
            <button type="button" className="min-print" onClick={() => window.print()}>
              Print
            </button>
          </li>
        </ul>
      </header>

      <Section id="skills" num="01" title="Skills">
        <dl className="min-skills">
          {RESUME.skillGroups.map((g) => (
            <div key={g.label} className="min-skill-row">
              <dt className="mono">{g.label}</dt>
              <dd>{g.items.join(' · ')}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="experience" num="02" title="Experience">
        {RESUME.experience.map((e) => (
          <article key={`${e.company}-${e.role}`} className="min-item">
            <div className="min-item-head">
              <div className="min-item-lead">
                <strong>{e.role}</strong>
                <span className="min-org"> · {e.company}</span>
              </div>
              <span className="min-meta mono">
                {e.period}
                {e.location ? ` · ${e.location}` : ''}
              </span>
            </div>
            <ul className="min-points">
              {e.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </article>
        ))}
      </Section>

      <Section id="projects" num="03" title="Projects">
        {PROJECTS.map((p) => (
          <article key={p.id} className="min-item">
            <div className="min-item-head">
              <div className="min-item-lead">
                <strong>{p.title}</strong>
                <span className="min-org"> · {p.tags.join(', ')}</span>
              </div>
              <span className="min-meta">
                <ProjectLink project={p} />
                {p.repo && (
                  <a className="min-link mono" href={p.repo} target="_blank" rel="noopener noreferrer">
                    Source ↗
                  </a>
                )}
              </span>
            </div>
            <p className="min-desc">{p.desc}</p>
          </article>
        ))}
        {RESUME.moreProjects.length > 0 && (
          <ul className="min-more">
            {RESUME.moreProjects.map((p) => (
              <li key={p.title}>
                <strong>{p.title}</strong> — {p.desc}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section id="competitive" num="04" title="Competitive programming">
        <p className="min-desc">
          <strong>{cp.title}</strong> · max rating{' '}
          <a href={SITE.socials.codeforces} target="_blank" rel="noreferrer">
            <strong>{cp.maxRating}</strong>
          </a>
          {cp.highlight ? ` · ${cp.highlight}` : ''}
        </p>
      </Section>

      <Section id="education" num="05" title="Education">
        {RESUME.education.map((e) => (
          <article key={e.school} className="min-item">
            <div className="min-item-head">
              <div className="min-item-lead">
                <strong>{e.degree}</strong>
                <span className="min-org"> · {e.school}</span>
              </div>
              <span className="min-meta mono">
                {e.period}
                {e.location ? ` · ${e.location}` : ''}
              </span>
            </div>
            {e.detail && <p className="min-desc">{e.detail}</p>}
          </article>
        ))}
      </Section>

      <footer className="min-footer mono no-print">
        <span>// PREFER THE INTERACTIVE VERSION?</span>{' '}
        <Link className="min-nav" to="/journey">CONTINUE TO THE JOURNEY →</Link>
      </footer>
    </div>
  );
}
