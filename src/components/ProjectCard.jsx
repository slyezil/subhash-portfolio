import React from 'react';
export default function ProjectCard({p}){
  return (
    <div className="card">
      <h3 style={{margin:'4px 0'}}>{p.title}</h3>
      <p style={{color:'var(--muted)',margin:'6px 0'}}>{p.desc}</p>
      {p.link && <a className="link" href={p.link} target="_blank" rel="noreferrer">View</a>}
    </div>
  );
}