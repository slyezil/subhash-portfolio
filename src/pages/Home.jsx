import React,{useEffect,useState} from 'react';
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
  const [cfRating,setCfRating] = useState(0);

  useEffect(()=>{
    const target = 1683;
    const duration = 1500; // ms counting phase
    const cycle = 5000; // total ms per cycle (count up + hold)

    const start = Date.now();
    const id = setInterval(()=>{
      const elapsed = Date.now() - start;
      const phase = elapsed % cycle;

      if (phase <= duration){
        const progress = phase / duration;
        setCfRating(Math.round(target * progress));
      } else {
        setCfRating(target);
      }
    },50);

    return ()=>clearInterval(id);
  },[]);

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

        {/* <section>
          <h2 style={{marginTop:20}}>Projects</h2>
          <div className="projects">
            {PROJECTS.map((p,i)=>(<ProjectCard key={i} p={p}/>))}
          </div>
        </section> */}
        <section>
          <h2 style={{marginTop:20}}>Codeforces</h2>
          <a className="link" href={SITE.codeforces} target="_blank" rel="noopener noreferrer">View Profile</a>
          <div className="card" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div>
              <div style={{fontSize:14,color:'var(--muted)'}}>Max Rating</div>
              <div style={{fontSize:28,fontWeight:700}}>{cfRating}</div>
            </div>
           <div>
              <div style={{fontSize:14,color:'var(--muted)'}}>Higest Rank</div>
              <div style={{fontSize:28,fontWeight:700}}>1</div>
            </div>
          </div>
        </section>

        {/* <section>
          <h2 style={{marginTop:20}}>Contact</h2>
          <div className="card">Email: <a className="link" href={`mailto:${SITE.email}`}>{SITE.email}</a></div>
        </section> */}
      </div>
    </div>
  );
}