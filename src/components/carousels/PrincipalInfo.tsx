import { lazy, Suspense, useEffect, useState, useMemo } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ChevronsUp, DollarSign, Star } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

// Componente de loading para el modelo 3D
const Router3DLoader = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-4">
      <Spinner size="xl" variant="white" label="Cargando modelo 3D" />
    </div>
  </div>
);

// Componente wrapper que solo carga el Router3DViewer cuando está activo y listo
const LazyRouter3DViewer = ({ isActive, shouldLoad }: { isActive: boolean; shouldLoad: boolean }) => {
  if (!isActive || !shouldLoad) {
    return <Router3DLoader />;
  }

  return (
    <Suspense fallback={<Router3DLoader />}>
      <Router3DViewer className="w-full h-full" />
    </Suspense>
  );
};

// Datos de los slides del carousel
const carouselData = [
  {
    id: 1,
    backgroundImage: "/banners/home/banner-home-galaxia-espacial.webp",
    height:
      "h-[550px] md:h-[900px]  bg-gradient-to-b from-transparent via-black/40 to-black",
    has3DModel: true, // Flag para identificar slides con modelo 3D
  },
  {
    id: 2,
    backgroundImage: "/banners/home/banner-home-galaxia-espacial.webp",
    height:
      "h-[550px] md:h-[900px]  bg-gradient-to-b from-transparent via-black/40 to-black",
    component: <Planes />,
    has3DModel: false,
  },
  {
    id: 3,
    backgroundImage: "/banners/home/banner-home-nave-espacial.webp",
    height: "h-[550px] md:h-[900px] ",
    has3DModel: false,
    component: (
      <div className="w-full h-full px-4 sm:px-6 md:px-8 lg:px-16">
        {/* Título */}
        <div className="flex flex-col items-center justify-center mb-6 sm:mb-8 md:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-bold text-white text-center px-2">
            Llega a la estratosfera digital
            <br />
            con nuestro <span className="text-orange-400">plan gamer</span>
          </h1>
        </div>

        {/* Container de cards con layout responsivo */}
        <div className="w-full h-[350px] md:h-[450px] lg:h-[200px] flex flex-col items-center justify-center">
          <div className="relative flex flex-col items-center w-full">
            {/* Card flotante superior - ChevronsUp */}
            <Card className="p-1.5 sm:p-2 absolute -top-[8%] sm:-top-[5%] md:-top-[10%] right-[20%] sm:right-[32%] md:right-[31%] lg:right-[25%] xl:right-[27%] 2xl:right-[36%] z-30 shadow-lg hover:shadow-xl transition-all backdrop-blur-md bg-gradient-to-b from-white/60 to-transparent border-white shadow-2sx shadow-orange-500/50 ring-4 ring-orange-400/20 rounded-full">
              <CardContent className="p-0">
                <ChevronsUp className="size-10 sm:size-6 md:size-8 lg:size-10 text-white" />
              </CardContent>
            </Card>

            {/* Texto de características (solo desktop) */}
            <div className="hidden lg:block absolute lg:top-[40px] md:left-30 lg:left-[20%] xl:left-[20%] 2xl:left-[30%] z-30 text-base md:text-xl lg:text-2xl font-bold text-white drop-shadow-md text-right">
              <div className="flex flex-col items-end gap-1 text-4xl">
                <span className="flex items-center gap-2">
                  Bajas latencias{" "}
                  <Star className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                </span>
                <span className="flex items-center gap-2">
                  NAT abierta{" "}
                  <Star className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                </span>
                <span className="flex items-center gap-2">
                  IPV6 <Star className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                </span>
              </div>
            </div>

            {/* Card flotante - DollarSign */}
            <Card className="p-1 sm:p-1.5 md:p-2 absolute top-[46%] sm:top-[44%] md:top-[43%] lg:top-[175px] right-[30%] sm:right-[39%] md:right-[40%] lg:right-[27%] xl:right-[31%] 2xl:right-[38%] z-31 shadow-lg hover:shadow-xl transition-all backdrop-blur-md bg-gradient-to-b from-white/60 to-transparent border-white shadow-2sx shadow-orange-500/50 ring-4 ring-orange-400/20 rounded-full">
              <CardContent className="p-0">
                <DollarSign className="size-6 sm:size-4 md:size-6 lg:size-7 text-orange-500" />
              </CardContent>
            </Card>

            {/* Card con precio 100.000 */}
            <Card className="absolute top-[45%] sm:top-[40%] md:top-[40%] lg:top-[160px] left-[69%] sm:left-[60%] md:left-auto md:right-[25%] lg:right-[15%] xl:right-[17%] 2xl:right-[29%] z-30 shadow-lg hover:shadow-xl transition-all backdrop-blur-md bg-gradient-to-b from-white/60 to-transparent border-white shadow-2sx shadow-orange-500/50 ring-4 ring-orange-400/20 p-1.5 sm:p-2 md:p-3 lg:p-4">
              <CardContent className="p-0">
                <div className="flex items-baseline text-orange-500">
                  <span className="text-2xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold">
                    100.000
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Card principal - 500 Megas */}
            <Card className="lg:absolute lg:left-[47%] w-[260px] sm:w-[200px] md:w-[240px] lg:w-70 h-[260px] sm:h-[220px] md:h-65 lg:h-75 shadow-lg hover:shadow-xl transition-all  backdrop-blur-xs bg-gradient-to-b from-white/60 to-transparent border-white shadow-2sx shadow-orange-500/50 ring-4 ring-orange-400/20">
              <CardHeader className="pb-1 sm:pb-2 border-b-2 border-white text-center">
                <CardTitle className="text-8xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold text-orange-500 drop-shadow-lg">
                  500
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2 sm:pt-3 md:pt-4 lg:pt-0">
                <h3 className="text-3xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white uppercase text-center leading-tight">
                  Megas <br /> Simétricas
                </h3>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    ),
  },
];

