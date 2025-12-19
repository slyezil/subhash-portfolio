import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

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

export default function SpinningPyramids({ width = "100%", height = 320 }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 12,
        overflow: "hidden",
        // Solid background so the full bottom pyramid is visible
        background: "#020617",
      }}
    >
      <Canvas
        shadows
        camera={{ position: [0, 1.5, 4], fov: 45 }}
      >
        <color attach="background" args={["#f5f7fb"]} />

        <ambientLight intensity={1.6} />
        <directionalLight
          position={[3, 4, 0.5]}
          intensity={1.4}
          castShadow
        />

        {/* Top made of two pyramids base‑to‑base */}
        <group>
          <Pyramid />
          <Pyramid inverted />
        </group>

        {/* Soft ground shadow hint */}
        {/* <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.9, 0]}
          receiveShadow
        >
          <circleGeometry args={[3, 32]} />
          <meshStandardMaterial color="#020617" roughness={0.9} />
        </mesh> */}

        <OrbitControls enablePan={false} enableZoom={false} autoRotate />
      </Canvas>
    </div>
  );
}


