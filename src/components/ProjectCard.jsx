import { Link } from 'react-router-dom';

export default function ProjectCard({ project }) {
  const internal = project.link.startsWith('/');
  const dead = project.link === '#';
  const LinkEl = internal ? Link : 'a';
  const linkProps = internal
    ? { to: project.link }
    : {
        href: project.link,
        target: project.link !== '#' ? '_blank' : undefined,
        rel: project.link !== '#' ? 'noopener noreferrer' : undefined
      };

  return (
    <article className="proj-card animate-in">
      <div className="proj-top">
        <span className="proj-index mono" aria-hidden="true">{project.id}</span>
        <div className="proj-tags">
          {project.tags.map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      </div>
      <h3 className="proj-title">{project.title}</h3>
      <p className="proj-desc">{project.desc}</p>
      <div className="proj-foot">
        {!dead && (
          <LinkEl {...linkProps} className="proj-link mono">
            {internal ? 'Read case study' : 'Open project'} <span aria-hidden="true">→</span>
          </LinkEl>
        )}
        {project.repo && (
          <a className="proj-repo mono" href={project.repo} target="_blank" rel="noopener noreferrer">
            Source ↗
          </a>
        )}
      </div>
    </article>
  );
}
