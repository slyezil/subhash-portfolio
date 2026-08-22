import { useEffect, useState } from 'react';

const CHAPTERS = [
  { id: 'origin', num: '01', label: 'Origin' },
  { id: 'craft', num: '02', label: 'Craft' },
  { id: 'frontier', num: '03', label: 'Frontier' },
  { id: 'works', num: '04', label: 'Works' },
  { id: 'epilogue', num: '05', label: 'Epilogue' }
];

export default function ChapterRail() {
  const [active, setActive] = useState('');

  useEffect(() => {
    const sections = CHAPTERS.map((c) => document.getElementById(c.id)).filter(Boolean);
    if (!sections.length) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-35% 0px -55% 0px' }
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <nav className="chapter-rail" aria-label="Story chapters">
      {CHAPTERS.map((c) => (
        <a key={c.id} href={`#${c.id}`} className={`rail-item${active === c.id ? ' active' : ''}`}>
          <span className="rail-label mono">{`${c.num} // ${c.label}`}</span>
          <span className="rail-diamond" aria-hidden="true" />
        </a>
      ))}
    </nav>
  );
}
