import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Group, Box3, Vector3 } from "three";

interface Router3DProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  autoRotate?: boolean;
}

function Router3D({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  autoRotate = true,
}: Router3DProps) {
  const { scene } = useGLTF("/models/router.glb");
  const groupRef = useRef<Group>(null);
  const [centerOffset, setCenterOffset] = useState<Vector3>(new Vector3());

  // Calcular el centro del modelo y configurar texturas
  useEffect(() => {
    if (scene) {
      const box = new Box3().setFromObject(scene);
      const center = new Vector3();
      box.getCenter(center);

      setCenterOffset(center);

      // Configurar texturas para evitar warnings de WebGL
      scene.traverse((child: any) => {
        if (child.isMesh && child.material) {
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];

          materials.forEach((material: any) => {
            // Configurar todas las texturas del material
            const textureTypes = [
              "map",
              "lightMap",
              "bumpMap",
              "normalMap",
              "specularMap",
              "envMap",
              "alphaMap",
              "aoMap",
              "displacementMap",
              "emissiveMap",
              "roughnessMap",
              "metalnessMap",
            ];

            textureTypes.forEach((type) => {
              if (material[type]) {
                material[type].flipY = false;
                material[type].premultiplyAlpha = false;
                material[type].needsUpdate = true;
              }
            });
          });
        }
      });
    }

    // Limpieza al desmontar
    return () => {
      if (scene) {
        scene.traverse((child: any) => {
          if (child.isMesh) {
            // Limpiar geometría
            if (child.geometry) {
              child.geometry.dispose();
            }
            // Limpiar materiales
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((material: any) => {
                  if (material.map) material.map.dispose();
                  if (material.lightMap) material.lightMap.dispose();
                  if (material.bumpMap) material.bumpMap.dispose();
                  if (material.normalMap) material.normalMap.dispose();
                  if (material.specularMap) material.specularMap.dispose();
                  if (material.envMap) material.envMap.dispose();
                  material.dispose();
                });
              } else {
                if (child.material.map) child.material.map.dispose();
                if (child.material.lightMap) child.material.lightMap.dispose();
                if (child.material.bumpMap) child.material.bumpMap.dispose();
                if (child.material.normalMap)
                  child.material.normalMap.dispose();
                if (child.material.specularMap)
                  child.material.specularMap.dispose();
                if (child.material.envMap) child.material.envMap.dispose();
                child.material.dispose();
              }
            }
          }
        });
      }
    };
  }, [scene]);

  // Rotación automática
  useFrame((_state, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <primitive
        object={scene.clone()}
        position={[-centerOffset.x, -centerOffset.y, -centerOffset.z]}
      />
    </group>
  );
}

// Precargar el modelo
useGLTF.preload("/models/router.glb");

export default Router3D;
