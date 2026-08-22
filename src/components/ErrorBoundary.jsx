import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('UI crashed:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="container err-wrap">
          <div className="hud-card err-panel" role="alert">
            <h2 className="glitch err-title" data-text="SYSTEM_FAULT">
              SYSTEM_FAULT
            </h2>
            <p className="mono err-msg">// {this.state.error.message}</p>
            <div className="err-actions">
              <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
                REBOOT
              </button>
              <Link className="btn" to="/">
                RETURN_HOME
              </Link>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
