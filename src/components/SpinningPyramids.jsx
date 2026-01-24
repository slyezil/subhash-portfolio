import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import useTheme from "../hooks/useTheme";

function Pyramid({ inverted = false, color = "#d4af37" }) {
  const groupRef = useRef();

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.8;
  });

  // Create wireframe geometry for decorative edges (shorter height for rhombus look)
  const wireframeGeometry = useMemo(() => {
    return new THREE.ConeGeometry(0.7, 0.9, 4);
  }, []);

  return (
    <group
      ref={groupRef}
      rotation={[inverted ? Math.PI : 0, 0, 0]}
      position={[0, inverted ? -0.47 : 0.47, 0]}
    >
      {/* Main pyramid mesh */}
      <mesh castShadow receiveShadow>
        <coneGeometry args={[0.7, 0.9, 4]} />
        <meshStandardMaterial
          color={color}
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>

      {/* Wireframe edges */}
      <lineSegments>
        <edgesGeometry args={[wireframeGeometry]} />
        <lineBasicMaterial color="#8b6914" linewidth={1.5} />
      </lineSegments>
    </group>
  );
}

export default function SpinningPyramids({ width = "100%", height = 400, quote = null }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const accentColor = isDark ? "#38bdf8" : "#0284c7";
  const edgeColor = isDark ? "#0ea5e9" : "#0369a1";

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 24,
        overflow: "hidden",
        background: "var(--bg-subtle)",
        position: "relative",
      }}
    >
      <Canvas
        shadows
        camera={{ position: [0, 1.5, 4], fov: 45 }}
      >
        <ambientLight intensity={isDark ? 0.8 : 1.5} />
        <directionalLight
          position={[3, 4, 0.5]}
          intensity={1.4}
          castShadow
        />

        <group>
          <Pyramid color={accentColor} />
          <Pyramid inverted color={accentColor} />
        </group>

        <OrbitControls enablePan={false} enableZoom={false} autoRotate />
      </Canvas>

      {quote && (
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            padding: "16px 32px",
            borderRadius: "16px",
            background: "rgba(var(--bg-rgb), 0.6)",
            backdropFilter: "blur(8px)",
            maxWidth: "90%",
          }}
        >
          <p
            style={{
              fontSize: "1.1rem",
              fontWeight: 600,
              fontStyle: "italic",
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            "{quote}"
          </p>
        </div>
      )}
    </div>
  );
}


