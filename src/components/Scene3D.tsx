import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { siteConfig } from '../config/site';

interface Scene3DProps {
  isMobile: boolean;
  prefersReducedMotion: boolean;
  activeTech: string;
  onSelectTech: (tech: string) => void;
}

type RenderMode = 'studio' | 'wireframe' | 'orbital';

const TECH_DETAILS: Record<string, { role: string; layer: string; color: string }> = {
  React: {
    role: 'Declarative UI component architecture & interactive state',
    layer: 'Frontend Layer',
    color: '#3B82F6',
  },
  JavaScript: {
    role: 'Asynchronous ES6+ runtime logic & interactive DOM orchestration',
    layer: 'Core Language',
    color: '#60A5FA',
  },
  'Node.js': {
    role: 'Event-driven server runtime & real-time WebSocket pipelines',
    layer: 'Backend Runtime',
    color: '#6366F1',
  },
  Python: {
    role: 'Server-side scripting, API services & data automation',
    layer: 'Backend Services',
    color: '#818CF8',
  },
  PHP: {
    role: 'Dynamic server-side web application architecture',
    layer: 'Backend Layer',
    color: '#6366F1',
  },
  MongoDB: {
    role: 'Document-oriented NoSQL data persistence & aggregation',
    layer: 'Database Layer',
    color: '#06B6D4',
  },
  MySQL: {
    role: 'ACID-compliant relational schema & indexed SQL queries',
    layer: 'Database Layer',
    color: '#22D3EE',
  },
  AWS: {
    role: 'Cloud infrastructure, media pipelines & scalable hosting',
    layer: 'Cloud & Infrastructure',
    color: '#3B82F6',
  },
};

/**
 * Verifies that a WebGL context is genuinely usable by Three.js WebGLCapabilities
 * BEFORE calling `new THREE.WebGLRenderer()`, preventing Three.js from logging
 * internal `console.error` messages when `gl.getShaderPrecisionFormat` returns null.
 */
function getValidatedWebGLContext(
  canvas: HTMLCanvasElement,
  isMobile: boolean
): WebGLRenderingContext | WebGL2RenderingContext | null {
  try {
    const contextAttributes: WebGLContextAttributes = {
      alpha: true,
      antialias: !isMobile,
      powerPreference: isMobile ? 'low-power' : 'high-performance',
      failIfMajorPerformanceCaveat: false,
    };

    const gl =
      (canvas.getContext('webgl2', contextAttributes) as WebGL2RenderingContext | null) ||
      (canvas.getContext('webgl', contextAttributes) as WebGLRenderingContext | null) ||
      (canvas.getContext(
        'experimental-webgl',
        contextAttributes
      ) as WebGLRenderingContext | null);

    if (!gl || typeof gl.getShaderPrecisionFormat !== 'function') {
      return null;
    }

    if (typeof gl.isContextLost === 'function' && gl.isContextLost()) {
      return null;
    }

    const version = gl.getParameter(gl.VERSION);
    if (!version) {
      return null;
    }

    // Three.js WebGLCapabilities checks all of these precision formats unconditionally:
    const shaders = [gl.VERTEX_SHADER, gl.FRAGMENT_SHADER];
    const precisions = [
      gl.HIGH_FLOAT,
      gl.MEDIUM_FLOAT,
      gl.LOW_FLOAT,
      gl.HIGH_INT,
      gl.MEDIUM_INT,
      gl.LOW_INT,
    ];

    for (const shader of shaders) {
      for (const precisionType of precisions) {
        const format = gl.getShaderPrecisionFormat(shader, precisionType);
        if (!format || typeof format.precision !== 'number') {
          return null;
        }
      }
    }

    return gl;
  } catch {
    return null;
  }
}

/**
 * Interactive 3D perspective software renderer using HTML5 2D Canvas.
 * Renders a genuine 3D icosahedron core, wireframe cage, counter-rotating 3D orbital rings,
 * orbiting satellites, and 3D particles with mouse parallax when WebGL is unavailable or disabled.
 */
