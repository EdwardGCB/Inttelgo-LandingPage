import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import Router3D from "./Router3D";
import { useRef, useState, useEffect, Suspense, useCallback } from "react";
import { Slider } from "../ui/slider";
import Translucent from "@/components/Cards/Translucent";

interface Router3DViewerProps {
  className?: string;
  /** Si true, solo renderiza el canvas 3D + slider, sin título ni cards (para usar dentro de RouterSlideLayout) */
  contentOnly?: boolean;
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
    title: "Megas simétricas",
    description: "Velocidad equilibrada",
    image: "/cards/up-down.svg",
  },
  {
    id: 3,
    title: "Alta velocidad",
    description: "1 Ms de respuesta",
    image: "/cards/speed-test.svg",
  },
];

function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-white border-r-transparent mb-4"></div>
        <p className="text-white text-sm">Cargando modelo 3D...</p>
      </div>
    </div>
  );
}

function Router3DViewer({ className = "", contentOnly = false }: Router3DViewerProps) {
  const [rotationValue, setRotationValue] = useState([0]);
  const [contextLost, setContextLost] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const webglCleanupRef = useRef<(() => void) | null>(null);

  const rotation = (rotationValue[0] / 100) * Math.PI * 2;
  const angle = (30 * Math.PI) / 180;
  const distance = 16;
  const cameraY = distance * Math.sin(angle);
  const cameraZ = distance * Math.cos(angle);
  // Rotación del HDRI para cambiar de dónde "viene" la luz (ajusta a gusto)
  const hdriRotation: [number, number, number] = [-Math.PI / 2, 0, 0];

  const attachWebglContextListeners = useCallback((canvasEl: HTMLCanvasElement) => {
    const handleLost = (event: Event) => {
      // Evita que el navegador descarte el contexto permanentemente
      event.preventDefault();
      setContextLost(true);
    };

    const handleRestored = () => {
      setContextLost(false);
    };

    canvasEl.addEventListener("webglcontextlost", handleLost as EventListener, {
      passive: false,
    } as AddEventListenerOptions);
    canvasEl.addEventListener("webglcontextrestored", handleRestored as EventListener);

    return () => {
      canvasEl.removeEventListener("webglcontextlost", handleLost as EventListener);
      canvasEl.removeEventListener(
        "webglcontextrestored",
        handleRestored as EventListener
      );
    };
  }, []);

  // Limpieza de listeners WebGL al desmontar
  useEffect(() => {
    return () => {
      if (webglCleanupRef.current) {
        webglCleanupRef.current();
        webglCleanupRef.current = null;
      }
    };
  }, []);

  const mediaContent = (
    <div
      className={`relative w-full h-[300px] md:h-[500px] lg:h-[600px] flex items-center justify-center transition-opacity duration-700 ${
        isModelReady ? "opacity-100" : "opacity-0"
      }`}
    >
      {!contentOnly && (
        <div className="absolute flex flex-col items-center justify-center z-0 pointer-events-none px-4 -top-0">
          <h1 className="text-xl sm:text-2xl lg:text-4xl xl:text-5xl text-white font-bold leading-tight tracking-wide text-center mb-2">
            Disfruta del internet más veloz
          </h1>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white font-extrabold leading-tight tracking-wide text-center">
            con nuestro módem WiFi 6
          </h1>
        </div>
      )}
      {/* Canvas 3D */}
      <div ref={canvasRef} className="relative w-full h-full z-10">
        {contextLost ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-lg">
              <p className="text-white text-lg font-medium mb-2">
                Reconectando visualización 3D...
              </p>
              <p className="text-white/70 text-sm">Por favor espera un momento</p>
            </div>
          </div>
        ) : (
          <Suspense fallback={<LoadingFallback />}>
            <Canvas
              camera={{
                position: [0, cameraY, cameraZ],
                fov: 60,
                near: 0.1,
                far: 1000
              }}
              gl={{
                powerPreference: "high-performance",
                antialias: window.devicePixelRatio < 2,
                alpha: true,
                stencil: true,
                depth: true,
              }}
              dpr={Math.min(window.devicePixelRatio, 2)}
              performance={{ min: 0.5 }}
              onCreated={({ gl }) => {
                gl.toneMapping = 0;
                gl.toneMappingExposure = 1;

                if (webglCleanupRef.current) {
                  webglCleanupRef.current();
                  webglCleanupRef.current = null;
                }
                webglCleanupRef.current = attachWebglContextListeners(gl.domElement);
              }}
            >
              <Environment
                files="/models/hdri2.hdr"
                background={false}
                environmentIntensity={0.7}
                environmentRotation={hdriRotation}
                backgroundRotation={hdriRotation}
              />
              <Router3D
                autoRotate={true}
                scale={1.5}
                rotation={[0, rotation, 0]}
                position={[0, 2, 0]}
                onReady={() => setIsModelReady(true)}
              />


              <OrbitControls
                enableZoom={false}
                enablePan={false}
                enableRotate={false}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI / 3}
                target={[0, 0, 0]}
              />
            </Canvas>
          </Suspense>
        )}
      </div>

      {/* Slider */}
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
    </div>
  );

  if (contentOnly) {
    return <div className={className}>{mediaContent}</div>;
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {mediaContent}
      {/* Cards informativos */}
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