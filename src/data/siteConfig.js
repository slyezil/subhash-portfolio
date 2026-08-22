import javaLogo from '../assets/tech/java.png';
import springLogo from '../assets/tech/springboot.png';
import reactLogo from '../assets/tech/react.png';
import tsLogo from '../assets/tech/typescript.png';
import pgLogo from '../assets/tech/postgresql.png';
import dockerLogo from '../assets/tech/docker.png';
import pythonLogo from '../assets/tech/python.png';

export const SKILL_ICONS = {
  Java: javaLogo,
  'Spring Boot': springLogo,
  'React.js': reactLogo,
  TypeScript: tsLogo,
  PostgreSQL: pgLogo,
  Docker: dockerLogo,
  Python: pythonLogo
};

export const SITE = {
  name: 'Subhash Chandra Bose Lavu',
  title: 'Full Stack Engineer',
  roles: ['FULL-STACK ENGINEER', 'SPRING BOOT ARCHITECT', 'APPLIED-ML ENGINEER', 'CREATIVE TECHNOLOGIST'],
  bio: 'A developer focused on building scalable backends and immersive frontends. Expert in Java/Spring Boot and React, with a strong foundation in algorithmic problem solving and performance optimization.',
  tagline: 'Where logic meets creativity, innovation follows.',
  skillCategories: [
    { name: 'Core', skills: ['Java', 'Spring Boot', 'React.js', 'TypeScript'] },
    { name: 'Tools & DB', skills: ['PostgreSQL', 'Redis', 'Docker', 'Kubernetes'] },
    { name: 'Specialties', skills: ['Distributed Systems', 'LLM Integration', '3D Web'] }
  ],
  stats: {
    rating: 1683,
    rank: 'Top 5%'
  },
  socials: {
    github: 'https://github.com/slyezil',
    email: 'lavuscb@gmail.com',
    codeforces: 'https://codeforces.com/profile/slyezil'
  },
  resume: `${import.meta.env.BASE_URL}assets/resume/Subhash_Resume_v1.pdf`
};