function startInteractiveCanvas3D(
  container: HTMLElement,
  isMobile: boolean,
  prefersReducedMotion: boolean,
  renderModeRef: React.MutableRefObject<RenderMode>
): () => void {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  container.innerHTML = '';
  container.appendChild(canvas);

  let width = container.clientWidth || 520;
  let height = container.clientHeight || 520;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const updateSize = () => {
    width = container.clientWidth || 520;
    height = container.clientHeight || 520;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  updateSize();

  // Generate Golden-Ratio 3D Icosahedron vertices & faces
  const t = (1 + Math.sqrt(5)) / 2;
  const rawVertices = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ].map(([x, y, z]) => {
    const len = Math.hypot(x, y, z);
    return { x: x / len, y: y / len, z: z / len };
  });

  const faces = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ];

  // Extract unique edges
  const edgeSet = new Set<string>();
  const edges: [number, number][] = [];
  faces.forEach(([a, b, c]) => {
    [
      [a, b],
      [b, c],
      [c, a],
    ].forEach(([u, v]) => {
      const key = u < v ? `${u}-${v}` : `${v}-${u}`;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        edges.push([u, v]);
      }
    });
  });

  // Generate 3D particles
  const particleCount = isMobile ? 55 : 110;
  const particles = Array.from({ length: particleCount }, () => {
    const r = 1.6 + Math.random() * 1.4;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    return {
      x: r * Math.sin(phi) * Math.cos(theta),
      y: r * Math.sin(phi) * Math.sin(theta),
      z: r * Math.cos(phi),
      size: 1 + Math.random() * 1.5,
    };
  });

  let targetRotX = 0;
  let targetRotY = 0;
  let currentRotX = 0;
  let currentRotY = 0;

  const handleMouseMove = (e: MouseEvent) => {
    if (prefersReducedMotion) return;
    const rect = container.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    targetRotY = Math.max(-1, Math.min(1, nx)) * 0.55;
    targetRotX = Math.max(-1, Math.min(1, ny)) * 0.45;
  };

  window.addEventListener('mousemove', handleMouseMove, { passive: true });
  window.addEventListener('resize', updateSize);

  const rotate3D = (
    p: { x: number; y: number; z: number },
    rx: number,
    ry: number,
    rz: number
  ) => {
    // Rotate X
    const cosX = Math.cos(rx);
    const sinX = Math.sin(rx);
    const y1 = p.y * cosX - p.z * sinX;
    const z1 = p.y * sinX + p.z * cosX;

    // Rotate Y
    const cosY = Math.cos(ry);
    const sinY = Math.sin(ry);
    const x2 = p.x * cosY + z1 * sinY;
    const z2 = -p.x * sinY + z1 * cosY;

    // Rotate Z
    const cosZ = Math.cos(rz);
    const sinZ = Math.sin(rz);
    const x3 = x2 * cosZ - y1 * sinZ;
    const y3 = x2 * sinZ + y1 * cosZ;

    return { x: x3, y: y3, z: z2 };
  };

  const project = (p: { x: number; y: number; z: number }, scaleRadius: number) => {
    const fov = 4.2;
    const distance = fov / (fov - p.z);
    return {
      x: width / 2 + p.x * scaleRadius * distance,
      y: height / 2 + p.y * scaleRadius * distance,
      z: p.z,
      scale: distance,
    };
  };

  let frameId: number;
  const startTime = performance.now();

  const render = (now: number) => {
    const elapsed = prefersReducedMotion ? 1.2 : (now - startTime) * 0.001;
    const mode = renderModeRef.current;
    const speed = mode === 'orbital' ? 1.55 : 1;

    currentRotX += (targetRotX - currentRotX) * 0.06;
    currentRotY += (targetRotY - currentRotY) * 0.06;

    ctx.clearRect(0, 0, width, height);

    const baseScale = Math.min(width, height) * 0.23;
    const rotX = elapsed * 0.22 * speed - currentRotX;
    const rotY = elapsed * 0.32 * speed + currentRotY;
    const rotZ = elapsed * 0.12 * speed;

    // 1. Render 3D Spatial Particles
    particles.forEach((pt) => {
      const rp = rotate3D(pt, rotX * 0.25, rotY * 0.3, 0);
      const proj = project(rp, baseScale);
      const alpha = Math.max(0.12, Math.min(0.65, (rp.z + 2) / 3.5));
      ctx.fillStyle = `rgba(147, 197, 253, ${alpha})`;
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, pt.size * proj.scale, 0, Math.PI * 2);
      ctx.fill();
    });

    // 2. Render Two Counter-Rotating 3D Orbital Rings
    const drawOrbitRing = (
      radiusMult: number,
      tiltX: number,
      tiltY: number,
      spin: number,
      strokeColor: string
    ) => {
      const segments = 64;
      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const a = (i / segments) * Math.PI * 2 + spin;
        const pt = {
          x: Math.cos(a) * radiusMult,
          y: 0,
          z: Math.sin(a) * radiusMult,
        };
        const rPt = rotate3D(pt, tiltX + currentRotX * 0.5, tiltY + currentRotY * 0.5, 0);
        const proj = project(rPt, baseScale);
        if (i === 0) ctx.moveTo(proj.x, proj.y);
        else ctx.lineTo(proj.x, proj.y);
      }
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.25;
      ctx.stroke();
    };

    drawOrbitRing(
      1.62,
      Math.PI / 2.8,
      elapsed * 0.2 * speed,
      elapsed * 0.3,
      mode === 'orbital' ? 'rgba(96, 165, 250, 0.55)' : 'rgba(96, 165, 250, 0.32)'
    );
    drawOrbitRing(
      1.92,
      -Math.PI / 3.2,
      -elapsed * 0.16 * speed,
      -elapsed * 0.25,
      'rgba(99, 102, 241, 0.26)'
    );

    // 3. Render Inner Faceted Core (Studio / Orbital modes)
    const coreVertices = rawVertices.map((v) =>
      rotate3D({ x: v.x * 0.95, y: v.y * 0.95, z: v.z * 0.95 }, rotX, rotY, rotZ)
    );

    if (mode !== 'wireframe') {
      const sortedFaces = faces
        .map(([a, b, c]) => {
          const va = coreVertices[a];
          const vb = coreVertices[b];
          const vc = coreVertices[c];
          const cz = (va.z + vb.z + vc.z) / 3;
          // Compute face normal for studio directional lighting
          const ux = vb.x - va.x;
          const uy = vb.y - va.y;
          const uz = vb.z - va.z;
          const vx = vc.x - va.x;
          const vy = vc.y - va.y;
          const vz = vc.z - va.z;
          const nx = uy * vz - uz * vy;
          const ny = uz * vx - ux * vz;
          const nz = ux * vy - uy * vx;
          const nLen = Math.hypot(nx, ny, nz) || 1;
          return {
            indices: [a, b, c],
            cz,
            normal: { x: nx / nLen, y: ny / nLen, z: nz / nLen },
          };
        })
        .sort((f1, f2) => f1.cz - f2.cz);

      sortedFaces.forEach(({ indices: [a, b, c], normal }) => {
        if (normal.z < -0.15) return; // Backface cull
        const pa = project(coreVertices[a], baseScale);
        const pb = project(coreVertices[b], baseScale);
        const pc = project(coreVertices[c], baseScale);

        const lightIntensity = Math.max(
          0.15,
          normal.x * 0.45 - normal.y * 0.45 + normal.z * 0.75
        );
        const r = Math.round(12 + lightIntensity * 38);
        const g = Math.round(24 + lightIntensity * 85);
        const bl = Math.round(58 + lightIntensity * 165);

        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.lineTo(pc.x, pc.y);
        ctx.closePath();
        ctx.fillStyle = `rgba(${r}, ${g}, ${bl}, 0.88)`;
        ctx.fill();
        ctx.strokeStyle = 'rgba(96, 165, 250, 0.28)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });
    }

    // 4. Render Outer Holographic Wireframe Shell
    const shellVertices = rawVertices.map((v) =>
      rotate3D(
        { x: v.x * 1.22, y: v.y * 1.22, z: v.z * 1.22 },
        -rotX * 0.7,
        -rotY * 0.7,
        rotZ * 0.5
      )
    );

    edges.forEach(([u, v]) => {
      const pu = project(shellVertices[u], baseScale);
      const pv = project(shellVertices[v], baseScale);
      const avgZ = (shellVertices[u].z + shellVertices[v].z) * 0.5;
      const alpha = mode === 'wireframe' ? 0.65 : Math.max(0.14, (avgZ + 1.5) * 0.22);

      ctx.beginPath();
      ctx.moveTo(pu.x, pu.y);
      ctx.lineTo(pv.x, pv.y);
      ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
      ctx.lineWidth = mode === 'wireframe' ? 1.4 : 1;
      ctx.stroke();
    });

    // 5. Render Orbiting Satellite Nodes
    const satCount = isMobile ? 6 : 8;
    for (let i = 0; i < satCount; i++) {
      const angle = (i / satCount) * Math.PI * 2 + elapsed * (0.4 + (i % 3) * 0.1) * speed;
      const radius = i % 2 === 0 ? 1.62 : 1.92;
      const satPt = rotate3D(
        {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle * 2) * 0.35,
          z: Math.sin(angle) * radius,
        },
        currentRotX * 0.5,
        currentRotY * 0.5,
        0
      );
      const proj = project(satPt, baseScale);

      ctx.beginPath();
      ctx.arc(proj.x, proj.y, 3.2 * proj.scale, 0, Math.PI * 2);
      ctx.fillStyle = '#38BDF8';
      ctx.fill();
    }

    frameId = requestAnimationFrame(render);
  };

  frameId = requestAnimationFrame(render);

  return () => {
    cancelAnimationFrame(frameId);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('resize', updateSize);
  };
}

