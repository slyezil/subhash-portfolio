import React from 'react';
import FuturisticHero from '../components/FuturisticHero';
import Header from '../components/Header';
import ProjectCard from '../components/ProjectCard';
import { SITE } from '../data/siteConfig';

const PROJECTS = [
  {title:'Project One',desc:'Short description — replace this.',link:'#'},
  {title:'Project Two',desc:'Short description — replace this.',link:'#'},
  {title:'Project Three',desc:'Short description — replace this.',link:'#'}
];

export default function Home(){
  return (
    <div>
      <Header />
      <div className="container">
        <section style={{marginBottom:20}}>
          <FuturisticHero height={480} />
        </section>
        <div className="card">
          <h1 style={{margin:0}}>{SITE.name}</h1>
          <div style={{color:'var(--muted)'}}>{SITE.title} · {SITE.bio}</div>
          <div style={{marginTop:12}}>
            <strong>Skills:</strong> {SITE.skills.join(' · ')}
          </div>
        </div>

        <section>
          <h2 style={{marginTop:20}}>Projects</h2>
          <div className="projects">
            {PROJECTS.map((p,i)=>(<ProjectCard key={i} p={p}/>))}
          </div>
        </section>

        <section>
          <h2 style={{marginTop:20}}>Contact</h2>
          <div className="card">Email: <a className="link" href={`mailto:${SITE.email}`}>{SITE.email}</a></div>
        </section>
      </div>
    </div>
  );
}