'use client';

import { useEffect, useRef } from 'react';
import { Canvas, useFrame, RootState, useThree } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { ThreeElements, extend } from '@react-three/fiber';

// Extend Three.js with the Line element
extend({ Line: THREE.Line });

interface Node {
  id: string;
  position: [number, number, number];
  label: string;
  color?: string;
}

interface Edge {
  source: string;
  target: string;
}

interface NetworkGraphProps {
  nodes: Node[];
  edges: Edge[];
  targetHandle: string | null;
}

// Camera animation component
const CameraAnimation = ({ targetPosition, targetHandle }: { targetPosition: [number, number, number], targetHandle: string | null }) => {
  const { camera, controls } = useThree();
  const isAnimating = useRef(true);
  const startPosition = useRef(camera.position.clone());
  const startTime = useRef(Date.now());
  const animationTrigger = useRef(0);
  
  useFrame((state) => {
    if (targetHandle && targetPosition && isAnimating.current) {
      // Disable controls during animation
      if (controls) {
        (controls as any).enabled = false;
      }

      const elapsedTime = (Date.now() - startTime.current) / 1000;
      const duration = 1.5;
      const progress = Math.min(elapsedTime / duration, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      // Keep camera at a fixed offset from target
      const offset = new THREE.Vector3(8, 8, 12);
      const targetCameraPos = new THREE.Vector3(...targetPosition).add(offset);
      
      camera.position.lerpVectors(startPosition.current, targetCameraPos, easeOut);
      if (controls) {
        (controls as any).target.lerp(new THREE.Vector3(...targetPosition), easeOut);
      }

      if (progress >= 1) {
        isAnimating.current = false;
        if (controls) {
          // Re-enable controls after animation
          (controls as any).enabled = true;
          // Ensure camera and controls are exactly at target
          camera.position.copy(targetCameraPos);
          (controls as any).target.set(...targetPosition);
          (controls as any).update();
        }
      }
    }
  });
  
  useEffect(() => {
    if (targetHandle) {
      isAnimating.current = true;
      startPosition.current = camera.position.clone();
      startTime.current = Date.now();
      animationTrigger.current += 1;
    }
  }, [targetHandle]);
  
  return null;
};

const NodeObject = ({ 
  position, 
  label, 
  color = '#3CA3FC', 
  isHighlighted = false,
  onNodeDoubleClick
}: Node & { 
  isHighlighted?: boolean,
  onNodeDoubleClick?: (label: string) => void 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const handleDoubleClick = (event: any) => {
    event.stopPropagation();
    if (onNodeDoubleClick) {
      onNodeDoubleClick(label);
    }
  };

  useFrame((state: RootState) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.5;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
    if (glowRef.current) {
      glowRef.current.rotation.x = state.clock.getElapsedTime() * 0.5;
      glowRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  // Enhance the glow effect when highlighted
  const glowOpacity = isHighlighted ? 0.1 : 0.03;
  const emissiveIntensity = isHighlighted ? 0.8 : 0.4;

  return (
    <group position={position}>
      {/* Rotating spheres group */}
      <group onDoubleClick={handleDoubleClick}>
        {/* Outer glow sphere */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshBasicMaterial
            color={color}
            transparent={true}
            opacity={glowOpacity}
          />
        </mesh>

        {/* Middle glow sphere */}
        <mesh>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshPhongMaterial
            color={color}
            transparent={true}
            opacity={0.1}
            shininess={100}
          />
        </mesh>

        {/* Main sphere */}
        <mesh ref={meshRef} castShadow receiveShadow>
          <sphereGeometry args={[0.3, 64, 64]} />
          <meshPhysicalMaterial
            color={color}
            emissive={color}
            emissiveIntensity={emissiveIntensity}
            roughness={0.2}
            metalness={0.8}
            clearcoat={1}
            clearcoatRoughness={0.1}
            reflectivity={1}
            envMapIntensity={1}
          />
        </mesh>

        {/* Inner core glow */}
        <mesh>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshBasicMaterial
            color={color}
            transparent={true}
            opacity={0.8}
          />
        </mesh>
      </group>

      {/* Static text label */}
      <Text
        position={[0, 0.9, 0]}
        fontSize={0.4}
        color={isHighlighted ? "white" : "rgba(255,255,255,0.8)"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#000000"
        renderOrder={1}
        onDoubleClick={handleDoubleClick}
      >
        {label}
      </Text>
    </group>
  );
};

const EdgeLine = ({ start, end }: { start: [number, number, number]; end: [number, number, number] }) => {
  const points = [
    new THREE.Vector3(...start),
    new THREE.Vector3(...end),
  ];
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <primitive object={new THREE.Line(
      lineGeometry,
      new THREE.LineBasicMaterial({
        color: '#BCE3FE',
        transparent: true,
        opacity: 0.4,
      })
    )} />
  );
};

const NetworkGraph: React.FC<NetworkGraphProps> = ({ nodes, edges, targetHandle }) => {
  const targetNode = targetHandle 
    ? nodes.find(node => node.label.toLowerCase() === targetHandle.toLowerCase())
    : null;

  const handleNodeDoubleClick = (label: string) => {
    window.dispatchEvent(new CustomEvent('updateTargetHandle', { 
      detail: { handle: label.toLowerCase() } 
    }));
  };

  return (
    <div className="w-full h-full" style={{ height: '100vh', width: '100vw' }}>
      <Canvas
        camera={{ 
          position: [30, 20, 40],
          fov: 60,
          near: 0.1,
          far: 1000
        }}
        style={{ background: '#000', display: 'block', width: '100%', height: '100%' }}
        shadows
      >
        <fog attach="fog" args={['#000', 20, 150]} />
        
        {/* Enhanced lighting setup */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <pointLight position={[0, 20, 0]} intensity={0.5} color="#BCE3FE" />
        <pointLight position={[0, -20, 0]} intensity={0.5} color="#3CA3FC" />
        
        {/* Environment lighting */}
        <hemisphereLight
          color="#BCE3FE"
          groundColor="#000000"
          intensity={0.3}
        />

        {/* Camera animation controller */}
        {targetNode && (
          <CameraAnimation 
            targetPosition={targetNode.position}
            targetHandle={targetHandle}
          />
        )}

        {/* Render edges */}
        {edges.map((edge, index) => {
          const sourceNode = nodes.find(n => n.id === edge.source);
          const targetNode = nodes.find(n => n.id === edge.target);
          
          if (!sourceNode || !targetNode) return null;
          
          return (
            <EdgeLine
              key={`edge-${index}`}
              start={sourceNode.position}
              end={targetNode.position}
            />
          );
        })}

        {/* Render nodes */}
        {nodes.map((node) => (
          <NodeObject 
            key={node.id} 
            {...node}
            isHighlighted={targetHandle ? node.label.toLowerCase() === targetHandle.toLowerCase() : false}
            onNodeDoubleClick={handleNodeDoubleClick}
          />
        ))}

        <OrbitControls
          makeDefault
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={!targetHandle}
          autoRotateSpeed={0.3}
          maxDistance={200}
          minDistance={10}
          enableDamping={true}
          dampingFactor={0.05}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
          panSpeed={1}
          screenSpacePanning={true}
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN
          }}
        />
      </Canvas>
    </div>
  );
};

export default NetworkGraph; 