export const Scene3D: React.FC<Scene3DProps> = ({
  isMobile,
  prefersReducedMotion,
  activeTech,
  onSelectTech,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [useFallback2D, setUseFallback2D] = useState<boolean>(false);
  const [renderMode, setRenderMode] = useState<RenderMode>('studio');
  const renderModeRef = useRef<RenderMode>('studio');

  useEffect(() => {
    renderModeRef.current = renderMode;
  }, [renderMode]);

  useEffect(() => {
    if (useFallback2D) return;
    const container = mountRef.current;
    if (!container) return;

    // Create a single canvas and strictly validate all shader precision formats
    // before ever calling `new THREE.WebGLRenderer()`
    const testCanvas = document.createElement('canvas');
    const validatedGl = getValidatedWebGLContext(testCanvas, isMobile);

    if (!validatedGl) {
      // Seamlessly run our interactive 3D perspective Canvas renderer without triggering Three.js console errors
      return startInteractiveCanvas3D(
        container,
        isMobile,
        prefersReducedMotion,
        renderModeRef
      );
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: testCanvas,
        context: validatedGl as WebGLRenderingContext,
        antialias: !isMobile,
        alpha: true,
        powerPreference: isMobile ? 'low-power' : 'high-performance',
      });
    } catch {
      return startInteractiveCanvas3D(
        container,
        isMobile,
        prefersReducedMotion,
        renderModeRef
      );
    }

    const width = container.clientWidth || 520;
    const height = container.clientHeight || 520;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050507, 0.065);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    // Three-Point Studio Lighting
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x3b82f6, 3.2);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x6366f1, 1.8);
    fillLight.position.set(-5, -3, 3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x06b6d4, 4.5, 14);
    rimLight.position.set(0, 3.5, -3.5);
    scene.add(rimLight);

    // Root Workstation / Core Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Inner Faceted Physical Core
    const coreDetail = isMobile ? 1 : 2;
    const coreGeo = new THREE.IcosahedronGeometry(1.35, coreDetail);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0b132b,
      emissive: 0x1e3a8a,
      emissiveIntensity: 0.35,
      metalness: 0.75,
      roughness: 0.22,
      flatShading: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    rootGroup.add(coreMesh);

    // 2. Outer Holographic Wireframe Shell
    const shellGeo = new THREE.IcosahedronGeometry(1.68, isMobile ? 1 : 2);
    const shellMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.32,
    });
    const shellMesh = new THREE.Mesh(shellGeo, shellMat);
    rootGroup.add(shellMesh);

    // 3. Orbital Gyroscope Rings
    const ring1Geo = new THREE.TorusGeometry(2.3, 0.014, 16, isMobile ? 64 : 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.42,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 2.6;
    ring1.rotation.y = Math.PI / 8;
    rootGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.75, 0.012, 16, isMobile ? 64 : 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.28,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 3.1;
    ring2.rotation.z = Math.PI / 5;
    rootGroup.add(ring2);

    // 4. Floating Geometric Satellite Nodes around the Core
    const satellitesGroup = new THREE.Group();
    rootGroup.add(satellitesGroup);

    const satGeo = new THREE.OctahedronGeometry(0.11, 0);
    const satMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      metalness: 0.5,
      roughness: 0.2,
    });

    const satCount = isMobile ? 6 : 8;
    const satellites: {
      mesh: THREE.Mesh;
      radius: number;
      speed: number;
      angle: number;
      yOffset: number;
    }[] = [];

    for (let i = 0; i < satCount; i++) {
      const mesh = new THREE.Mesh(satGeo, satMat);
      const angle = (i / satCount) * Math.PI * 2;
      const radius = i % 2 === 0 ? 2.3 : 2.75;
      const yOffset = Math.sin(angle * 2) * 0.65;
      mesh.position.set(Math.cos(angle) * radius, yOffset, Math.sin(angle) * radius);
      satellitesGroup.add(mesh);
      satellites.push({
        mesh,
        radius,
        speed: 0.35 + (i % 3) * 0.12,
        angle,
        yOffset,
      });
    }

    // 5. Spatial Particle Field
    const particleCount = isMobile ? 80 : 220;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 2.8 + Math.random() * 3.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: isMobile ? 0.035 : 0.028,
      transparent: true,
      opacity: 0.55,
    });
    const particleSystem = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particleSystem);

    // Mouse Parallax Interaction
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handlePointerMove = (event: MouseEvent) => {
      if (prefersReducedMotion) return;
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      targetX = Math.max(-1, Math.min(1, x)) * 0.55;
      targetY = Math.max(-1, Math.min(1, y)) * 0.45;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      setUseFallback2D(true);
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('webglcontextlost', handleContextLost, false);

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 520;
      const newH = container.clientHeight || 520;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      const mode = renderModeRef.current;

      if (mode === 'wireframe') {
        coreMat.wireframe = true;
        shellMat.opacity = 0.65;
        ring1Mat.opacity = 0.6;
      } else if (mode === 'orbital') {
        coreMat.wireframe = false;
        shellMat.opacity = 0.18;
        ring1Mat.opacity = 0.75;
      } else {
        coreMat.wireframe = false;
        shellMat.opacity = 0.32;
        ring1Mat.opacity = 0.42;
      }

      if (!prefersReducedMotion) {
        const speedMultiplier = mode === 'orbital' ? 1.65 : 1;
        coreMesh.rotation.y = elapsedTime * 0.22 * speedMultiplier;
        coreMesh.rotation.x = elapsedTime * 0.14 * speedMultiplier;

        shellMesh.rotation.y = -elapsedTime * 0.15 * speedMultiplier;
        shellMesh.rotation.z = elapsedTime * 0.1 * speedMultiplier;

        ring1.rotation.z = elapsedTime * 0.25 * speedMultiplier;
        ring2.rotation.y = -elapsedTime * 0.18 * speedMultiplier;

        satellites.forEach((sat, idx) => {
          const a = sat.angle + elapsedTime * sat.speed * speedMultiplier;
          sat.mesh.position.x = Math.cos(a) * sat.radius;
          sat.mesh.position.z = Math.sin(a) * sat.radius;
          sat.mesh.position.y = Math.sin(a * 2 + idx) * 0.55;
          sat.mesh.rotation.x = elapsedTime * 0.8;
          sat.mesh.rotation.y = elapsedTime * 0.6;
        });

        particleSystem.rotation.y = elapsedTime * 0.04;

        currentX += (targetX - currentX) * 0.06;
        currentY += (targetY - currentY) * 0.06;
        rootGroup.rotation.y = currentX;
        rootGroup.rotation.x = -currentY;
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('webglcontextlost', handleContextLost);

      coreGeo.dispose();
      coreMat.dispose();
      shellGeo.dispose();
      shellMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      satGeo.dispose();
      satMat.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
      renderer.dispose();
    };
  }, [isMobile, prefersReducedMotion, useFallback2D]);

  // Orbital positions for the 8 floating technology labels around the 3D scene
  const floatingPositions = [
    { top: '8%', left: '10%' },
    { top: '10%', right: '8%' },
    { top: '34%', left: '2%' },
    { top: '36%', right: '2%' },
    { bottom: '32%', left: '4%' },
    { bottom: '30%', right: '4%' },
    { bottom: '12%', left: '16%' },
    { bottom: '12%', right: '14%' },
  ];

  const activeTechInfo = TECH_DETAILS[activeTech] || TECH_DETAILS.React;

  return (
    <div
      className="relative w-full h-[430px] sm:h-[520px] lg:h-[580px] flex items-center justify-center select-none"
      data-cursor="3d"
    >
      {/* Ambient Radial Studio Backlight */}
      <div
        className="pointer-events-none absolute inset-10 rounded-full bg-gradient-to-tr from-blue-600/15 via-indigo-500/10 to-cyan-400/10 blur-3xl"
        aria-hidden="true"
      />

      {/* Interactive 3D Viewport OR Lightweight 2D Orbital View */}
      {!useFallback2D ? (
        <div
          ref={mountRef}
          className="w-full h-full relative z-10"
          aria-label="Interactive 3D developer architecture core"
          role="img"
        />
      ) : (
        <div
          className="relative z-10 flex items-center justify-center w-full h-full"
          aria-label="2D geometric developer architecture visualization"
          role="img"
        >
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-blue-500/30 animate-spin [animation-duration:24s]" />
            <div className="absolute inset-6 rounded-full border border-dashed border-indigo-400/30 animate-spin [animation-duration:18s] [animation-direction:reverse]" />
            <div className="absolute inset-14 rounded-full border border-cyan-400/25" />
            <div className="relative flex flex-col items-center justify-center w-32 h-32 rounded-2xl bg-[#0D111A]/90 border border-blue-500/40 shadow-[0_0_50px_rgba(59,130,246,0.25)] backdrop-blur-md">
              <span className="font-display text-2xl font-bold text-white">
                {siteConfig.monogram}
              </span>
              <span className="text-[11px] text-blue-300 font-mono mt-1">FULL STACK</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Technology Nodes Around 3D Object */}
      <div className="pointer-events-none absolute inset-0 z-20">
        {siteConfig.heroFloatingTech.map((tech, idx) => {
          const pos = floatingPositions[idx % floatingPositions.length];
          const isSelected = activeTech === tech;
          return (
            <button
              key={tech}
              type="button"
              onClick={() => onSelectTech(tech)}
              style={pos}
              className={`pointer-events-auto absolute px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap backdrop-blur-md border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                isSelected
                  ? 'bg-blue-600/25 border-blue-400/80 text-white shadow-[0_0_20px_rgba(59,130,246,0.35)] -translate-y-0.5'
                  : 'bg-[#090C14]/75 border-white/10 text-slate-300 hover:text-white hover:border-blue-400/40 hover:-translate-y-0.5'
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isSelected ? 'bg-cyan-400' : 'bg-blue-500/70'
                  }`}
                  aria-hidden="true"
                />
                <span>{tech}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Subtle Floating HUD Inspector & Mode Switcher */}
      <div className="absolute bottom-2 left-3 right-3 sm:left-6 sm:right-6 z-20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#080B11]/80 backdrop-blur-md border border-white/10">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-white whitespace-nowrap">{activeTech}</span>
            <span className="text-slate-500" aria-hidden="true">·</span>
            <span className="text-blue-400 font-mono text-[11px] truncate">
              {activeTechInfo.layer}
            </span>
          </div>
          <p className="text-xs text-slate-400 truncate mt-0.5">{activeTechInfo.role}</p>
        </div>

        <div className="flex items-center gap-1 self-end sm:self-center shrink-0">
          {(['studio', 'wireframe', 'orbital'] as RenderMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => {
                setUseFallback2D(false);
                setRenderMode(mode);
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-colors whitespace-nowrap ${
                !useFallback2D && renderMode === mode
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {mode}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setUseFallback2D((prev) => !prev)}
            title="Toggle lightweight 2D mode"
            className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors whitespace-nowrap ${
              useFallback2D
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {useFallback2D ? '2D' : '3D'}
          </button>
        </div>
      </div>
    </div>
  );
};