function PrincipalInfo() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [shouldLoad3D, setShouldLoad3D] = useState(false);

  // Precargar todas las imágenes del carousel para mejorar LCP
  useEffect(() => {
    carouselData.forEach((slide, index) => {
      const img = new Image();
      // La primera imagen tiene prioridad alta (elemento LCP)
      img.fetchPriority = index === 0 ? "high" : "auto";
      img.src = slide.backgroundImage;
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

      // Precargar el modelo 3D cuando el slide está activo o cuando el usuario está cerca
      // Agregar un pequeño delay para no bloquear el render inicial
      if (carouselData[newIndex]?.has3DModel) {
        // Delay para permitir que la página se renderice primero
        timer = setTimeout(() => {
          setShouldLoad3D(true);
        }, 300); // 300ms de delay para no bloquear el render inicial
      } else {
        setShouldLoad3D(false);
      }
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

  return (
    <div
      className="relative w-full overflow-hidden mb-12 transition-all duration-700 min-h-[550px] md:min-h-[900px]"
      style={{
        backgroundImage: `url(${currentImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Imagen precargada invisible para forzar carga temprana */}
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
      {/* Contenido sobre la imagen */}
      <div className="relative z-10">
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
        <Menu
          className="text-white bg-transparent"
          logo="logo-blanco.svg"
          detailsColor=""
        />

        {/* Carousel */}
        <Carousel
          setApi={setApi}
          className="w-full transition-all duration-700 min-h-[550px] md:min-h-[900px]"
          opts={{ loop: true }}
        >
          <CarouselContent className="h-full">
            {carouselData.map((slide, index) => (
              <CarouselItem key={slide.id} className="h-full">
                {slide.has3DModel ? (
                  <LazyRouter3DViewer
                    isActive={current === index}
                    shouldLoad={shouldLoad3D}
                  />
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
                aria-label={`Ir al slide ${index + 1} de ${carouselData.length
                  }`}
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
