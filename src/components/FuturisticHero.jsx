import React,{useRef,useMemo} from 'react';
import { Canvas,useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';


function HologramSphere({radius=1.2,segments=64,wireframe=false}){
const ref = useRef();
useFrame((state,delta)=>{ ref.current.rotation.y += delta*0.25; ref.current.rotation.x += delta*0.06 });
return (
<mesh ref={ref}>
<sphereGeometry args={[radius,segments,segments]} />
<meshStandardMaterial
transparent
opacity={0.18}
metalness={0.7}
roughness={0.1}
/>
{wireframe && <lineSegments>
<wireframeGeometry args={[new THREE.SphereGeometry(radius,segments,segments)]}/>
<lineBasicMaterial toneMapped={false} color="#7dd3fc" linewidth={1} />
</lineSegments>}
</mesh>
);
}


function ParticleField({count=120,spread=3}){
const geom = useMemo(()=>{
const g = new THREE.BufferGeometry();
const pos = new Float32Array(count*3);
for(let i=0;i<count;i++){ pos[i*3]=(Math.random()-0.5)*spread; pos[i*3+1]=(Math.random()-0.5)*spread; pos[i*3+2]=(Math.random()-0.5)*spread }
g.setAttribute('position',new THREE.BufferAttribute(pos,3));
return g;
},[count,spread]);
const mat = useMemo(()=> new THREE.PointsMaterial({size:0.025,opacity:0.9,transparent:true}),[]);
const ref = useRef();
useFrame((s,dt)=>{ if(ref.current) ref.current.rotation.y += dt*0.08 });
return <points ref={ref} geometry={geom} material={mat} />
}


export default function FuturisticHero({width='100%',height=420}){
return (
<div style={{width,height,display:'block',borderRadius:12,overflow:'hidden'}}>
<Canvas camera={{position:[0,0,6],fov:50}}>
<ambientLight intensity={0.6} />
<directionalLight position={[5,5,5]} intensity={0.8} />
<HologramSphere wireframe={true} />
<ParticleField />
<OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
<Html position={[0,-1.6,0]} center>
<div style={{color:'#bfefff',textAlign:'center',fontFamily:'Inter,sans-serif'}}>
<div style={{fontSize:22,fontWeight:700}}>Subhash Chandra Bose Lavu</div>
<div style={{color:'#9fbcd6',marginTop:6}}>Full Stack Developer</div>
</div>
</Html>
</Canvas>
</div>
);
}