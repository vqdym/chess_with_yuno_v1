import { useGLTF } from "@react-three/drei";

export function Restaurant() {
  const scene = useGLTF("/models/cafe_interior.glb");

  return (
    <group>
      <primitive object={scene.scene} position={[489, -9.21, 264.5]} scale={12}/>
    </group>
  )
}

useGLTF.preload("/models/cafe_interior.glb");