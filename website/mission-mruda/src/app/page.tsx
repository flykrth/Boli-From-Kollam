"use client";

import { Canvas } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import { OrbitControls, Stars, useGLTF } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { motion } from "framer-motion";

const RotatingEarth = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const { scene } = useGLTF("/models/textures/earth.glb");

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.002;
    }
  });

  return (
    <primitive 
      ref={earthRef} 
      object={scene} 
      scale={[0.2, 0.2, 0.2]} 
      position={[0, 0, 0]} 
    />
  );
};

export default function Home() {
  const router = useRouter();
  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      <Canvas className="absolute top-0 left-0 w-full h-full" camera={{ position: [0, 0, 3], fov: 40 }}>
        <Stars 
          radius={100} 
          depth={50} 
          count={5000} 
          factor={4}   
          saturation={0} 
          fade
        />

        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} intensity={1.5} />
    
        <RotatingEarth />

        <OrbitControls enableZoom={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI - Math.PI / 3} />
      </Canvas>

      <motion.div 
        className="absolute inset-0 flex flex-col items-center justify-center text-white text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <h1 className="text-7xl md:text-9xl font-bold bg-gradient-to-r from-green-400 to-teal-600 bg-clip-text text-transparent">
          Mission Mruda
        </h1>
        <p className="text-xl md:text-3xl mt-4 mb-12 max-w-2xl mx-auto text-gray-300">
          AI-driven IoT soil monitoring for smarter farming.
        </p>
        <div className="mt-6 flex gap-4">
          <motion.button 
            className="bg-green-900 px-6 py-3 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 hover:scale-105"
            onClick={() => router.push("/about")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            About
          </motion.button>
          <motion.button 
            className="bg-white text-black px-8 py-3 rounded-lg text-lg hover:bg-gray-200 transition-all duration-300 hover:scale-105"
            onClick={() => router.push("/analytics")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Data Insights
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
