import { useEffect, useRef, useState } from 'react';
import { useFrame, RootState } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import textureWorkerPool from '../utils/textureWorkerPool';

interface NodeProps {
  id: string;
  position: [number, number, number];
  label: string;
  color?: string;
  picture?: string;
  isHighlighted?: boolean;
  renderOrder?: number;
  onNodeDoubleClick?: (label: string) => void;
  isMoving?: boolean;
  isNetworkSwitching?: boolean;
}

const NodeObject = ({ 
  position, 
  label, 
  color = '#3CA3FC',
  picture = '/default_image.png',
  isHighlighted = false,
  renderOrder = 0,
  onNodeDoubleClick,
  isMoving = false,
  isNetworkSwitching = false,
}: NodeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [hasValidImage, setHasValidImage] = useState(false);
  const loadingQueue = useRef<string | null>(null);
  const lastPictureRef = useRef<string>(picture);

  // Create gradient shader material
  const gradientMaterial = new THREE.ShaderMaterial({
    uniforms: {
      color1: { value: new THREE.Color(isHighlighted ? "#25d280" : "#000000") },
      color2: { value: new THREE.Color(isHighlighted ? "#25d280" : "#000000") },
      time: { value: 0 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color1;
      uniform vec3 color2;
      uniform float time;
      varying vec2 vUv;
      
      void main() {
        float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
        angle = (angle + 3.14159) / (2.0 * 3.14159);
        angle = mod(angle + time * 0.1, 1.0);
        vec3 color = mix(color1, color2, angle);
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    transparent: false,
    depthTest: true,
    depthWrite: true
  });

  // Check if the picture has changed from a previous value
  const hasPictureChanged = lastPictureRef.current !== picture;

  useEffect(() => {
    // Update last picture reference
    lastPictureRef.current = picture;
    
    // Skip loading if camera is moving during network switching
    if (isNetworkSwitching) {
      if (!hasValidImage) {
        loadingQueue.current = picture;
      }
      return;
    }
    
    // Only skip loading in these cases:
    // 1. Camera is moving AND
    // 2. We don't have an image yet AND
    // 3. We don't already have something queued
    if (isMoving && !hasValidImage && !loadingQueue.current) {
      // Store the URL to load later when camera stops
      loadingQueue.current = picture;
      return;
    }
    
    // Try to load the texture in these cases:
    // 1. We have a queued image to load AND camera isn't moving (or network isn't switching)
    // 2. OR: We don't have a texture yet AND we're not in the middle of a network switch
    // 3. OR: The picture URL has changed
    if (
      (loadingQueue.current && (!isMoving || !isNetworkSwitching)) ||
      (!texture && !isNetworkSwitching && !hasValidImage) ||
      hasPictureChanged
    ) {
      const pictureToLoad = loadingQueue.current || picture;
      loadingQueue.current = null;
      
      // Use worker pool to load the texture (will use cache if available)
      textureWorkerPool.loadTexture(pictureToLoad)
        .then((loadedTexture) => {
          setTexture(loadedTexture);
          setHasValidImage(true);
        })
        .catch((error) => {
          setHasValidImage(false);
        });
    }
  }, [picture, isMoving, isNetworkSwitching, hasValidImage, texture, hasPictureChanged]);

  useFrame((state: RootState) => {
    // Make nodes face camera but don't copy the full quaternion
    if (groupRef.current) {
      // Calculate direction to camera
      const cameraPosition = state.camera.position.clone();
      const nodePosition = new THREE.Vector3(...position);
      const direction = cameraPosition.sub(nodePosition).normalize();
      
      // Use lookAt instead of quaternion copying
      groupRef.current.lookAt(cameraPosition);
    }
    
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.getElapsedTime() * 0.3;
      gradientMaterial.uniforms.time.value = state.clock.getElapsedTime();
    }
    
    if (meshRef.current && !hasValidImage) {
      // Only rotate meshes without images
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <group position={position} renderOrder={renderOrder}>
      <group 
        ref={groupRef}
        onDoubleClick={(e) => {
          e.stopPropagation();
          onNodeDoubleClick?.(label);
        }}
      >
        <mesh ref={ringRef} renderOrder={renderOrder}>
          <torusGeometry args={[isHighlighted ? 4.0 : 1.4, isHighlighted ? 0.3 : 0.09, 32, 64]} />
          <primitive object={gradientMaterial} attach="material" />
        </mesh>

        {hasValidImage ? (
          <mesh renderOrder={renderOrder}>
            <sphereGeometry args={[isHighlighted ? 3.2 : 1.1, 32, 32]} />
            <meshStandardMaterial
              map={texture}
              transparent={false}
              opacity={1.0}
              side={THREE.FrontSide}
              depthTest={true}
              depthWrite={true}
              roughness={0.0}
              metalness={0.0}
              alphaTest={0.0}
            />
          </mesh>
        ) : (
          <mesh ref={meshRef} renderOrder={renderOrder}>
            <sphereGeometry args={[isHighlighted ? 2.1 : 0.7, 32, 32]} />
            <meshPhysicalMaterial
              color={color}
              emissive={color}
              emissiveIntensity={isHighlighted ? 3.0 : 2.0}
              roughness={0.2}
              metalness={0.8}
              clearcoat={1}
              clearcoatRoughness={0.1}
              reflectivity={1}
              transparent={false}
              opacity={1.0}
              depthTest={true}
              depthWrite={true}
            />
          </mesh>
        )}
      </group>

      <Text
        position={[0, isHighlighted ? 4.5 : 1.8, 0]}
        fontSize={isHighlighted ? 1.2 : 0.6}
        color={isHighlighted ? "white" : "rgba(255,255,255,0.8)"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#000000"
        renderOrder={renderOrder}
        onDoubleClick={(e) => {
          e.stopPropagation();
          onNodeDoubleClick?.(label);
        }}
      >
        {label}
      </Text>
    </group>
  );
};

export default NodeObject; 