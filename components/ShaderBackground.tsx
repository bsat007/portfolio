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
  
  // Much lower ambient/diffuse to keep it dark
  float ambient = 0.02;
  float diffuse = max(dot(vNormal, lightDir), 0.0) * 0.4;
  
  // Rim Lighting - Subtle
  vec3 viewDir = normalize(vec3(0.0, 0.0, 5.0) - vPosition);
  float rim = 1.0 - max(dot(viewDir, vNormal), 0.0);
  rim = pow(rim, 4.0) * 0.5; // Toned down rim
  
  float intensity = ambient + diffuse + rim;
  
  // 2. Dithering
  vec2 screenPos = gl_FragCoord.xy;
  float threshold = bayer4x4(screenPos);
  
  // 3. Output Color Strategy - CRITICAL FOR TEXT VISIBILITY
  // Use very dark colors.
  
  // Lit color is a dark grey/blue, not white
  vec3 litColor = vec3(0.15, 0.16, 0.18); 
  vec3 darkColor = vec3(0.0, 0.0, 0.0);
  
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

const Scene = () => {
  const { viewport } = useThree();
  // Don't show side elements on very narrow screens (mobile) to avoid overlap
  const isWide = viewport.width > 12;

  return (
    <>
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
    <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
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