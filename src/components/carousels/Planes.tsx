import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useRef, useState, useEffect } from "react";
import TranslucentPlan from "../Cards/TranslucentPlan";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Separator } from "../ui/separator";

interface Plan {
  speed: string;
  price: string;
  category: string;
  caracteristicas: string[];
}
const planes: Plan[] = [
  {
    speed: "200",
    price: "55,000",
    category: "Básico",
    caracteristicas: [
      "Velocidad simétrica",
      "Tareas Básicas",
      "Módem con WiFi",
    ],
  },
  {
    speed: "300",
    price: "70,000",
    category: "Básico",
    caracteristicas: [
      "Velocidad simétrica",
      "Tareas Básicas",
      "Módem con WiFi",
    ],
  },
  {
    speed: "500",
    price: "90,000",
    category: "Básico",
    caracteristicas: [
      "Velocidad simétrica",
      "Tareas Básicas",
      "Módem con WiFi",
    ],
  },
  {
    speed: "750",
    price: "55,000",
    category: "Básico",
    caracteristicas: [
      "Velocidad simétrica",
      "Tareas Básicas",
      "Módem con WiFi",
    ],
  },
  {
    speed: "950",
    price: "55,000",
    category: "Básico",
    caracteristicas: [
      "Velocidad simétrica",
      "Tareas Básicas",
      "Módem con WiFi",
    ],
  },
];

export default function Planes() {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const plugin = useRef(
    Autoplay({
      delay: 2000,
      stopOnInteraction: false,
      jump: false,
    })
  );

  useEffect(() => {
    if (!api) return;

    // Actualizar el índice seleccionado cuando cambia el slide
    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };

    onSelect();
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Función para determinar si un card está en el centro
  const isCenter = (index: number) => {
    return index === selectedIndex;
  };

  return (
    <div className="w-full  overflow-hidden relative py-2 md:py-8 flex flex-col items-center justify-center">
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-white mb-8">
        Mas megas por el
        <br />
        <span className="text-orange-500 font-extrabold">mismo precio</span>
      </h2>
      <div className="w-full md:h-[600px] container mx-auto px-4 md:px-16 lg:px-32 flex flex-col items-center justify-center">
        <Carousel
          setApi={setApi}
          className="w-full mx-auto flex items-center justify-center"
          plugins={[plugin.current]}
          opts={{
            align: "center",
            loop: true,
            dragFree: false,
            duration: 30,
            startIndex: 0,
            skipSnaps: false,
          }}
        >
          <CarouselContent className="flex items-center my-6">
            {planes.map((plan, index) => {
              const isCenterCard = isCenter(index);

              return (
                <CarouselItem
                  key={index}
                  className="basis-full md:basis-1/3 flex justify-center items-center"
                >
                  <div className="w-full flex flex-col items-center justify-center gap-4">
                    <div className="w-full flex items-center justify-center py-6 md:py-12 px-12 md:px-6">
                      <TranslucentPlan
                        plan={plan}
                        className={cn(
                          "relative flex justify-center transition-all duration-700 ease-out h-[200px] sm:h-[150px] md:h-[180px] lg:h-[200px] xl:h-[200px] w-45 sm:w-70 md:w-40 lg:w-50 xl:w-50",
                          isCenterCard
                            ? "shadow-2xl shadow-orange-500/50 ring-4 ring-orange-400/20 scale-105 md:scale-[1.5]"
                            : "shadow-sm scale-100 opacity-70"
                        )}
                        style={{
                          transformOrigin: "center center",
                        }}
                      />
                    </div>
                    {isCenterCard && (
                      <Separator className="!w-60 sm:!w-80 md:!w-full h-2 bg-white" />
                    )}
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>

        {/* Botón para conocer más */}
        <div className="w-full flex items-center justify-center mt-8">
          <Button
            onClick={() => navigate("/planes/internet")}
            size="lg"
            className="relative overflow-hidden bg-gradient-to-r from-[#FF9900] to-[#EC5406] text-white font-bold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-110 group min-h-[44px]"
            style={{
              animation: "pulse 2s ease-in-out infinite",
            }}
          >
            <span className="relative z-10">Conocer más</span>

            {/* Efecto de brillo que pasa por el botón */}
            <span
              className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{
                animation: "shine 3s ease-in-out infinite",
                transform: "translateX(-100%)",
              }}
            />
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(255, 153, 0, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(255, 153, 0, 0);
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          50%, 100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </div>
  );
}
