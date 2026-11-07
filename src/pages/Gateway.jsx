import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { IDENTITY, SITE } from '../data/siteConfig';
import ThemeToggle from '../components/ThemeToggle';

// Warm the journey chunk when the visitor shows intent, so "Enter" feels instant.
const prefetchJourney = () => import('./Home');

const CHOICES = [
  {
    to: '/minimal',
    idx: '01',
    kicker: 'For recruiters',
    title: 'Minimalist',
    desc: 'Skills, experience, projects and contact on one quiet page. Loads instantly and prints as a résumé.',
    cta: 'Open',
    key: '1',
    modifier: 'gw-choice--minimal'
  },
  {
    to: '/journey',
    idx: '02',
    kicker: 'The full experience',
    title: 'Continue to the journey',
    desc: 'Interactive 3D, the story told chapter by chapter, and the writing log.',
    cta: 'Enter',
    key: '2',
    modifier: 'gw-choice--journey',
    onIntent: prefetchJourney
  }
];

export default function Gateway() {
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const hit = CHOICES.find((c) => c.key === e.key);
      if (hit) navigate(hit.to);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  return (
    <div className="gateway">
      <Helmet>
        <title>{`${IDENTITY.name} // Portfolio`}</title>
      </Helmet>

      <div className="gw-top">
        <span className="gw-sys mono hidden-mobile">SYS.PORTFOLIO // v2.0</span>
        <ThemeToggle />
      </div>

      <div className="gw-inner animate-in">
        <p className="whoami mono">// IDENTITY_CONFIRMED</p>
        <h1 className="glitch gw-name" data-text={IDENTITY.name.toUpperCase()}>
          {IDENTITY.name.toUpperCase()}
        </h1>
        <p className="gw-role mono">
          {IDENTITY.role.toUpperCase()} <span className="gw-sep">·</span> {IDENTITY.focus.toUpperCase()}
        </p>
        <p className="gw-prompt mono" aria-hidden="true">
          <span className="prompt">&gt;</span> SELECT_INTERFACE<span className="caret">▌</span>
        </p>

        <div className="gw-choices" role="group" aria-label="Choose how to explore the portfolio">
          {CHOICES.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className={`hud-card gw-choice ${c.modifier}`}
              onMouseEnter={c.onIntent}
              onFocus={c.onIntent}
            >
              <span className="gw-idx mono" aria-hidden="true">[{c.idx}]</span>
              <span className="gw-kicker mono">{c.kicker.toUpperCase()}</span>
              <span className="gw-title">{c.title}</span>
              <span className="gw-desc">{c.desc}</span>
              <span className="gw-cta mono">
                {c.cta.toUpperCase()} <span aria-hidden="true">→</span>
                <kbd className="gw-kbd" aria-label={`Shortcut key ${c.key}`}>{c.key}</kbd>
              </span>
            </Link>
          ))}
        </div>

        <p className="gw-foot mono">
          // BOTH INTERFACES LINK TO EACH OTHER <span className="gw-sep">·</span>{' '}
          <a href={SITE.socials.github} target="_blank" rel="noreferrer">GITHUB ↗</a>
        </p>
      </div>
    </div>
  );
}
