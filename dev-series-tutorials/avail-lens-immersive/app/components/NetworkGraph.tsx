'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, RootState, useThree } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { ThreeElements, extend } from '@react-three/fiber';
import React from 'react';
import NodeObject from './NodeObject'; // Import the separate NodeObject component

// Extend Three.js with the Line element
extend({ Line: THREE.Line });

interface Node {
  id: string;
  position: [number, number, number];
  label: string;
  color?: string;
  picture?: string;
}

interface Edge {
  source: string;
  target: string;
}

interface NetworkGraphProps {
  nodes: Node[];
  links: Edge[];
  targetHandle: string | null;
  initialHandle: string | null;
}

// Camera animation component
const CameraAnimation = ({ targetPosition, targetHandle, isDoubleClick = false }: { 
  targetPosition: [number, number, number], 
  targetHandle: string | null,
  isDoubleClick?: boolean
}) => {
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
      
      // Calculate distance to target to adjust animation duration
      const distance = new THREE.Vector3(...targetPosition).distanceTo(startPosition.current);
      
      // Longer duration for smoother animation
      const baseDuration = 2.5;
      const distanceBasedDuration = Math.min(baseDuration + (distance / 150), 3.5); // Cap at 3.5 seconds
      
      const duration = distanceBasedDuration;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Use smoother easing function with gentler approach to prevent overshooting
      // Combination of sinusoidal and cubic for smoother deceleration
      const easeOut = progress < 0.5
        ? 4 * Math.pow(progress, 3)
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      // Use different offsets based on whether it's a double-click or search
      // Closer view for double-click, wider view for search
      const offset = isDoubleClick 
        ? new THREE.Vector3(0, 0, 20) // Front view for double-click
        : new THREE.Vector3(0, 0, 100); // Front view for search, but far enough to see network
      
      const targetCameraPos = new THREE.Vector3(...targetPosition).add(offset);
      
      camera.position.lerpVectors(startPosition.current, targetCameraPos, easeOut);
      
      if (controls) {
        // Smoother targeting
        (controls as any).target.lerp(new THREE.Vector3(...targetPosition), easeOut);
        (controls as any).update();
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
      // Wait for any previous animation to complete
      setTimeout(() => {
        isAnimating.current = true;
        startPosition.current = camera.position.clone();
        startTime.current = Date.now();
        animationTrigger.current += 1;
      }, 50);
    }
  }, [targetHandle]);
  
  return null;
};

const EdgeLine = ({ 
  start, 
  end, 
  opacity = 0.2 
}: { 
  start: [number, number, number]; 
  end: [number, number, number];
  opacity?: number;
}) => {
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
        opacity,
        depthTest: false,
        depthWrite: false
      })
    )} />
  );
};

