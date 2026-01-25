import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import useTheme from '../hooks/useTheme';

function NodeNetwork() {
    const ref = useRef();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const count = 400; // Increased density
    const { positions, velocities, initialPos, circleTexture } = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const vel = new Float32Array(count * 3);
        const init = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 12;
            const y = (Math.random() - 0.5) * 10;
            const z = (Math.random() - 0.5) * 10;

            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;

            init[i * 3] = x;
            init[i * 3 + 1] = y;
            init[i * 3 + 2] = z;

            vel[i * 3] = (Math.random() - 0.5) * 0.01;
            vel[i * 3 + 1] = Math.random() * 0.02; // Antigravity drift up
            vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
        }

        // Create a circular texture for spherical particles
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(64, 64, 60, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        const texture = new THREE.CanvasTexture(canvas);

        return { positions: pos, velocities: vel, initialPos: init, circleTexture: texture };
    }, []);

    useFrame((state) => {
        const { mouse, clock } = state;
        const time = clock.getElapsedTime();

        for (let i = 0; i < count; i++) {
            const ix = i * 3;
            const iy = i * 3 + 1;
            const iz = i * 3 + 2;

            // 1. Antigravity Drift
            positions[iy] += velocities[iy] + Math.sin(time + positions[ix]) * 0.002;
            positions[ix] += velocities[ix];
            positions[iz] += velocities[iz];

            // 2. Mouse Repulsion
            const mx = mouse.x * 5; // Scale mouse to scene
            const my = mouse.y * 5;

            const dx = positions[ix] - mx;
            const dy = positions[iy] - my;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 2) {
                const force = (2 - dist) * 0.05;
                positions[ix] += (dx / dist) * force;
                positions[iy] += (dy / dist) * force;
            }

            // 3. Boundary Wrap-around/Recovery
            if (positions[iy] > 6) positions[iy] = -6;
            if (positions[iy] < -6) positions[iy] = 6;
            if (positions[ix] > 8) positions[ix] = -8;
            if (positions[ix] < -8) positions[ix] = 8;
            if (positions[iz] > 5) positions[iz] = -5;
            if (positions[iz] < -5) positions[iz] = 5;
        }
        ref.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <group>
            <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    map={circleTexture}
                    alphaTest={0.5}
                    color={isDark ? "#38bdf8" : "#0284c7"}
                    size={0.15}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Points>
        </group>
    );
}

export default function FloatingNodes({ height = 500 }) {
    return (
        <div style={{
            width: '100%',
            height,
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '32px',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-color)'
        }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
                <ambientLight intensity={0.5} />
                <NodeNetwork />
            </Canvas>
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none',
                zIndex: 1,
                padding: '2rem',
                borderRadius: '24px',
                background: 'rgba(var(--bg-rgb), 0.4)'
            }}>
                <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '12px', letterSpacing: '-0.02em' }}>Interactive Systems</h2>
                <p style={{ color: 'var(--text-primary)', maxWidth: '450px', fontSize: '1.2rem', lineHeight: '1.6', fontWeight: '700' }}>
                    Building fluid, responsive, and performant user experiences with physics-based animations.
                </p>
            </div>
        </div>
    );
}
