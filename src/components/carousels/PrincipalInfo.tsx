import { lazy, Suspense, useEffect, useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import Menu from "@/Layouts/Menu";
const Stars = lazy(() => import("@/components/Canvas/Stars"));
const Router3DViewer = lazy(() => import("@/components/Canvas/Router3DViewer"));
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Planes from "./Planes";
import { Spinner } from "@/components/ui/spinner";
import { RouterSlideContent } from "./RouterSlideContent";
import Galaxy from "../Canvas/Galaxy";
import { Card, CardContent, CardTitle, CardHeader, CardDescription, CardFooter } from "../ui/card";
import { ChevronsUp, DollarSign, Star, Zap } from "lucide-react";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import GeminiStar from "../logos/GeminiStar";

// Componente de loading para el modelo 3D
const Router3DLoader = () => (
  <div className="w-full h-full min-h-[300px] md:min-h-[500px] flex items-center justify-center">
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-4">
      <Spinner size="xl" variant="white" label="Cargando modelo 3D" />
    </div>
  </div>
);

// Imagen del modem para vista móvil (fallback del modelo 3D)
const RouterMobileImage = () => (
  <div className="relative w-full mt-10 h-[300px] md:h-[500px] lg:h-[600px] flex items-center justify-center">
    <img
      src={ROUTER_MOBILE_IMAGE}
      alt="Modem Inttelgo"
      className="w-auto h-[80%] max-h-[400px] object-contain"
      loading="eager"
      decoding="async"
    />
  </div>
);

/** Renderiza el media: imagen (móvil) o modelo 3D (desktop).
 * El 3D se monta una sola vez y solo se oculta con CSS al cambiar de slide. */
const RouterSlideMedia = ({
  isActive,
  shouldLoad,
  isMobile,
}: {
  isActive: boolean;
  shouldLoad: boolean;
  isMobile: boolean;
}) => {
  if (isMobile) {
    return <RouterMobileImage />;
  }
  if (!shouldLoad) {
    return <Router3DLoader />;
  }
  return (
    <div
      className={`w-full h-full min-h-[300px] md:min-h-[500px] lg:min-h-[600px] ${!isActive ? "invisible pointer-events-none" : ""}`}
      aria-hidden={!isActive}
    >
      <Suspense fallback={<Router3DLoader />}>
        <Router3DViewer className="w-full h-full" contentOnly />
      </Suspense>
    </div>
  );
};

// Ruta de la imagen del modem para vista móvil (fallback del modelo 3D)
const ROUTER_MOBILE_IMAGE = "/models/ROUTER .png";

// Datos de los slides del carousel
const carouselData = [
  {
    id: 1,
    backgroundImage: "/banners/home/banner-home-galaxia-espacial.webp",
    className:
      "bg-gradient-to-b from-transparent via-black/40 to-black",
    has3DModel: true, // Flag para identificar slides con modelo 3D
    hasGalaxyBackground: false,
    mobileHeight: "h-[550px]"
  },
  {
    id: 2,
    backgroundImage: "/banners/home/banner-home-galaxia-espacial.webp",
    class:
      "bg-gradient-to-b from-transparent via-black/40 to-black",
    component: <Planes />,
    has3DModel: false,
    hasGalaxyBackground: false,
    mobileHeight: "h-[550px]"
  },
  {
    id: 3,
    backgroundImage: "",
    className: "",
    has3DModel: false,
    hasGalaxyBackground: true, // Nuevo flag para identificar el slide con galaxia
    mobileHeight: "h-[1350px]",
    component: (
      <div className="w-full h-full px-4 sm:px-6 md:px-8 lg:px-16 flex items-center justify-center py-12">
        <div className="relative w-full max-w-7xl">
          {/* Título principal */}
          <div className="text-center mb-12 md:mb-16 space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(147,51,234,0.5)]">
                Llega a la estratosfera digital
              </span>
            </h1>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              con nuestro{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  plan gamer
                </span>
              </span>
            </p>
          </div>

          {/* Grid principal */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Columna izquierda - Características */}
            <div className="lg:col-span-4 space-y-4">
              <Card className="backdrop-blur-md bg-white/10 border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-120 group">
                <CardHeader >
                  <div className="flex items-center gap-3">
                    <GeminiStar size={24} className="text-white" />
                    <div>
                      <CardTitle className="text-xl md:text-2xl text-white">
                        Bajas latencias
                      </CardTitle>
                      <CardDescription className="text-white/70 text-base">
                        Ping ultra bajo para gaming competitivo
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="backdrop-blur-md bg-white/10 border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-120 group">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <GeminiStar size={24} className="text-white" />
                    <div>

                      <CardTitle className="text-xl md:text-2xl text-white">
                        NAT abierta
                      </CardTitle>
                      <CardDescription className="text-white/70 text-base">
                        Conexión directa sin restricciones
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="backdrop-blur-md bg-white/10 border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-120 group">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <GeminiStar size={24} className="text-white" />
                    <div>

                      <CardTitle className="text-xl md:text-2xl text-white">
                        IPV6
                      </CardTitle>
                      <CardDescription className="text-white/70 text-base">
                        Tecnología de próxima generación
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Columna central - Card principal */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative">
                {/* Efectos de órbita */}
                <div className="absolute inset-0 rounded-2xl border-2 border-orange-400/30 animate-ping" style={{ animationDuration: "3s" }}></div>
                <div className="absolute inset-4 rounded-2xl border-2 border-purple-400/30 animate-ping" style={{ animationDuration: "4s", animationDelay: "0.5s" }}></div>

                <Card className="relative z-10 w-[280px] md:w-[320px] backdrop-blur-xl bg-gradient-to-br from-white/20 to-white/5 border-2 border-white/30 shadow-2xl hover:shadow-orange-500/50 transition-all duration-500 hover:scale-130">
                  <CardHeader className="pb-4">
                    <div className="flex justify-center items-center gap-2 mb-2">
                      <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-400/50">
                        PLAN GAMER
                      </Badge>
                    </div>
                    <CardTitle className="text-center">
                      <div className="text-8xl md:text-9xl font-black">
                        <span className="bg-gradient-to-b from-orange-300 via-orange-400 to-orange-600 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(251,146,60,0.8)]">
                          500
                        </span>
                      </div>
                    </CardTitle>
                  </CardHeader>

                  <Separator className="bg-white/30" />

                  <CardContent className="pt-6">
                    <h3 className="text-3xl md:text-4xl font-bold text-white uppercase text-center leading-tight tracking-wide">
                      Megas
                      <br />
                      <span className="bg-gradient-to-r from-orange-300 to-orange-500 bg-clip-text text-transparent">
                        Simétricas
                      </span>
                    </h3>
                  </CardContent>

                  <CardFooter className="flex justify-center pt-2">
                    <div className="flex gap-1">
                      <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                      <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                      <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                      <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                      <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                    </div>
                  </CardFooter>

                  {/* Partículas decorativas */}
                </Card>
              </div>
            </div>

            {/* Columna derecha - Precio y CTA */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="group relative backdrop-blur-xl bg-gradient-to-br from-white/20 to-white/5 border-2 border-orange-400/30 shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-120 overflow-visible">
                {/* Ribbon de oferta especial en la esquina */}
                <div className="absolute -top-2 -left-2 z-20 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 group-hover:-translate-x-1">
                  <div className="relative">
                    <div className="relative bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 text-white px-4 py-2 rounded-lg shadow-xl">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-white fill-white" />
                        <span className="font-bold text-sm uppercase tracking-wide">
                          Fibra óptica 100% simétrica
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-9 -left-2 z-20 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 group-hover:-translate-x-1">
                  <div className="relative">
                    {/* Badge principal */}
                    <div className="relative bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 text-white px-4 py-2 rounded-lg shadow-xl">
                      <div className="flex items-center gap-2">

                        <Star className="w-4 h-4 text-white fill-white" />

                        <span className="font-bold text-sm uppercase tracking-wide">
                          Oferta
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="space-y-4">
                  <CardHeader className="pt-16">
                    <CardTitle className="text-white text-2xl">
                      Precio mensual
                    </CardTitle>
                  </CardHeader>
                  <div className="flex items-start gap-2">
                    <DollarSign className="w-10 h-10 text-orange-400 drop-shadow-lg mt-1" />
                    <div className="flex flex-col">
                      <span className="text-5xl md:text-6xl font-black bg-gradient-to-r from-orange-300 to-orange-500 bg-clip-text text-transparent">
                        100.000
                      </span>
                      <span className="text-lg text-white/80 font-semibold">
                        pesos colombianos / mes
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-3">
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg shadow-lg hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105"
                    asChild
                  >
                    <Link to="/planes/internet">
                      <ChevronsUp className="w-5 h-5 mr-2" />
                      ¡Despega ahora!
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Agrega este estilo en tu CSS global o en el componente */}
            <style>{`
              @keyframes shine {
                0% {
                  transform: translateX(-100%);
                }
                100% {
                  transform: translateX(100%);
                }
              }
              
              .animate-shine {
                animation: shine 3s ease-in-out infinite;
              }
            `}
            </style>
          </div>
        </div>
      </div>
    ),
  },
];

const MOBILE_BREAKPOINT = 768; // md breakpoint - debajo de esto se usa imagen en vez de 3D

function PrincipalInfo() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [shouldLoad3D, setShouldLoad3D] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const updateIsMobile = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", updateIsMobile);
    return () => mediaQuery.removeEventListener("change", updateIsMobile);
  }, []);

  // Precargar todas las imágenes del carousel para mejorar LCP
  useEffect(() => {
    carouselData.forEach((slide, index) => {
      if (slide.backgroundImage) {
        const img = new Image();
        // La primera imagen tiene prioridad alta (elemento LCP)
        img.fetchPriority = index === 0 ? "high" : "auto";
        img.src = slide.backgroundImage;
      }
    });
  }, []);

  useEffect(() => {
    if (!api) return;

    let timer: ReturnType<typeof setTimeout> | null = null;

    // Actualizar el índice actual cuando cambia el slide
    const handleSelect = () => {
      const newIndex = api.selectedScrollSnap();
      setCurrent(newIndex);

      // Limpiar timer anterior si existe
      if (timer) {
        clearTimeout(timer);
      }

      // Precargar el modelo 3D cuando el slide está activo (solo una vez, no se desmonta)
      if (carouselData[newIndex]?.has3DModel) {
        timer = setTimeout(() => {
          setShouldLoad3D(true);
        }, 300);
      }
      // No setear shouldLoad3D(false): mantener el 3D en memoria para evitar remontajes
    };

    api.on("select", handleSelect);

    // Cleanup
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      api.off("select", handleSelect);
    };
  }, [api]);

  // Precargar el modelo 3D cuando la página está lista (después del render inicial)
  useEffect(() => {
    // Solo precargar si el primer slide tiene el modelo 3D y después de un delay
    if (carouselData[0]?.has3DModel && current === 0) {
      const timer = setTimeout(() => {
        setShouldLoad3D(true);
      }, 500); // Delay inicial para no bloquear el LCP

      return () => clearTimeout(timer);
    }
  }, []);

  const currentImage = useMemo(
    () => carouselData[current].backgroundImage,
    [current]
  );

  const isGalaxySlide = carouselData[current]?.hasGalaxyBackground;
  const bannerRef = useRef<HTMLDivElement>(null);

  const getCurrentHeight = () => {
    const slide = carouselData[current];
    if (isMobile && slide?.mobileHeight) {
      return slide.mobileHeight;
    }
    return "";
  };

  return (
    <div
      ref={bannerRef}
      className="relative w-full overflow-hidden mb-12 transition-all duration-700 min-h-0 h-auto"
    >
      {/* Fondo de galaxia para el slide 3 */}
      {isGalaxySlide && (
        <div className="absolute inset-0 w-full h-full">
          <Galaxy
            trackingContainerRef={bannerRef}
            mouseRepulsion
            mouseInteraction
            density={1}
            glowIntensity={0.1}
            saturation={0.5}
            hueShift={100}
            twinkleIntensity={0.3}
            rotationSpeed={0.1}
            repulsionStrength={2}
            autoCenterRepulsion={0}
            starSpeed={0.2}
            speed={1}
          />
        </div>
      )}

      {/* Fondo de imagen para otros slides */}
      {!isGalaxySlide && currentImage && (
        <div
          className="absolute inset-0 w-full h-full transition-all duration-700"
          style={{
            backgroundImage: `url(${currentImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      )}

      {/* Imagen precargada invisible para forzar carga temprana */}
      {carouselData[0].backgroundImage && (
        <img
          src={carouselData[0].backgroundImage}
          alt=""
          className="hidden"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          width={1920}
          height={1080}
          style={{ aspectRatio: "16 / 9" }}
          aria-hidden="true"
        />
      )}

      {/* Contenido sobre la imagen */}
      <div className="relative z-10">
        {/* Estrellas - solo se muestran cuando NO es el slide de galaxia */}
        {!isGalaxySlide && (
          <Suspense fallback={null}>
            <Stars
              starCount={30}
              colors={[
                "#FFFFFF",
                "#F8F9FA",
                "#E9ECEF",
                "#DEE2E6",
                "#CED4DA",
                "#ADB5BD",
                "#6C757D",
                "#495057",
              ]}
            />
          </Suspense>
        )}

        {/* Menú siempre visible encima */}
        <Menu
          className="text-white bg-transparent"
          logo="logo-blanco.svg"
          detailsColor=""
        />

        {/* Carousel: altura 100% del contenido, sin mínimos que corten */}
        <Carousel
          setApi={setApi}
          className="w-full transition-all duration-700 min-h-0 h-auto bg-gradient-to-b from-transparent via-black/20 to-black"
          opts={{ loop: true }}
        >
          <CarouselContent className={`min-h-0 h-auto ${getCurrentHeight()}`}>
            {carouselData.map((slide, index) => (
              <CarouselItem key={slide.id} className="min-h-0 h-auto">
                {slide.has3DModel ? (
                  <RouterSlideContent>
                    <RouterSlideMedia
                      isActive={current === index}
                      shouldLoad={shouldLoad3D}
                      isMobile={isMobile}
                    />
                  </RouterSlideContent>
                ) : (
                  slide.component
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 top-1/2 text-orange-400 size-12" />
          <CarouselNext className="right-4 top-1/2 text-orange-400 size-12" />
          {/* Indicadores de slide */}
          <div
            className="flex justify-center gap-2 pb-4"
            role="tablist"
            aria-label="Indicadores de slides del carousel"
          >
            {carouselData.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all ${current === index ? "w-8 bg-orange-400" : "w-2 bg-white/50"
                  }`}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Ir al slide ${index + 1} de ${carouselData.length}`}
                aria-selected={current === index}
                role="tab"
                tabIndex={current === index ? 0 : -1}
              />
            ))}
          </div>
        </Carousel>
      </div>
    </div>
  );
}

export default PrincipalInfo;