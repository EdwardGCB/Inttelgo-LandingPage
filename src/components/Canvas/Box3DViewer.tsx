import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Box3D from "./Box3D";
import { useRef, useState, useEffect, Suspense } from "react";

interface Box3DViewerProps {
  modelPath: string;
  hdrPath: string;
  distance: number;
  scale: number;
}

export default function Box3DViewer({
  modelPath,
  hdrPath,
  distance,
  scale,
}: Box3DViewerProps) {
  const [contextLost, setContextLost] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Manejar contexto perdido
    const handleContextLost = (event: Event) => {
      console.warn("WebGL context lost. Intentando recuperar...");
      event.preventDefault();
      setContextLost(true);
    };

    const handleContextRestored = () => {
      console.log("WebGL context restored");
      setContextLost(false);
    };

    const canvas = canvasRef.current?.querySelector("canvas");
    if (canvas) {
      canvas.addEventListener("webglcontextlost", handleContextLost);
      canvas.addEventListener("webglcontextrestored", handleContextRestored);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener("webglcontextlost", handleContextLost);
        canvas.removeEventListener(
          "webglcontextrestored",
          handleContextRestored
        );
      }
    };
  }, []);

  const rotation = (0 / 100) * Math.PI * 2;
  const angle = (30 * Math.PI) / 180;
  const cameraY = distance * Math.sin(angle);
  const cameraZ = distance * Math.cos(angle);

  return (
    <div ref={canvasRef} className="relative w-full h-full z-10">
      {contextLost ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-lg">
            <p className="text-gray-700 text-lg font-medium mb-2">
              Reconectando visualización 3D...
            </p>
            <p className="text-gray-500 text-sm">Por favor espera un momento</p>
          </div>
        </div>
      ) : (
        <Canvas
          camera={{ position: [0, cameraY, cameraZ], fov: 60 }}
          gl={{
            powerPreference: "high-performance",
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: false,
            logarithmicDepthBuffer: true,
            precision: "highp",
          }}
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
          onCreated={({ gl }) => {
            gl.toneMapping = 0;
            gl.toneMappingExposure = 1;
            const originalWarn = console.warn;
            console.warn = (...args) => {
              const message = args[0]?.toString() || "";
              if (
                !message.includes("Alpha-premult") &&
                !message.includes("y-flip")
              ) {
                originalWarn(...args);
              }
            };
          }}
        >
          <Suspense fallback={null}>
            {hdrPath ? (
              <Environment
                files={`/models/${hdrPath}`}
                background={false}
                environmentIntensity={0.6}
              />
            ) : (
              <ambientLight intensity={8} />
            )}
            <ambientLight intensity={6} />

            <Box3D
              modelPath={modelPath}
              autoRotate={true}
              scale={scale}
              rotation={[0, rotation, 0]}
              position={[0, 0, 0]}
            />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              enableRotate={false}
              minPolarAngle={Math.PI / 2.2}
              maxPolarAngle={Math.PI / 2}
              target={[0, 0, 0]}
            />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
