'use client';

import { useMemo, forwardRef, type HTMLAttributes } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { ParametricGeometry } from 'three-stdlib';
import { cn } from '@/lib/utils';

const heartFunction = (u: number, v: number, target: THREE.Vector3) => {
  const theta = u * 2 * Math.PI;
  const phi = v * Math.PI;

  const x0 = Math.sin(phi) * Math.cos(theta);
  const y0 = Math.sin(phi) * Math.sin(theta);
  const z0 = Math.cos(phi);

  const A = x0 * x0 + 2.25 * y0 * y0 + z0 * z0;
  const B = x0 * x0 * z0 * z0 * z0 + 0.045 * y0 * y0 * z0 * z0 * z0;

  let r_min = 0;
  let r_max = 5;
  
  for (let i = 0; i < 50; i++) {
    const r = (r_min + r_max) / 2;
    const val = Math.pow(A * r * r - 1, 3) - B * Math.pow(r, 5);
    
    if (val > 0) {
      r_max = r;
    } else {
      r_min = r;
    }
  }

  const r = (r_min + r_max) / 2;
  const xm = r * x0;
  const ym = r * y0;
  const zm = r * z0;

  const scale = 2.0;
  target.set(xm * scale, zm * scale, -ym * scale);
};

export interface HeartProps extends HTMLAttributes<HTMLDivElement> {}

export const Heart = forwardRef<HTMLDivElement, HeartProps>(
  ({ className, ...props }, ref) => {
    const geometry = useMemo(() => new ParametricGeometry(heartFunction, 64, 64), []);
    const wireframeGeometry = useMemo(() => new THREE.WireframeGeometry(geometry), [geometry]);

    return (
      <div 
        ref={ref}
        className={cn("w-full h-full relative", className)} 
        {...props}
      >
        <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1.5} />
          <directionalLight position={[-10, -10, -10]} intensity={0.5} />
          
          <group>
            <mesh geometry={geometry}>
              <meshPhysicalMaterial 
                color="#ff0000" 
                emissive="#550000"
                roughness={0.4}
                metalness={0.1}
                side={THREE.DoubleSide}
              />
            </mesh>
            <lineSegments geometry={wireframeGeometry}>
              <lineBasicMaterial color="#ffaa00" transparent opacity={0.6} />
            </lineSegments>
          </group>
          
          <OrbitControls enablePan={false} enableZoom={true} />
        </Canvas>

        <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center flex-col pointer-events-none gap-4">
          <div 
            className="text-white text-xl md:text-3xl font-serif tracking-widest px-4 py-2 opacity-90"
            style={{ fontFamily: '"Playfair Display", "Times New Roman", Times, serif' }}
          >
            <span className="italic">(x<sup>2</sup> + <span className="inline-flex flex-col items-center align-middle mx-1" style={{ fontSize: '0.6em' }}><span>9</span><span className="border-t border-white w-full text-center">4</span></span>y<sup>2</sup> + z<sup>2</sup> - 1)<sup>3</sup></span>
            <span className="mx-2">-</span>
            <span className="italic">x<sup>2</sup>z<sup>3</sup></span>
            <span className="mx-2">-</span>
            <span className="inline-flex flex-col items-center align-middle mx-1" style={{ fontSize: '0.6em' }}><span>9</span><span className="border-t border-white w-full text-center">200</span></span>
            <span className="italic">y<sup>2</sup>z<sup>3</sup> = 0</span>
          </div>
        </div>
      </div>
    );
  }
);
Heart.displayName = "Heart";
