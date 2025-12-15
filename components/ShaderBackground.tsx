import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// --- Advanced Dither Shader Material ---

const futuristicVertexShader = `
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

uniform float uTime;
uniform vec2 uMouse;

// Simplex 3D Noise function (simplified)
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) { 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

  i = mod289(i); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

void main() {
  vUv = uv;
  vPosition = position;
  
  // Reduced noise amplitude for smoother surface
  float noiseVal = snoise(vec3(position.x * 0.3, position.y * 0.3, uTime * 0.1));
  vec3 newPos = position + normal * noiseVal * 0.1; 

  // Slower breathing
  newPos += normal * sin(uTime * 0.3) * 0.02;

  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
}
`;

const futuristicFragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

// Bayer Matrix 4x4 for cleaner dither look
float bayer4x4(vec2 uv) {
    int x = int(mod(uv.x, 4.0));
    int y = int(mod(uv.y, 4.0));
    int index = x + y * 4;
    
    if (index == 0) return 0.0625;
    if (index == 1) return 0.5625;
    if (index == 2) return 0.1875;
    if (index == 3) return 0.6875;
    if (index == 4) return 0.8125;
    if (index == 5) return 0.3125;
    if (index == 6) return 0.9375;
    if (index == 7) return 0.4375;
    if (index == 8) return 0.25;
    if (index == 9) return 0.75;
    if (index == 10) return 0.125;
    if (index == 11) return 0.625;
    if (index == 12) return 1.0;
    if (index == 13) return 0.5;
    if (index == 14) return 0.875;
    if (index == 15) return 0.375;
    return 0.5;
}

