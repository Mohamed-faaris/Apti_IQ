import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

// Education-themed Particles Background
function EducationParticles() {
  const particlesRef = useRef<THREE.Group>(null);
  const particleCount = 50;

  // Education-themed symbols
  const symbols = ['📚', '📖', '✏️', '📝', '🎓', '🏆', '⭐', '💡', '🧮', '📊', '✓', '🎯', '💯', '🔢', '➕', '➖', '✖️', '➗'];

  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, () => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
      ] as [number, number, number],
      velocity: [
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.01,
      ] as [number, number, number],
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      scale: 0.3 + Math.random() * 0.4,
    }));
  }, []);

  useFrame(() => {
    if (particlesRef.current) {
      particlesRef.current.children.forEach((child, i) => {
        const particle = particles[i];
        
        // Update position
        child.position.x += particle.velocity[0];
        child.position.y += particle.velocity[1];
        child.position.z += particle.velocity[2];

        // Boundary check - wrap around
        if (Math.abs(child.position.x) > 10) particle.velocity[0] *= -1;
        if (Math.abs(child.position.y) > 10) particle.velocity[1] *= -1;
        if (Math.abs(child.position.z) > 5) particle.velocity[2] *= -1;

        // Rotation
        child.rotation.z += particle.rotationSpeed;
      });
    }
  });

  return (
    <group ref={particlesRef}>
      {particles.map((particle, i) => (
        <Sprite
          key={i}
          position={particle.position}
          scale={particle.scale}
          symbol={particle.symbol}
        />
      ))}
    </group>
  );
}

// Sprite component for rendering emoji/symbols
function Sprite({ position, scale, symbol }: { position: [number, number, number]; scale: number; symbol: string }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Clear canvas
      ctx.clearRect(0, 0, 128, 128);
      
      // Draw emoji/symbol
      ctx.font = 'bold 80px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(symbol, 64, 64);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [symbol]);

  return (
    <sprite position={position} scale={[scale, scale, 1]}>
      <spriteMaterial map={texture} transparent opacity={0.8} />
    </sprite>
  );
}

// Floating background particles (small dots for depth)
function BackgroundDots() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 1500;

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const color = new THREE.Color();
      const hue = Math.random() * 0.3 + 0.55; // Blue to purple range
      color.setHSL(hue, 0.7, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Main scene component
function Scene() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <BackgroundDots />
      <EducationParticles />
    </>
  );
}

// Main component
export function AuthBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        className="absolute inset-0"
      >
        <Scene />
      </Canvas>
    </div>
  );
}
