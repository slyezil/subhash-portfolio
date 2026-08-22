import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="notfound container">
      <h1 className="glitch nf-code mono" data-text="404">404</h1>
      <p className="nf-msg mono">// SECTOR_NOT_FOUND — the route you requested is outside the grid.</p>
      <Link className="btn btn-primary" to="/">Return home</Link>
    </div>
  );
}