void main() {
  // 1. Lighting Calculation
  vec3 lightDir = normalize(vec3(uMouse.x * 0.5, uMouse.y * 0.5, 2.0));
  
  // Increased ambient/diffuse for more visibility
  float ambient = 0.08;
  float diffuse = max(dot(vNormal, lightDir), 0.0) * 0.6;
  
  // Rim Lighting - Enhanced for edge visibility
  vec3 viewDir = normalize(vec3(0.0, 0.0, 5.0) - vPosition);
  float rim = 1.0 - max(dot(viewDir, vNormal), 0.0);
  rim = pow(rim, 3.0) * 0.7; // Stronger rim for visible edges
  
  float intensity = ambient + diffuse + rim;
  
  // 2. Dithering
  vec2 screenPos = gl_FragCoord.xy;
  float threshold = bayer4x4(screenPos);
  
  // 3. Output Color Strategy - CRITICAL FOR TEXT VISIBILITY
  // Use very dark colors.
  
  // Lit color - brighter grey for more visibility
  vec3 litColor = vec3(0.25, 0.26, 0.28); 
  vec3 darkColor = vec3(0.02, 0.02, 0.02);
  
  float quantized = step(threshold, intensity);
  
  // Fade out edges deeply
  float dist = gl_FragCoord.z / gl_FragCoord.w;
  float fog = 1.0 - smoothstep(2.0, 9.0, dist);
  quantized *= fog;

  vec3 finalColor = mix(darkColor, litColor, quantized);

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

interface ShapeProps {
  position?: [number, number, number];
  scale?: number;
  rotationSpeed?: number;
  geometryType?: 'knot' | 'icosahedron';
}

const DitheredShape: React.FC<ShapeProps> = ({ 
  position = [0, 0, 0], 
  scale = 1, 
  rotationSpeed = 0.04,
  geometryType = 'knot'
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { mouse } = useThree();
  
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uMouse: { value: new THREE.Vector2(0, 0) }
    }),
    []
  );

  useFrame((state) => {
    const { clock } = state;
    if (meshRef.current) {
        // @ts-ignore
      meshRef.current.material.uniforms.uTime.value = clock.getElapsedTime();
      
      // Mouse interaction
      const targetX = mouse.x;
      const targetY = mouse.y;
      // @ts-ignore
      meshRef.current.material.uniforms.uMouse.value.x = THREE.MathUtils.lerp(
        // @ts-ignore
        meshRef.current.material.uniforms.uMouse.value.x, 
        targetX, 
        0.05
      );
      // @ts-ignore
      meshRef.current.material.uniforms.uMouse.value.y = THREE.MathUtils.lerp(
         // @ts-ignore
        meshRef.current.material.uniforms.uMouse.value.y, 
        targetY, 
        0.05
      );

      // Rotation
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * rotationSpeed) * 0.2;
      meshRef.current.rotation.y += rotationSpeed * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      {geometryType === 'knot' && <torusKnotGeometry args={[1, 0.35, 100, 16]} />}
      {geometryType === 'icosahedron' && <icosahedronGeometry args={[1, 0]} />}
      <shaderMaterial
        fragmentShader={futuristicFragmentShader}
        vertexShader={futuristicVertexShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  );
};

// --- Parallax Cloud Layer Shader ---
const cloudLayerVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const cloudLayerFragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform float uScrollY;

varying vec2 vUv;

// Hash functions for noise
vec2 hash22(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

// Simplex-like 2D noise
float noise2D(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  
  vec2 u = f * f * (3.0 - 2.0 * f);
  
  return mix(
    mix(hash21(i + vec2(0.0, 0.0)), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

// Fractal Brownian Motion
float fbm(vec2 p, int octaves) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  float lacunarity = 2.0;
  float persistence = 0.5;
  
  for(int i = 0; i < 8; i++) {
    if(i >= octaves) break;
    value += amplitude * noise2D(p * frequency);
    amplitude *= persistence;
    frequency *= lacunarity;
  }
  return value;
}

// Cloud shape function - creates billowy cloud forms
float cloudShape(vec2 uv, float time, float speed, float scale, float offset) {
  vec2 movement = vec2(time * speed, time * speed * 0.3);
  vec2 pos = uv * scale + movement + vec2(offset * 100.0, offset * 50.0);
  
  // Base cloud noise
  float n = fbm(pos, 6);
  
  // Create cloud-like billows
  n = smoothstep(0.3, 0.7, n);
  
  // Add wispy details
  float detail = fbm(pos * 3.0 + vec2(time * speed * 0.5), 4) * 0.3;
  n += detail * n;
  
  return n;
}

void main() {
  vec2 uv = vUv;
  float aspectRatio = uResolution.x / uResolution.y;
  uv.x *= aspectRatio;
  
  float time = uTime;
  
  // Parallax offset based on scroll
  float parallaxStrength = 0.0003;
  
  // Layer 1 - Far background clouds (slowest, largest)
  vec2 uv1 = uv + vec2(0.0, uScrollY * parallaxStrength * 0.3);
  float cloud1 = cloudShape(uv1, time, 0.02, 1.5, 0.0);
  
  // Layer 2 - Mid clouds
  vec2 uv2 = uv + vec2(0.0, uScrollY * parallaxStrength * 0.6);
  float cloud2 = cloudShape(uv2, time, 0.035, 2.5, 1.0);
  
  // Layer 3 - Closer clouds (faster, smaller details)
  vec2 uv3 = uv + vec2(0.0, uScrollY * parallaxStrength * 1.0);
  float cloud3 = cloudShape(uv3, time, 0.05, 4.0, 2.0);
  
  // Layer 4 - Foreground wisps (fastest)
  vec2 uv4 = uv + vec2(0.0, uScrollY * parallaxStrength * 1.5);
  float cloud4 = cloudShape(uv4, time, 0.08, 6.0, 3.0);
  
  // Color palette - dark moody clouds (lightened for visibility)
  vec3 bgColor = vec3(0.03, 0.03, 0.04);
  vec3 cloudColor1 = vec3(0.10, 0.11, 0.16);  // Deep blue-grey
  vec3 cloudColor2 = vec3(0.13, 0.14, 0.20);  // Slightly lighter
  vec3 cloudColor3 = vec3(0.16, 0.17, 0.23);  // Mid tone
  vec3 cloudColor4 = vec3(0.19, 0.21, 0.27);  // Lighter wisps
  
  // Subtle highlight color for edges
  vec3 highlightColor = vec3(0.24, 0.27, 0.35);
  
  // Composite layers with depth
  vec3 color = bgColor;
  
  // Add each layer with decreasing opacity for depth
  color = mix(color, cloudColor1, cloud1 * 0.4);
  color = mix(color, cloudColor2, cloud2 * 0.35);
  color = mix(color, cloudColor3, cloud3 * 0.3);
  color = mix(color, cloudColor4, cloud4 * 0.25);
  
  // Add subtle edge highlights on the brightest parts
  float highlight = max(max(cloud3, cloud4) - 0.5, 0.0) * 2.0;
  color = mix(color, highlightColor, highlight * 0.15);
  
  // Vignette effect - darker at edges
  vec2 vignetteUv = vUv * 2.0 - 1.0;
  float vignette = 1.0 - dot(vignetteUv * 0.5, vignetteUv * 0.5);
  vignette = smoothstep(0.0, 1.0, vignette);
  color *= vignette * 0.7 + 0.3;
  
  // Overall transparency
  float alpha = 0.85;
  
  gl_FragColor = vec4(color, alpha);
}
`;

// Full-screen cloud layer component
const CloudLayer: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uScrollY: { value: 0 }
    }),
    []
  );

  useFrame((state) => {
    if (meshRef.current) {
      // @ts-ignore
      meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
      // @ts-ignore
      meshRef.current.material.uniforms.uScrollY.value = window.scrollY;
      // @ts-ignore
      meshRef.current.material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -5]}>
      <planeGeometry args={[viewport.width * 2, viewport.height * 2]} />
      <shaderMaterial
        fragmentShader={cloudLayerFragmentShader}
        vertexShader={cloudLayerVertexShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
      />
    </mesh>
  );
};

const Scene = () => {
  const { viewport } = useThree();
  // Don't show side elements on very narrow screens (mobile) to avoid overlap
  const isWide = viewport.width > 12;

  return (
    <>
      {/* Parallax Cloud Layer - "Badal" */}
      <CloudLayer />
      
      {/* Central Background Element */}
      <DitheredShape position={[0, 0, 0]} scale={1.8} rotationSpeed={0.04} geometryType="knot" />

      {/* Floating Side Elements (Sci-fi Icosahedrons) */}
      {isWide && (
        <>
          <DitheredShape 
            position={[-viewport.width / 2.8, 1.5, -1]} 
            scale={0.9} 
            rotationSpeed={0.08} 
            geometryType="icosahedron" 
          />
          <DitheredShape 
            position={[viewport.width / 2.8, -1.5, -1]} 
            scale={1.2} 
            rotationSpeed={0.06} 
            geometryType="icosahedron" 
          />
        </>
      )}
    </>
  );
};

const Particles = () => {
    const count = 40;
    const mesh = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    
    const particles = useMemo(() => {
        const temp = [];
        for(let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.005 + Math.random() / 500;
            const x = (Math.random() - 0.5) * 12;
            const y = (Math.random() - 0.5) * 12;
            const z = (Math.random() - 0.5) * 12;
            temp.push({ t, factor, speed, x, y, z });
        }
        return temp;
    }, [count]);

    useFrame(() => {
        if(!mesh.current) return;
        
        particles.forEach((particle, i) => {
            let { t, factor, speed, x, y, z } = particle;
            t = particle.t += speed;
            const s = Math.cos(t);
            
            dummy.position.set(
                x + Math.cos(t * factor),
                y + Math.sin(t * factor),
                z + Math.cos(t * factor)
            );
            
            const scale = (Math.sin(t * 3) + 1.2) * 0.15; 
            dummy.scale.set(scale, scale, scale);
            dummy.rotation.set(s * 2, s * 2, s * 2);
            dummy.updateMatrix();
            
            mesh.current.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
            <octahedronGeometry args={[0.2, 0]} />
            <meshBasicMaterial color="#222" wireframe />
        </instancedMesh>
    )
}

export const ShaderBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-70">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 2]} 
        gl={{ antialias: false, alpha: true }}
      >
        <Scene />
        <Particles />
      </Canvas>
    </div>
  );
};