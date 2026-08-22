import { SITE } from '../data/siteConfig';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container footer-inner mono">
        <div className="footer-left">
          <span>© {year} {SITE.name.toUpperCase()}</span>
        </div>
        <nav className="footer-links" aria-label="Social links">
          <a href={SITE.socials.github} target="_blank" rel="noreferrer">GITHUB</a>
          <a href={SITE.socials.codeforces} target="_blank" rel="noreferrer">CODEFORCES</a>
          <a href={`mailto:${SITE.socials.email}`}>EMAIL</a>
        </nav>
      </div>
    </footer>
  );
}
