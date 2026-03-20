import React from 'react';
import { Routes,Route } from 'react-router-dom';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Post from './pages/Post';
import usePageTracking from './hooks/usePageTracking';

export default function App(){
  usePageTracking();
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/blog" element={<Blog/>} />
      <Route path="/post/:slug" element={<Post/>} />
    </Routes>
  );
}