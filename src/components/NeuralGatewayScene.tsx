'use client';

import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

type NeuralGatewaySceneProps = {
  progress: number;
  active: boolean;
};

export default function NeuralGatewayScene({ progress, active }: NeuralGatewaySceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const coreRef = useRef<THREE.Mesh | null>(null);
  const ringRef = useRef<THREE.Mesh | null>(null);
  const faceRef = useRef<THREE.Group | null>(null);
  const glowRef = useRef<THREE.Mesh | null>(null);
  const leftEyeRef = useRef<THREE.Mesh | null>(null);
  const rightEyeRef = useRef<THREE.Mesh | null>(null);
  const animationRef = useRef<number | null>(null);
  const zoomRef = useRef(0);

  const fog = useMemo(() => new THREE.Fog('#050507', 2.5, 6), []);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#050507');
    scene.fog = fog;

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 20);
    camera.position.set(0, 0.2, 3.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio ?? 1);
    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;

    containerRef.current.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight('#cbd5f5', 0.35);
    const spot = new THREE.SpotLight('#7dd3fc', 1.1);
    spot.position.set(2, 3, 4);
    spot.angle = 0.4;
    const point = new THREE.PointLight('#1e40af', 0.6);
    point.position.set(-2, -1, 3);
    scene.add(ambient, spot, point);

    const faceGroup = new THREE.Group();
    faceGroup.position.set(0, -0.1, 0);
    scene.add(faceGroup);
    faceRef.current = faceGroup;

    const faceMaterial = new THREE.MeshStandardMaterial({ color: '#0f172a', metalness: 0.6, roughness: 0.25 });
    const faceMesh = new THREE.Mesh(new THREE.SphereGeometry(1.1, 48, 48), faceMaterial);
    faceGroup.add(faceMesh);

    const visorMaterial = new THREE.MeshStandardMaterial({
      color: '#1e293b',
      metalness: 0.4,
      roughness: 0.1,
      transparent: true,
      opacity: 0.45,
    });
    const visor = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 32), visorMaterial);
    visor.position.set(0, 0.1, 0.9);
    faceGroup.add(visor);

    const glowMaterial = new THREE.MeshStandardMaterial({
      color: '#38bdf8',
      emissive: '#38bdf8',
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.55,
    });
    const glow = new THREE.Mesh(new THREE.SphereGeometry(0.78, 32, 32), glowMaterial);
    glow.position.set(0, 0.1, 0.6);
    faceGroup.add(glow);
    glowRef.current = glow;

    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: '#e2e8f0',
      emissive: '#38bdf8',
      emissiveIntensity: 1.2,
    });
    const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), eyeMaterial);
    leftEye.position.set(-0.32, 0.18, 0.92);
    faceGroup.add(leftEye);
    leftEyeRef.current = leftEye;

    const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), eyeMaterial.clone());
    rightEye.position.set(0.32, 0.18, 0.92);
    faceGroup.add(rightEye);
    rightEyeRef.current = rightEye;

    const coreMaterial = new THREE.MeshStandardMaterial({
      color: '#7dd3fc',
      emissive: '#e0f2fe',
      emissiveIntensity: 1.4,
    });
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.32, 32, 32), coreMaterial);
    core.position.set(0, 0.2, 0.4);
    scene.add(core);
    coreRef.current = core;

    const ringMaterial = new THREE.MeshStandardMaterial({
      color: '#38bdf8',
      emissive: '#38bdf8',
      emissiveIntensity: 0.9,
    });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.02, 16, 64), ringMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, 0.2, 0.4);
    scene.add(ring);
    ringRef.current = ring;

    const resize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) {
        return;
      }
      const { width, height } = containerRef.current.getBoundingClientRect();
      const nextHeight = Math.max(height, 1);
      const nextWidth = Math.max(width, 1);
      cameraRef.current.aspect = nextWidth / nextHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(nextWidth, nextHeight);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(containerRef.current);

    const animate = () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current) {
        return;
      }
      const camera = cameraRef.current;
      const targetZoom = active ? 1 - progress : 0;
      zoomRef.current += (targetZoom - zoomRef.current) * 0.14;
      const zBase = 3.2;
      const zTarget = 1.4;
      camera.position.z = zBase - (zBase - zTarget) * zoomRef.current;
      camera.position.y = 0.2 + 0.12 * zoomRef.current;
      const time = Date.now() * 0.004;
      const pulse = active ? 0.15 + progress * 0.35 : 0.12;
      if (coreRef.current) {
        coreRef.current.scale.setScalar(0.9 + Math.sin(time) * pulse);
      }
      if (ringRef.current) {
        ringRef.current.rotation.y += 0.01 + progress * 0.02;
      }
      if (faceRef.current) {
        faceRef.current.rotation.x = progress * 0.35;
        faceRef.current.rotation.y = Math.sin(Date.now() * 0.0015) * 0.05;
      }
      if (glowRef.current) {
        glowRef.current.scale.setScalar(1 + Math.sin(Date.now() * 0.003) * pulse * 0.08);
        (glowRef.current.material as THREE.MeshStandardMaterial).opacity = 0.35 + progress * 0.45;
      }
      const emissive = new THREE.Color().setHSL(0.56, 0.9, 0.6 + progress * 0.2);
      if (leftEyeRef.current) {
        (leftEyeRef.current.material as THREE.MeshStandardMaterial).emissive = emissive;
      }
      if (rightEyeRef.current) {
        (rightEyeRef.current.material as THREE.MeshStandardMaterial).emissive = emissive;
      }
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      observer.disconnect();
      renderer.dispose();
      scene.clear();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [active, fog, progress]);

  return <div ref={containerRef} className="absolute inset-0" />;
}