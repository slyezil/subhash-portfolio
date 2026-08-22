import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import useTheme from '../hooks/useTheme';

function makeCircleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.arc(32, 32, 28, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();
  return new THREE.CanvasTexture(canvas);
}

function NodeNetwork({ countA, countB }) {
  const refA = useRef();
  const refB = useRef();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const texture = useMemo(makeCircleTexture, []);

  useEffect(() => () => texture.dispose(), [texture]);

  const clouds = useMemo(() => {
    const build = (count, drift) => {
      const pos = new Float32Array(count * 3);
      const vel = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 12;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
        vel[i * 3] = (Math.random() - 0.5) * 0.01;
        vel[i * 3 + 1] = Math.random() * drift;
        vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
      }
      return { pos, vel };
    };
    return { a: build(countA, 0.02), b: build(countB, 0.03) };
  }, [countA, countB]);

  useFrame((state) => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const { mouse, clock } = state;
    const time = clock.getElapsedTime();
    const mx = mouse.x * 5;
    const my = mouse.y * 5;

    const step = (cloud, ref) => {
      const positions = cloud.pos;
      for (let i = 0; i < positions.length / 3; i++) {
        const ix = i * 3;
        const iy = ix + 1;
        const iz = ix + 2;

        positions[ix] += cloud.vel[ix];
        positions[iy] += cloud.vel[iy] + Math.sin(time + positions[ix]) * 0.002;
        positions[iz] += cloud.vel[iz];

        const dx = positions[ix] - mx;
        const dy = positions[iy] - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0.001 && dist < 1.8) {
          const force = (1.8 - dist) * 0.04;
          positions[ix] += (dx / dist) * force;
          positions[iy] += (dy / dist) * force;
        }

        if (positions[iy] > 6) positions[iy] = -6;
        if (positions[iy] < -6) positions[iy] = 6;
        if (positions[ix] > 8) positions[ix] = -8;
        if (positions[ix] < -8) positions[ix] = 8;
        if (positions[iz] > 5) positions[iz] = -5;
        if (positions[iz] < -5) positions[iz] = 5;
      }
      if (ref.current) {
        ref.current.geometry.attributes.position.needsUpdate = true;
      }
    };

    step(clouds.a, refA);
    step(clouds.b, refB);
  });

  return (
    <group>
      <Points ref={refA} positions={clouds.a.pos} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          map={texture}
          alphaTest={0.5}
          color={isDark ? '#00e5ff' : '#0077b6'}
          size={0.14}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      <Points ref={refB} positions={clouds.b.pos} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          map={texture}
          alphaTest={0.5}
          color={isDark ? '#ff2bd6' : '#c9008f'}
          size={0.11}
          sizeAttenuation
          depthWrite={false}
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

export default function FloatingNodes({ height = 430 }) {
  const mobile = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches,
    []
  );

  return (
    <div className="nodes-stage" style={{ '--stage-h': `${height}px` }} role="img"
      aria-label="Interactive particle field that repels around the cursor">
      <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, 5], fov: 60 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.5} />
        <NodeNetwork countA={mobile ? 130 : 380} countB={mobile ? 36 : 100} />
      </Canvas>
      <div className="nodes-copy" aria-hidden="true">
        <h2>INTERACTIVE_SYSTEMS</h2>
        <p>One facet of the craft — fluid, physics-based frontends. Drag through the field.</p>
      </div>
    </div>
  );
}
