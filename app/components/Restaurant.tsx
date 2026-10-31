import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import { Mesh, MeshStandardMaterial, type Object3D } from "three";

function createLitInterior(source: Object3D) {
  const object = source.clone(true);
  const bulbMaterials = new Map<MeshStandardMaterial, MeshStandardMaterial>();
  const lightBulb = (material: MeshStandardMaterial) => {
    if (!(material instanceof MeshStandardMaterial) || material.name !== "Emissive") return material;
    let lit = bulbMaterials.get(material);
    if (!lit) {
      lit = material.clone();
      lit.emissive.set("#ffb66e");
      lit.emissiveIntensity = 2.5;
      bulbMaterials.set(material, lit);
    }
    return lit;
  };
  object.traverse((node) => {
    if (!(node instanceof Mesh)) return;
    node.material = Array.isArray(node.material)
      ? node.material.map(lightBulb)
      : lightBulb(node.material);
  });
  return { object, bulbMaterials };
}

export function Restaurant() {
  const scene = useGLTF("/models/cafe_interior.glb");

  // Clone only bulb materials; retain the loader's shared geometry and textures.
  const interior = useMemo(() => createLitInterior(scene.scene), [scene.scene]);
  useEffect(() => () => {
    interior.bulbMaterials.forEach((material) => material.dispose());
  }, [interior]);

  return (
    <group>
      <primitive object={interior.object} position={[489, -9.21, 264.5]} scale={12}/>
    </group>
  )
}

useGLTF.preload("/models/cafe_interior.glb");
