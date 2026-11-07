import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import Gateway from './pages/Gateway';
import usePageTracking from './hooks/usePageTracking';

// Everything past the gateway is code-split so "/" and "/minimal" stay tiny.
const Home = lazy(() => import('./pages/Home'));
const Minimal = lazy(() => import('./pages/Minimal'));
const Blog = lazy(() => import('./pages/Blog'));
const Post = lazy(() => import('./pages/Post'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Routes that render without the HUD header/footer chrome.
const BARE_ROUTES = new Set(['/', '/minimal']);

function Shell() {
  const location = useLocation();
  const bare = BARE_ROUTES.has(location.pathname.replace(/\/+$/, '') || '/');

  usePageTracking();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {!bare && <Header />}
      <ErrorBoundary>
        <main id="main">
          <Suspense
            fallback={
              <div className="boot" role="status">
                <span className="boot-text mono">
                  BOOTING INTERFACE<span className="caret">▌</span>
                </span>
              </div>
            }
          >
            <Routes location={location}>
              <Route path="/" element={<Gateway />} />
              <Route path="/minimal" element={<Minimal />} />
              <Route path="/journey" element={<Home />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/post/:slug" element={<Post />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
      </ErrorBoundary>
      {!bare && <Footer />}
    </>
  );
}

export default function App() {
  return <Shell />;
}
