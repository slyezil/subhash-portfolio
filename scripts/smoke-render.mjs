import { createServer } from 'vite';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';

const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error'
});

const targets = [
  ['/src/pages/Home.jsx', 'default', '/'],
  ['/src/pages/Home.jsx', 'default', '/blog'],
  ['/src/pages/Blog.jsx', 'default', '/blog'],
  ['/src/pages/Post.jsx', 'default', '/post/building-agentflow'],
  ['/src/pages/Post.jsx', 'default', '/post/does-not-exist'],
  ['/src/pages/NotFound.jsx', 'default', '/nowhere'],
  ['/src/components/Header.jsx', 'default', '/'],
  ['/src/components/Footer.jsx', 'default', '/'],
  ['/src/components/ChapterRail.jsx', 'default', '/'],
  ['/src/App.jsx', 'default', '/']
];

let failures = 0;

for (const [file, exportName, route] of targets) {
  try {
    const mod = await vite.ssrLoadModule(file);
    const Component = mod[exportName];
    let wrapped;
    if (file.endsWith('Post.jsx')) {
      wrapped = React.createElement(
        Routes,
        null,
        React.createElement(Route, { path: '/post/:slug', element: React.createElement(Component) })
      );
    } else {
      wrapped = React.createElement(Component);
    }
    const el = React.createElement(
      MemoryRouter,
      { initialEntries: [route] },
      React.createElement(Suspense, { fallback: null }, wrapped)
    );
    const html = renderToString(el);
    console.log(`PASS ${file} @ ${route} (${html.length} chars)`);
  } catch (err) {
    failures += 1;
    console.log(`FAIL ${file} @ ${route}`);
    console.log(`  ${err && err.message}`);
    const frame = String(err && err.stack || '').split('\n').slice(1, 5).join('\n');
    console.log(frame);
  }
}

await vite.close();
process.exit(failures > 0 ? 1 : 0);
