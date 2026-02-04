import { useRef, useEffect, useState, useMemo } from "react";
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
  const [isReady, setIsReady] = useState(false);

  // Memoizar el offset del centro para calcularlo solo una vez
  const centerOffset = useMemo(() => {
    if (!scene) return new Vector3();

    const box = new Box3().setFromObject(scene);
    const center = new Vector3();
    box.getCenter(center);
    return center;
  }, [scene]);

  // Optimizar texturas una sola vez
  useEffect(() => {
    if (!scene) return;

    const processScene = () => {
      scene.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = false;
          child.receiveShadow = false;

          if (child.material) {
            const materials = Array.isArray(child.material)
              ? child.material
              : [child.material];

            materials.forEach((material: any) => {
              const textureTypes = [
                "map",
                "normalMap",
                "roughnessMap",
                "metalnessMap",
                "aoMap",
                "emissiveMap",
              ];

              textureTypes.forEach((type) => {
                if (material[type]) {
                  material[type].flipY = false;
                  material[type].premultiplyAlpha = false;
                }
              });

              material.precision = "mediump";
            });
          }
        }
      });

      setIsReady(true);
    };

    if ('requestIdleCallback' in window) {
      const handle = requestIdleCallback(processScene, { timeout: 100 });
      return () => cancelIdleCallback(handle);
    } else {
      const timeout = setTimeout(processScene, 0);
      return () => clearTimeout(timeout);
    }
  }, [scene]);

  // Limpieza optimizada
  useEffect(() => {
    return () => {
      if (scene) {
        scene.traverse((child: any) => {
          if (child.isMesh) {
            child.geometry?.dispose();

            const materials = Array.isArray(child.material)
              ? child.material
              : [child.material];

            materials.forEach((material: any) => {
              Object.keys(material).forEach((key) => {
                if (material[key]?.isTexture) {
                  material[key].dispose();
                }
              });
              material.dispose();
            });
          }
        });
      }
    };
  }, [scene]);

  // Rotación automática - SIEMPRE activa cuando isReady
  useFrame((_state, delta) => {
    if (groupRef.current && autoRotate && isReady) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  if (!isReady) {
    return null;
  }

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <primitive
        object={scene}
        position={[-centerOffset.x, -centerOffset.y, -centerOffset.z]}
      />
    </group>
  );
}

useGLTF.preload("/models/router.glb");

export default Router3D;