import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useRef, useState, useEffect } from "react";

// Definimos la interfaz para los canales
interface Channel {
  name: string;
  filename: string;
}

// Lista de canales SVG disponibles en la carpeta public/channels/
const channels: Channel[] = [
  { name: "A&E", filename: "CANAL_AANDE.svg" },
  { name: "Cartoon", filename: "CANAL_cartoon_network.svg" },
  { name: "Disney", filename: "CANAL_disney.svg" },
  { name: "ESPN", filename: "CANAL_ESPN.svg" },
  { name: "ESPN2", filename: "CANAL_ESPN2.svg" },
  { name: "ESPN3", filename: "CANAL_ESPN3.svg" },
  { name: "ESPN4", filename: "CANAL_ESPN4.svg" },
  { name: "FX", filename: "CANAL_fx.svg" },
  { name: "National Geographic", filename: "CANAL_national_geographic.svg" },
  { name: "Paramount", filename: "CANAL_paramount.svg" },
  { name: "Star", filename: "CANAL_star.svg" },
  { name: "Syfy", filename: "CANAL_syfy.svg" },
  { name: "TNT", filename: "CANAL_tnt.svg" },
  { name: "Warner", filename: "CANAL_warner.svg" },
];

export default function Channels() {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const plugin = useRef(
    Autoplay({
      delay: 1500,
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
    <div className="w-full max-w-full overflow-hidden relative my-12">
      <div className="w-full max-w-7xl mx-auto px-4">
        <Carousel
          setApi={setApi}
          className="w-full mx-auto"
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
          <CarouselContent className="flex items-center h-[300px]">
            {channels.map((channel, index) => {
              const isCenterCard = isCenter(index);

              return (
                <CarouselItem
                  key={index}
                  className="basis-1/3 md:basis-1/5 lg:basis-1/9 flex justify-center items-center"
                >
                  <div className="w-full flex items-center justify-center py-8 px-2">
                    <div
                      className={`relative w-24 h-24 md:w-28 md:h-28 flex items-center justify-center bg-white rounded-lg transition-all duration-700 ease-out ${
                        isCenterCard
                          ? "shadow-2sx shadow-orange-500/50 ring-4 ring-orange-400/20 scale-[1.8] md:scale-[1.5]"
                          : "shadow-sm scale-100 opacity-70"
                      }`}
                      style={{
                        transformOrigin: "center center",
                      }}
                    >
                      {/* Efecto de glow adicional para el card del centro */}
                      {isCenterCard && (
                        <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/30 via-orange-400/10 to-orange-500/30 rounded-lg blur-xl animate-pulse" />
                      )}

                      <img
                        src={`/channels/${channel.filename}`}
                        alt={channel.name}
                        className={`object-contain transition-all duration-700 ease-out relative z-10 ${
                          isCenterCard
                            ? "w-16 h-16 md:w-20 md:h-20 opacity-100"
                            : "w-14 h-14 md:w-16 md:h-16 opacity-80"
                        }`}
                        loading="lazy"
                      />
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
