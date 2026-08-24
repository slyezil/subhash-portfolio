import { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { SITE, SKILL_ICONS } from '../data/siteConfig';
import { PROJECTS } from '../data/projects';
import useTypewriter from '../hooks/useTypewriter';
import useCountUp from '../hooks/useCountUp';
import ProjectCard from '../components/ProjectCard';
import DigitalRain from '../components/DigitalRain';
import ChapterRail from '../components/ChapterRail';
import NeuralNet from '../components/NeuralNet';

const SpinningPyramids = lazy(() => import('../components/SpinningPyramids'));
const FloatingNodes = lazy(() => import('../components/FloatingNodes'));

const HOOK = 'I turn raw logic into living systems.';
const STORY_BIO =
  'From algorithmic ladders to LLM memory layers — this is the record of an engineer turning pure logic into products people can touch. Scroll to read it chapter by chapter.';

function StageFallback({ height }) {
  return (
    <div className="stage-skeleton" style={{ '--stage-h': `${height}px` }} aria-hidden="true">
      <span className="mono">◢◤ LOADING RIG ◥◣</span>
    </div>
  );
}

export default function Home() {
  const typed = useTypewriter(SITE.roles);
  const [ratingRef, rating] = useCountUp(SITE.stats.rating);

  return (
    <div className="home">
      <ChapterRail />
      <section className="section hero animate-in" aria-label="Introduction">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="whoami mono">{SITE.name}</p>
            <h1 className="glitch story-hook" data-text={HOOK.toUpperCase()}>
              {HOOK.toUpperCase()}
            </h1>
            <p className="hero-typed mono">
              <span className="prompt" aria-hidden="true">&gt;_</span> {typed}
              <span className="caret" aria-hidden="true">▌</span>
            </p>
            <p className="hero-bio">{STORY_BIO}</p>
            <div className="hero-cta">
              <a className="btn btn-primary" href="#origin">
                Begin the story
              </a>
              <a className="btn" href={SITE.resume} download target="_blank" rel="noopener noreferrer">
                Resume.pdf
              </a>
              <a className="btn" href={SITE.socials.github} target="_blank" rel="noreferrer">
                GitHub ↗
              </a>
            </div>
          </div>
          <div className="hero-stage">
            <Suspense fallback={<StageFallback height={360} />}>
              <SpinningPyramids height={360} quote={SITE.tagline} />
            </Suspense>
          </div>
        </div>
      </section>

      <div className="rain-divider" aria-hidden="true">
        <DigitalRain height={110} />
      </div>

      <section id="origin" className="section animate-in" aria-label="Chapter one, competitive programming">
        <header className="section-head">
          <span className="mono">//CH.01</span>
          <h2 className="section-title">The Origin</h2>
        </header>
        <p className="section-story">
          Before frameworks, there were problems. Hundreds of them — graph traversals at 2 AM,
          DP tables until the logic finally clicked. Competitive programming forged the
          algorithmic core that everything else in this story runs on.
        </p>
        <div className="stats-row">
          <div className="hud-card stat-tile" ref={ratingRef}>
            <div className="stat-label mono">CODEFORCES_RATING</div>
            <div className="stat-value cyan">{rating}</div>
            <a
              className="stat-sub mono"
              href={SITE.socials.codeforces}
              target="_blank"
              rel="noopener noreferrer"
            >
              SPECIALIST // PROFILE ↗
            </a>
          </div>
          <div className="hud-card stat-tile">
            <div className="stat-label mono">GLOBAL_RANK</div>
            <div className="stat-value magenta">{SITE.stats.rank.toUpperCase()}</div>
            <div className="stat-sub mono">ACROSS GLOBAL CONTESTS</div>
          </div>
        </div>
      </section>

      <section id="craft" className="section animate-in" aria-label="Chapter two, technical expertise">
        <header className="section-head">
          <span className="mono">//CH.02</span>
          <h2 className="section-title">The Craft</h2>
        </header>
        <p className="section-story">
          Problems taught me to think; systems taught me to build. Spring Boot backends that
          scale, React frontends that feel instant — and the database and deployment tooling
          that keeps both of them honest.
        </p>
        <div className="skills-grid">
          {SITE.skillCategories.map((cat) => (
            <article key={cat.name} className="hud-card skill-card">
              <h3 className="skill-cat mono">[{cat.name.toUpperCase()}]</h3>
              <ul className="skill-list">
                {cat.skills.map((skill) => (
                  <li key={skill} className="skill-badge">
                    {SKILL_ICONS[skill] && (
                      <img src={SKILL_ICONS[skill]} alt="" width="18" height="18" loading="lazy" />
                    )}
                    {skill}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="frontier" className="section animate-in" aria-label="Chapter three, beyond the stack">
        <header className="section-head">
          <span className="mono">//CH.03</span>
          <h2 className="section-title">The Frontier</h2>
        </header>
        <p className="section-story">
          Frontend craft is one stop on the map, not the destination. The same hands that build
          physics-driven interfaces also train small language models and finetune them for
          specific business use cases — the frontier is where product, code and ML converge.
        </p>
        <div className="frontier-grid">
          <div className="hud-card nodes-panel">
            <Suspense fallback={<StageFallback height={430} />}>
              <FloatingNodes height={430} />
            </Suspense>
          </div>
          <article className="hud-card ml-card">
            <h3 className="skill-cat mono">[Applied_ML]</h3>
            <NeuralNet height={240} />
            <p className="ml-copy">
              Beyond the interface: I train small language models and finetune them for specific
              business use cases — compact, private models shaped around real company workflows
              instead of generic chatbots.
            </p>
            <ul className="skill-list">
              <li className="skill-badge">SLM Training</li>
              <li className="skill-badge">Model Finetuning</li>
              <li className="skill-badge">Business-Specific Tuning</li>
              <li className="skill-badge">Local LLM Systems</li>
            </ul>
            <Link className="proj-link mono ml-link" to="/post/building-agentflow">
              See it applied <span aria-hidden="true">→</span>
            </Link>
          </article>
        </div>
      </section>

      <section id="works" className="section animate-in" aria-label="Chapter four, selected works">
        <header className="section-head">
          <span className="mono">//CH.04</span>
          <h2 className="section-title">The Works</h2>
        </header>
        <p className="section-story">
          Theory became artifacts. Each project below started as a question I couldn&apos;t let
          go of — and ended as a system running in production.
        </p>
        <div className="works-grid">
          {PROJECTS.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>

      <section id="epilogue" className="section epilogue animate-in" aria-label="Epilogue and contact">
        <div className="hud-card epi-panel">
          <p className="epi-kicker mono">//EPILOGUE</p>
          <h2 className="glitch epi-title" data-text="YOUR MOVE.">
            YOUR MOVE.
          </h2>
          <p className="epi-copy">
            Every system ships; every story continues. If you&apos;re building something
            ambitious and need an engineer who cares about both the algorithm and the
            experience — I&apos;d love to hear about it.
          </p>
          <div className="hero-cta center">
            <a className="btn btn-primary" href={`mailto:${SITE.socials.email}`}>
              Start a conversation
            </a>
            <a className="btn" href={SITE.socials.github} target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
