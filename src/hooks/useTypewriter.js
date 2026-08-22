import { useEffect, useState } from 'react';

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function useTypewriter(words, { typeMs = 65, holdMs = 1700, eraseMs = 26 } = {}) {
  const [display, setDisplay] = useState('');

  useEffect(() => {
    if (!words || words.length === 0) return undefined;
    if (prefersReducedMotion()) {
      setDisplay(words[0]);
      return undefined;
    }

    let wordIdx = 0;
    let charIdx = 0;
    let erasing = false;
    let timer;

    const step = () => {
      const word = words[wordIdx];
      if (!erasing) {
        charIdx += 1;
        setDisplay(word.slice(0, charIdx));
        if (charIdx === word.length) {
          erasing = true;
          timer = setTimeout(step, holdMs);
          return;
        }
        timer = setTimeout(step, typeMs);
      } else {
        charIdx -= 1;
        setDisplay(word.slice(0, charIdx));
        if (charIdx === 0) {
          erasing = false;
          wordIdx = (wordIdx + 1) % words.length;
          timer = setTimeout(step, 380);
          return;
        }
        timer = setTimeout(step, eraseMs);
      }
    };

    timer = setTimeout(step, 500);
    return () => clearTimeout(timer);
  }, [words, typeMs, holdMs, eraseMs]);

  return display;
}
