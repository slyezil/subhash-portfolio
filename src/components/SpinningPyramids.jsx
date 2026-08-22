import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import useTheme from '../hooks/useTheme';

const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Pyramid({ inverted = false, color, edge, speed }) {
  const groupRef = useRef();

  const coneGeo = useMemo(() => new THREE.ConeGeometry(0.72, 0.95, 4), []);
  const edgeGeo = useMemo(() => new THREE.EdgesGeometry(coneGeo), [coneGeo]);

  useEffect(
    () => () => {
      coneGeo.dispose();
      edgeGeo.dispose();
    },
    [coneGeo, edgeGeo]
  );

  useFrame((state, delta) => {
    if (!groupRef.current || REDUCED) return;
    groupRef.current.rotation.y += delta * speed;
    const baseY = inverted ? -0.52 : 0.52;
    groupRef.current.position.y =
      baseY + Math.sin(state.clock.elapsedTime * 1.2 + (inverted ? Math.PI : 0)) * 0.05;
  });

  return (
    <group
      ref={groupRef}
      rotation={[inverted ? Math.PI : 0, 0, 0]}
      position={[0, inverted ? -0.52 : 0.52, 0]}
    >
      <mesh geometry={coneGeo} castShadow>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.55}
          metalness={0.85}
          roughness={0.22}
          flatShading
        />
      </mesh>
      <lineSegments geometry={edgeGeo}>
        <lineBasicMaterial color={edge} toneMapped={false} transparent opacity={0.9} />
      </lineSegments>
    </group>
  );
}

export default function SpinningPyramids({ height = 380, quote = null }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const core = isDark ? '#00e5ff' : '#0077b6';
  const edge = isDark ? '#ff2bd6' : '#c9008f';

  return (
    <div
      className="pyramid-stage"
      style={{
        '--stage-h': `${height}px`,
        background: `radial-gradient(circle at 50% 42%, ${isDark ? '#0a1030' : '#dbe6ff'} 0%, transparent 62%)`
      }}
    >
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.7, 4.3], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={isDark ? 0.5 : 0.9} />
        <pointLight position={[4, 4, 4]} intensity={isDark ? 40 : 22} color="#00e5ff" distance={25} decay={2} />
        <pointLight position={[-4, -3, 3]} intensity={isDark ? 32 : 16} color="#ff2bd6" distance={20} decay={2} />
        <directionalLight position={[2, 5, 2]} intensity={isDark ? 0.7 : 1.1} castShadow />
        <Pyramid color={core} edge={edge} speed={0.85} />
        <Pyramid inverted color={core} edge={edge} speed={-0.6} />
        <OrbitControls enablePan={false} enableZoom={false} autoRotate={!REDUCED} autoRotateSpeed={0.9} />
      </Canvas>

      {quote && (
        <figure className="quote-chip">
          <span className="quote-mark" aria-hidden="true">⌜</span>
          <blockquote>{quote}</blockquote>
          <span className="quote-mark end" aria-hidden="true">⌟</span>
        </figure>
      )}
    </div>
  );
}