const NetworkGraph: React.FC<NetworkGraphProps> = ({ nodes, links, targetHandle, initialHandle }) => {
  // Find the target node's ID
  const targetNodeId = nodes.find(node => 
    targetHandle ? 
      node.label.toLowerCase() === targetHandle.toLowerCase() :
      null
  )?.id;

  // Find the initial node's ID
  const initialNodeId = nodes.find(node => 
    initialHandle ? 
      node.label.toLowerCase() === initialHandle.toLowerCase() :
      null
  )?.id;

  // Find all directly connected node IDs to the target handle
  const connectedNodeIds = new Set(
    links
      .filter(edge => edge.source === targetNodeId || edge.target === targetNodeId)
      .flatMap(edge => [edge.source, edge.target])
  );

  // Adjust node positions based on connections to target handle
  const adjustedNodes = nodes.map(node => {
    // Create a new node object to avoid mutating the original
    const adjustedNode = { ...node };
    
    // If there's a target handle, adjust positions to prevent overlap
    if (targetHandle) {
      const targetNode = nodes.find(n => 
        n.label.toLowerCase() === targetHandle.toLowerCase()
      );
      
      if (targetNode && node.id !== targetNode.id) {
        // Calculate distance between this node and target node
        const targetPos = new THREE.Vector3(...targetNode.position);
        const nodePos = new THREE.Vector3(...node.position);
        const distance = targetPos.distanceTo(nodePos);
        
        // If nodes are too close, push them away
        const minDistance = 8; // Increased minimum distance to maintain
        if (distance < minDistance) {
          // Direction from target to this node
          const direction = new THREE.Vector3().subVectors(nodePos, targetPos).normalize();
          
          // Move node away from target along this direction
          const newPos = new THREE.Vector3().addVectors(
            targetPos, 
            direction.multiplyScalar(minDistance + 2) // Add extra spacing
          );
          
          // Update position
          adjustedNode.position = [newPos.x, newPos.y, newPos.z];
        }
      }
    }
    
    return adjustedNode;
  });
  
  // Apply global scaling to all nodes for better spacing
  const spacedNodes = adjustedNodes.map(node => {
    const spacingFactor = 1.4; // Increase overall spacing by 40%
    
    // Only apply z-adjustment to the network owner node (initial handle or searched handle)
    // Not to any node that gets clicked on
    const isNetworkOwner = !!(
      (initialHandle && node.label.toLowerCase() === initialHandle.toLowerCase())
    );
    
    // Push network owner node deeper into the scene
    const zAdjustment = isNetworkOwner ? +30 : 0;
    
    return {
      ...node,
      position: [
        node.position[0] * spacingFactor,
        node.position[1] * spacingFactor,
        node.position[2] * spacingFactor + zAdjustment
      ] as [number, number, number]
    };
  });

  const [isFromDoubleClick, setIsFromDoubleClick] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const moveTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Debounce function for camera movement
  const handleCameraMove = () => {
    setIsMoving(true);
    
    // Clear any existing timer
    if (moveTimerRef.current) {
      clearTimeout(moveTimerRef.current);
    }
    
    // Set a new timer to mark camera as stopped after delay
    moveTimerRef.current = setTimeout(() => {
      setIsMoving(false);
    }, 300); // 300ms debounce delay
  };

  const handleNodeDoubleClick = (label: string) => {
    setIsFromDoubleClick(true);
    window.dispatchEvent(new CustomEvent('updateTargetHandle', { 
      detail: { handle: label.toLowerCase(), isDoubleClick: true } 
    }));
  };

  // Reset double-click flag when targetHandle changes from non-double-click source
  useEffect(() => {
    if (targetHandle && !isFromDoubleClick) {
      setIsFromDoubleClick(false);
    }
  }, [targetHandle]);

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ 
          position: [5, 5, 80],
          fov: 60,
          near: 0.1,
          far: 3000
        }}
        style={{ background: '#000', display: 'block', width: '100%', height: '100%' }}
        shadows
      >
        <fog attach="fog" args={['#000', 20, 150]} />
        
        {/* Enhanced lighting setup */}
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={1} />
        <pointLight position={[0, 20, 0]} intensity={1} color="#BCE3FE" />
        <pointLight position={[0, -20, 0]} intensity={1} color="#3CA3FC" />
        
        {/* Environment lighting */}
        <hemisphereLight
          color="#BCE3FE"
          groundColor="#000000"
          intensity={0.3}
        />

        {/* Camera animation controller */}
        {targetHandle && (
          <CameraAnimation 
            targetPosition={spacedNodes.find(n => n.label.toLowerCase() === targetHandle.toLowerCase())?.position || [5, 5, 55]}
            targetHandle={targetHandle}
            isDoubleClick={isFromDoubleClick}
          />
        )}

        {/* Render edges */}
        {links.map((edge, index) => {
          const sourceNode = spacedNodes.find(n => n.id === edge.source);
          const targetNode = spacedNodes.find(n => n.id === edge.target);
          
          if (!sourceNode || !targetNode) return null;
          
          // Set edge opacity based on whether it connects to target node
          const isConnectedToTarget = edge.source === targetNodeId || edge.target === targetNodeId;
          
          return (
            <EdgeLine
              key={`edge-${index}`}
              start={sourceNode.position}
              end={targetNode.position}
              opacity={isConnectedToTarget ? 0.3 : 0.3}
            />
          );
        })}

        {/* Render nodes */}
        {spacedNodes.map((node) => {
          // Highlight both the target handle and initial handle
          const isHighlighted = !!(
            (targetHandle && node.label.toLowerCase() === targetHandle.toLowerCase()) || 
            (initialHandle && !targetHandle && node.label.toLowerCase() === initialHandle.toLowerCase())
          );
          
          return (
            <NodeObject 
              key={node.id} 
              {...node}
              isHighlighted={isHighlighted}
              onNodeDoubleClick={handleNodeDoubleClick}
              isMoving={isMoving}
            />
          );
        })}

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
          rotateSpeed={0.8}
          zoomSpeed={0.8}
          panSpeed={1}
          screenSpacePanning={true}
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN
          }}
          onChange={handleCameraMove}
          onStart={handleCameraMove}
        />
      </Canvas>
    </div>
  );
};

export default NetworkGraph;