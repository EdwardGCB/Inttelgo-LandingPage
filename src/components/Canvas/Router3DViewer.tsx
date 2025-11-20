import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import Router3D from "./Router3D";
import { useRef, useState, useEffect, Suspense } from "react";
import { Slider } from "../ui/slider";
import Translucent from "@/components/Cards/Translucent";

interface Router3DViewerProps {
  className?: string;
}

const infoData = [
  {
    id: 1,
    title: "24/7",
    description: "Soporte técnico",
    image: "/cards/24-7.svg",
  },
  {
    id: 2,
    title: "Megas simetricas",
    description: "megas simétricas",
    image: "/cards/up-down.svg",
  },
  {
    id: 3,
    title: "Alta velocidad",
    description: "1 Ms de respuesta",
    image: "/cards/speed-test.svg",
  },
];

function Router3DViewer({ className = "" }: Router3DViewerProps) {
  const [rotationValue, setRotationValue] = useState([0]);
  const [isMobile, setIsMobile] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

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

  const rotation = (rotationValue[0] / 100) * Math.PI * 2;
  const angle = (30 * Math.PI) / 180;
  const distance = 16;
  const cameraY = distance * Math.sin(angle);
  const cameraZ = distance * Math.cos(angle);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Sección del texto y 3D */}
      <div className="relative w-full h-[300px] md:h-[500px] lg:h-[600px] flex items-center justify-center">
        {/* Texto principal - Atrás */}
        <div className="absolute flex flex-col items-center justify-center z-0 pointer-events-none px-4 top-1/10">
          <h1 className="text-xl sm:text-2xl lg:text-4xl xl:text-5xl text-white font-bold leading-tight tracking-wide text-center mb-2">
            Disfruta del internet mas veloz
          </h1>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white font-extrabold leading-tight tracking-wide text-center">
            con nuestro modem wifi 6
          </h1>
        </div>

        {/* Canvas 3D - Adelante */}
        <div ref={canvasRef} className="relative w-full h-full z-10">
          {contextLost ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-lg">
                <p className="text-white text-lg font-medium mb-2">
                  Reconectando visualización 3D...
                </p>
                <p className="text-white/70 text-sm">
                  Por favor espera un momento
                </p>
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
                <Environment
                  files="/models/hdri.hdr"
                  background={false}
                  environmentIntensity={1.2}
                />
                <ambientLight intensity={0.8} />
                <directionalLight
                  position={[10, 10, 5]}
                  intensity={1}
                  castShadow
                />
                <pointLight
                  position={[-10, 5, -10]}
                  intensity={0.5}
                  color="#ffffff"
                />

                <Router3D
                  autoRotate={true}
                  scale={isMobile ? 1.3 : 1.5}
                  rotation={[0, rotation, 0]}
                  position={[0, isMobile ? 0 : 2, 0]}
                />

                <OrbitControls
                  enableZoom={false}
                  enablePan={false}
                  enableRotate={false}
                  minPolarAngle={Math.PI / 6}
                  maxPolarAngle={Math.PI / 3}
                  target={[0, 0, 0]}
                />
              </Suspense>
            </Canvas>
          )}
        </div>

        {/* Slider - Solo desktop */}
        {!isMobile && (
          <div className="absolute bottom-8 z-20 w-full flex justify-center px-8">
            <Slider
              variant="white"
              value={rotationValue}
              onValueChange={setRotationValue}
              max={100}
              step={1}
              className="w-full max-w-md"
            />
          </div>
        )}
      </div>

      {/* Cards informativos - Separados del canvas */}
      <div className="w-full max-w-6xl px-4 mt-8 mb-12">
        <div className="grid grid-cols-3 gap-4 lg:gap-6">
          {infoData.map((item) => (
            <Translucent key={item.id} data={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Router3DViewer;
