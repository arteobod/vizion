'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function IcosahedronMesh() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    meshRef.current.rotation.x = t * 0.12
    meshRef.current.rotation.y = t * 0.18
  })

  return (
    <mesh ref={meshRef} position={[2.2, 0, 0]}>
      <icosahedronGeometry args={[1.8, 1]} />
      <meshBasicMaterial color="#FF4500" wireframe />
    </mesh>
  )
}

function OuterRing() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    meshRef.current.rotation.x = -t * 0.07
    meshRef.current.rotation.y = t * 0.1
    meshRef.current.rotation.z = t * 0.05
  })

  return (
    <mesh ref={meshRef} position={[2.2, 0, 0]}>
      <torusGeometry args={[3, 0.008, 2, 80]} />
      <meshBasicMaterial color="#FF4500" transparent opacity={0.25} />
    </mesh>
  )
}

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null)

  const count = 1800
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta) + 2.2
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi) - 1
    }
    return arr
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    const t = state.clock.elapsedTime
    pointsRef.current.rotation.y = t * 0.04
    pointsRef.current.rotation.x = t * 0.02
  })

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00d4ff"
        size={0.025}
        sizeAttenuation
        depthWrite={false}
        opacity={0.55}
      />
    </Points>
  )
}

function OrangeParticles() {
  const pointsRef = useRef<THREE.Points>(null)

  const count = 400
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 1.9 + Math.random() * 0.3
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta) + 2.2
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y = state.clock.elapsedTime * -0.12
    pointsRef.current.rotation.x = state.clock.elapsedTime * 0.08
  })

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#FF4500"
        size={0.04}
        sizeAttenuation
        depthWrite={false}
        opacity={0.7}
      />
    </Points>
  )
}

function Scene() {
  return (
    <>
      <fog attach="fog" args={['#060608', 8, 22]} />
      <ambientLight intensity={0.1} />
      <ParticleField />
      <OrangeParticles />
      <OuterRing />
      <IcosahedronMesh />
    </>
  )
}

export default function ThreeHero() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 55 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
      dpr={[1, 1.5]}
    >
      <Scene />
    </Canvas>
  )
}
