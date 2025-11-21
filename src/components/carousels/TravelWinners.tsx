import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useRef } from "react";

export default function CarrouselWinner({
  images,
  title,
  description,
}: {
  images: string[];
  title: string;
  description: string;
}) {
  const plugin = useRef(
    Autoplay({
      delay: 2000,
      stopOnInteraction: false,
      jump: false,
    })
  );

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-foreground mb-2">
            {title}
          </h2>
          <p className="text-lg text-secondary-foreground/70">{description}</p>
        </div>

        <Carousel
          className="w-full"
          plugins={[plugin.current]}
          opts={{
            align: "start",
            loop: true,
            dragFree: false,
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {images.map((image: string, index: number) => (
              <CarouselItem
                key={index}
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={image}
                    alt={`Ganador del sorteo ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
