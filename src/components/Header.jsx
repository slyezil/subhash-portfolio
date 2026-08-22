import { Link, NavLink } from 'react-router-dom';
import { SITE } from '../data/siteConfig';
import ThemeToggle from './ThemeToggle';

const navClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`;

export default function Header() {
  return (
    <header className="hud-header">
      <div className="container header-content">
        <Link to="/" className="brand" aria-label="Home">
          <span className="brand-glyph" aria-hidden="true">◢◤</span>
          <span className="brand-text">
            <span className="brand-name">{SITE.name}</span>
            <span className="brand-role mono">{SITE.title}</span>
          </span>
        </Link>
        <nav className="nav" aria-label="Primary navigation">
          <NavLink to="/" end className={navClass}>
            Home
          </NavLink>
          <NavLink to="/blog" className={navClass}>
            Blog
          </NavLink>
          <a className="nav-link" href={SITE.socials.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="nav-link hidden-mobile" href={`mailto:${SITE.socials.email}`}>
            Email
          </a>
          <a
            className="btn btn-mini hidden-mobile"
            href={SITE.resume}
            download
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume
          </a>
          <ThemeToggle />
        </nav>
      </div>
      <div className="header-beam" aria-hidden="true" />
    </header>
  );
}
