import { lazy, useEffect, useState } from "react";
import Menu from "@/Layouts/Menu";
import Stars from "@/components/Canvas/Stars";
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

// Datos de los slides del carousel
const carouselData = [
  {
    id: 1,
    backgroundImage: "/banners/home/universo.webp",
    height: "h-[550px] md:h-[900px]",
    component: <Router3DViewer className="w-full h-full" />,
  },
  {
    id: 2,
    backgroundImage: "/banners/home/universo.webp",
    height: "h-[500px] md:h-[600px]",
    component: <Planes />,
  },
  {
    id: 3,
    backgroundImage: "/banners/home/nave.webp",
    height: "h-[400px] md:h-[500px]",
    component: (
      <div className="w-full h-full px-4 sm:px-6 md:px-8 lg:px-16">
        {/* Título */}
        <div className="flex flex-col items-center justify-center mb-6 sm:mb-8 md:mb-12">
          <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white text-center px-2">
            Llega a la estratosfera digital
            <br />
            con nuestro <span className="text-orange-400">plan gamer</span>
          </h1>
        </div>

        {/* Container de cards con layout responsivo */}
        <div className="relative flex flex-col items-center w-full">
          {/* Card flotante superior - ChevronsUp */}
          <Card className="p-1.5 sm:p-2 absolute -top-[5%] sm:-top-[5%] md:-top-5 right-[25%] sm:right-[32%] md:right-20 lg:right-110 z-30 shadow-lg hover:shadow-xl transition-all backdrop-blur-md bg-gradient-to-b from-white/60 to-transparent border-white shadow-2sx shadow-orange-500/50 ring-4 ring-orange-400/20 rounded-full">
            <CardContent className="p-0">
              <ChevronsUp className="size-5 sm:size-6 md:size-8 lg:size-10 text-white" />
            </CardContent>
          </Card>

          {/* Texto de características (solo desktop) */}
          <div className="hidden md:block absolute md:top-[40px] lg:top-[40px] md:left-30 lg:left-60 z-30 text-base md:text-xl lg:text-2xl font-bold text-white drop-shadow-lg text-right">
            <div className="flex flex-col items-end gap-1">
              <span className="flex items-center gap-2">
                Bajas latencias{" "}
                <Star className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
              </span>
              <span className="flex items-center gap-2">
                Nat abierta{" "}
                <Star className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
              </span>
              <span className="flex items-center gap-2">
                IPV6 <Star className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
              </span>
            </div>
          </div>

          {/* Card flotante - DollarSign */}
          <Card className="p-1 sm:p-1.5 md:p-2 absolute top-[97%] sm:top-[44%] md:top-[45%] lg:top-[175px] right-[39%] sm:right-[39%] md:right-20 lg:right-115 z-31 shadow-lg hover:shadow-xl transition-all backdrop-blur-md bg-gradient-to-b from-white/60 to-transparent border-white shadow-2sx shadow-orange-500/50 ring-4 ring-orange-400/20 rounded-full">
            <CardContent className="p-0">
              <DollarSign className="size-4 sm:size-4 md:size-6 lg:size-7 text-orange-500" />
            </CardContent>
          </Card>

          {/* Card con precio 100.000 */}
          <Card className="absolute top-[92%] sm:top-[40%] md:top-[40%] lg:top-[160px] left-[59%] sm:left-[60%] md:left-auto md:right-[25%] lg:right-75 z-30 shadow-lg hover:shadow-xl transition-all backdrop-blur-md bg-gradient-to-b from-white/60 to-transparent border-white shadow-2sx shadow-orange-500/50 ring-4 ring-orange-400/20 p-1.5 sm:p-2 md:p-3 lg:p-4">
            <CardContent className="p-0">
              <div className="flex items-baseline text-orange-500">
                <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold">
                  100.000
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Card principal - 500 Megas */}
          <Card className="w-[160px] sm:w-[200px] md:w-[240px] lg:w-70 h-[180px] sm:h-[220px] md:h-65 lg:h-75 shadow-lg hover:shadow-xl transition-all bg-gradient-to-b from-white/60 to-transparent border-white shadow-2sx shadow-orange-500/50 ring-4 ring-orange-400/20">
            <CardHeader className="pb-1 sm:pb-2 border-b-2 border-white text-center">
              <CardTitle className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold text-orange-500 drop-shadow-lg">
                500
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2 sm:pt-3 md:pt-4">
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white uppercase text-center leading-tight">
                Megas <br /> Simétricas
              </h3>
            </CardContent>
          </Card>
        </div>
      </div>
    ),
  },
];

function PrincipalInfo() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    // Actualizar el índice actual cuando cambia el slide
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div
      className="relative w-full overflow-hidden mb-12 transition-all duration-700"
      style={{
        backgroundImage: `url(${carouselData[current].backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Contenido sobre la imagen */}
      <div className="relative z-10">
        <Stars
          starCount={50}
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
        <Menu className="text-white bg-transparent" />

        {/* Carousel */}
        <Carousel
          setApi={setApi}
          className={`w-full transition-all duration-700 ${carouselData[current].height}`}
          opts={{ loop: true }}
        >
          <CarouselContent className="h-full">
            {carouselData.map((slide) => (
              <CarouselItem key={slide.id} className="h-full">
                {slide.component}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 top-1/2 bg-white/10 border-white/20 text-white hover:bg-white/20" />
          <CarouselNext className="right-4 top-1/2 bg-white/10 border-white/20 text-white hover:bg-white/20" />
        </Carousel>

        {/* Indicadores de slide */}
        <div className="flex justify-center gap-2 pb-4">
          {carouselData.map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all ${
                current === index ? "w-8 bg-orange-400" : "w-2 bg-white/50"
              }`}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PrincipalInfo;
