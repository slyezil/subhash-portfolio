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

// ---------------------------------------------------------------------------
// Identity + résumé data. Shown on the gateway (/) and the minimalist (/minimal)
// recruiter page. Keep in sync with public/assets/resume/*.pdf.
// ---------------------------------------------------------------------------
export const IDENTITY = {
  name: 'Subhash Chandra Bose Lavu',
  role: 'Full Stack Engineer',
  location: 'Bengaluru, India',
  focus: 'Java / Spring Boot · React · Applied ML'
};

export const RESUME = {
  summary:
    'Full stack engineer building scalable Java / Spring Boot microservices and React front ends, ' +
    'with a competitive-programming core and hands-on experience shipping LLM-powered features in production.',
  skillGroups: [
    { label: 'Languages', items: ['Java', 'JavaScript', 'TypeScript', 'Python', 'C++', 'Go'] },
    {
      label: 'Backend',
      items: ['Spring Boot', 'Spring Cloud', 'Spring Security', 'REST APIs', 'Microservices', 'Node.js']
    },
    { label: 'Data', items: ['PostgreSQL', 'MongoDB', 'Redis', 'OpenSearch'] },
    { label: 'Frontend', items: ['React.js', 'Salesforce LWC', 'Three.js'] },
    { label: 'Cloud & tools', items: ['Docker', 'Kubernetes', 'Azure AD B2C', 'Amazon Bedrock', 'JUnit / Mockito', 'Git'] },
    { label: 'Applied ML', items: ['LLM integration', 'RAG pipelines', 'SLM finetuning'] }
  ],
  experience: [
    {
      company: 'UD Trucks India',
      role: 'Application Development Professional',
      period: 'Jul 2025 — Present',
      location: 'Bengaluru, IN',
      points: [
        'Designed and implemented a scalable Java microservices architecture with Spring Boot and Spring Cloud, enabling independent deployments and fault tolerance.',
        'Built and optimized RESTful APIs with Spring WebClient for external repository integrations, cutting average API latency by 40%.',
        'Tuned database queries and added caching strategies, improving throughput and reducing API response times by 28%.',
        'Integrated Azure AD B2C authentication and authorization across microservices with custom claims, policy-based access control, and Application Insights observability.',
        'Implemented JWT- and OAuth2-based security with Spring Security for consistent, secure API access.',
        'Raised test coverage from 60% to 90% with JUnit and Mockito, reducing production defects by 35%.'
      ]
    },
    {
      company: 'UD Trucks India',
      role: 'Graduate Engineer Trainee',
      period: 'Jul 2024 — Jul 2025',
      location: 'Bengaluru, IN',
      points: [
        'Developed a multilingual chatbot in Salesforce LWC (English, Japanese, Thai, Indonesian, Spanish) with dynamic greeting logic and a language selector.',
        'Integrated Amazon Bedrock for natural-language and generative responses, and OpenSearch for semantic knowledge retrieval, improving answer relevance by 35%.',
        'Combined retrieval-augmented generation with Bedrock models into a hybrid system balancing accuracy and context.',
        'Added GA4 event tracking with GDPR-compliant cookie handling via Cookiebot, and AJAX-driven real-time UI updates inside LWC.'
      ]
    }
  ],
  moreProjects: [
    { title: 'Quantistrat', desc: 'Python package for financial data analysis and capital-market strategy implementation.' },
    { title: 'Longlinked', desc: 'AI-powered LinkedIn automation bot that generates, schedules, and posts content autonomously.' },
    { title: 'Clothes Vision', desc: 'Rule-based wardrobe recommendation system driven by occasion, season, and style preferences.' }
  ],
  competitive: {
    title: 'Codeforces Expert',
    maxRating: 1683,
    highlight: 'Global Rank 1 in Codeforces Round 1062'
  },
  education: [
    {
      school: 'RV College of Engineering',
      degree: 'Bachelor of Engineering, Information Science',
      detail: 'GPA 7.94',
      period: 'Aug 2020 — Jul 2024',
      location: 'Bengaluru, India'
    }
  ]
};
